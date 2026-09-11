export function allowedUser(user, email) {
  return Boolean(email && user?.emailVerified === true && user?.email?.toLowerCase() === email.toLowerCase());
}
export function sameOrigin(request, origin) {
  return Boolean(origin && request.headers.get('origin') === origin);
}
export function validateRecords(data) {
  if (!Number.isSafeInteger(data?.revision) || data.revision < 0 || !Array.isArray(data.records) || data.records.length > 10000) throw Error('Invalid backup format or revision.');
  const seen = new Set();
  for (const r of data.records) {
    if (!r || typeof r !== 'object' || Array.isArray(r) || typeof r.id !== 'string' || !r.id || r.id.length > 200 || typeof r.type !== 'string' || !r.type || seen.has(r.id)) throw Error('Invalid record or duplicate ID.');
    seen.add(r.id);
    // Legacy v8 includes IDs in inline handlers: allow only safe identifier characters.
    if (!/^[a-zA-Z0-9_-]+$/.test(r.id)) throw Error('A record ID contains unsupported characters. Review the backup before importing.');
    for (const [key,value] of Object.entries(r)) {
      if (['__proto__','constructor','prototype'].includes(key)) throw Error('Invalid field.');
      if (!['string','number','boolean'].includes(typeof value) && value !== null) throw Error('Record fields must be simple values.');
    }
  }
  return data;
}
