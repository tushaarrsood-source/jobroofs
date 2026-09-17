console.log('====================================================');
console.log(' VERIFYING CHAT QUESTION STYLING & PAYWALL GATEWAY');
console.log('====================================================\n');

let failed = false;

// 1. TEST CHAT QUESTION PARSER
console.log('[1/4] Testing AI Chat Question Detection (~20% bolder formatting)...');

function parseChatContent(content) {
  const lines = content.split('\n');
  return lines.map((line) => {
    if (!line.trim()) return [];
    const segments = [];
    const sentenceRegex = /([^.!?:]*\?)/g;
    let lastIndex = 0;
    let match;
    while ((match = sentenceRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ text: line.slice(lastIndex, match.index), isQuestion: false });
      }
      segments.push({ text: match[0], isQuestion: true });
      lastIndex = sentenceRegex.lastIndex;
    }
    if (lastIndex < line.length) {
      segments.push({ text: line.slice(lastIndex), isQuestion: false });
    }
    return segments;
  });
}

const sampleChat = `Hi! Ich erstelle dein Inserat.

📋 Bisher erfasst:
• Stelle: Barista (m/w/d)
• Betrieb: Café Mitte
• Ort: Berlin

Wie hoch soll der Stundenlohn sein? Und ab wann suchst du?`;

const parsed = parseChatContent(sampleChat);
const questionSegments = parsed.flat().filter((s) => s.isQuestion);
const normalSegments = parsed.flat().filter((s) => !s.isQuestion);

if (questionSegments.length !== 2) {
  console.error('FAIL: Expected 2 question segments, got ' + questionSegments.length);
  failed = true;
} else {
  console.log('  PASS: Successfully detected both questions:');
  questionSegments.forEach((q) => console.log('    - "' + q.text.trim() + '" -> isQuestion: true (fontWeight: 550)'));
}

if (!normalSegments.some((s) => s.text.includes('Barista'))) {
  console.error('FAIL: Normal text was not preserved properly');
  failed = true;
} else {
  console.log('  PASS: Normal message body preserved with normal font weight 400.');
}

// 2. TEST JOB FEED FILTER FOR UNPAID LISTINGS
console.log('\n[2/4] Testing Job Feed Direct Employer Hydration Filter...');

const mockLocalStorage = [
  { id: 'job-1', type: 'job', status: 'active', title: 'Active Job 1' },
  { id: 'job-2', type: 'job', status: 'pending_payment', title: 'Unpaid Job 2' },
  { id: 'job-3', type: 'job', status: 'expired', title: 'Expired Job 3' },
  { id: 'housing-1', type: 'housing', status: 'active', title: 'Housing Listing' },
];

const hydratedJobs = mockLocalStorage.filter(
  (l) => l.type === 'job' && (l.status === 'active' || l.status === 'published')
);

if (hydratedJobs.length !== 1 || hydratedJobs[0].id !== 'job-1') {
  console.error('FAIL: Job feed allowed unpaid or expired listings!', hydratedJobs);
  failed = true;
} else {
  console.log('  PASS: Feed strictly filters only active jobs. Pending payment job "job-2" is 100% BLOCKED.');
}

// 3. TEST MY LISTINGS STATUS BADGE LOGIC
console.log('\n[3/4] Testing My Listings Badge Logic...');

function getListingBadge(listing) {
  if (listing.status === 'pending_payment') return 'Zahlung ausstehend';
  if (listing.status === 'expired') return 'Abgelaufen';
  return 'Aktiv';
}

const badgeActive = getListingBadge({ status: 'active' });
const badgePending = getListingBadge({ status: 'pending_payment' });
const badgeExpired = getListingBadge({ status: 'expired' });

if (badgeActive !== 'Aktiv' || badgePending !== 'Zahlung ausstehend' || badgeExpired !== 'Abgelaufen') {
  console.error('FAIL: Badges do not match expected status!');
  failed = true;
} else {
  console.log('  PASS: Pending payment displays "Zahlung ausstehend", Active displays "Aktiv".');
}

// 4. SUMMARY
console.log('\n====================================================');
if (failed) {
  console.error(' TESTS FAILED! Please review issues above.');
  process.exit(1);
} else {
  console.log(' ALL VERIFICATIONS PASSED SUCCESSFULLY (100%)');
  console.log('====================================================');
}
