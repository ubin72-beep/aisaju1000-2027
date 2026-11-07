'use server';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase-server';
export async function requestPasswordReset(form:FormData){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next=/mypage/settings');
 const email=user.email;
 if(!email)redirect('/mypage/settings?error=email');
 const origin=process.env.NEXT_PUBLIC_SITE_URL;
 if(!origin)redirect('/mypage/settings?error=config');
 const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:origin.replace(/\/$/,'')+'/auth/callback?next=/mypage/settings/password'});
 if(error)redirect('/mypage/settings?error=send');
 redirect('/mypage/settings?sent=1');
}
