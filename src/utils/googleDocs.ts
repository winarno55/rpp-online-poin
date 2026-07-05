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
  // Professional, elegant layout styling
  const styledHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1e293b;
  }
  h1 {
    font-size: 20pt;
    font-weight: bold;
    color: #0369a1;
    text-align: center;
  }
  h2 {
    font-size: 14pt;
    font-weight: bold;
    color: #0f766e;
    border-bottom: 1px solid #cbd5e1;
  }
  h3 {
    font-size: 12pt;
    font-weight: bold;
    color: #334155;
  }
  p {
    margin-bottom: 10pt;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f1f5f9;
    font-weight: bold;
  }
  ul, ol {
    padding-left: 20pt;
  }
  li {
    margin-bottom: 4pt;
  }
</style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  const metadata = {
    name: title,
    mimeType: 'application/vnd.google-apps.document'
  };

  const boundary = 'rpp_generator_google_docs_boundary';

  // Constructing multipart/related body as a standard raw string to prevent the browser's fetch API
  // from stripping the crucial "boundary" parameter from the Content-Type header.
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    styledHtml,
    `--${boundary}--`
  ].join('\r\n');

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
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
