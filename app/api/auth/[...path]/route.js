import {auth} from '../../../../lib/auth.js';
import {sameOrigin} from '../../../../lib/policy.mjs';
export const dynamic='force-dynamic';
async function handle(request,context){
  if(!process.env.APP_ORIGIN || !process.env.ADMIN_EMAIL || !process.env.NEON_AUTH_BASE_URL || (process.env.NEON_AUTH_COOKIE_SECRET||'').length<32)return Response.json({message:'Online sign-in setup is not finished. Configure the private Netlify settings first.'},{status:503});
  const path=(await context.params).path.join('/');
  if(!['get-session','sign-out','email-otp/send-verification-otp','sign-in/email-otp'].includes(path))return Response.json({error:'Not available'},{status:404});
  if(request.method==='POST'){
    if(!sameOrigin(request,process.env.APP_ORIGIN))return Response.json({error:'Request origin not allowed'},{status:403});
    if(path!=='sign-out'){
      let body;try{body=await request.clone().json();}catch{return Response.json({message:'Invalid request'},{status:400});}
      if(!process.env.ADMIN_EMAIL || body.email?.toLowerCase()!==process.env.ADMIN_EMAIL.toLowerCase())return Response.json({message:'This email is not approved for this manager.'},{status:403});
    }
  }
  try{return await auth().handler()[request.method](request,context);}catch{return Response.json({message:'Sign-in is not configured yet. Complete Neon Auth and Netlify setup.'},{status:503});}
}
export const GET=handle;
export const POST=handle;
