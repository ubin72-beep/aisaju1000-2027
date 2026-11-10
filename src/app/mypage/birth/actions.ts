'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

function validBirthDate(value:string,calendar:'solar'|'lunar'){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const [year,month,day]=value.split('-').map(Number);
 if(year<1900||year>new Date().getFullYear()||month<1||month>12)return false;
 // Lunar months can have 29 or 30 days regardless of Gregorian month length.
 // Full lunar month/leap-month validation awaits a verified calendar source.
 const maxDay=calendar==='lunar'?30:new Date(Date.UTC(year,month,0)).getUTCDate();
 if(day<1||day>maxDay)return false;
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const part=(type:string)=>parts.find(p=>p.type===type)?.value||'';
 const today=part('year')+'-'+part('month')+'-'+part('day');
 // A lunar date is not directly comparable to the Gregorian current date.
 // Reject obvious future years, but do not claim full lunar validity here.
 return calendar==='lunar'?year<=Number(part('year')):value<=today;
}
export async function saveBirth(form:FormData){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next=/mypage/birth');
 const date=String(form.get('birth_date')||''),time=String(form.get('birth_time')||''),calendar=String(form.get('calendar_type')||'solar'),gender=String(form.get('gender')||'unspecified');
 const leap=form.get('is_leap_month')==='on';
 if(!['solar','lunar'].includes(calendar)||!validBirthDate(date,calendar as 'solar'|'lunar')||!['male','female','unspecified'].includes(gender)||(time!==''&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))||(leap&&calendar!=='lunar'))redirect('/mypage/birth?error=invalid');
 const {error}=await supabase.from('birth_profiles').upsert({user_id:user.id,birth_date:date,birth_time:time||null,calendar_type:calendar,is_leap_month:leap,gender},{onConflict:'user_id'});
 if(error)redirect('/mypage/birth?error=save');
 revalidatePath('/mypage');revalidatePath('/mypage/birth');redirect('/mypage/birth?saved=1');
}
export async function deleteBirth(){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login');
 const {error}=await supabase.from('birth_profiles').delete().eq('user_id',user.id);
 if(error)redirect('/mypage/birth?error=delete');
 revalidatePath('/mypage');revalidatePath('/mypage/birth');redirect('/mypage/birth?deleted=1');
}
