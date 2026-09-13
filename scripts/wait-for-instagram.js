const { Composio } = require('C:\\Users\\tusha\\.gemini\\antigravity\\brain\\3f78e4f2-4365-423d-9733-8e113c3f1062\\scratch\\node_modules\\@composio\\core');
const fs = require('fs');
const path = require('path');

const composio = new Composio({ apiKey: 'ak_wwv5ypPbzYy5XaHt2An3' });

async function poll() {
  const accountId = process.argv[2] || 'ca_4qp9ECyKqX57';
  console.log('Polling Instagram connection status for:', accountId);
  for (let i = 0; i < 120; i++) {
    try {
      const acc = await composio.connectedAccounts.get(accountId);
      console.log('Current status:', acc.status);
      if (acc.status === 'ACTIVE') {
        console.log('?? INSTAGRAM CONNECTED SUCCESSFULLY!');
        console.log('Account Details:', JSON.stringify(acc, null, 2));
        fs.writeFileSync(path.join(__dirname, '..', 'reports', 'instagram-connected.json'), JSON.stringify(acc, null, 2));
        process.exit(0);
      }
    } catch (e) {
      console.log('Poll error:', e.message);
    }
    await new Promise(r => setTimeout(r, 4000));
  }
  console.log('Polling timed out.');
}
poll();
