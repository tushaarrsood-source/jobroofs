import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBN68Y6_n-xxFIB74OuvEtp0lFhPhY9gGI',
  authDomain: 'jobroofs-321c7.firebaseapp.com',
  projectId: 'jobroofs-321c7',
  storageBucket: 'jobroofs-321c7.firebasestorage.app',
  messagingSenderId: '960773392367',
  appId: '1:960773392367:web:c7cb340bf0b0964cbc981a',
  measurementId: 'G-HQ5MDN7Z6P',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setup() {
  console.log('=== SETTING UP MASTER ACCOUNTS FOR JOBROOFS ===');

  // Account 2: japrahimanshu7@gmail.com
  const email = 'japrahimanshu7@gmail.com';
  const pass = 'Himanshu@0010';

  let userCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth, email, pass);
    console.log('✓ Signed in to existing account:', email, 'UID:', userCredential.user.uid);
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        console.log('✓ Created brand new master account:', email, 'UID:', userCredential.user.uid);
      } catch (createErr) {
        console.error('Failed creating account:', createErr);
        throw createErr;
      }
    } else {
      console.error('Error signing in:', err);
      throw err;
    }
  }

  const user = userCredential.user;
  await updateProfile(user, { displayName: 'Himanshu (Master)' });

  // Update Firestore user document with Master & Unlimited Pro permissions
  console.log('Writing Master Document in Firestore for UID:', user.uid);
  await setDoc(
    doc(db, 'users', user.uid),
    {
      userId: user.uid,
      email: email,
      displayName: 'Himanshu (Master)',
      role: 'master',
      isMaster: true,
      plan: 'annual_unlimited',
      unlimitedPro: true,
      bypassStripe: true,
      subscriptionExpiresAt: '2099-12-31T23:59:59.999Z',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  console.log('✓ Master Firestore document configured for japrahimanshu7@gmail.com');
  console.log('Setup finished successfully!');
}

setup().catch((e) => {
  console.error('Setup failed:', e);
  process.exit(1);
});
