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

const POSTER_CONFIGS = {
  helper: {
    role: 'Helper',
    germanTitle: 'Aushilfe / Allrounder gesucht?',
    imageFile: 'poster-helper-gallery.png',
    caption: `Need a Helper? Post at JOBROOFS. 🤝📦

Du suchst eine zuverlässige Aushilfe für dein Lager, deinen Laden, dein Studio oder dein Event?
Spare dir hunderte Euro für teure Agenturen und endlose Bewerbungsformulare.

Auf JOBROOFS inserieren Betriebe direkt:
✓ 1. Inserat 100% kostenlos
✓ Direkter 1-Klick Kontakt per WhatsApp & Telefon
✓ 0% Zeitarbeit – nur echte, lokale Betriebe
✓ In 2 Minuten online geschaltet

👉 Schalte jetzt dein Inserat auf jobroofs.com/post-a-job (Link in Bio)!

#aushilfe #aushilfsjob #stellenanzeige #mitarbeitersuche #jobportal #jobroofs #unternehmer #selbststaendig #lagerjob #allrounder #arbeitgeber #minijob #berlinjobs #deutschlandjobs`,
  },
  barista: {
    role: 'Barista',
    germanTitle: 'Barista / Café-Personal gesucht?',
    imageFile: 'poster-barista-gallery.png',
    caption: `Need a Barista? Post at JOBROOFS. ☕✨

Dein Café oder deine Bar braucht Verstärkung an der Siebträger-Maschine?
Vergiss teure Jobportale, die dich in monatliche Abos zwingen.

Finde motivierte Baristas & Servicekräfte direkt aus deinem Kiez:
✓ 1. Stellenanzeige 100% kostenlos
✓ Bewerber melden sich direkt per WhatsApp auf deinem Smartphone
✓ Kein Anschreiben-Papierkrieg – Fokus auf Leidenschaft & Zuverlässigkeit
✓ Keine Zeitarbeit, keine Vermittler

👉 Inseriere dein Café jetzt kostenlos auf jobroofs.com/post-a-job (Link in Bio)!

#barista #baristajob #cafeberlin #gastronomie #gastrojobs #kaffeeliebe #mitarbeitersuche #stellenangebot #servicekraft #jobroofs #jobportal #unternehmer #gastronomen`,
  },
  driver: {
    role: 'Driver',
    germanTitle: 'Fahrer / Kurier gesucht?',
    imageFile: 'poster-driver-gallery.png',
    caption: `Need a Driver? Post at JOBROOFS. 🚗📦

Du suchst Fahrer für Auslieferung, Kurierfahrten, Shuttle oder Logistik?
Erreiche zuverlässige Fahrer in deiner Stadt ohne teure Personalagenturen.

Warum Betriebe auf JOBROOFS setzen:
✓ Erstes Inserat komplett gratis
✓ Direkter Draht via WhatsApp & Telefon
✓ Stadtteil- und Kiez-genaue Reichweite
✓ In 2 Minuten live

👉 Schalte deine Anzeige jetzt auf jobroofs.com/post-a-job (Link in Bio)!

#fahrer #kurier #auslieferungsfahrer #logistik #transport #stellenanzeige #mitarbeitersuche #jobroofs #fuhrpark #kurierdienst #lieferdienst #minijob`,
  },
  cook: {
    role: 'Cook',
    germanTitle: 'Koch / Küchenhilfe gesucht?',
    imageFile: 'poster-cook-gallery.png',
    caption: `Need a Cook? Post at JOBROOFS. 🍳👨‍🍳

Die Küche brennt und du brauchst dringend Unterstützung für den Pass, die Vorbereitung oder Küchenhilfe?
Schalte deine Anzeige direkt dort, wo Gastro-Talente suchen.

✓ 1. Stellenanzeige 100% kostenlos
✓ Direkter 1-Klick Kontakt ohne ATS-Hürden
✓ 0% Zeitarbeit – echte Betriebe
✓ Schnelle Besetzung für deine offenen Schichten

👉 Jetzt kostenlos inserieren auf jobroofs.com/post-a-job (Link in Bio)!

#koch #küchenhilfe #gastroberlin #gastronomie #restaurantjobs #stellenangebot #küche #foodjobs #jobroofs #arbeitgeber #gastronomen`,
  },
  cashier: {
    role: 'Cashier',
    germanTitle: 'Kassierer / Store Staff gesucht?',
    imageFile: 'poster-cashier-gallery.png',
    caption: `Need a Cashier? Post at JOBROOFS. 🛍️🏷️

Freundliches Verkaufspersonal und zuverlässige Kassierer für deinen Store oder deine Boutique gesucht?
Veröffentliche deine offene Stelle in 2 Minuten auf JOBROOFS.

✓ 1. Inserat 100% kostenlos
✓ 1-Klick WhatsApp Kontakt
✓ Keine Abofalle, volle Transparenz
✓ Kiez-Reichweite in ganz Deutschland

👉 Jetzt kostenlos online gehen: jobroofs.com/post-a-job (Link in Bio)!

#kassierer #einzelhandel #storestaff #verkauf #retailjobs #stellenanzeige #jobroofs #mitarbeitersuche #boutique #ladeninhaber #mittelstand`,
  },
};

