import { neon } from '@neondatabase/serverless';
export function database() {
  const value = process.env.DATABASE_URL;
  if (!value) throw Error('Database configuration missing');
  const url = new URL(value);
  if (!url.hostname.startsWith('ep-late-mountain-aenu9ajv.') && !url.hostname.startsWith('ep-late-mountain-aenu9ajv-pooler.')) throw Error('This connection is not the Northridge database.');
  return neon(value);
}
