import Link from 'next/link';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase-server';
import Consultation from './consultation';
import {calculateManse} from '@/lib/manse-engine';
export const dynamic='force-dynamic';
export default async function ConsultPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const params=await searchParams;
 const initialQuestion=typeof params.q==='string'?params.q.slice(0,1000):'';
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next='+encodeURIComponent('/consult'+(initialQuestion?'?q='+encodeURIComponent(initialQuestion):'')));
 const {data:birth}=await supabase.from('birth_profiles').select('birth_date,birth_time,calendar_type,is_leap_month').eq('user_id',user.id).maybeSingle();
 const manse=birth?calculateManse({birthDate:birth.birth_date,calendarType:birth.calendar_type,isLeapMonth:birth.is_leap_month,birthTime:birth.birth_time?.slice(0,5)||null,timeZone:'Asia/Seoul'}):null;
 const {data:rows}=await supabase.from('consultations').select('id,question,answer,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(20);
 return <main className="dashboard"><header className="dash-nav"><Link href="/mypage">← 마이페이지</Link><Link href="/" className="brand">天 <b>천년지기</b></Link></header><section className="dash-content"><div className="section-kicker">AI CONSULTATION · BETA</div><h1>AI 명리 상담실</h1><p className="muted">현재는 일반적인 명리학 개념을 설명하는 베타 상담입니다. 정확한 만세력 계산과 개인 사주 해석은 아직 제공하지 않습니다. 결제 및 포인트 차감은 없습니다.</p><div className="consult-profile-status"><div><strong>{birth?'출생 정보 등록 완료':'출생 정보 미등록'}</strong><p>{birth?'개인 사주 계산 상태: {manse?.status==='invalid_input'?'등록된 날짜·시간을 다시 확인해 주세요.':manse?.status==='verified'?'검증 완료':'만세력 엔진 검증 대기 중'} · 현재 AI 답변에는 개인 명식이 사용되지 않습니다.':'전문 사주 상담을 준비하려면 생년월일과 태어난 시간을 등록해 주세요. 지금은 등록 없이도 일반 명리 상담을 이용할 수 있습니다.'}</p></div><Link href="/mypage/birth">{birth?'정보 확인·수정':'출생 정보 등록'} →</Link></div><Consultation initial={rows||[]} initialQuestion={initialQuestion}/></section></main>;
}
