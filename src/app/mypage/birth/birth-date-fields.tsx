'use client';
import {useState} from 'react';
import {validateBirthDate} from '@/lib/birth-date-validation';

export default function BirthDateFields({date,calendar,leap}:{date:string;calendar:string;leap:boolean}){
 const [kind,setKind]=useState(calendar==='lunar'?'lunar':'solar');
 const [value,setValue]=useState(date);
 const [isLeap,setIsLeap]=useState(leap);
 const validation=value?validateBirthDate(value,kind):null;
 return <>
  <label>양력/음력<select name="calendar_type" value={kind} onChange={e=>{setKind(e.target.value);setValue('');setIsLeap(false);}}><option value="solar">양력</option><option value="lunar">음력</option></select></label>
  <label>{kind==='lunar'?'음력 생년월일 (YYYY-MM-DD)':'양력 생년월일'}<input name="birth_date" type={kind==='lunar'?'text':'date'} inputMode={kind==='lunar'?'numeric':undefined} pattern={kind==='lunar'?'[0-9]{4}-[0-9]{2}-[0-9]{2}':undefined} placeholder={kind==='lunar'?'예: 1990-02-30':undefined} required value={value} onChange={e=>setValue(e.target.value)} maxLength={kind==='lunar'?10:undefined} aria-describedby="birth-date-help" aria-invalid={validation?.valid===false}/></label>
  {kind==='lunar'&&<label className="birth-check"><input name="is_leap_month" type="checkbox" checked={isLeap} onChange={e=>setIsLeap(e.target.checked)}/> 음력 윤달</label>}
  <p id="birth-date-help" className={validation?.valid===false?'form-error':'muted'} role={validation?.valid===false?'alert':undefined}>{validation?.valid===false?'날짜 형식 또는 범위를 확인해 주세요.':kind==='lunar'?'음력 날짜는 YYYY-MM-DD 형식으로 입력하세요. 실제 음력 월 길이·윤달 유효성은 아직 검증되지 않습니다.':'한국 날짜 기준으로 입력해 주세요.'}</p>
 </>;
}
