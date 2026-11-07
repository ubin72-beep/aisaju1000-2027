import Link from 'next/link';
export default function NotFound(){
 return <main className="auth-wrap"><section className="auth-card"><div className="brand-mark">天</div><div className="section-kicker">404 · PAGE NOT FOUND</div><h1>페이지를 찾을 수 없습니다.</h1><p>주소를 다시 확인하거나 천년지기 홈으로 돌아가 주세요.</p><Link className="button" href="/">홈으로 돌아가기</Link></section></main>;
}
