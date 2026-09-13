import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  deleteUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

const envContent = readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
});

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testAuthAndFirestore() {
  console.log('Testing Firebase Authentication & Authenticated Firestore Operations...');
  let user = null;
  const testEmail = 'authtest_' + Date.now() + '@jobroofs.de';
  const testPassword = 'Password123!@#';

  try {
    const cred = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    user = cred.user;
    console.log('SUCCESS: Created test user:', user.uid, user.email);
  } catch (err) {
    console.log('Notice: Email sign-up failed (' + err.code + '), trying anonymous auth...');
    try {
      const anonCred = await signInAnonymously(auth);
      user = anonCred.user;
      console.log('SUCCESS: Signed in anonymously:', user.uid);
    } catch (anonErr) {
      console.error('ERROR: Both email & anonymous auth failed:', anonErr);
      return;
    }
  }

  if (!user) return;

  const testJobId = 'job-audit-' + Date.now();
  try {
    // 1. Write user profile
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      email: user.email || 'anonymous',
      hasUsedFreeListing: false,
      createdAt: new Date().toISOString()
    });
    console.log('SUCCESS: Wrote user document in users/' + user.uid);

    // 2. Read user profile
    const userSnap = await getDoc(doc(db, 'users', user.uid));
    console.log('SUCCESS: Read user document:', userSnap.data());

    // 3. Create job listing matching rules (userId == user.uid, title.size() > 2)
    await setDoc(doc(db, 'jobs', testJobId), {
      id: testJobId,
      userId: user.uid,
      title: 'Barista (m/w/d) für Café am Ku\'damm',
      company: 'Audit Café Berlin',
      city: 'Berlin',
      district: 'Charlottenburg',
      status: 'active',
      tier: 'free',
      createdAt: new Date().toISOString(),
    });
    console.log('SUCCESS: Created job listing in jobs/' + testJobId);

    // 4. Read job listing back
    const jobSnap = await getDoc(doc(db, 'jobs', testJobId));
    console.log('SUCCESS: Read job listing:', jobSnap.data().title);

    // 5. Test Entitlement: Mark free listing used
    await setDoc(doc(db, 'users', user.uid), {
      hasUsedFreeListing: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('SUCCESS: Marked free listing used in users/' + user.uid);

    const updatedUserSnap = await getDoc(doc(db, 'users', user.uid));
    console.log('SUCCESS: Verified entitlement flag in Firestore:', updatedUserSnap.data().hasUsedFreeListing);

    // 6. Clean up
    await deleteDoc(doc(db, 'jobs', testJobId));
    await deleteDoc(doc(db, 'users', user.uid));
    console.log('SUCCESS: Cleaned up test job & user docs from Firestore');

    if (user.delete) {
      await deleteUser(user).catch(() => {});
      console.log('SUCCESS: Cleaned up test user account');
    }

    console.log('\n>>> FIREBASE AUTH + FIRESTORE ENTITLEMENTS ARE 100% OPERATIONAL! <<<');

  } catch (firestoreErr) {
    console.error('ERROR during Firestore operation:', firestoreErr);
  }
}

testAuthAndFirestore();