async function publishPoster(roleKey = 'helper', options = {}) {
  const config = POSTER_CONFIGS[roleKey.toLowerCase()];
  if (!config) {
    throw new Error(`Unknown role "${roleKey}". Available: ${Object.keys(POSTER_CONFIGS).join(', ')}`);
  }

  const imagePath = path.join(__dirname, '../reports/posters', config.imageFile);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Poster image not found: ${imagePath}`);
  }

  const composio = getComposioClient();
  console.log(`\n========================================`);
  console.log(`🚀 Publishing Poster: "Need a ${config.role}? Post at JOBROOFS"`);
  console.log(`📸 Image: ${config.imageFile} (${fs.statSync(imagePath).size} bytes)`);
  console.log(`========================================\n`);

  // 1. Upload to Composio S3
  console.log('☁️ Uploading poster to Composio S3...');
  const uploadResult = await composio.files.upload({
    file: imagePath,
    toolSlug: 'INSTAGRAM_POST_IG_USER_MEDIA',
    toolkitSlug: 'instagram',
  });
  console.log('✅ Upload successful! S3 Key:', uploadResult.s3key);

  if (options.dryRun) {
    console.log('\n🔍 [DRY RUN ACTIVE] - Poster upload verified. Skipping live Instagram publish.');
    console.log('\n📝 Caption preview:\n' + config.caption.slice(0, 200) + '...\n');
    return {
      success: true,
      dryRun: true,
      role: config.role,
      imageFile: config.imageFile,
      uploadResult,
    };
  }

  // 2. Create Instagram Container
  console.log('📸 Creating Instagram Media Container via Composio...');
  const containerRes = await composio.tools.execute('INSTAGRAM_POST_IG_USER_MEDIA', {
    userId: 'jobroofs_admin',
    arguments: {
      ig_user_id: IG_USER_ID,
      image_file: uploadResult,
      caption: config.caption,
    },
    dangerouslySkipVersionCheck: true,
  });

  console.log('Container Response:', JSON.stringify(containerRes, null, 2));

  if (!containerRes.successful || !containerRes.data?.id) {
    throw new Error(`Failed to create container: ${JSON.stringify(containerRes.data || containerRes.error)}`);
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
  console.log(`\n🎉 POSTER PUBLISHED SUCCESSFULLY ON INSTAGRAM!`);
  console.log(`Media ID: ${publishedMediaId}`);
  console.log(`Target: @jobroofs (User ID: ${IG_USER_ID})`);

  return {
    success: true,
    publishedMediaId,
    creationId,
    account: '@jobroofs',
    role: config.role,
  };
}

module.exports = {
  publishPoster,
  POSTER_CONFIGS,
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const roleArg = args.find((a) => !a.startsWith('--')) || 'helper';

  publishPoster(roleArg, { dryRun: isDryRun })
    .then((res) => {
      console.log('\n🏁 Done:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Error:', err);
      process.exit(1);
    });
}
