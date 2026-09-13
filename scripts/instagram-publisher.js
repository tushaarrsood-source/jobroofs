const fs = require('fs');
const path = require('path');
const os = require('os');
const { renderJobCardPng } = require('./generate-social-card');
const { generateJobCaption } = require('./instagram-caption-generator');

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
const CONNECTED_ACCOUNT_ID = 'ca_4qp9ECyKqX57';

/**
 * Publishes a job listing to Instagram (@jobroofs) automatically.
 */
async function publishJobToInstagram(job, options = {}) {
  const composio = getComposioClient();
  console.log(`\n🚀 Starting Instagram publishing for: "${job.title}" at ${job.company}`);

  // 1. Render PNG Graphic (1080x1350)
  console.log('🎨 Generating 1080x1350 Instagram visual card...');
  const pngBuffer = renderJobCardPng(job);
  const tempDir = path.join(os.tmpdir(), 'jobroofs-social');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  const tempFilePath = path.join(tempDir, `job-${Date.now()}.png`);
  fs.writeFileSync(tempFilePath, pngBuffer);
  console.log(`✅ Saved temporary image to: ${tempFilePath} (${pngBuffer.length} bytes)`);

  // 2. Generate German Caption
  const caption = generateJobCaption(job);
  console.log('📝 Caption generated:');
  console.log('---');
  console.log(caption.slice(0, 200) + '...\n---');

  // 3. Upload image via Composio S3
  console.log('☁️ Uploading graphic to Composio S3 storage...');
  const uploadResult = await composio.files.upload({
    file: tempFilePath,
    toolSlug: 'INSTAGRAM_POST_IG_USER_MEDIA',
    toolkitSlug: 'instagram',
  });
  console.log('✅ Image uploaded successfully:', uploadResult.s3key);

  if (options.dryRun) {
    console.log('🔍 DRY RUN ENABLED - Skipping live post publication.');
    return {
      success: true,
      dryRun: true,
      uploadResult,
      caption,
      tempFilePath,
    };
  }

  // 4. Create Media Container on Instagram
  console.log('📸 Creating Instagram Media Container via Composio...');
  const containerRes = await composio.tools.execute('INSTAGRAM_POST_IG_USER_MEDIA', {
    userId: 'jobroofs_admin',
    arguments: {
      ig_user_id: IG_USER_ID,
      image_file: uploadResult,
      caption: caption,
    },
    dangerouslySkipVersionCheck: true,
  });

  console.log('Container Response:', JSON.stringify(containerRes, null, 2));

  if (!containerRes.successful || !containerRes.data?.id) {
    throw new Error(`Failed to create Instagram media container: ${JSON.stringify(containerRes.data || containerRes.error)}`);
  }

  const creationId = containerRes.data.id;
  console.log(`✅ Media Container created: ${creationId}`);

  // Wait a short moment for Meta to process the uploaded image
  console.log('⏳ Waiting for Meta container processing (4s)...');
  await new Promise((r) => setTimeout(r, 4000));

  // 5. Publish Media to Instagram Feed
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
  console.log(`🎉 POST PUBLISHED SUCCESSFULLY ON INSTAGRAM! Media ID: ${publishedMediaId}`);

  // Clean up temp file
  try {
    fs.unlinkSync(tempFilePath);
  } catch (e) {}

  return {
    success: true,
    publishedMediaId,
    creationId,
    igUserId: IG_USER_ID,
    account: '@jobroofs',
  };
}

module.exports = {
  publishJobToInstagram,
  IG_USER_ID,
  CONNECTED_ACCOUNT_ID,
};

if (require.main === module) {
  const isDryRun = process.argv.includes('--dry-run');
  const sampleJob = {
    title: 'Barista & Café Allrounder (m/w/d)',
    company: 'Five Elephant Café',
    city: 'Berlin',
    district: 'Mitte',
    wage: '16,50 € / Std.',
    employmentType: 'Minijob (bis 603 €)',
    hours: '12 Std. / Woche',
    jobSlug: 'five-elephant-barista-berlin',
  };

  publishJobToInstagram(sampleJob, { dryRun: isDryRun })
    .then((res) => {
      console.log('\n🏁 Instagram Workflow Finished:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Instagram Workflow Failed:', err);
      process.exit(1);
    });
}
