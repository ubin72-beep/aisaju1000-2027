import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase-server';
import {createClient as createAdminClient} from '@supabase/supabase-js';
export const runtime='nodejs';
export async function DELETE(){
 const supabase=await createClient();
 const {data:{user},error:authError}=await supabase.auth.getUser();
 if(authError||!user)return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return NextResponse.json({error:'서비스 설정 중입니다.'},{status:503});
 const admin=createAdminClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {error}=await admin.from('consultations').delete().eq('user_id',user.id);
 if(error)return NextResponse.json({error:'상담 기록 삭제에 실패했습니다.'},{status:500});
 return NextResponse.json({ok:true});
}
