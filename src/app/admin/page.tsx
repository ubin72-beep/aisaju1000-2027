import Link from 'next/link';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase-server';
export const dynamic='force-dynamic';
export default async function Admin(){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login');
 return <main className="dashboard"><header className="dash-nav"><Link href="/" className="brand">天 <b>천년지기</b></Link></header><section className="dash-content"><h1>접근 권한이 없습니다</h1><p className="muted">관리자 기능은 서버 권한 정책과 감사 로그 구축 후 공개됩니다.</p><Link href="/mypage" className="button">마이페이지로 이동</Link></section></main>;
}