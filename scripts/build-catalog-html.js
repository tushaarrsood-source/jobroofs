const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/campaign-150-posts.json');
const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jobroofs 150-Post Master Campaign Catalog (5x Täglich / 30 Tage)</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
</head>
<body class="bg-zinc-950 text-zinc-100 antialiased p-4 sm:p-8 font-sans">
  <div class="max-w-7xl mx-auto space-y-8">

    <!-- Header & Stats -->
    <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">30 TAGE &bull; 5 POSTS / TAG (150 POSTS TOTAL)</span>
          <span class="text-xs text-zinc-400">100% Double-Color &bull; Helvetica Ultra-Bold</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-white">Jobroofs 150-Post Master Campaign</h1>
        <p class="text-sm text-zinc-400 mt-1">Der Alex-Hormozi-Standard für kompromissloses Recruiting-Wachstum auf Instagram (@jobroofs).</p>
      </div>

      <!-- Schedule Indicator -->
      <div class="bg-black/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 text-xs font-mono">
        <div>
          <span class="text-zinc-500 block">AUTOMATION STATUS</span>
          <span class="text-emerald-400 font-bold">● 5x TÄGLICH AKTIV</span>
        </div>
        <div class="border-l border-zinc-800 pl-4">
          <span class="text-zinc-500 block">POST-SLOTS</span>
          <span class="text-zinc-300">07:30 &bull; 11:30 &bull; 14:30 &bull; 18:30 &bull; 21:30 CET</span>
        </div>
      </div>
    </div>

    <!-- Filter Buttons -->
    <div class="flex flex-wrap items-center gap-2">
      <button onclick="filterSlot('all')" id="f-all" class="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-950 shadow">Alle (150)</button>
      <button onclick="filterSlot('morning')" id="f-morning" class="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800">1. Morgen-Klartext (07:30)</button>
      <button onclick="filterSlot('pre_lunch')" id="f-pre_lunch" class="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800">2. Arbeitgeber-Weckruf (11:30)</button>
      <button onclick="filterSlot('afternoon')" id="f-afternoon" class="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800">3. Hormozi-Wahrheit (14:30)</button>
      <button onclick="filterSlot('evening')" id="f-evening" class="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800">4. Kiez-Spotlight (18:30)</button>
      <button onclick="filterSlot('late_night')" id="f-late_night" class="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800">5. Late-Night-Manifest (21:30)</button>
    </div>

    <!-- Posts Grid -->
    <div id="posts-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Injected by JS -->
    </div>

  </div>

  <script>
    const posts = ${JSON.stringify(posts)};

    function renderGrid(filtered) {
      const container = document.getElementById('posts-grid');
      container.innerHTML = filtered.map(p => {
        return \`
        <div class="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
          
          <!-- Card Header -->
          <div class="flex items-center justify-between text-[11px] font-mono">
            <span class="text-zinc-500">TAG \${p.day} &bull; \${p.slotTitle || p.slot.toUpperCase()} (\${p.time})</span>
            <span class="px-2 py-0.5 rounded-full uppercase font-bold" style="background: \${p.palette.bg}; color: \${p.palette.text}; border: 1px solid \${p.palette.text}40">\${p.colorway}</span>
          </div>

          <!-- Mini Poster Preview Card -->
          <div class="rounded-2xl p-6 text-center shadow-inner flex flex-col items-center justify-between min-h-[260px]" style="background: \${p.palette.bg}; color: \${p.palette.text}">
            
            <div class="text-[10px] font-mono tracking-[0.25em] opacity-80">JOBROOFS.COM</div>
            
            <div class="my-auto py-3">
              <h2 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight uppercase">\${p.role1}<br/>\${p.role2}</h2>
              <p class="text-xs font-bold tracking-widest uppercase mt-2 opacity-95">\${p.subline}</p>
              <p class="text-[9px] font-mono tracking-wider mt-3 opacity-75">\${p.tags}</p>
            </div>

            <!-- Pill Button -->
            <div class="px-5 py-2 rounded-full text-[11px] font-black tracking-wider uppercase shadow-md" style="background: \${p.palette.text}; color: \${p.palette.bg}">
              \${p.buttonText}
            </div>

          </div>

          <!-- German Caption & Trigger -->
          <div class="space-y-3 pt-1">
            <p class="text-xs text-zinc-400 font-mono line-clamp-2 leading-relaxed">\${p.germanCaption}</p>
            
            <div class="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-mono">
              <span class="text-zinc-500">Post #\${p.id}</span>
              <span class="text-emerald-400">node scripts/auto-poster.js --id \${p.id}</span>
            </div>
          </div>

        </div>
        \`;
      }).join('');
    }

    function filterSlot(slot) {
      ['all', 'morning', 'pre_lunch', 'afternoon', 'evening', 'late_night'].forEach(s => {
        const btn = document.getElementById('f-' + s);
        if (btn) {
          if (s === slot) {
            btn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-950 shadow";
          } else {
            btn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800";
          }
        }
      });

      if (slot === 'all') {
        renderGrid(posts);
      } else {
        renderGrid(posts.filter(item => item.slot === slot));
      }
    }

    filterSlot('all');
  </script>
</body>
</html>`;

const destBrain150 = 'C:/Users/tusha/.gemini/antigravity/brain/3f78e4f2-4365-423d-9733-8e113c3f1062/campaign_150_catalog.html';
const destBrain100 = 'C:/Users/tusha/.gemini/antigravity/brain/3f78e4f2-4365-423d-9733-8e113c3f1062/campaign_100_catalog.html';

fs.writeFileSync(destBrain150, html);
fs.writeFileSync(destBrain100, html);
console.log('Successfully updated campaign catalogs in brain artifacts directory!');
