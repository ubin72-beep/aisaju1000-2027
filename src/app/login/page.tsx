'use client';
import Link from 'next/link';
import { FormEvent,useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
function windowSafeSignupSuffix(){if(typeof window==='undefined')return '';const next=new URLSearchParams(window.location.search).get('next');return next&&next.startsWith('/')&&!next.startsWith('//')&&!next.includes('\\\\')?'?next='+encodeURIComponent(next):'';}
export default function Login(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError('');try{const {error}=await createClient().auth.signInWithPassword({email,password});if(error)throw error;const params=new URLSearchParams(window.location.search),next=params.get('next')||'/mypage',safeNext=next.startsWith('/')&&!next.startsWith('//')&&!next.includes('\\')&&!next.includes('\\r')&&!next.includes('\\n')?next:'/mypage';window.location.href=safeNext;}catch(e){setError(e instanceof Error?e.message:'로그인에 실패했습니다.');}finally{setBusy(false);}}
 return <main className="auth-wrap"><Link href="/" className="back">← 천년지기 홈</Link><section className="auth-card"><div className="brand-mark">天</div><div className="section-kicker">WELCOME BACK</div><h1>다시 만나 반갑습니다.</h1><p>나의 사주와 상담 기록을 이어가세요.</p><form onSubmit={submit}>
 <label>이메일<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@email.com" autoComplete="email" required/></label>
 <label>비밀번호<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" autoComplete="current-password" required/></label>
 {error&&<p role="alert" className="form-error">{error}</p>}<button className="button" type="submit" disabled={busy}>{busy?'로그인 중…':'로그인'}</button>
 </form><div className="auth-bottom">아직 회원이 아니신가요? <Link href={"/signup"+windowSafeSignupSuffix()}>회원가입</Link></div><small className="notice">비밀번호는 인증 시스템에서 안전하게 관리됩니다.</small></section></main>;
}
