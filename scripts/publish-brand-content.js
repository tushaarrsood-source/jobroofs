const fs = require('fs');
const path = require('path');
const os = require('os');

function getComposioClient() {
  const scratchSdk = path.join(
    'C:\\Users\\tusha\\.gemini\\antigravity\\brain\\3f78e4f2-4365-423d-9733-8e113c3f1062\\scratch\\node_modules\\@composio\\core'
  );
  let ComposioClass;
  try {
    ComposioClass = require('@composio/core').Composio;
  } catch (e) {
    ComposioClass = require(scratchSdk).Composio;
  }

  let apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) {
    const userDataPath = path.join(os.homedir(), '.composio', 'user_data.json');
    if (fs.existsSync(userDataPath)) {
      const data = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
      apiKey = data.api_key;
    }
  }

  if (!apiKey) {
    apiKey = 'ak_wwv5ypPbzYy5XaHt2An3';
  }

  return new ComposioClass({ apiKey });
}

const IG_USER_ID = '28262255153431238'; // Verified @jobroofs Instagram Business ID

const BRAND_POSTS = {
  1: {
    id: 1,
    title: 'Competitor Comparison (StepStone vs Jobroofs)',
    imagePath: path.join(__dirname, '../reports/brand-content/1-comparison-stepstone-vs-jobroofs.png'),
    caption: `499 € für eine einzige Stellenanzeige? Schluss mit der Abzocke etablierter Portale. 🛑

Warum lokale Betriebe, Cafés, Handwerker und Praxen auf herkömmlichen Plattformen verlieren:
✕ StepStone & Indeed verlangen Hunderte Euro oder zwingen in Abo-Modelle.
✕ Kleine Betriebe gehen im Meer von Zeitarbeitsfirmen und Großkonzernen unter.
✕ Komplizierte Bewerbungsformulare schrecken 73% aller jungen Kandidaten ab.

Der neue Standard für Betriebe heißt JOBROOFS:
✓ Dein 1. Stelleninserat ist zu 100% kostenlos – ohne versteckte Kosten.
✓ 1-Klick Direktkontakt via WhatsApp & Telefon – Bewerber landen direkt bei dir.
✓ 0% Zeitarbeit – nur echte, lokale Arbeitgeber.
✓ Kein Abonnement, keine automatische Verlängerung.

Schluss mit leeren Versprechen und teuren Anzeigen. Schalte deine Stelle jetzt in 2 Minuten kostenlos online:
👉 Link in Bio oder direkt auf jobroofs.com/post-a-job

#recruiting #arbeitgeber #stellenanzeigen #stellenangebot #mitarbeitersuche #handwerk #gastronomie #mittelstand #unternehmen #personalsuche #jobportal #jobroofs #unternehmertum #stepstone #indeed #recruitingtipps #hrdeutschland`,
  },
  2: {
    id: 2,
    title: 'Recruiting Dilemma Quote',
    imagePath: path.join(__dirname, '../reports/brand-content/2-recruiting-dilemma-quote.png'),
    caption: `„Niemand unter 30 lädt mehr ein 4-seitiges Anschreiben als PDF hoch.“ 📄❌

Die Realität im deutschen Arbeitsmarkt 2026:
73% aller Bewerber brechen den Prozess sofort ab, wenn sie sich erst registrieren oder endlose Formulare ausfüllen müssen.

Wenn du heute einen zuverlässigen Barista, eine MFA, einen Koch, Fahrer oder Monteur suchst, brauchst du keinen 20-minütigen ATS-Bewerbungsprozess. Du brauchst:
1️⃣ Einen transparenten Stundenlohn ab Minute 1.
2️⃣ Den direkten 1-Klick-Draht per WhatsApp oder Kurznachricht.
3️⃣ Den Fokus auf Zuverlässigkeit & Persönlichkeit statt Schulnoten.

Genau dafür haben wir JOBROOFS gebaut:
Das Portal für unabhängige Betriebe, das Bewerben so einfach macht wie eine WhatsApp-Nachricht.

👉 Schalte dein 1. Inserat jetzt zu 100% kostenlos auf jobroofs.com/post-a-job (Link in Bio).

#recruitinghacks #mitarbeitergewinnung #personalsuche #bewerbungsprozess #unternehmer #handwerk #gastroberlin #mittelstanddeutschland #hrinsights #jobroofs #arbeitgebermarke #fachkräftemangel #stellenanzeige`,
  },
  3: {
    id: 3,
    title: 'Welcome Employers & Free Posting Invitation',
    imagePath: path.join(__dirname, '../reports/brand-content/3-welcome-employers-free-posting.png'),
    caption: `An alle Betriebe, Cafés, Handwerksbetriebe und Studios in Deutschland: 📢

Stellenanzeigen schalten muss nicht kompliziert sein und darf kein Vermögen kosten.

Wir laden dich herzlich ein:
Schalte dein 1. Inserat auf JOBROOFS zu 100% kostenlos!

Was dich auf JOBROOFS erwartet:
0 € Erstinserat — Keine Kreditkarte nötig. Keine Abo-Falle. Volle Kostenkontrolle.
💬 1-Klick WhatsApp Direktkontakt — Bewerber schreiben dir direkt auf dein Smartphone. Erlebe bis zu 5x schnellere Rückmeldungen.
🏙️ Reichweite in 14 deutschen Metropolen — von Berlin, Hamburg, München, Köln bis Frankfurt mit Kiez- und Stadtteilfilter.

In nur 2 Minuten ist deine Stelle online.
👉 Starte jetzt kostenlos über den Link in unserer Bio oder unter jobroofs.com/post-a-job

#stellenanzeige #mitarbeitersuche #arbeitgeber #jobportal #unternehmer #selbststaendig #gastronomie #einzelhandel #handwerk #startupdeutschland #berlinjobs #hamburgjobs #muenchenjobs #koelnjobs #jobroofs`,
  },
};

