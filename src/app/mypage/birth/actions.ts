'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { validateBirthDate, type BirthCalendar } from '@/lib/birth-date-validation';

export async function saveBirth(form:FormData){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next=/mypage/birth');
 const date=String(form.get('birth_date')||''),time=String(form.get('birth_time')||''),calendar=String(form.get('calendar_type')||'solar'),gender=String(form.get('gender')||'unspecified');
 const leap=form.get('is_leap_month')==='on';
 if(!['solar','lunar'].includes(calendar)||!validateBirthDate(date,calendar as BirthCalendar).valid||!['male','female','unspecified'].includes(gender)||(time!==''&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))||(leap&&calendar!=='lunar'))redirect('/mypage/birth?error=invalid');
 const {error}=await supabase.from('birth_profiles').upsert({user_id:user.id,birth_date:date,birth_time:time||null,calendar_type:calendar,is_leap_month:leap,gender},{onConflict:'user_id'});
 if(error){
  // Before the birth_date text migration, PostgreSQL date rejects some valid
  // lunar notations. Do not silently coerce or replace the entered date.
  if(calendar==='lunar'&&(error.code==='22007'||error.code==='22008'||error.code==='22009'))
   redirect('/mypage/birth?error=lunar_migration');
  redirect('/mypage/birth?error=save');
 }
 revalidatePath('/mypage');revalidatePath('/mypage/birth');redirect('/mypage/birth?saved=1');
}
export async function deleteBirth(){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login');
 const {error}=await supabase.from('birth_profiles').delete().eq('user_id',user.id);
 if(error)redirect('/mypage/birth?error=delete');
 revalidatePath('/mypage');revalidatePath('/mypage/birth');redirect('/mypage/birth?deleted=1');
}
