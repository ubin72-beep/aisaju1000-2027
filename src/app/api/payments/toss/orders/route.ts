import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase-server';
import {createClient as createAdminClient} from '@supabase/supabase-js';
import {getTopupProduct} from '@/lib/topup-products';

export const runtime='nodejs';
export async function POST(request:Request){
 if(process.env.TOSS_TEST_PAYMENTS_ENABLED!=='true')
  return NextResponse.json({error:'테스트 충전 기능이 비활성화되어 있습니다.'},{status:503});
 if(!process.env.TOSS_SECRET_KEY?.startsWith('test_gsk_')||
    !process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.startsWith('test_gck_')||
    !process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)
  return NextResponse.json({error:'테스트 결제 설정이 완료되지 않았습니다.'},{status:503});
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 let body:unknown;
 try{body=await request.json();}catch{return NextResponse.json({error:'요청 형식이 올바르지 않습니다.'},{status:400});}
 const product=getTopupProduct(body&&typeof body==='object'?(body as {productId?:unknown}).productId:null);
 if(!product)return NextResponse.json({error:'지원하지 않는 충전 상품입니다.'},{status:400});
 const orderId='topup_'+crypto.randomUUID().replace(/-/g,'');
 const admin=createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const {error}=await admin.from('payment_orders').insert({
  order_id:orderId,user_id:user.id,product_code:'wallet_topup',
  order_name:product.name,amount:product.amount,currency:'KRW',status:'pending'
 });
 if(error)return NextResponse.json({error:'주문 생성에 실패했습니다.'},{status:503});
 return NextResponse.json({orderId,orderName:product.name,amount:product.amount});
}
