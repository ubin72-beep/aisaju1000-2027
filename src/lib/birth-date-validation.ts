export type BirthCalendar = 'solar' | 'lunar';
export type BirthDateValidation = {valid:true;verified:boolean} | {valid:false;reason:string};

function koreaToday(now:Date):string {
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}

// This validates the input notation, NOT the historical Korean lunisolar calendar.
// In particular, a 30th lunar day or a leap month is only provisionally accepted.
export function validateBirthDate(value:string,calendar:BirthCalendar,now=new Date()):BirthDateValidation {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return {valid:false,reason:'format'};
 const [year,month,day]=value.split('-').map(Number);
 if(year<1900||month<1||month>12)return {valid:false,reason:'range'};
 const maxDay=calendar==='lunar'?30:new Date(Date.UTC(year,month,0)).getUTCDate();
 if(day<1||day>maxDay)return {valid:false,reason:'day'};
 const today=koreaToday(now);
 if(calendar==='solar'&&value>today)return {valid:false,reason:'future'};
 // A lunar date cannot be ordered against Gregorian today without conversion.
 if(calendar==='lunar'&&year>Number(today.slice(0,4)))return {valid:false,reason:'future'};
 return {valid:true,verified:calendar==='solar'};
}
