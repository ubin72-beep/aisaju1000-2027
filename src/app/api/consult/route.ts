import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase-server';
import {createClient as createAdminClient} from '@supabase/supabase-js';
export const runtime='nodejs';
const systemPrompt='당신은 AI 사주 천년지기의 한국어 명리학 교육 상담 도우미입니다. 명리학의 일반 개념을 차분하게 설명하고 자기성찰을 돕습니다. 사용자의 실제 사주팔자나 오행을 계산한 것처럼 말하지 마세요. 정확한 만세력 엔진이 아직 연결되지 않았으므로 개인 운세, 미래 사건, 궁합을 확정적으로 예측하지 마세요. 의료, 법률, 금융 관련 결정은 전문가 상담을 권하세요. 500자 내외로 답하세요.';
export async function POST(request:Request){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 let question='';try{const body=await request.json();if(typeof body.question==='string')question=body.question.trim();}catch{return NextResponse.json({error:'잘못된 요청입니다.'},{status:400});}
 if(!question||question.length>1000)return NextResponse.json({error:'질문은 1~1000자로 입력해 주세요.'},{status:400});
 const key=process.env.OPENAI_API_KEY,serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY,url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 if(!key||!serviceKey||!url)return NextResponse.json({error:'상담 서비스 설정 중입니다.'},{status:503});
 const admin=createAdminClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 // The database RPC atomically claims one daily slot, preventing parallel bypass.
 const {data:allowed,error:limitError}=await admin.rpc('claim_consultation_slot',{p_user_id:user.id});
 if(limitError)return NextResponse.json({error:'상담 이용 제한 설정이 필요합니다.'},{status:503});
 if(!allowed)return NextResponse.json({error:'오늘의 무료 베타 상담 3회를 모두 사용했습니다.'},{status:429});
 try{
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:systemPrompt},{role:'user',content:question}],max_tokens:650,temperature:0.6}),signal:AbortSignal.timeout(25000)});
  if(!response.ok)throw new Error('AI provider error');
  const data=await response.json();const answer=data?.choices?.[0]?.message?.content;
  if(typeof answer!=='string'||!answer.trim())throw new Error('Empty AI response');
  const {data:entry,error}=await admin.from('consultations').insert({user_id:user.id,question,answer:answer.trim()}).select('id,question,answer,created_at').single();
  if(error||!entry)throw new Error('Failed to save consultation');
  return NextResponse.json({entry});
 }catch{
  await admin.rpc('release_consultation_slot',{p_user_id:user.id});
  return NextResponse.json({error:'상담 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.'},{status:502});
 }
}
