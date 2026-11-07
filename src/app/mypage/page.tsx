import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
export const dynamic='force-dynamic';
export default async function MyPage(){
 const supabase=await createClient(),{data:{user},error}=await supabase.auth.getUser();
 if(error||!user)redirect('/login?next=/mypage');
 const {data:birth}=await supabase.from('birth_profiles').select('birth_date,calendar_type').eq('user_id',user.id).maybeSingle();
 const displayName=user.user_metadata?.full_name||user.email?.split('@')[0]||'회원';
 return <main className="dashboard"><header className="dash-nav"><Link href="/" className="brand"><span className="brand-mark">天</span><span>AI 사주 <b>천년지기</b></span></Link><div className="dash-nav-actions"><span>{user.email}</span><form action="/logout" method="post"><button className="logout-button" type="submit">로그아웃</button></form></div></header><div className="dash-content"><div className="section-kicker">MY CHEONNYEON JIGI</div><h1>{displayName}님, 반갑습니다.</h1><p className="muted">나의 사주 정보를 안전하게 관리하세요.</p><div className="dash-grid"><article className="dash-card"><span>보유 포인트</span><strong>준비 중</strong><p>결제 및 포인트 원장 검증 후 제공됩니다.</p></article><article className="dash-card"><span>나의 사주 프로필</span><strong>{birth?'등록됨':'미등록'}</strong><p>{birth?birth.birth_date+' · '+(birth.calendar_type==='lunar'?'음력':'양력'):'생년월일과 태어난 시간을 등록하세요.'}</p><Link href="/mypage/birth">사주 정보 {birth?'수정':'등록'} →</Link></article><article className="dash-card"><span>AI 상담</span><strong>베타 상담</strong><p>일반 명리학 개념 상담 · 하루 3회 무료</p><Link href="/consult">AI 상담실 열기 →</Link></article></div><section className="admin-panel"><h2>내 개인정보 관리</h2><p className="muted">등록한 출생 정보와 AI 상담 기록을 JSON 파일로 내려받을 수 있습니다. 다운로드한 파일에는 개인정보가 포함되므로 안전하게 보관하세요.</p><a className="button" href="/api/account/export" download>내 데이터 다운로드</a><p className="muted"><Link href="/mypage/settings">계정 설정 및 비밀번호 변경 →</Link></p></section></div></main>;
}