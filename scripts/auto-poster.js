const fs = require('fs');
const path = require('path');
const os = require('os');
const { renderPostSvg, renderSvgToPng } = require('./generate-100-campaign');
const { generateHashtagsForPost, formatCaptionWithHashtags } = require('./hashtag-matrix');

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

function getNextPostToPublish(specificId = null) {
  const dataPath150 = path.join(__dirname, '../data/campaign-150-posts.json');
  const dataPath100 = path.join(__dirname, '../data/campaign-100-posts.json');
  const dataPath = fs.existsSync(dataPath150) ? dataPath150 : dataPath100;
  const historyPath = path.join(__dirname, '../data/publish-history.json');

  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  let history = [];
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  }

  if (specificId) {
    const p = posts.find((item) => item.id === parseInt(specificId, 10));
    if (!p) throw new Error(`Post ${specificId} not found in master dataset.`);
    return p;
  }

  const publishedIds = new Set(history.map((h) => h.id));
  const nextPost = posts.find((item) => !publishedIds.has(item.id));
  if (!nextPost) {
    console.log(`All ${posts.length} posts have been published! Starting round 2...`);
    return posts[0];
  }

  return nextPost;
}

function recordPublishedPost(post, publishedMediaId, creationId) {
  const historyPath = path.join(__dirname, '../data/publish-history.json');
  let history = [];
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  }

  history.push({
    id: post.id,
    day: post.day,
    slot: post.slot,
    role: `${post.role1} ${post.role2}`,
    publishedMediaId,
    creationId,
    timestamp: new Date().toISOString(),
  });

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

async function publishScheduledPost(options = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const historyPath = path.join(__dirname, '../data/publish-history.json');
  if (fs.existsSync(historyPath) && !options.force && !options.id) {
    const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    const publishedToday = history.find((h) => h.timestamp && h.timestamp.startsWith(today));
    if (publishedToday) {
      console.log(`\nℹ️ Today's post (#${publishedToday.id}: "${publishedToday.role}") was already published at ${publishedToday.timestamp}.`);
      console.log(`To publish another post today, run with: node scripts/auto-poster.js --force\n`);
      return { skipped: true, post: publishedToday };
    }
  }

  const post = getNextPostToPublish(options.id);
  console.log(`\n======================================================`);
  console.log(`🚀 [JOBROOFS CAMPAIGN] Publishing Post #${post.id} (${post.slot.toUpperCase()} / Day ${post.day})`);
  console.log(`🎨 Concept: "${post.role1} ${post.role2}" (${post.palette.name})`);
  console.log(`======================================================\n`);

  // Ensure image exists or render it
  const outDir = path.join(__dirname, '../reports/campaign-100');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const pngPath = path.join(outDir, `post-${post.id}.png`);

  if (!fs.existsSync(pngPath)) {
    console.log(`🎨 Rendering post-${post.id}.png...`);
    const svg = renderPostSvg(post);
    fs.writeFileSync(pngPath, renderSvgToPng(svg));
  }

  const composio = getComposioClient();

  // 1. Upload to Composio S3
  console.log('☁️ Uploading to Composio S3...');
  const uploadResult = await composio.files.upload({
    file: pngPath,
    toolSlug: 'INSTAGRAM_POST_IG_USER_MEDIA',
    toolkitSlug: 'instagram',
  });
  console.log('✅ Upload successful! S3 Key:', uploadResult.s3key);

  // Format caption with high-intent ranking hashtags
  const hashtags = post.hashtags || generateHashtagsForPost(post);
  const captionToPublish = formatCaptionWithHashtags(post.germanCaption, hashtags);

  if (options.dryRun) {
    console.log('\n🔍 [DRY RUN ACTIVE] - Post prepared & S3 upload verified. Skipping live publish.');
    console.log('\n📝 Caption with High-Intent Hashtags:\n' + captionToPublish + '\n');
    return {
      success: true,
      dryRun: true,
      post,
      caption: captionToPublish,
      hashtags,
      uploadResult,
    };
  }

  // 2. Create Media Container
  console.log('📸 Creating Instagram Media Container via Composio...');
  const containerRes = await composio.tools.execute('INSTAGRAM_POST_IG_USER_MEDIA', {
    userId: 'jobroofs_admin',
    arguments: {
      ig_user_id: IG_USER_ID,
      image_file: uploadResult,
      caption: captionToPublish,
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
  console.log(`\n🎉 POST PUBLISHED LIVE ON INSTAGRAM! Media ID: ${publishedMediaId}`);

  recordPublishedPost(post, publishedMediaId, creationId);

  return {
    success: true,
    publishedMediaId,
    creationId,
    post,
  };
}

module.exports = {
  publishScheduledPost,
  getNextPostToPublish,
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isForce = args.includes('--force');
  const idIdx = args.indexOf('--id');
  const specificId = idIdx !== -1 ? args[idIdx + 1] : null;

  publishScheduledPost({ dryRun: isDryRun, id: specificId, force: isForce })
    .then((res) => {
      console.log('\n🏁 Done:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Error:', err);
      process.exit(1);
    });
}
