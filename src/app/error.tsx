'use client';
import {useEffect} from 'react';
export default function ErrorPage({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
 useEffect(()=>{console.error('Page rendering error',error.digest||'unknown');},[error]);
 return <main className="auth-wrap"><section className="auth-card"><div className="brand-mark">天</div><h1>잠시 문제가 발생했습니다.</h1><p>일시적인 오류일 수 있습니다. 다시 시도해 주세요.</p><button className="button" onClick={reset}>다시 시도</button></section></main>;
}
