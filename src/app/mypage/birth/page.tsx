import Link from 'next/link';
import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase-server';
import {saveBirth,deleteBirth} from './actions';
export const dynamic='force-dynamic';
export default async function BirthPage({searchParams}:{searchParams:Promise<{saved?:string;deleted?:string;error?:string}>}){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login?next=/mypage/birth');
 const {data:birth}=await supabase.from('birth_profiles').select('birth_date,birth_time,calendar_type,is_leap_month,gender').eq('user_id',user.id).maybeSingle();
 const p=await searchParams;
 return <main className="dashboard"><header className="dash-nav"><Link href="/mypage">← 마이페이지</Link><Link href="/">천년지기 홈</Link></header><section className="dash-content"><div className="section-kicker">MY BIRTH PROFILE</div><h1>나의 사주 정보</h1><p className="muted">정보는 회원 본인만 조회할 수 있습니다. 정확한 만세력 계산은 별도 검증 후 제공합니다.</p>{p.saved&&<p className="form-success">저장되었습니다.</p>}{p.deleted&&<p className="form-success">삭제되었습니다.</p>}{p.error&&<p className="form-error">저장에 실패했습니다. 입력값 또는 데이터베이스 설정을 확인해 주세요.</p>}<form action={saveBirth} className="birth-form"><label>생년월일<input name="birth_date" type="date" required defaultValue={birth?.birth_date||''}/></label><label>양력/음력<select name="calendar_type" defaultValue={birth?.calendar_type||'solar'}><option value="solar">양력</option><option value="lunar">음력</option></select></label><label className="birth-check"><input name="is_leap_month" type="checkbox" defaultChecked={birth?.is_leap_month||false}/> 음력 윤달</label><label>태어난 시간 (모르면 비워두세요)<input name="birth_time" type="time" defaultValue={birth?.birth_time?.slice(0,5)||''}/></label><label>성별<select name="gender" defaultValue={birth?.gender||'unspecified'}><option value="unspecified">선택 안 함</option><option value="female">여성</option><option value="male">남성</option></select></label><p className="muted">현재 국내 출생 기준으로 입력받습니다. 해외 출생 시간대 보정은 아직 지원하지 않습니다.</p><button className="button" type="submit">정보 저장</button></form>{birth&&<form action={deleteBirth} className="birth-delete"><button className="logout-button" type="submit">사주 정보 삭제</button></form>}</section></main>;
}
