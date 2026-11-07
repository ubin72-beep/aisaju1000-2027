import {NextResponse} from 'next/server';
export const runtime='nodejs';
export function GET(){
 return NextResponse.json({status:'ok',service:'aisaju1000-2027',version:'beta'},{
  headers:{'Cache-Control':'no-store'}
 });
}
