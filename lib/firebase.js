import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase config at runtime
if (typeof window !== 'undefined') {
  const missingVars = [];
  const requiredVars = {
    'NEXT_PUBLIC_FIREBASE_API_KEY': firebaseConfig.apiKey,
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': firebaseConfig.authDomain,
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': firebaseConfig.projectId,
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': firebaseConfig.storageBucket,
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': firebaseConfig.messagingSenderId,
    'NEXT_PUBLIC_FIREBASE_APP_ID': firebaseConfig.appId,
  };

  Object.entries(requiredVars).forEach(([name, value]) => {
    if (!value) missingVars.push(name);
  });

  if (missingVars.length > 0) {
    console.error(
      '❌ Firebase Configuration Error:\n\n' +
      'Missing environment variables on this deployment:\n' +
      missingVars.map(v => `  • ${v}`).join('\n') +
      '\n\n' +
      'To fix:\n' +
      '1. Go to Vercel Project Settings → Environment Variables\n' +
      '2. Add all NEXT_PUBLIC_FIREBASE_* variables\n' +
      '3. Use the same values from your local .env.local file\n' +
      '4. Redeploy the project\n\n' +
      'Your local values:\n' +
      '  • NEXT_PUBLIC_FIREBASE_API_KEY: ✓\n' +
      '  • NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ✓\n' +
      '  • NEXT_PUBLIC_FIREBASE_PROJECT_ID: ✓\n' +
      '  • NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ✓\n' +
      '  • NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ✓\n' +
      '  • NEXT_PUBLIC_FIREBASE_APP_ID: ✓\n\n' +
      'Without these, Firebase cannot initialize and properties will not load.'
    );
  }
}

// Initialize Firebase only if it hasn't been initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Log initialization (client-side only)
if (typeof window !== 'undefined') {
  console.log('Firebase initialized:');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Storage Bucket:', firebaseConfig.storageBucket);
  console.log('Auth configured:', !!auth);
}

export default app;
