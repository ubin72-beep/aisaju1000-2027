import Link from 'next/link';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase-server';
import {requestPasswordReset} from './actions';
export const dynamic='force-dynamic';
export default async function Settings({searchParams}:{searchParams:Promise<{sent?:string;error?:string}>}){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next=/mypage/settings');
 const p=await searchParams;
 return <main className="dashboard"><header className="dash-nav"><Link href="/mypage">← 마이페이지</Link><Link href="/">천년지기 홈</Link></header><section className="dash-content"><div className="section-kicker">ACCOUNT SETTINGS</div><h1>계정 설정</h1><div className="admin-panel"><h2>비밀번호 변경</h2><p className="muted">등록된 이메일 주소로 비밀번호 변경 링크를 보냅니다.</p><p className="muted">{user.email}</p>{p.sent&&<p className="form-success">비밀번호 변경 이메일 발송을 요청했습니다.</p>}{p.error&&<p className="form-error">이메일 발송에 실패했습니다. 서비스 설정을 확인해 주세요.</p>}<form action={requestPasswordReset}><button className="button" type="submit">비밀번호 변경 이메일 받기</button></form></div><div className="admin-panel"><h2>개인정보 내보내기</h2><p className="muted">회원 본인의 출생 정보와 상담 기록을 다운로드할 수 있습니다.</p><a href="/api/account/export" className="button" download>내 데이터 다운로드</a></div></section></main>;
}
