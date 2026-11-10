'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Suspense} from 'react';
function Confirm(){
 const params=useSearchParams();
 const [message,setMessage]=useState('결제 승인 결과를 확인하고 있습니다.');
 const [paid,setPaid]=useState(false);
 const started=useRef(false);
 useEffect(()=>{
  if(started.current)return;
  started.current=true;
  const orderId=params.get('orderId'),paymentKey=params.get('paymentKey'),amount=Number(params.get('amount'));
  if(!orderId||!paymentKey||!Number.isSafeInteger(amount)||amount<=0){setMessage('결제 인증 정보가 올바르지 않습니다.');return;}
  void (async()=>{
   try{
    const response=await fetch('/api/payments/toss/confirm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId,paymentKey,amount})});
    const result=await response.json();
    if(!response.ok){setMessage(result.error||'결제 결과 확인이 필요합니다. 재결제하지 마세요.');return;}
    setPaid(true);setMessage('테스트 결제 승인이 완료되어 포인트가 적립되었습니다.');
   }catch{setMessage('결제 결과를 확인할 수 없습니다. 재결제하지 말고 운영자에게 문의해 주세요.');}
  })();
 },[params]);
 return <main className="dashboard"><section className="dash-content"><h1>{paid?'포인트 충전 완료':'결제 확인'}</h1><p className="muted" role="status">{message}</p><Link href="/mypage">마이페이지로 이동 →</Link></section></main>;
}
export default function Page(){return <Suspense fallback={<p>결제 결과 확인 중...</p>}><Confirm/></Suspense>;}
