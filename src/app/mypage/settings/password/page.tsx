import Link from 'next/link';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase-server';
import PasswordForm from './password-form';
export const dynamic='force-dynamic';
export default async function PasswordPage(){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next=/mypage/settings/password');
 return <main className="dashboard"><header className="dash-nav"><Link href="/mypage/settings">← 계정 설정</Link></header><section className="dash-content"><h1>새 비밀번호 설정</h1><PasswordForm/></section></main>;
}
