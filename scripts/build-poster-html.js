const fs = require('fs');
const path = require('path');

const helperSvg = fs.readFileSync('reports/posters/poster-helper-gallery.svg', 'utf8');
const baristaSvg = fs.readFileSync('reports/posters/poster-barista-gallery.svg', 'utf8');
const driverSvg = fs.readFileSync('reports/posters/poster-driver-gallery.svg', 'utf8');

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jobroofs Simple Poster Series</title>
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

    <!-- Brand Header -->
    <div class="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-zinc-800">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path d="M5 21L16 9L27 21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.5 21H22.5" stroke="#a1a1aa" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="16" cy="15.5" r="1.8" fill="#10b981"/>
          </svg>
        </div>
        <div>
          <h1 class="text-base font-bold text-[var(--foreground)] tracking-tight">JOBROOFS Everyday Posters</h1>
          <p class="text-xs text-[var(--muted-foreground)]">Sleek, Modern Photography Posters &bull; Exact Website Brand</p>
        </div>
      </div>

      <!-- Selector Pills -->
      <div class="flex items-center gap-1.5 bg-zinc-900/60 p-1.5 rounded-xl border border-zinc-800">
        <button onclick="selectPoster('helper')" id="btn-helper" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-white shadow-sm">
          Need a Helper?
        </button>
        <button onclick="selectPoster('barista')" id="btn-barista" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white">
          Need a Barista?
        </button>
        <button onclick="selectPoster('driver')" id="btn-driver" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white">
          Need a Driver?
        </button>
      </div>
    </div>

    <!-- Poster Frame + Actions -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      
      <!-- Poster Card (7 cols) -->
      <div class="md:col-span-7 flex justify-center">
        <div class="w-full max-w-[460px] bg-zinc-950 p-3 rounded-[28px] border border-zinc-800/80 shadow-2xl">
          <div id="poster-display" class="svg-box overflow-hidden rounded-2xl">
            <!-- Injected -->
          </div>
        </div>
      </div>

      <!-- Strategy & Publish Box (5 cols) -->
      <div class="md:col-span-5 space-y-4">
        
        <div class="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">AUTHENTIC WEBSITE BRANDING</span>
          </div>
          <h2 id="poster-title" class="text-lg font-bold text-[var(--foreground)]">Need a Helper? Post at JOBROOFS</h2>
          <p id="poster-desc" class="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Konzipiert für Lager, Logistik, Handwerk, Aushilfen und Allrounder. Verlinkt direkt auf jobroofs.com/post-a-job mit WhatsApp-Kontakt.
          </p>
        </div>

        <!-- 1-Click Publish Box -->
        <div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">Instagram Post Befehl</span>
            </div>
            <span class="text-[11px] font-mono text-zinc-500">@jobroofs</span>
          </div>
          <div class="bg-black p-3 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-200 flex items-center justify-between">
            <span id="cmd-text" class="text-emerald-400">node scripts/publish-poster.js helper</span>
          </div>
          <p class="text-[11px] text-zinc-500">Direkte Veröffentlichung via Composio S3 &amp; Meta Graph API.</p>
        </div>

        <!-- Caption Preview -->
        <div class="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-2">
          <span class="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">Instagram Begleittext</span>
          <p id="caption-text" class="text-xs font-mono text-zinc-300 whitespace-pre-line bg-zinc-950 p-3 rounded-xl border border-zinc-800 max-h-[160px] overflow-y-auto leading-relaxed"></p>
        </div>

      </div>

    </div>

  </div>

  <script>
    const svgs = {
      helper: ${JSON.stringify(helperSvg)},
      barista: ${JSON.stringify(baristaSvg)},
      driver: ${JSON.stringify(driverSvg)}
    };

    const data = {
      helper: {
        title: "Need a Helper? Post at JOBROOFS",
        desc: "Konzipiert für Lager, Logistik, Handwerk, Aushilfen und Allrounder. Verlinkt direkt auf jobroofs.com/post-a-job mit WhatsApp-Direktkontakt.",
        cmd: "node scripts/publish-poster.js helper",
        caption: "Need a Helper? Post at JOBROOFS. 🤝📦\\n\\nDu suchst eine zuverlässige Aushilfe für dein Lager, deinen Laden, dein Studio oder dein Event?\\n\\nAuf JOBROOFS inserieren Betriebe direkt:\\n✓ 1. Inserat 100% kostenlos\\n✓ Direkter 1-Klick Kontakt per WhatsApp\\n✓ 0% Zeitarbeit\\n\\n👉 jobroofs.com/post-a-job"
      },
      barista: {
        title: "Need a Barista? Post at JOBROOFS",
        desc: "Perfekt für Cafés, Röstereien, Bars und Brunch-Lokale. Schnelle Besetzung von Schichten ohne ATS-Hürden.",
        cmd: "node scripts/publish-poster.js barista",
        caption: "Need a Barista? Post at JOBROOFS. ☕✨\\n\\nDein Café oder deine Bar braucht Verstärkung?\\n\\nFinde motivierte Baristas & Servicekräfte direkt aus deinem Kiez:\\n✓ 1. Inserat 100% kostenlos\\n✓ WhatsApp Direktkontakt auf dein Smartphone\\n✓ Keine Abofalle\\n\\n👉 jobroofs.com/post-a-job"
      },
      driver: {
        title: "Need a Driver? Post at JOBROOFS",
        desc: "Für Kuriere, Lieferdienste, Fuhrparks und Transportunternehmen. Keine Vermittlungsgebühren.",
        cmd: "node scripts/publish-poster.js driver",
        caption: "Need a Driver? Post at JOBROOFS. 🚗📦\\n\\nDu suchst Fahrer für Auslieferung, Kurier oder Logistik?\\n\\nErreiche zuverlässige Fahrer in deiner Stadt ohne teure Personalagenturen:\\n✓ 1. Inserat gratis\\n✓ Direkter Kontakt\\n\\n👉 jobroofs.com/post-a-job"
      }
    };

    function selectPoster(key) {
      ['helper', 'barista', 'driver'].forEach(k => {
        const btn = document.getElementById('btn-' + k);
        if (k === key) {
          btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-white shadow-sm";
        } else {
          btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white";
        }
      });

      document.getElementById('poster-display').innerHTML = svgs[key];
      document.getElementById('poster-title').innerText = data[key].title;
      document.getElementById('poster-desc').innerText = data[key].desc;
      document.getElementById('cmd-text').innerText = data[key].cmd;
      document.getElementById('caption-text').innerText = data[key].caption;
    }

    selectPoster('helper');
  </script>
</body>
</html>`;

const dest = 'C:/Users/tusha/.gemini/antigravity/brain/3f78e4f2-4365-423d-9733-8e113c3f1062/poster_series_preview.html';
fs.writeFileSync(dest, html);
console.log('Written to:', dest, 'size:', fs.statSync(dest).size);
