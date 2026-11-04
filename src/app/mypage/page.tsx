import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
export default async function MyPage(){
 const supabase=await createClient(),{data:{user},error}=await supabase.auth.getUser();
 if(error||!user)redirect('/login?next=/mypage');
 const displayName=user.user_metadata?.full_name||user.email?.split('@')[0]||'회원';
 return <main className="dashboard"><header className="dash-nav"><Link href="/" className="brand"><span className="brand-mark">天</span><span>AI 사주 <b>천년지기</b></span></Link><div className="dash-nav-actions"><span>{user.email}</span><form action="/logout" method="post"><button className="logout-button" type="submit">로그아웃</button></form></div></header><div className="dash-content"><div className="section-kicker">MY CHEONNYEON JIGI</div><h1>{displayName}님, 반갑습니다.</h1><p className="muted">나의 사주와 상담 여정을 이곳에서 관리할 수 있습니다.</p><div className="dash-grid"><article className="dash-card"><span>보유 포인트</span><strong>준비 중</strong><p>포인트 지갑 기능은 결제 시스템 연결 후 제공됩니다.</p></article><article className="dash-card"><span>나의 사주 프로필</span><strong>등록 준비 중</strong><p>다음 단계에서 생년월일과 태어난 시간을 등록합니다.</p></article><article className="dash-card"><span>상담 기록</span><strong>준비 중</strong><p>AI 상담 기능 연결 후 기록이 표시됩니다.</p></article></div></div></main>;
}
