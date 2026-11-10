import Link from 'next/link';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase-server';
import TopupCheckout from './topup-checkout';
export const dynamic='force-dynamic';
export default async function TopupPage(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next=/mypage/topup');
 const enabled=process.env.TOSS_TEST_PAYMENTS_ENABLED==='true' &&
  !!process.env.TOSS_SECRET_KEY?.startsWith('test_gsk_') &&
  !!process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.startsWith('test_gck_');
 return <main className="dashboard"><header className="dash-nav"><Link href="/mypage">← 마이페이지</Link><Link href="/">천년지기 홈</Link></header><section className="dash-content"><div className="section-kicker">WALLET TOP-UP</div><h1>포인트 충전</h1><p className="muted">1포인트 = 1원 · 상담 답변 1건당 100포인트 차감 예정</p><p className="muted">현재 테스트 결제 전용입니다. 실제 금액은 청구되지 않습니다. 환불 및 운영 정책 검증 전에는 실결제를 제공하지 않습니다.</p><TopupCheckout enabled={enabled} clientKey={enabled?process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY||'':''}/></section></main>;
}
