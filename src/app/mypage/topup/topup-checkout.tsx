'use client';
import Script from 'next/script';
import {useState} from 'react';
import {TOPUP_PRODUCTS,type TopupProductId} from '@/lib/topup-products';

type PaymentWidget={setAmount:(amount:{currency:'KRW';value:number})=>Promise<void>;renderPaymentMethods:(input:{selector:string})=>Promise<unknown>;renderAgreement:(input:{selector:string})=>Promise<unknown>;requestPayment:(input:{orderId:string;orderName:string;successUrl:string;failUrl:string})=>Promise<void>};
type TossSDK={widgets:(options:{customerKey:string})=>PaymentWidget};
type TossFactory=(clientKey:string)=>TossSDK;
declare global {interface Window {TossPayments?:TossFactory}}
export default function TopupCheckout({enabled,clientKey}:{enabled:boolean;clientKey:string}){
 const [selected,setSelected]=useState<TopupProductId>('topup_1000');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [sdkReady,setSdkReady]=useState(false);
 const [widget,setWidget]=useState<PaymentWidget|null>(null);
 const [ready,setReady]=useState(false);
 async function initialize(){
  if(!enabled||!window.TossPayments||widget)return;
  setBusy(true);setError('');
  try{
   // SDK v2 accepts an anonymous customer key for one-off payments.
   const w=window.TossPayments(clientKey).widgets({customerKey:'ANONYMOUS'});
   await w.setAmount({currency:'KRW',value:TOPUP_PRODUCTS[selected].amount});
   await w.renderPaymentMethods({selector:'#toss-payment-methods'});
   await w.renderAgreement({selector:'#toss-payment-agreement'});
   setWidget(w);setReady(true);
  }catch{setError('결제 화면을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');}
  finally{setBusy(false);}
 }
 async function choose(id:TopupProductId){
  if(busy)return;
  setSelected(id);setError('');
  if(widget){setReady(false);try{await widget.setAmount({currency:'KRW',value:TOPUP_PRODUCTS[id].amount});setReady(true);}catch{setError('금액 변경에 실패했습니다. 페이지를 새로고침해 주세요.');}}
 }
 async function pay(){
  if(!widget||!ready||busy)return;
  setBusy(true);setError('');
  try{
   const response=await fetch('/api/payments/toss/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:selected})});
   const order=await response.json();
   if(!response.ok)throw Error(order.error||'주문 생성에 실패했습니다.');
   await widget.requestPayment({orderId:order.orderId,orderName:order.orderName,successUrl:location.origin+'/mypage/topup/success',failUrl:location.origin+'/mypage/topup/fail'});
  }catch(e){setError(e instanceof Error?e.message:'결제 요청에 실패했습니다.');setBusy(false);}
 }
 return <section>
  {enabled&&<Script src="https://js.tosspayments.com/v2/standard" strategy="afterInteractive" onReady={()=>setSdkReady(true)}/>}
  <div className="dash-grid">{(Object.entries(TOPUP_PRODUCTS) as [TopupProductId,(typeof TOPUP_PRODUCTS)[TopupProductId]][]).map(([id,p])=><button key={id} type="button" onClick={()=>choose(id)} disabled={!enabled||busy} className="dash-card" style={{textAlign:'left',borderColor:selected===id?'#c8a96b':undefined}}><span>{p.amount.toLocaleString('ko-KR')}원</span><strong>{p.points.toLocaleString('ko-KR')} P</strong><p>상담 {p.points/100}회 상당</p></button>)}</div>
  {!enabled?<p className="muted">테스트 결제 설정이 완료되면 충전 기능이 열립니다. 현재 충전할 수 없습니다.</p>:<>
   <div id="toss-payment-methods"/><div id="toss-payment-agreement"/>
   {!widget?<button className="button" type="button" disabled={!sdkReady||busy} onClick={initialize}>테스트 결제수단 불러오기</button>:<button className="button" type="button" disabled={!ready||busy} onClick={pay}>{TOPUP_PRODUCTS[selected].amount.toLocaleString('ko-KR')}원 테스트 결제</button>}
  </>}
  {error&&<p className="form-error" role="alert">{error}</p>}
 </section>;
}
