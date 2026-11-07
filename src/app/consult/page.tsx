import Link from 'next/link';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase-server';
import Consultation from './consultation';
export const dynamic='force-dynamic';
export default async function ConsultPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const params=await searchParams;
 const initialQuestion=typeof params.q==='string'?params.q.slice(0,1000):'';
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next=/consult');
 const {data:rows}=await supabase.from('consultations').select('id,question,answer,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(20);
 return <main className="dashboard"><header className="dash-nav"><Link href="/mypage">← 마이페이지</Link><Link href="/" className="brand">天 <b>천년지기</b></Link></header><section className="dash-content"><div className="section-kicker">AI CONSULTATION · BETA</div><h1>AI 명리 상담실</h1><p className="muted">현재는 일반적인 명리학 개념을 설명하는 베타 상담입니다. 정확한 만세력 계산과 개인 사주 해석은 아직 제공하지 않습니다. 결제 및 포인트 차감은 없습니다.</p><Consultation initial={rows||[]} initialQuestion={initialQuestion}/></section></main>;
}
