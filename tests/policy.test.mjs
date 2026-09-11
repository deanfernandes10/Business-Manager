import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allowedUser,sameOrigin,validateRecords} from '../lib/policy.mjs';
test('only the approved verified owner is authorized',()=>{
  const user={email:'owner@example.com',emailVerified:true};
  assert.equal(allowedUser(user,'owner@example.com'),true);
  assert.equal(allowedUser(user,'someone@example.com'),false);
  assert.equal(allowedUser({...user,emailVerified:false},'owner@example.com'),false);
  assert.equal(allowedUser(null,'owner@example.com'),false);
  assert.equal(allowedUser(user,''),false);
});
test('mutations require an exact origin, not a subdomain or missing origin',()=>{
  assert.equal(sameOrigin(new Request('https://app.test',{headers:{origin:'https://app.test'}}),'https://app.test'),true);
  assert.equal(sameOrigin(new Request('https://app.test',{headers:{origin:'https://app.test.evil.test'}}),'https://app.test'),false);
  assert.equal(sameOrigin(new Request('https://app.test'),'https://app.test'),false);
});
test('v8/v9-shaped records round-trip and reject duplicate or unsafe IDs',()=>{
  const rows={revision:0,records:[{id:'NR-123',type:'Project',title:'A project',hours:1.5}]};
  assert.deepEqual(validateRecords(rows),rows);
  assert.throws(()=>validateRecords({...rows,revision:-1}));
  assert.throws(()=>validateRecords({...rows,records:[...rows.records,...rows.records]}));
  assert.throws(()=>validateRecords({...rows,records:[{id:"bad'quote",type:'Contact'}]}));
  assert.throws(()=>validateRecords({...rows,records:[{id:'NR-a',type:'Project',notes:{nested:true}}]}));
});
