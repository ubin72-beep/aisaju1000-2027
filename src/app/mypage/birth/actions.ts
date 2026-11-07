'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
export async function saveBirth(form:FormData){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next=/mypage/birth');
 const date=String(form.get('birth_date')||''),time=String(form.get('birth_time')||''),calendar=String(form.get('calendar_type')||'solar'),gender=String(form.get('gender')||'unspecified');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||!['solar','lunar'].includes(calendar)||!['male','female','unspecified'].includes(gender)||(time!==''&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)))redirect('/mypage/birth?error=invalid');
 const {error}=await supabase.from('birth_profiles').upsert({user_id:user.id,birth_date:date,birth_time:time||null,calendar_type:calendar,is_leap_month:calendar==='lunar'&&form.get('is_leap_month')==='on',gender},{onConflict:'user_id'});
 if(error)redirect('/mypage/birth?error=save');revalidatePath('/mypage');redirect('/mypage/birth?saved=1');
}
export async function deleteBirth(){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login');
 const {error}=await supabase.from('birth_profiles').delete().eq('user_id',user.id);
 if(error)redirect('/mypage/birth?error=delete');revalidatePath('/mypage');redirect('/mypage/birth?deleted=1');
}
