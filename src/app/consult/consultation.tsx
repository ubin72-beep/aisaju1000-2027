'use client';
import {useState} from 'react';
const topics=[
 {title:'오행과 성격',question:'사주명리학에서 오행과 성격의 관계를 초보자도 이해하기 쉽게 설명해 주세요.'},
 {title:'연애와 인간관계',question:'명리학에서는 인간관계와 궁합을 어떤 관점에서 바라보나요?'},
 {title:'직업과 적성',question:'명리학에서 직업과 적성을 살펴볼 때 어떤 개념을 참고하나요?'},
 {title:'재물과 생활',question:'명리학에서 재물운이라는 개념은 무엇이며 현실적인 재정 판단과 어떻게 구분해야 하나요?'},
 {title:'운세와 흐름',question:'대운과 세운의 의미를 예시와 함께 쉽게 설명해 주세요.'},
 {title:'자유 질문',question:''}
];
type Entry={id:string;question:string;answer:string;created_at:string};
export default function Consultation({initial}:{initial:Entry[]}){
 const [items,setItems]=useState(initial),[question,setQuestion]=useState(''),[busy,setBusy]=useState(false),[deleting,setDeleting]=useState(false),[error,setError]=useState('');
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!question.trim()||busy)return;setBusy(true);setError('');
 try{const res=await fetch('/api/consult',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question})});const json=await res.json();if(!res.ok)throw new Error(json.error||'상담에 실패했습니다.');setItems(v=>[json.entry,...v]);setQuestion('');}catch(e){setError(e instanceof Error?e.message:'오류가 발생했습니다.');}finally{setBusy(false);}
 }
 async function clearHistory(){
 if(deleting||!window.confirm('저장된 상담 기록을 모두 삭제할까요? 삭제 후 복구할 수 없습니다.'))return;
 setDeleting(true);setError('');
 try{const res=await fetch('/api/consult/history',{method:'DELETE'});if(!res.ok){const json=await res.json();throw new Error(json.error||'삭제에 실패했습니다.');}setItems([]);}catch(e){setError(e instanceof Error?e.message:'삭제에 실패했습니다.');}finally{setDeleting(false);}
 }
 return <section className="consult-app"><div className="consult-topics"><h2>어떤 이야기가 궁금하세요?</h2><p className="muted">아래 주제를 누르면 질문 예시가 자동으로 입력됩니다. 자유롭게 수정해도 됩니다.</p><div className="consult-topic-grid">{topics.map(topic=><button type="button" key={topic.title} className="consult-topic" onClick={()=>{setQuestion(topic.question);setError('');}} disabled={busy}>{topic.title} <span aria-hidden="true">→</span></button>)}</div></div><form onSubmit={submit} className="consult-form"><label htmlFor="question">질문을 확인하고 상담을 시작하세요.</label><textarea id="question" maxLength={1000} rows={4} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="예: 오행의 균형은 어떤 의미인가요?" required/><div className="consult-form-bottom"><span>{question.length}/1000자 · 무료 베타 · 하루 최대 3회 · 개인 사주 계산 미지원</span><button className="button" disabled={busy||!question.trim()}>{busy?'답변 생성 중…':'질문하기'}</button></div></form><div className="consult-history-head"><h2>최근 상담</h2>{items.length>0&&<button className="logout-button" type="button" onClick={clearHistory} disabled={deleting}>{deleting?'삭제 중…':'전체 기록 삭제'}</button>}</div>{error&&<p className="form-error" role="alert">{error}</p>}{items.length===0&&<p className="muted">아직 상담 기록이 없습니다.</p>}{items.map(item=><article className="consult-entry" key={item.id}><time>{new Date(item.created_at).toLocaleString('ko-KR')}</time><h3>{item.question}</h3><p>{item.answer}</p></article>)}</section>;
}
