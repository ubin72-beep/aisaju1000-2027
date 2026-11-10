'use client';
import {useState} from 'react';

export default function BirthDateFields({date,calendar,leap}:{date:string;calendar:string;leap:boolean}){
 const [kind,setKind]=useState(calendar==='lunar'?'lunar':'solar');
 const [value,setValue]=useState(date);
 const [isLeap,setIsLeap]=useState(leap);
 return <>
  <label>양력/음력<select name="calendar_type" value={kind} onChange={e=>{setKind(e.target.value);setValue('');setIsLeap(false);}}><option value="solar">양력</option><option value="lunar">음력</option></select></label>
  <label>{kind==='lunar'?'음력 생년월일 (YYYY-MM-DD)':'양력 생년월일'}<input name="birth_date" type={kind==='lunar'?'text':'date'} inputMode={kind==='lunar'?'numeric':undefined} pattern={kind==='lunar'?'[0-9]{4}-[0-9]{2}-[0-9]{2}':undefined} placeholder={kind==='lunar'?'예: 1990-02-30':undefined} required value={value} onChange={e=>setValue(e.target.value)} maxLength={kind==='lunar'?10:undefined}/></label>
  {kind==='lunar'&&<label className="birth-check"><input name="is_leap_month" type="checkbox" checked={isLeap} onChange={e=>setIsLeap(e.target.checked)}/> 음력 윤달</label>}
  {kind==='lunar'&&<p className="muted">음력 날짜는 YYYY-MM-DD 형식으로 입력하세요. 양력 달력의 월 길이를 적용하지 않습니다. 실제 윤달·월 길이는 아직 검증 전입니다.</p>}
 </>;
}
