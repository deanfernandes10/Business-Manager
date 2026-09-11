import {owner} from '../../../lib/auth.js';
import {database} from '../../../lib/db.mjs';
import {sameOrigin,validateRecords} from '../../../lib/policy.mjs';
export const dynamic='force-dynamic';
const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}});
export async function GET(){try{
  if(!await owner())return reply({error:'Sign in with your approved, verified email.'},401);
  const sql=database();const rows=await sql`SELECT revision, records FROM nr_manager_state WHERE id = 1`;
  if(!rows.length)return reply({error:'Database needs its initial migration.'},503);
  return reply(rows[0]);
}catch{return reply({error:'Cloud database unavailable or not configured. Your existing data has not been replaced.'},503);}}
export async function POST(request){
  if(!sameOrigin(request,process.env.APP_ORIGIN))return reply({error:'Request origin not allowed.'},403);
  try{if(!await owner())return reply({error:'Session expired. Keep this window open, sign in in another tab, then retry.'},401);}catch{return reply({error:'Sign-in service unavailable.'},503);}
  let data;try{const body=await request.text();if(Buffer.byteLength(body)>3_000_000)return reply({error:'Backup is larger than the 3 MB record limit. Documents must be links.'},413);data=validateRecords(JSON.parse(body));}catch(err){return reply({error:err.message||'Invalid records.'},400);}
  try{
    const sql=database();
    const rows=await sql`WITH previous AS MATERIALIZED (
      SELECT revision, records FROM nr_manager_state WHERE id=1 AND revision=${data.revision} FOR UPDATE
    ), changed AS (
      UPDATE nr_manager_state s SET revision=s.revision+1,records=${JSON.stringify(data.records)}::jsonb,updated_at=now()
      FROM previous p WHERE s.id=1 AND s.revision=${data.revision} RETURNING s.revision
    ), archived AS (
      INSERT INTO nr_manager_history(revision,records) SELECT p.revision,p.records FROM previous p CROSS JOIN changed c
      ON CONFLICT (revision) DO NOTHING
    ) SELECT revision FROM changed`;
    if(!rows.length)return reply({error:'Another window saved first. Download your current backup before reloading, then reconcile changes.'},409);
    // Retention cleanup is best effort and must not turn a committed save into a failure.
    try{await sql`DELETE FROM nr_manager_history WHERE revision < ${rows[0].revision-50}`;}catch{}
    return reply(rows[0]);
  }catch{return reply({error:'Save could not be confirmed. Do not close the window. Export a backup, then reload to check the latest saved records.'},503);}
}
