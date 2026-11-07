import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(){
 const supabase=await createClient();
 const {data:{user},error:authError}=await supabase.auth.getUser();
 if(authError||!user)return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 const {data:birth,error:birthError}=await supabase.from('birth_profiles')
  .select('birth_date,birth_time,calendar_type,is_leap_month,gender,updated_at')
  .eq('user_id',user.id).maybeSingle();
 if(birthError)return NextResponse.json({error:'출생 정보 조회에 실패했습니다.'},{status:500});
 const consultations:{id:string;question:string;answer:string;created_at:string}[]=[];
 for(let offset=0;offset<10000;offset+=500){
  const {data,error}=await supabase.from('consultations')
   .select('id,question,answer,created_at')
   .eq('user_id',user.id).order('created_at',{ascending:true}).order('id',{ascending:true})
   .range(offset,offset+499);
  if(error)return NextResponse.json({error:'상담 기록 조회에 실패했습니다.'},{status:500});
  consultations.push(...(data||[]));
  if(!data||data.length<500)break;
  if(offset===9500)return NextResponse.json({error:'상담 기록이 너무 많아 일괄 내보내기를 할 수 없습니다. 고객 지원에 문의해 주세요.'},{status:413});
 }
 const payload={exported_at:new Date().toISOString(),account:{email:user.email||null,created_at:user.created_at},birth_profile:birth,consultations};
 return new NextResponse(JSON.stringify(payload,null,2),{status:200,headers:{
  'Content-Type':'application/json; charset=utf-8',
  'Content-Disposition':'attachment; filename="cheonny eonjigi-data.json"'.replace(' ',''),
  'Cache-Control':'private, no-store, max-age=0',
  'X-Content-Type-Options':'nosniff'
 }});
}
