import {readFile} from 'node:fs/promises';
import {database} from '../lib/db.mjs';
const sql=database();
const commands=(await readFile(new URL('../migrations/001-manager.sql',import.meta.url),'utf8')).split(';').map(s=>s.trim()).filter(Boolean);
await sql.transaction(commands.map(command=>sql.query(command,[])));
console.log('Northridge manager schema ready. Existing records preserved.');
