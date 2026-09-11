'use client';
import {useState} from 'react';
import {createAuthClient} from '@neondatabase/auth/next';
const client=createAuthClient();
export default function SignIn(){
  const [email,setEmail]=useState(''),[otp,setOtp]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function submit(event){event.preventDefault();setBusy(true);setError('');try{
    const result=sent?await client.signIn.emailOtp({email,otp}):await client.emailOtp.sendVerificationOtp({email,type:'sign-in'});
    if(result.error)throw Error(result.error.status===503?'Online sign-in setup is not finished. The Netlify settings still need to be connected.':result.error.status===403?'This request is not approved. Check your email address and the site configuration.':result.error.message||'Sign-in failed. Please try again.');
    if(sent)location.assign('/manager');else setSent(true);
  }catch(err){setError(err.message);}finally{setBusy(false);}}
  return <main className="auth-wrap"><section className="auth-card"><div className="brand">NorthRidge Advisory · v10</div><h1>Your business, in one place.</h1><p>Sign in with a code sent to your approved email address.</p><form onSubmit={submit}><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required value={email} readOnly={sent} onChange={e=>setEmail(e.target.value)}/>{sent&&<><label htmlFor="otp">Email verification code</label><input id="otp" inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={e=>setOtp(e.target.value)}/><p>Check your inbox and spam folder for the code.</p></>}<p role="alert">{error}</p><button disabled={busy}>{busy?'Please wait…':sent?'Verify & open manager':'Send sign-in code'}</button>{sent&&<button type="button" className="secondary" disabled={busy} onClick={()=>{setSent(false);setOtp('');}}>Use another email or request a new code</button>}</form><p><small>Private access · Neon sign-in · No local launcher required after deployment.</small></p></section></main>;
}
