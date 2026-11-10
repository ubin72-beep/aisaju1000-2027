import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase-server';
import {createClient as createAdminClient} from '@supabase/supabase-js';
export const runtime='nodejs';
const systemPrompt='당신은 AI 사주 천년지기의 전문적인 한국어 명리학 교육 상담 도우미입니다. 명리학의 일반 개념을 차분하게 설명하고 자기성찰을 돕습니다. 사용자의 실제 사주팔자나 오행을 계산한 것처럼 말하지 마세요. 정확한 만세력 엔진이 아직 연결되지 않았으므로 개인 운세, 미래 사건, 궁합을 확정적으로 예측하지 마세요. 의료, 법률, 금융 관련 결정은 전문가 상담을 권하세요. 상담을 이어가는 경우 직전 대화의 맥락을 고려하되 이전 AI 답변이 사실임을 보증하지 마세요. 고객의 고민을 공감하되 미래를 단정하거나 중요한 결정을 대신하지 마세요. 상담 답변은 ① 질문의 핵심을 한두 문장으로 짚고 ② 관련 명리학 개념과 그 해석의 한계를 설명하고 ③ 현실에서 스스로 점검할 수 있는 선택지나 질문을 제안하세요. 사용자가 추가 질문을 하면 이미 설명한 내용을 반복하기보다 바로 그 질문에 집중하세요. 실제 명식 자료가 없으므로 개인의 오행, 십성, 일주, 대운, 세운을 추측하지 마세요. 사용자가 출생 정보를 직접 말해도 검증된 만세력 계산 없이 사주팔자를 만들어내지 마세요. 답변에 과도한 확신이나 불안 조장, 유료 서비스 유도를 포함하지 마세요. 이해하기 쉬운 한국어로 500자 내외로 답하세요.';
export async function POST(request:Request){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 let question='';try{const body=await request.json();if(typeof body.question==='string')question=body.question.trim();}catch{return NextResponse.json({error:'잘못된 요청입니다.'},{status:400});}
 if(!question||question.length>1000)return NextResponse.json({error:'질문은 1~1000자로 입력해 주세요.'},{status:400});
 // Use only the authenticated member's saved conversation as limited context.
 // Past assistant replies are treated as context, never as system instructions.
 const {data:history,error:historyError}=await supabase.from('consultations')
  .select('question,answer').eq('user_id',user.id)
  .order('created_at',{ascending:false}).limit(4);
 if(historyError)return NextResponse.json({error:'이전 상담 조회에 실패했습니다.'},{status:503});
 const previous=(history||[]).reverse().flatMap(row=>[
  {role:'user',content:String(row.question).slice(0,1000)},
  {role:'assistant',content:String(row.answer).slice(0,1800)}
 ]);
 const key=process.env.OPENAI_API_KEY,serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY,url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 if(!key||!serviceKey||!url)return NextResponse.json({error:'상담 서비스 설정 중입니다.'},{status:503});
 const admin=createAdminClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 // The database RPC atomically claims one daily slot, preventing parallel bypass.
 const {data:allowed,error:limitError}=await admin.rpc('claim_consultation_slot',{p_user_id:user.id});
 if(limitError)return NextResponse.json({error:'상담 이용 제한 설정이 필요합니다.'},{status:503});
 if(!allowed)return NextResponse.json({error:'오늘의 무료 베타 상담 3회를 모두 사용했습니다.'},{status:429});
 try{
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:systemPrompt},...previous,{role:'user',content:question}],max_tokens:650,temperature:0.6}),signal:AbortSignal.timeout(25000)});
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
