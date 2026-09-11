# NorthRidge Business Manager v10 — Netlify + Neon

Version 10 is prepared for online deployment, but is NOT deployed or connected to Netlify yet. Do not stop using version 9 until live sign-in, saving and backup tests pass.

## What changed

- Managed Neon email-code sign-in; server-side verification of the approved email on every business-data request.
- Records saved in your separate Northridge Neon PostgreSQL database, not browser storage or the version 9 local server.
- Existing v9 client, project, document, retainer, time, follow-up and invoice tools retained.
- Saves reject stale revisions rather than overwrite another window. Up to 50 previous database states retained for technical recovery.
- Missing configuration blocks access; database credentials never go into the HTML.

## Already completed in Neon

- Project: Northridge Business Manager (`blue-queen-64750709`).
- Production branch, database `neondb`, Ohio region.
- Neon Auth enabled. Neon currently labels this service Beta; the SDK is pinned to the tested version.
- `nr_manager_state` and `nr_manager_history` tables created on September 11, 2026.
- Initial state verified at revision 0 with zero business records.
- No version 8/9 data imported. Executive Search was not changed.

## Next: deploy as a SEPARATE private business application

1. Extract this package. Create a separate PRIVATE GitHub repository for the manager. Upload this folder's contents to the repository root, retaining the app, lib, manager, migrations and other subfolders. Do not upload the ZIP itself. Do not put these files into the public NorthRidge website repository or the Executive Search repository.
2. In Netlify, import that repository as a new project. The included netlify.toml provides the build settings. This is a server-backed Next.js application; uploading only index_10.html or using a static file drop will not work.
3. Set the following private environment variables in Netlify for this project. Scope them to the build and server runtime, not public browser variables. Never put credentials in GitHub, chat or the HTML.

| Setting | Value |
|---|---|
| DATABASE_URL | Connection string copied from the NEW Northridge Neon project's Connect panel, preferably the pooled URL. Never use the Executive Search connection. |
| NEON_AUTH_BASE_URL | https://ep-late-mountain-aenu9ajv.neonauth.c-2.us-east-2.aws.neon.tech/neondb/auth |
| NEON_AUTH_COOKIE_SECRET | A unique random secret, at least 32 characters. Generate and store it with your password manager. |
| ADMIN_EMAIL | deanfernandes@live.com, or your chosen owner email. Only that verified address gets access. |
| APP_ORIGIN | The exact new Netlify HTTPS address, without a trailing slash, for example the address assigned to THIS manager project. |

4. In Neon → Northridge Business Manager → Auth → Configuration, add that exact Netlify address as a trusted domain. Configure/verify the email provider for delivery of sign-in codes. No wildcard domains. Localhost access has not been enabled.
5. Redeploy the manager. Open its URL, enter the approved email and verify the code received in that inbox. Do not share the code in chat.
6. Before importing real records, create one clearly labelled test contact, reload and confirm it remains. Test backup export and sign-out. Confirm a signed-out browser cannot open /api/records or /manager. Remove the test contact.
7. Export a full backup from the version 8/9 installation you actually use. In version 10 use Import Backup, review the replacement warning, then verify client/invoice counts and a few records. Keep both old backups. Continue work in ONE version after migration, not both.

## Important boundaries

The cloud link will only work AFTER deployment and the private environment settings. `manager/index_10.html` is a server-served template, NOT a file to double-click. No local launcher is needed after deployment.

Neon Auth allows public account creation at its own service currently. The application independently restricts business-data access to ADMIN_EMAIL with a verified email. Account creation is not permission to access Northridge data. Passwords and verification codes are handled by Neon. Full live authentication QA is still required.

Version 10 is single-owner, online-only. Updates are not real-time across tabs; reload to see another tab's changes. The inherited manager uses blocking requests while saving; do not close the window while saving. A network failure can leave a save outcome uncertain: export your current in-memory backup, reload, and compare before retrying.

Imports replace ALL cloud records after confirmation. Record payload limit is 3 MB, maximum 10,000 records. Files remain at their linked document-storage URLs. JSON backups do not include the documents themselves, authentication users, Netlify credentials or browser preferences.

QuickBooks, Outlook, Calendly and document-upload integrations are NOT connected by this change. Existing links/import tools remain as before. Do not assume that invoice status, meeting bookings or file permissions synchronize automatically.

The schema is already initialized. For a future clean database on the same configured endpoint, a developer can run `npm run db:migrate` with DATABASE_URL securely configured, or execute migrations/001-manager.sql in the Northridge SQL editor. No unauthenticated setup endpoint is exposed. The database host guard deliberately rejects the Executive Search endpoint.

## QA and remaining checks

- Production build passed; both embedded manager scripts parsed.
- Policy tests passed for approved/verified users, absent/wrong users, exact-origin writes and malformed/duplicate records.
- Sign-in screen visually checked locally; unconfigured sign-in fails rather than allowing access.
- Neon schema creation succeeded; no business records migrated.
- Version 10 invoice logic regression tests passed (rendering, save/edit, duplicate detection, totals, terms and contact autofill), with storage mocked. Repeat invoice save/edit through Neon after deployment.
- Actual Neon save SQL tested inside a rolled-back transaction: revision advanced to 1 and one history entry appeared; rollback restored revision 0 and zero business records.
- Local HTTP checks: sign-in 200, unconfigured manager/data API deny access with 503, private template and environment paths 404, foreign-origin write 403.
- Not yet verified: live email delivery/session cookies, authorized cloud API round-trip, Netlify deployment/file tracing, real backup import or multi-window writes through the deployed app.

Implementation references: [Neon Next.js authentication](https://github.com/neondatabase/neon-js/blob/main/packages/auth/NEXT-JS.md), [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver), [Netlify Next.js hosting](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).
