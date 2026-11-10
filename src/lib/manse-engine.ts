import {validateBirthDate, type BirthCalendar} from './birth-date-validation';

export type BirthInput = {
 birthDate:string;
 calendarType:BirthCalendar;
 isLeapMonth:boolean;
 birthTime:string|null;
 timeZone:'Asia/Seoul';
};
export type Pillar = {stem:string;branch:string};
export type VerifiedFourPillars = {
 year:Pillar;
 month:Pillar;
 day:Pillar;
 hour:Pillar|null;
 solarDate:string;
 calculationVersion:string;
 source:string;
};
export type ManseResult =
 | {status:'invalid_input';reason:string}
 | {status:'not_available';reason:'calendar_provider_not_verified'|'time_policy_not_verified'}
 | {status:'verified';pillars:VerifiedFourPillars};

// Fail closed: no personal pillars until a Korean lunar/solar-term reference,
// date boundaries and time-zone policy are independently verified.
export function calculateManse(input:BirthInput):ManseResult {
 if(input.calendarType!=='solar'&&input.calendarType!=='lunar')
  return {status:'invalid_input',reason:'calendar'};
 if(input.timeZone!=='Asia/Seoul')return {status:'invalid_input',reason:'time_zone'};
 if(input.isLeapMonth&&input.calendarType!=='lunar')
  return {status:'invalid_input',reason:'leap_requires_lunar'};
 if(input.birthTime!==null&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.birthTime))
  return {status:'invalid_input',reason:'time'};
 const date=validateBirthDate(input.birthDate,input.calendarType);
 if(!date.valid)return {status:'invalid_input',reason:date.reason};
 return {status:'not_available',reason:'calendar_provider_not_verified'};
}
