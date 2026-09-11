import { createNeonAuth } from '@neondatabase/auth/next/server';
import { allowedUser } from './policy.mjs';
let instance;
export function auth() {
  if (!process.env.NEON_AUTH_BASE_URL || (process.env.NEON_AUTH_COOKIE_SECRET || '').length < 32) {
    throw new Error('Sign-in configuration is incomplete');
  }
  return instance ||= createNeonAuth({baseUrl: process.env.NEON_AUTH_BASE_URL, cookies: {secret: process.env.NEON_AUTH_COOKIE_SECRET, sessionDataTtl: 30}});
}
export async function owner() {
  if (!process.env.ADMIN_EMAIL) throw new Error('Owner email is not configured');
  const {data} = await auth().getSession();
  return allowedUser(data?.user, process.env.ADMIN_EMAIL) ? data.user : null;
}
