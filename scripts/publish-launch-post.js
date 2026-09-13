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

const LAUNCH_CAPTION = `Wir machen Schluss mit 499-Euro-Stellenanzeigen und 20-minütigen Bewerbungsformularen. 🛑

Warum etablierte Jobportale für lokale Betriebe kaputt sind:
✕ Sie verlangen hunderte Euro für eine einzelne Anzeige.
✕ Sie fesseln Unternehmen in teure monatliche Abos.
✕ Sie zwingen Bewerber durch komplizierte PDF-Uploads, die 73% aller Talente abbrechen lassen.

Das ist JOBROOFS:
Das Portal für unabhängige Betriebe, Minijobs & temporäre Jobs in ganz Deutschland. 🏛️

Unsere 3 Grundregeln:
1️⃣ Dein 1. Stelleninserat ist zu 100% kostenlos – dauerhaft, ohne versteckte Kosten.
2️⃣ 1-Klick Direktkontakt via WhatsApp & Telefon – Bewerber melden sich direkt auf deinem Smartphone.
3️⃣ 0% Zeitarbeit – nur echte Cafés, Handwerker, Boutiquen, Studios und Betriebe.

Egal ob du ein Café in Berlin-Mitte führst, einen Handwerksbetrieb in Hamburg hast oder eine Boutique in München:
Schalte deine Stelle jetzt in 2 Minuten live.

👉 Link in der Bio oder direkt auf jobroofs.com/post-a-job

#jobroofs #stellenanzeige #unternehmertum #arbeitgeber #mittelstand #mitarbeitersuche #handwerk #gastronomie #minijob #gastrojobs #recruitinghacks #startupdeutschland #berlinjobs #hamburgjobs #muenchenjobs #koelnjobs`;

async function publishLaunchPost(options = {}) {
  const imagePath = path.join(__dirname, '../reports/double-color-campaign/post-1-logo-launch-green.png');
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Launch image not found at: ${imagePath}`);
  }

  const composio = getComposioClient();
  console.log(`\n======================================================`);
  console.log(`🚀 PUBLISHING OFFICIAL LAUNCH POST TO @jobroofs`);
  console.log(`📸 Image: post-1-logo-launch-green.png (${fs.statSync(imagePath).size} bytes)`);
  console.log(`======================================================\n`);

  // 1. Upload to Composio S3
  console.log('☁️ Uploading image to Composio S3...');
  const uploadResult = await composio.files.upload({
    file: imagePath,
    toolSlug: 'INSTAGRAM_POST_IG_USER_MEDIA',
    toolkitSlug: 'instagram',
  });
  console.log('✅ Upload successful! S3 Key:', uploadResult.s3key);

  if (options.dryRun) {
    console.log('\n🔍 [DRY RUN ACTIVE] - Upload verified. Skipping live Instagram publish.');
    console.log('\n📝 Caption preview:\n' + LAUNCH_CAPTION.slice(0, 250) + '...\n');
    return {
      success: true,
      dryRun: true,
      uploadResult,
      caption: LAUNCH_CAPTION,
    };
  }

  // 2. Create Instagram Container
  console.log('📸 Creating Instagram Media Container via Composio...');
  const containerRes = await composio.tools.execute('INSTAGRAM_POST_IG_USER_MEDIA', {
    userId: 'jobroofs_admin',
    arguments: {
      ig_user_id: IG_USER_ID,
      image_file: uploadResult,
      caption: LAUNCH_CAPTION,
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
  console.log(`\n🎉 LAUNCH POST PUBLISHED LIVE ON INSTAGRAM!`);
  console.log(`Media ID: ${publishedMediaId}`);
  console.log(`Account: @jobroofs (User ID: ${IG_USER_ID})`);

  return {
    success: true,
    publishedMediaId,
    creationId,
    account: '@jobroofs',
    caption: LAUNCH_CAPTION,
  };
}

module.exports = {
  publishLaunchPost,
  LAUNCH_CAPTION,
};

if (require.main === module) {
  const isDryRun = process.argv.includes('--dry-run');
  publishLaunchPost({ dryRun: isDryRun })
    .then((res) => {
      console.log('\n🏁 Done:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Error:', err);
      process.exit(1);
    });
}
