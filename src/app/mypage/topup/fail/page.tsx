import Link from 'next/link';
export default function Fail(){return <main className="dashboard"><section className="dash-content"><h1>결제가 완료되지 않았습니다</h1><p className="muted">결제 인증이 취소되거나 실패했습니다. 결제 결과가 불확실하다면 다시 결제하지 말고 운영자에게 문의해 주세요.</p><Link href="/mypage/topup">충전 화면으로 돌아가기 →</Link></section></main>;}
