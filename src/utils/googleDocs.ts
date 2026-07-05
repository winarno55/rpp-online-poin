import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App specifically for Google Workspace integration
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/documents');
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory token storage
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token akses dari Google.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Saves HTML content as a stylized Google Document in Google Drive
 */
export const saveToGoogleDocs = async (
  htmlContent: string,
  title: string,
  accessToken: string
): Promise<{ id: string; url: string }> => {
  // To avoid Google Drive API 500 Internal Error during HTML conversion,
  // we apply inline styles instead of a <style> block, as the Google Docs
  // importer can crash on specific CSS blocks like border-collapse.
  let styledHtmlContent = htmlContent
    .replace(/<h1/g, '<h1 style="font-size: 20pt; font-weight: bold; color: #0369a1; text-align: center;"')
    .replace(/<h2/g, '<h2 style="font-size: 14pt; font-weight: bold; color: #0f766e; border-bottom: 1px solid #cbd5e1;"')
    .replace(/<h3/g, '<h3 style="font-size: 12pt; font-weight: bold; color: #334155;"')
    .replace(/<table/g, '<table style="width: 100%; border-collapse: collapse; margin-bottom: 10pt;"')
    .replace(/<th/g, '<th style="background-color: #f1f5f9; font-weight: bold; padding: 8px; border: 1px solid #cbd5e1; text-align: left;"')
    .replace(/<td/g, '<td style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;"')
    .replace(/<ul/g, '<ul style="padding-left: 20pt; margin-bottom: 10pt;"')
    .replace(/<ol/g, '<ol style="padding-left: 20pt; margin-bottom: 10pt;"')
    .replace(/<li/g, '<li style="margin-bottom: 4pt;"')
    .replace(/<p/g, '<p style="margin-bottom: 10pt;"');

  const styledHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b;">
  ${styledHtmlContent}
</body>
</html>`;

  const metadata = {
    name: title,
    mimeType: 'application/vnd.google-apps.document'
  };

  const boundary = 'rpp_generator_google_docs_boundary';

  // Constructing multipart/related body using Blob.
  // This ensures the browser automatically sets the correct Content-Length
  // and properly handles UTF-8 multibyte characters.
  const body = new Blob([
    `--${boundary}\r\n`,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    JSON.stringify(metadata),
    `\r\n--${boundary}\r\n`,
    'Content-Type: text/html; charset=UTF-8\r\n\r\n',
    styledHtml,
    `\r\n--${boundary}--\r\n`
  ], { type: `multipart/related; boundary=${boundary}` });

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
      // Note: We DO NOT set 'Content-Type' here. fetch will automatically
      // set it to the Blob's type ('multipart/related; boundary=...') 
      // along with the correct Content-Length.
    },
    body: body
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal menyimpan ke Google Drive: ${response.statusText} (${errorText})`);
  }

  const result = await response.json();

  if (!result.id) {
    throw new Error('Gagal mendapatkan ID file dari Google Drive');
  }

  return {
    id: result.id,
    url: `https://docs.google.com/document/d/${result.id}/edit`
  };
};
