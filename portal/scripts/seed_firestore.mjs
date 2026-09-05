import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
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

async function seed() {
  console.log('--- 1. Authenticating admin seed account ---');
  const adminEmail = 'founder@jobroofs.com';
  const adminPass = 'Jobroofs2026!Berlin';

  let userCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
    console.log('Signed in as existing founder account:', userCredential.user.uid);
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
      console.log('Created new founder account:', userCredential.user.uid);
    } else {
      throw err;
    }
  }

  const uid = userCredential.user.uid;

  console.log('\n--- 2. Creating User Document in /users/' + uid + ' ---');
  await setDoc(doc(db, 'users', uid), {
    userId: uid,
    email: adminEmail,
    displayName: 'JOBROOFS Team',
    role: 'verified_founder',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log('User profile created!');

  console.log('\n--- 3. Seeding Jobs Collection ---');
  const jobs = [
    {
      id: 'job-specialty-barista-xberg',
      userId: uid,
      title: 'Barista & Café Service (m/w/d) - Specialty Coffee',
      company: 'Café Boxi Berlin',
      district: 'Kreuzberg',
      postcode: '10997',
      description: 'Wir suchen einen passionierten Barista für unser Team im Wrangelkiez. Flexible Schichten, moderne La Marzocco Maschinen und tolles Stammkundschaft-Publikum.',
      requirements: 'Erfahrung mit Siebträgermaschinen, freundliches Auftreten, Deutsch- oder Englischkenntnisse.',
      payText: '18,50 € / Std.',
      hoursLabel: '15–20 Std. / Woche',
      scheduleSummary: 'Flexible Schichten (Do–So)',
      employmentForms: ['Teilzeit', 'Werkstudent', 'Minijob'],
      contactEmail: 'jobs@cafeboxi.berlin',
      status: 'published',
      tier: 'premium',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      id: 'job-kiez-courier-mitte',
      userId: uid,
      title: 'Fahrradkurier / Kiez-Lieferant (m/w/d) - E-Bike gestellt',
      company: 'GreenRide Logistics Berlin',
      district: 'Mitte',
      postcode: '10115',
      description: 'Nachhaltige Express-Lieferung auf zwei Rädern im Herzen von Berlin. E-Cargobike wird komplett gestellt. Sofortige Auszahlung nach der Schicht möglich.',
      requirements: 'Sicherer Fahrstil im Stadtverkehr, Smartphone für Touren-App.',
      payText: '17,00 € / Std. + Trinkgeld',
      hoursLabel: '10–25 Std. / Woche',
      scheduleSummary: 'Tagesschichten wählbar',
      employmentForms: ['Minijob', 'Kurzfristig', 'Teilzeit'],
      contactEmail: 'ride@greenride.berlin',
      status: 'published',
      tier: 'standard',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      id: 'job-event-crew-fshain',
      userId: uid,
      title: 'Event Crew & Bühnenhilfe (m/w/d) - RAW Areal',
      company: 'RAW Stage Productions',
      district: 'Friedrichshain',
      postcode: '10245',
      description: 'Hands-on Crew für Open-Air Konzerte und Club-Events auf dem RAW Gelände. Auf- und Abbau, Einlassbetreuung und Backstage-Support.',
      requirements: 'Zuverlässigkeit, Teamgeist, Belastbarkeit.',
      payText: '19,00 € / Std.',
      hoursLabel: 'Tagesjobs / Events',
      scheduleSummary: 'Wochenenden & Abende',
      employmentForms: ['Kurzfristig', 'Tagesschicht', 'Aushilfe'],
      contactEmail: 'crew@raw-productions.berlin',
      status: 'published',
      tier: 'standard',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  ];

  for (const job of jobs) {
    await setDoc(doc(db, 'jobs', job.id), job);
    console.log('Seeded Job:', job.id, '->', job.title);
  }

  console.log('\n--- 4. Seeding Housing Listings Collection ---');
  const housing = [
    {
      id: 'housing-fshain-wg-boxi',
      userId: uid,
      title: 'Sonniges WG-Zimmer am Boxhagener Kiez mit Balkon',
      district: 'Friedrichshain',
      neighborhood: 'Boxhagener Kiez',
      postcode: '10245',
      address: 'Gärtnerstraße',
      listingType: 'wg_room',
      kaltmieteEur: 460,
      nebenkostenEur: 120,
      warmmieteEur: 580,
      kautionEur: 1380,
      roomSqm: 22,
      totalRooms: 3,
      furnished: 'fully',
      anmeldungPossible: true,
      moveInDate: '2026-10-01',
      moveOutDate: '2027-03-31',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      ],
      description: 'Helles, ruhiges 22m² Zimmer im beliebten Boxhagener Kiez. Voll möbliert mit großem Bett, Schreibtisch und Balkonzugang. Offizielle Anmeldung (Wohnungsgeberbestätigung) ist genehmigt und selbstverständlich möglich!',
      contactEmail: 'boxi-sublet@jobroofs.com',
      status: 'published',
      tier: 'standard',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      id: 'housing-xberg-studio-wrangel',
      userId: uid,
      title: 'Ruhiges 1-Zimmer Studio im Wrangelkiez (Gartenhaus)',
      district: 'Kreuzberg',
      neighborhood: 'Wrangelkiez',
      postcode: '10997',
      address: 'Wrangelstraße',
      listingType: 'sublet',
      kaltmieteEur: 710,
      nebenkostenEur: 180,
      warmmieteEur: 890,
      kautionEur: 1500,
      roomSqm: 38,
      totalRooms: 1,
      furnished: 'fully',
      anmeldungPossible: true,
      moveInDate: '2026-10-15',
      moveOutDate: '2027-02-28',
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502005229762-ee152da7c5d6?auto=format&fit=crop&w=1200&q=80',
      ],
      description: 'Komplett ausgestattetes 1-Zimmer Apartment im ruhigen Gartenhaus. Ideal für Expats oder Praktikanten. Schnelles WLAN, Waschmaschine, voll ausgestattete Küche.',
      contactEmail: 'wrangel-studio@jobroofs.com',
      status: 'published',
      tier: 'premium',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      id: 'housing-neukoelln-altbau-reuter',
      userId: uid,
      title: 'Helle Altbau-Wohnung im beliebten Reuterkiez',
      district: 'Neukölln',
      neighborhood: 'Reuterkiez',
      postcode: '12047',
      address: 'Pannierstraße',
      listingType: 'apartment',
      kaltmieteEur: 750,
      nebenkostenEur: 200,
      warmmieteEur: 950,
      kautionEur: 1900,
      roomSqm: 52,
      totalRooms: 2,
      furnished: 'partially',
      anmeldungPossible: true,
      moveInDate: '2026-11-01',
      images: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      ],
      description: 'Klassischer Berliner Altbau mit Dielen und hohen Decken am Maybachufer. Ruhiges Schlafzimmer zum Innenhof. Anmeldung garantiert.',
      contactEmail: 'reuterkiez@jobroofs.com',
      status: 'published',
      tier: 'standard',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  ];

  for (const item of housing) {
    await setDoc(doc(db, 'housing_listings', item.id), item);
    console.log('Seeded Housing:', item.id, '->', item.title);
  }

  console.log('\n--- 5. Verifying Reads from Collections ---');
  const testJobDoc = await getDoc(doc(db, 'jobs', 'job-specialty-barista-xberg'));
  console.log('Read back job:', testJobDoc.exists() ? testJobDoc.data()?.title : 'NOT FOUND');

  const testHousingDoc = await getDoc(doc(db, 'housing_listings', 'housing-fshain-wg-boxi'));
  console.log('Read back housing:', testHousingDoc.exists() ? testHousingDoc.data()?.title : 'NOT FOUND');

  console.log('\n===========================================');
  console.log('ALL COLLECTIONS SEEDED & VERIFIED IN FIRESTORE!');
  console.log('===========================================');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
