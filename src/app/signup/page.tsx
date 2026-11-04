'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function Signup(){
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [agreed,setAgreed]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError('');setMessage('');
  if(!agreed){setError('이용약관 및 개인정보 처리방침에 동의해 주세요.');return;}
  if(password.length<8){setError('비밀번호는 8자 이상 입력해 주세요.');return;}
  setBusy(true);try{const supabase=createClient();const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:`${window.location.origin}/auth/callback`}});
   if(error)throw error;if(data.session)window.location.href='/mypage';else setMessage('가입 요청이 접수되었습니다. 이메일로 발송된 인증 링크를 확인해 주세요.');
  }catch(e){setError(e instanceof Error?e.message:'회원가입 중 오류가 발생했습니다.');}finally{setBusy(false);}
 }
 return <main className="auth-wrap"><Link href="/" className="back">← 천년지기 홈</Link><section className="auth-card"><div className="brand-mark">天</div><div className="section-kicker">JOIN CHEONNYEON JIGI</div><h1>나를 알아가는 여정을<br/>시작해 보세요.</h1><p>회원가입 후 나의 사주 정보를 등록할 수 있습니다.</p><form onSubmit={submit}>
 <label>이름<input value={name} onChange={e=>setName(e.target.value)} placeholder="이름" autoComplete="name" required maxLength={40}/></label>
 <label>이메일<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="이메일 주소" autoComplete="email" required/></label>
 <label>비밀번호<input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="8자 이상 비밀번호" autoComplete="new-password" minLength={8} required/></label>
 <label className="check"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/> 이용약관 및 개인정보 처리방침에 동의합니다.</label>
 {error&&<p role="alert" className="form-error">{error}</p>}{message&&<p role="status" className="form-success">{message}</p>}
 <button className="button" type="submit" disabled={busy}>{busy?'가입 처리 중…':'가입하기'}</button>
 </form><div className="auth-bottom">이미 계정이 있으신가요? <Link href="/login">로그인</Link></div><small className="notice">안전한 회원 인증을 위해 Supabase를 사용합니다. 이메일 인증 설정에 따라 인증 메일이 발송됩니다.</small></section></main>;
}
