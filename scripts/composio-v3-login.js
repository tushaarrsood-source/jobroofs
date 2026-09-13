const { Composio } = require('C:\\Users\\tusha\\.gemini\\antigravity\\brain\\3f78e4f2-4365-423d-9733-8e113c3f1062\\scratch\\node_modules\\@composio\\core');
const fs = require('fs');
const path = require('path');
const os = require('os');

const composio = new Composio();

async function start() {
  const code = process.argv[2] || '530527';
  console.log('Monitoring CLI Session Code:', code);
  console.log('Open: https://app.composio.dev/cli');
  console.log('Enter code:', code);
  
  for (let i = 0; i < 60; i++) {
    try {
      const res = await composio.client.cli.getSession({ id: code });
      if (res.status === 'linked' && res.api_key) {
        console.log('?? SUCCESSFULLY AUTHENTICATED!');
        console.log('Account:', res.account?.email || res.account?.name || 'Linked');
        
        // Save to ~/.composio/user_data.json
        const composioDir = path.join(os.homedir(), '.composio');
        if (!fs.existsSync(composioDir)) fs.mkdirSync(composioDir, { recursive: true });
        const userDataPath = path.join(composioDir, 'user_data.json');
        fs.writeFileSync(userDataPath, JSON.stringify({ api_key: res.api_key }, null, 2));
        console.log('Saved valid API key to:', userDataPath);
        process.exit(0);
      }
    } catch (e) {
      console.log('Check error:', e.message);
    }
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log('Timed out waiting for approval.');
}

start();