async function publishBrandPost(postId = 1, options = {}) {
  const post = BRAND_POSTS[postId];
  if (!post) {
    throw new Error(`Post ${postId} not found. Available: 1, 2, 3`);
  }

  const composio = getComposioClient();
  console.log(`\n========================================`);
  console.log(`🚀 Publishing Brand Post ${post.id}: "${post.title}"`);
  console.log(`📸 Image: ${post.imagePath}`);
  console.log(`========================================\n`);

  if (!fs.existsSync(post.imagePath)) {
    throw new Error(`Image file does not exist: ${post.imagePath}`);
  }

  // 1. Upload to Composio S3
  console.log('☁️ Uploading image to Composio S3...');
  const uploadResult = await composio.files.upload({
    file: post.imagePath,
    toolSlug: 'INSTAGRAM_POST_IG_USER_MEDIA',
    toolkitSlug: 'instagram',
  });
  console.log('✅ Upload successful! S3 Key:', uploadResult.s3key);

  if (options.dryRun) {
    console.log('\n🔍 [DRY RUN ACTIVE] - Post prepared, S3 upload verified, skipping live publish.');
    console.log('\n📝 Caption preview:\n' + post.caption.slice(0, 250) + '...\n');
    return {
      success: true,
      dryRun: true,
      postId: post.id,
      title: post.title,
      uploadResult,
    };
  }

  // 2. Create Media Container on Instagram
  console.log('📸 Creating Instagram Media Container via Composio...');
  const containerRes = await composio.tools.execute('INSTAGRAM_POST_IG_USER_MEDIA', {
    userId: 'jobroofs_admin',
    arguments: {
      ig_user_id: IG_USER_ID,
      image_file: uploadResult,
      caption: post.caption,
    },
    dangerouslySkipVersionCheck: true,
  });

  console.log('Container Response:', JSON.stringify(containerRes, null, 2));

  if (!containerRes.successful || !containerRes.data?.id) {
    throw new Error(`Failed to create Instagram media container: ${JSON.stringify(containerRes.data || containerRes.error)}`);
  }

  const creationId = containerRes.data.id;
  console.log(`✅ Media Container created: ${creationId}`);

  // Wait 4s for Meta processing
  console.log('⏳ Waiting for Meta container processing (4s)...');
  await new Promise((r) => setTimeout(r, 4000));

  // 3. Publish to Feed
  console.log('📢 Publishing container to @jobroofs Instagram Feed...');
  const publishRes = await composio.tools.execute('INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH', {
    userId: 'jobroofs_admin',
    arguments: {
      ig_user_id: IG_USER_ID,
      creation_id: creationId,
    },
    dangerouslySkipVersionCheck: true,
  });

  console.log('Publish Response:', JSON.stringify(publishRes, null, 2));

  if (!publishRes.successful) {
    throw new Error(`Failed to publish media: ${JSON.stringify(publishRes.data || publishRes.error)}`);
  }

  const publishedMediaId = publishRes.data?.id || creationId;
  console.log(`\n🎉 POST PUBLISHED SUCCESSFULLY ON INSTAGRAM!`);
  console.log(`Media ID: ${publishedMediaId}`);
  console.log(`Target: @jobroofs (User ID: ${IG_USER_ID})`);

  return {
    success: true,
    publishedMediaId,
    creationId,
    account: '@jobroofs',
    postId: post.id,
    title: post.title,
  };
}

module.exports = {
  publishBrandPost,
  BRAND_POSTS,
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const postArg = args.find((a) => !a.startsWith('--'));
  const postId = postArg ? parseInt(postArg, 10) : 1;

  publishBrandPost(postId, { dryRun: isDryRun })
    .then((res) => {
      console.log('\n🏁 Done:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Error:', err);
      process.exit(1);
    });
}
