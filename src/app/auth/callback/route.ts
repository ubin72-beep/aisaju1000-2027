import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase-server';
export async function GET(request:Request){
 const {searchParams,origin}=new URL(request.url);
 const code=searchParams.get('code');
 const next=searchParams.get('next')||'/mypage';
 const allowed=['/mypage','/mypage/settings/password'];
 let destination=allowed.includes(next)?next:'/mypage';
 if(next==='/consult')destination='/consult';
 else if(next.startsWith('/consult?')){
  const target=new URL(next,origin);
  const question=target.searchParams.get('q');
  if(question&&question.length<=1000)destination='/consult?q='+encodeURIComponent(question);
 }
 if(code){
  const supabase=await createClient();
  const {error}=await supabase.auth.exchangeCodeForSession(code);
  if(!error)return NextResponse.redirect(new URL(destination,origin));
 }
 return NextResponse.redirect(new URL('/login?error=auth_callback',origin));
}
