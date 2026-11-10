import {validateBirthDate} from './birth-date-validation';

// KASI / Public Data Portal: solar-date lookup, not a four-pillars engine.
// https://www.data.go.kr/data/15012679/openapi.do
export type KasiLunarDay = {
 solarDate:string;
 lunarDate:string;
 isLeapMonth:boolean;
 lunarMonthDays:29|30;
 source:'KASI_LRSR_CLD_INFO';
};
function xmlValue(xml:string,tag:string):string|null {
 const match=xml.match(new RegExp('<'+tag+'(?:\\s[^>]*)?>([^<]*)</'+tag+'>'));
 return match?match[1].trim():null;
}
export function parseKasiLunarDay(xml:string,requestedSolarDate:string):KasiLunarDay|null {
 if(xml.length>100_000||xmlValue(xml,'resultCode')!=='00')return null;
 const item=xml.match(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/)?.[1];
 if(!item)return null;
 const get=(tag:string)=>xmlValue(item,tag);
 const sol=[get('solYear'),get('solMonth'),get('solDay')];
 const lun=[get('lunYear'),get('lunMonth'),get('lunDay')];
 if([...sol,...lun].some(v=>!v||!/^\d{1,4}$/.test(v)))return null;
 const format=(parts:(string|null)[])=>parts.map((v,i)=>i===0?v!.padStart(4,'0'):v!.padStart(2,'0')).join('-');
 const solarDate=format(sol),lunarDate=format(lun);
 if(solarDate!==requestedSolarDate||!validateBirthDate(lunarDate,'lunar').valid)return null;
 const leap=get('lunLeapmonth'),days=get('lunNday');
 if((leap!=='평'&&leap!=='윤')||(days!=='29'&&days!=='30'))return null;
 if(Number(lun[2])>Number(days))return null;
 return {solarDate,lunarDate,isLeapMonth:leap==='윤',lunarMonthDays:Number(days) as 29|30,source:'KASI_LRSR_CLD_INFO'};
}
export async function lookupKasiLunarDay(solarDate:string):Promise<KasiLunarDay|null> {
 if(!validateBirthDate(solarDate,'solar').valid)return null;
 const key=process.env.KASI_SERVICE_KEY;
 if(!key)return null;
 const [year,month,day]=solarDate.split('-');
 const url=new URL('https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo');
 url.searchParams.set('serviceKey',key);
 url.searchParams.set('solYear',year);
 url.searchParams.set('solMonth',month);
 url.searchParams.set('solDay',day);
 url.searchParams.set('numOfRows','1');
 try {
  const response=await fetch(url.toString(),{signal:AbortSignal.timeout(8000),cache:'no-store'});
  if(!response.ok)return null;
  return parseKasiLunarDay(await response.text(),solarDate);
 }catch{return null;}
}
