const fs = require('fs');
const path = require('path');

const logoSvg = fs.readFileSync('reports/double-color-campaign/post-1-logo-launch-green.svg', 'utf8');
const helperSvg = fs.readFileSync('reports/double-color-campaign/post-2-need-a-helper.svg', 'utf8');
const baristaSvg = fs.readFileSync('reports/double-color-campaign/post-3-need-a-barista.svg', 'utf8');

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jobroofs Double-Color Campaign</title>
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
<body class="bg-transparent text-[var(--foreground)] antialiased p-3 sm:p-6 font-sans">
  <div class="max-w-4xl mx-auto space-y-6">

    <!-- Header -->
    <div class="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#385542] flex items-center justify-center border border-zinc-700 shadow-inner">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M5 21L16 9L27 21" stroke="#F6F4EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.5 21H22.5" stroke="#F6F4EB" stroke-opacity="0.8" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="16" cy="15.5" r="1.6" fill="#F6F4EB"/>
          </svg>
        </div>
        <div>
          <h1 class="text-base font-bold text-[var(--foreground)] tracking-tight">Double-Color Campaign</h1>
          <p class="text-xs text-[var(--muted-foreground)]">Exakt wie das Referenzdesign &bull; 2 Farben &bull; Reine Typografie</p>
        </div>
      </div>

      <!-- Selector Tabs -->
      <div class="flex items-center gap-1.5 bg-zinc-900/60 p-1.5 rounded-xl border border-zinc-800">
        <button onclick="selectPost('logo')" id="btn-logo" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-white shadow-sm">
          Post 1: Launch Logo
        </button>
        <button onclick="selectPost('helper')" id="btn-helper" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white">
          Post 2: Need a Helper?
        </button>
        <button onclick="selectPost('barista')" id="btn-barista" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white">
          Post 3: Need a Barista?
        </button>
      </div>
    </div>

    <!-- Main Display Grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      
      <!-- Poster Preview Frame (7 cols) -->
      <div class="md:col-span-7 flex justify-center">
        <div class="w-full max-w-[430px] bg-zinc-950 p-2.5 rounded-[28px] border border-zinc-800 shadow-2xl">
          <div id="poster-display" class="svg-box overflow-hidden rounded-2xl">
            <!-- Injected dynamically -->
          </div>
        </div>
      </div>

      <!-- Action & Caption Panel (5 cols) -->
      <div class="md:col-span-5 space-y-4">
        
        <div class="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-2">
          <span id="post-badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">POST #1: OFFICIAL LAUNCH</span>
          <h2 id="post-title" class="text-lg font-bold text-[var(--foreground)]">Jobroofs Manifesto Launch</h2>
          <p id="post-desc" class="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Minimalistisches Double-Color Logo-Announcement. Keine Ablenkung, pure Markenpräsenz auf Mattgrün (#385542) und Warmweiß (#F6F4EB).
          </p>
        </div>

        <!-- 1-Click Publish Action -->
        <div class="bg-zinc-950 border border-emerald-950/60 rounded-2xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">Live auf @jobroofs posten</span>
            </div>
            <span class="text-[11px] font-mono text-zinc-500">Composio S3 Verified</span>
          </div>

          <div class="bg-black p-3 rounded-lg border border-zinc-800 font-mono text-xs text-emerald-400">
            node scripts/publish-launch-post.js
          </div>

          <p class="text-[11px] text-zinc-400">Bereit für den sofortigen Upload via Meta Graph API.</p>
        </div>

        <!-- Caption Box -->
        <div class="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-2">
          <span class="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">Deutscher Begleittext</span>
          <div id="caption-box" class="text-xs font-mono text-zinc-300 whitespace-pre-wrap bg-zinc-950 p-3 rounded-xl border border-zinc-800 max-h-[160px] overflow-y-auto leading-relaxed"></div>
        </div>

      </div>

    </div>

  </div>

  <script>
    const svgs = {
      logo: ${JSON.stringify(logoSvg)},
      helper: ${JSON.stringify(helperSvg)},
      barista: ${JSON.stringify(baristaSvg)}
    };

    const data = {
      logo: {
        badge: "POST #1: OFFICIAL LAUNCH",
        title: "Jobroofs Manifesto Launch",
        desc: "Minimalistisches Double-Color Logo-Announcement. Keine Ablenkung, pure Markenpräsenz auf Mattgrün (#385542) und Warmweiß (#F6F4EB).",
        caption: \`Wir machen Schluss mit 499-Euro-Stellenanzeigen und 20-minütigen Bewerbungsformularen. 🛑\\n\\nDas ist JOBROOFS:\\nDas Portal für unabhängige Betriebe, Minijobs & temporäre Jobs in ganz Deutschland. 🏛️\\n\\n1️⃣ Dein 1. Stelleninserat ist 100% kostenlos.\\n2️⃣ 1-Klick Direktkontakt via WhatsApp & Telefon.\\n3️⃣ 0% Zeitarbeit – nur echte lokale Betriebe.\\n\\n👉 jobroofs.com/post-a-job\`
      },
      helper: {
        badge: "POST #2: CAMPAIGN ROLLOUT",
        title: "NEED A HELPER? POST AT JOBROOFS",
        desc: "Exakter Nachbau der Typografie-Hierarchie aus dem Referenzdesign. Groß, plakativ, zentrierter Pill-Button.",
        caption: \`NEED A HELPER? POST AT JOBROOFS. 🤝📦\\n\\nDu suchst eine Aushilfe für Lager, Laden oder Studio?\\n✓ 1. Inserat 100% kostenlos\\n✓ 1-Klick WhatsApp Direktkontakt\\n✓ 0% Zeitarbeit\\n\\n👉 jobroofs.com/post-a-job\`
      },
      barista: {
        badge: "POST #3: CAMPAIGN ROLLOUT",
        title: "NEED A BARISTA? POST AT JOBROOFS",
        desc: "Warmes Röstton-Farbdoppel (Terracotta & Off-White) für Cafés, Röstereien und Gastronomie.",
        caption: \`NEED A BARISTA? POST AT JOBROOFS. ☕✨\\n\\nVerstärkung an der Espressomaschine gesucht?\\nFinde motivierte Baristas direkt aus deinem Kiez.\\n✓ 1. Inserat 100% kostenlos\\n\\n👉 jobroofs.com/post-a-job\`
      }
    };

    function selectPost(key) {
      ['logo', 'helper', 'barista'].forEach(k => {
        const btn = document.getElementById('btn-' + k);
        if (k === key) {
          btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-white shadow-sm";
        } else {
          btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white";
        }
      });

      document.getElementById('poster-display').innerHTML = svgs[key];
      document.getElementById('post-badge').innerText = data[key].badge;
      document.getElementById('post-title').innerText = data[key].title;
      document.getElementById('post-desc').innerText = data[key].desc;
      document.getElementById('caption-box').innerText = data[key].caption;
    }

    selectPost('logo');
  </script>
</body>
</html>`;

const dest = 'C:/Users/tusha/.gemini/antigravity/brain/3f78e4f2-4365-423d-9733-8e113c3f1062/campaign_preview.html';
fs.writeFileSync(dest, html);
console.log('Written to:', dest, 'size:', fs.statSync(dest).size);
