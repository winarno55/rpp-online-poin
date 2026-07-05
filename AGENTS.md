# Modul Ajar Cerdas - Production Safety Guidelines

This application is deployed in production with over 10,0,00+ active users, using MongoDB, Vercel, and Firebase.

## Safety Rules for Future Agents

1. **Do NOT Modify the Database Schema or Seed Scripts**: The database contains critical user data. Any changes to schemas must be fully backward-compatible.
2. **Do NOT touch or replace the Brevo email authentication**: User signup/login is powered by Brevo. Do not replace it or attempt to switch to generic Google Sign-In for app authentication unless explicitly requested.
3. **Google Workspace OAuth Isolation**: The Google Docs and Google Drive integrations are integrated purely client-side via an isolated Firebase Auth instance (`src/utils/googleDocs.ts`). This is completely independent of the application's user auth, ensuring that any user can safely connect their Google Docs regardless of how they signed in.
4. **Layout Quality Guidelines**: Any generated lesson plans must maintain semantic, elegant layouts. When exporting to external tools like Google Docs, always inject professional style templates to avoid raw text conversion degradation.
