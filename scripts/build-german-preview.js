const fs = require('fs');
const path = require('path');

const { renderPostSvg } = require('./generate-100-campaign');

const dataPath = path.join(__dirname, '../data/campaign-100-posts.json');
const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const svg1 = renderPostSvg(posts[0]);
const svg2 = renderPostSvg(posts[1]);
const svg3 = renderPostSvg(posts[2]);
const svg4 = renderPostSvg(posts[3]);

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jobroofs German Campaign Preview</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    .svg-box svg {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 16px;
    }
  </style>
</head>
<body class="bg-transparent text-zinc-100 antialiased p-3 sm:p-6 font-sans">
  <div class="max-w-4xl mx-auto space-y-6">

    <!-- Header -->
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-zinc-800">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M5 21L16 9L27 21" stroke="#F6F4EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.5 21H22.5" stroke="#F6F4EB" stroke-opacity="0.8" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="16" cy="15.5" r="1.6" fill="#10B981"/>
          </svg>
        </div>
        <div>
          <h1 class="text-base font-bold text-white tracking-tight">100% Deutsche Kampagne</h1>
          <p class="text-xs text-zinc-400">German Headlines &bull; Hormozi Value Equation &bull; Double-Color</p>
        </div>
      </div>

      <!-- Selector Pills -->
      <div class="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
        <button onclick="selectPost('p1')" id="b-p1" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-white shadow-sm">Aushilfe</button>
        <button onclick="selectPost('p2')" id="b-p2" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white">499 € Abzocke</button>
        <button onclick="selectPost('p3')" id="b-p3" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white">Minijob</button>
        <button onclick="selectPost('p4')" id="b-p4" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white">Barista</button>
      </div>
    </div>

    <!-- Main Display -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      
      <div class="md:col-span-7 flex justify-center">
        <div class="w-full max-w-[430px] bg-zinc-950 p-2.5 rounded-[28px] border border-zinc-800 shadow-2xl">
          <div id="display-frame" class="svg-box overflow-hidden rounded-2xl"></div>
        </div>
      </div>

      <div class="md:col-span-5 space-y-4">
        
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <span id="post-badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">DEUTSCHER HORMOZI HOOK</span>
          <h2 id="post-title" class="text-lg font-bold text-white">Aushilfe gesucht?</h2>
          <p id="post-desc" class="text-xs text-zinc-400 leading-relaxed">
            Direkte Ansprache für lokale Inhaber in Deutschland. Reibungsfreie WhatsApp-Bewerbung ohne CV-Papierkrieg.
          </p>
        </div>

        <div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">Automatischer Trigger</span>
            <span class="text-[11px] font-mono text-zinc-500">Composio Verified</span>
          </div>
          <div id="cmd-box" class="bg-black p-3 rounded-lg border border-zinc-800 font-mono text-xs text-emerald-400">
            node scripts/auto-poster.js --id 1
          </div>
        </div>

        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <span class="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Viraler Deutscher Begleittext</span>
          <div id="caption-box" class="text-xs font-mono text-zinc-300 whitespace-pre-wrap bg-zinc-950 p-3 rounded-xl border border-zinc-800 max-h-[160px] overflow-y-auto leading-relaxed"></div>
        </div>

      </div>

    </div>

  </div>

  <script>
    const svgs = {
      p1: ${JSON.stringify(svg1)},
      p2: ${JSON.stringify(svg2)},
      p3: ${JSON.stringify(svg3)},
      p4: ${JSON.stringify(svg4)}
    };

    const data = {
      p1: {
        title: "Aushilfe gesucht? Schluss mit 500 € Anzeigen.",
        desc: "Direkte Ansprache für deutsche Betriebe. Reibungsfreie WhatsApp-Bewerbung ohne CV-Papierkrieg.",
        cmd: "node scripts/auto-poster.js --id 1",
        caption: "AUSHILFE GESUCHT? Inseriere auf JOBROOFS. 🏢⚡\\n\\nWarum zahlen Betriebe 2026 immer noch 499 € für ein einziges Inserat, nur um dann geghostet zu werden?\\n\\nUnser Grand Slam Offer:\\nDein 1. Inserat kostet 0 €. Keine Kreditkarte. Kein Abo.\\n\\n👉 jobroofs.com/post-a-job"
      },
      p2: {
        title: "499 € für eine Anzeige? Du wirst legal bestohlen.",
        desc: "Polarisierender Truth-Bomb Post. Attackiert alte Konkurrenten wie StepStone & Indeed frontal.",
        cmd: "node scripts/auto-poster.js --id 2",
        caption: "499 € FÜR EINE ANZEIGE? 🛑\\n\\nGroße Jobbörsen leben davon, dass du aus reiner Gewohnheit zahlst. Sie garantieren dir 0 Einstellungen. Nur eine PDF-Rechnung.\\n\\nWir haben das System umgedreht: 1. Inserat 100% kostenlos.\\n\\n👉 jobroofs.com/post-a-job"
      },
      p3: {
        title: "Suchst du einen Minijob? Bis 538 € steuerfrei.",
        desc: "Direkte Ansprache junger Talente, Studierender und Minijobber in ganz Deutschland.",
        cmd: "node scripts/auto-poster.js --id 3",
        caption: "SUCHST DU EINEN MINIJOB? ✨\\n\\nBis 538 € steuerfrei. 0 Papierkrieg.\\nAuf JOBROOFS bewirbst du dich so einfach wie eine WhatsApp-Nachricht:\\n✓ Transparente Stundenlöhne ab Minute 1\\n✓ Kein Lebenslauf nötig\\n\\n👉 jobroofs.com"
      },
      p4: {
        title: "Barista gesucht? Deine Schichten sind nicht grundlos leer.",
        desc: "Klartext für Gastronomen, Cafés und Röstereien in Berlin, Hamburg, München & Co.",
        cmd: "node scripts/auto-poster.js --id 4",
        caption: "BARISTA GESUCHT? ☕\\n\\nWenn dein Café keine Leute findet, liegt es nicht am Fachkräftemangel. Es liegt an deinem 12-Schritte-Bewerbungsprozess.\\n\\nBei Jobroofs meldet sich Talent direkt per WhatsApp.\\n\\n👉 jobroofs.com/post-a-job"
      }
    };

    function selectPost(key) {
      ['p1', 'p2', 'p3', 'p4'].forEach(k => {
        const btn = document.getElementById('b-' + k);
        if (k === key) {
          btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-white shadow-sm";
        } else {
          btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white";
        }
      });

      document.getElementById('display-frame').innerHTML = svgs[key];
      document.getElementById('post-title').innerText = data[key].title;
      document.getElementById('post-desc').innerText = data[key].desc;
      document.getElementById('cmd-box').innerText = data[key].cmd;
      document.getElementById('caption-box').innerText = data[key].caption;
    }

    selectPost('p1');
  </script>
</body>
</html>`;

const dest = 'C:/Users/tusha/.gemini/antigravity/brain/3f78e4f2-4365-423d-9733-8e113c3f1062/german_campaign_preview.html';
fs.writeFileSync(dest, html);
console.log('Written german_campaign_preview.html, size:', fs.statSync(dest).size);
