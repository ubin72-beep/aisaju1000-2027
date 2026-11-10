import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase-server';
import {createClient as createAdminClient} from '@supabase/supabase-js';

export const runtime='nodejs';

// Disabled by default. Only test keys are accepted during integration testing.
// Never enable real payments until product pricing, fulfilment and refunds are implemented.
export async function POST(request:Request) {
 if(process.env.TOSS_TEST_PAYMENTS_ENABLED!=='true')
  return NextResponse.json({error:'테스트 결제 기능이 비활성화되어 있습니다.'},{status:503});
 const secret=process.env.TOSS_SECRET_KEY;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!secret?.startsWith('test_gsk_')||!url||!serviceKey)
  return NextResponse.json({error:'테스트 결제 서버 설정이 필요합니다.'},{status:503});
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 let body:unknown;
 try{body=await request.json();}catch{return NextResponse.json({error:'잘못된 요청입니다.'},{status:400});}
 if(!body||typeof body!=='object')return NextResponse.json({error:'잘못된 요청입니다.'},{status:400});
 const input=body as Record<string,unknown>;
 const {orderId,paymentKey,amount}=input;
 if(typeof orderId!=='string'||!/^[A-Za-z0-9_=-]{6,64}$/.test(orderId)||
    typeof paymentKey!=='string'||paymentKey.length<1||paymentKey.length>200||
    !Number.isSafeInteger(amount)||Number(amount)<=0)
  return NextResponse.json({error:'결제 정보 형식이 올바르지 않습니다.'},{status:400});
 const admin=createAdminClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:order,error:lookupError}=await admin.from('payment_orders')
  .select('order_id,user_id,amount,status').eq('order_id',orderId).eq('user_id',user.id).maybeSingle();
 if(lookupError||!order)return NextResponse.json({error:'주문을 찾을 수 없습니다.'},{status:404});
 if(order.status==='paid')return NextResponse.json({error:'이미 처리된 주문입니다.'},{status:409});
 if(order.status!=='pending'||order.amount!==amount)
  return NextResponse.json({error:'주문 상태 또는 결제 금액이 일치하지 않습니다.'},{status:409});
 // Claim once to avoid concurrent confirmations. A timeout is marked for manual review,
 // never automatically retried (the payment may have been approved).
 const {data:claimed,error:claimError}=await admin.from('payment_orders')
  .update({status:'confirming'}).eq('order_id',orderId).eq('user_id',user.id)
  .eq('status','pending').select('order_id').maybeSingle();
 if(claimError||!claimed)return NextResponse.json({error:'이미 처리 중인 주문입니다.'},{status:409});
 try {
  const response=await fetch('https://api.tosspayments.com/v1/payments/confirm',{
   method:'POST',
   headers:{Authorization:'Basic '+Buffer.from(secret+':').toString('base64'),'Content-Type':'application/json'},
   body:JSON.stringify({paymentKey,orderId,amount}),
   signal:AbortSignal.timeout(15000),
  });
  const result=await response.json();
  if(!response.ok||result?.status!=='DONE'||result?.orderId!==orderId||
      result?.paymentKey!==paymentKey||result?.totalAmount!==amount) {
   await admin.from('payment_orders').update({status:'review'}).eq('order_id',orderId).eq('status','confirming');
   return NextResponse.json({error:'결제 상태를 확인해야 합니다. 재결제하지 말고 운영자에게 문의해 주세요.'},{status:502});
  }
  const {data:saved,error:saveError}=await admin.from('payment_orders').update({
   status:'paid',payment_key:paymentKey,paid_at:new Date().toISOString()
  }).eq('order_id',orderId).eq('status','confirming').select('order_id').maybeSingle();
  if(saveError||!saved)return NextResponse.json({error:'결제 승인 후 기록 확인이 필요합니다. 재결제하지 마세요.'},{status:503});
  return NextResponse.json({status:'paid',orderId});
 }catch {
  await admin.from('payment_orders').update({status:'review'}).eq('order_id',orderId).eq('status','confirming');
  return NextResponse.json({error:'결제 결과 확인이 필요합니다. 재결제하지 마세요.'},{status:503});
 }
}
