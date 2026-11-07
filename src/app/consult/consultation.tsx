'use client';
import {useState} from 'react';
type Entry={id:string;question:string;answer:string;created_at:string};
export default function Consultation({initial}:{initial:Entry[]}){
 const [items,setItems]=useState(initial),[question,setQuestion]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!question.trim()||busy)return;setBusy(true);setError('');
 try{const res=await fetch('/api/consult',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question})});const json=await res.json();if(!res.ok)throw new Error(json.error||'상담에 실패했습니다.');setItems(v=>[json.entry,...v]);setQuestion('');}catch(e){setError(e instanceof Error?e.message:'오류가 발생했습니다.');}finally{setBusy(false);}
 }
 return <section className="consult-app"><form onSubmit={submit} className="consult-form"><label htmlFor="question">궁금한 명리학 개념이나 삶의 주제를 질문해 보세요.</label><textarea id="question" maxLength={1000} rows={4} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="예: 오행의 균형은 어떤 의미인가요?" required/><div className="consult-form-bottom"><span>{question.length}/1000자 · 하루 최대 3회 베타 상담</span><button className="button" disabled={busy||!question.trim()}>{busy?'답변 생성 중…':'질문하기'}</button></div>{error&&<p className="form-error" role="alert">{error}</p>}</form><h2>최근 상담</h2>{items.length===0&&<p className="muted">아직 상담 기록이 없습니다.</p>}{items.map(item=><article className="consult-entry" key={item.id}><time>{new Date(item.created_at).toLocaleString('ko-KR')}</time><h3>{item.question}</h3><p>{item.answer}</p></article>)}</section>;
}
