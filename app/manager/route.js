import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {owner} from '../../lib/auth.js';
export const dynamic='force-dynamic';
export async function GET(request){
  try{if(!await owner())return Response.redirect(new URL('/sign-in',request.url),303);}catch{return new Response('<h1>NorthRidge Business Manager v11</h1><p>Online setup is not finished. Configure Neon Auth, the owner email and Netlify environment variables before importing any records.</p><a href="/sign-in">Sign in</a>',{status:503,headers:{'Content-Type':'text/html','Cache-Control':'no-store'}});}
  const html=await readFile(join(process.cwd(),'manager/index_10.html'),'utf8');
  return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','Vary':'Cookie'}});
}
