'use client';
import {useState} from 'react';
import {createAuthClient} from '@neondatabase/auth/next';
export default function SignOut(){const [error,setError]=useState('');return <main className="auth-wrap"><section className="auth-card"><h1>Sign out</h1><p>Download a backup of any unsaved changes before signing out.</p><button onClick={async()=>{const r=await createAuthClient().signOut();if(r.error)setError('Unable to sign out. Please try again.');else location.replace('/sign-in');}}>Confirm sign out</button><p role="alert">{error}</p><a href="/manager">Back to manager</a></section></main>;}
