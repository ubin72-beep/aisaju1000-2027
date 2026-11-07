'use client';
import {FormEvent,useState} from 'react';
import {createClient} from '@/lib/supabase-browser';
export default function PasswordForm(){
 const [password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setError('');setMessage('');
  if(password.length<8||password!==confirm){setError('8자 이상 비밀번호를 동일하게 입력해 주세요.');return;}
  setBusy(true);
  try{const {error}=await createClient().auth.updateUser({password});if(error)throw error;setMessage('비밀번호가 변경되었습니다.');setPassword('');setConfirm('');}
  catch(e){setError(e instanceof Error?e.message:'비밀번호 변경에 실패했습니다.');}
  finally{setBusy(false);}
 }
 return <form className="birth-form" onSubmit={submit}><label>새 비밀번호<input type="password" minLength={8} required autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><label>새 비밀번호 확인<input type="password" minLength={8} required autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>{error&&<p className="form-error" role="alert">{error}</p>}{message&&<p className="form-success" role="status">{message}</p>}<button className="button" disabled={busy}>{busy?'변경 중…':'비밀번호 변경'}</button></form>;
}
