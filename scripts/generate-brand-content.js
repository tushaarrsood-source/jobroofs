const fs = require('fs');
const path = require('path');

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Official Jobroofs Architectural Logo Header (matching components/brand-logo.tsx)
 */
function renderLogoHeader(theme = 'light') {
  const isDark = theme === 'dark';
  const stroke = isDark ? '#ffffff' : '#09090b';
  const subtext = isDark ? '#a1a1aa' : '#71717a';
  const border = isDark ? '#27272a' : '#e4e4e7';

  return `
  <!-- Official Jobroofs Logo Header -->
  <g transform="translate(100, 100)">
    <!-- Precision Hairline Roof Chevron (Jobroofs Architectural Mark) -->
    <g transform="translate(0, 4) scale(1.6)">
      <path d="M5 19L16 7L27 19" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.5 19H22.5" stroke="${subtext}" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="16" cy="13.5" r="1.8" fill="${stroke}" />
    </g>
    <!-- Brand Wordmark -->
    <text x="65" y="32" fill="${stroke}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="700" letter-spacing="3.5">JOBROOFS</text>
    <text x="65" y="48" fill="${subtext}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" letter-spacing="2.5">DAS PORTAL FÜR UNABHÄNGIGE BETRIEBE</text>
    <text x="880" y="36" text-anchor="end" fill="${subtext}" font-family="ui-monospace, monospace" font-size="14" font-weight="600" letter-spacing="2">JOBROOFS.COM</text>
  </g>
  <line x1="100" y1="185" x2="980" y2="185" stroke="${border}" stroke-width="1.5" />
  `;
}

/**
 * Format 1: Competitor Comparison (StepStone / Indeed vs Jobroofs)
 */
function generateComparisonCard() {
  return `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1350" fill="#fafaf9" />

  ${renderLogoHeader('light')}

  <!-- Category Tag -->
  <g transform="translate(100, 235)">
    <rect width="280" height="42" rx="21" fill="#09090b" />
    <text x="140" y="26" text-anchor="middle" fill="#ffffff" font-family="ui-monospace, monospace" font-size="12" font-weight="700" letter-spacing="2">DER VERGLEICH 2026</text>
  </g>

  <!-- Provocative Headline -->
  <g transform="translate(100, 335)">
    <text x="0" y="55" fill="#09090b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="56" font-weight="700" letter-spacing="-1.5">
      499 € für eine Anzeige?
    </text>
    <text x="0" y="125" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="400" letter-spacing="-1">
      Schluss mit der Abzocke.
    </text>
    <text x="0" y="195" fill="#52525b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="400">
      Warum etablierte Jobportale für lokale Betriebe nicht mehr funktionieren:
    </text>
  </g>

  <!-- Comparison Matrix -->
  <g transform="translate(100, 600)">
    <!-- Column Header: Old Portals -->
    <rect x="0" y="0" width="425" height="460" rx="24" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5" />
    <text x="35" y="55" fill="#a1a1aa" font-family="ui-monospace, monospace" font-size="13" font-weight="700" letter-spacing="2">STEPSTONE &amp; INDEED</text>
    
    <g transform="translate(35, 100)">
      <text x="0" y="0" fill="#dc2626" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700">✕ 70 € bis 500 €+</text>
      <text x="0" y="28" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17">pro Anzeige oder Abo-Falle</text>

      <text x="0" y="90" fill="#dc2626" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700">✕ Hohe Hürden</text>
      <text x="0" y="118" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17">CV-Pflicht &amp; lange Formulare</text>

      <text x="0" y="180" fill="#dc2626" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700">✕ Zeitarbeit &amp; Konzerne</text>
      <text x="0" y="208" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17">Kleine Betriebe gehen unter</text>

      <text x="0" y="270" fill="#dc2626" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700">✕ Anonyme ATS-Tools</text>
      <text x="0" y="298" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17">Kein direkter Draht</text>
    </g>

    <!-- Column Header: JOBROOFS (Featured) -->
    <rect x="455" y="0" width="425" height="460" rx="24" fill="#09090b" stroke="#18181b" stroke-width="2" />
    <g transform="translate(490, 50)">
      <text x="0" y="0" fill="#10b981" font-family="ui-monospace, monospace" font-size="13" font-weight="700" letter-spacing="2">JOBROOFS DIREKT</text>
      <rect x="230" y="-18" width="130" height="26" rx="13" fill="#10b981" fill-opacity="0.2" />
      <text x="295" y="-1" text-anchor="middle" fill="#34d399" font-family="ui-monospace, monospace" font-size="11" font-weight="700">NEUER STANDARD</text>
    </g>

    <g transform="translate(490, 100)">
      <text x="0" y="0" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700">✓ 1. Job 100% Gratis</text>
      <text x="0" y="28" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17">Danach ab 14,99 € einmalig</text>

      <text x="0" y="90" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700">✓ 1-Klick WhatsApp</text>
      <text x="0" y="118" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17">Direktkontakt ohne Anschreiben</text>

      <text x="0" y="180" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700">✓ 0% Zeitarbeit</text>
      <text x="0" y="208" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17">Nur echte, lokale Betriebe</text>

      <text x="0" y="270" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="700">✓ Kein Abonnement</text>
      <text x="0" y="298" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17">Volle Kostenkontrolle</text>
    </g>
  </g>

  <!-- Bottom CTA Box -->
  <g transform="translate(100, 1100)">
    <rect width="880" height="135" rx="24" fill="#18181b" />
    <g transform="translate(50, 48)">
      <text x="0" y="0" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="700">
        Jetzt dein erstes Inserat kostenlos schalten
      </text>
      <text x="0" y="32" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18">
        In 2 Minuten online · Keine Kreditkarte nötig · jobroofs.com
      </text>
    </g>
    <!-- Arrow button -->
    <circle cx="810" cy="67" r="32" fill="#10b981" />
    <path d="M802 67H818M818 67L811 60M818 67L811 74" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;
}

/**
 * Format 2: Thought Leadership / The Friction Dilemma
 */
function generateQuoteCard() {
  return `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1350" fill="#09090b" />

  ${renderLogoHeader('dark')}

  <!-- Category Tag -->
  <g transform="translate(100, 235)">
    <rect width="250" height="42" rx="21" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    <text x="125" y="26" text-anchor="middle" fill="#10b981" font-family="ui-monospace, monospace" font-size="12" font-weight="700" letter-spacing="2">RECRUITING REALITÄT</text>
  </g>

  <!-- Huge Editorial Quote Statement -->
  <g transform="translate(100, 340)">
    <text x="0" y="70" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="58" font-weight="700" letter-spacing="-1.5" line-height="1.2">
      „Niemand unter 30
    </text>
    <text x="0" y="145" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="58" font-weight="700" letter-spacing="-1.5">
      lädt mehr ein 4-seitiges
    </text>
    <text x="0" y="220" fill="#10b981" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="58" font-weight="700" letter-spacing="-1.5">
      Anschreiben als PDF hoch.“
    </text>
  </g>

  <!-- Supporting Editorial Context -->
  <g transform="translate(100, 640)">
    <rect width="880" height="380" rx="24" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    
    <g transform="translate(50, 60)">
      <text x="0" y="0" fill="#e4e4e7" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="600">
        73% aller Bewerber brechen den Prozess ab,
      </text>
      <text x="0" y="38" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="22" font-weight="400">
        wenn sie sich in komplizierte Portale einloggen müssen.
      </text>

      <line x1="0" y1="75" x2="780" y2="75" stroke="#27272a" stroke-width="1.5" />

      <text x="0" y="125" fill="#e4e4e7" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="600">
        Was Bewerber im Kiez wirklich wollen:
      </text>
      
      <g transform="translate(0, 160)">
        <circle cx="12" cy="0" r="5" fill="#10b981" />
        <text x="35" y="7" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="21" font-weight="500">Transparenter Stundenlohn ab Minute 1</text>

        <circle cx="12" cy="45" r="5" fill="#10b981" />
        <text x="35" y="52" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="21" font-weight="500">Direkter 1-Klick Kontakt per WhatsApp oder Anruf</text>

        <circle cx="12" cy="90" r="5" fill="#10b981" />
        <text x="35" y="97" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="21" font-weight="500">Fokus auf Persönlichkeit &amp; Zuverlässigkeit statt Noten</text>
      </g>
    </g>
  </g>

  <!-- Bottom Action -->
  <g transform="translate(100, 1070)">
    <rect width="880" height="150" rx="24" fill="#ffffff" />
    <g transform="translate(50, 55)">
      <text x="0" y="0" fill="#09090b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="700">
        Finde Mitarbeiter, die zu deinem Betrieb passen.
      </text>
      <text x="0" y="34" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18">
        Erstes Inserat 100% kostenlos schalten auf jobroofs.com
      </text>
    </g>
    <rect x="680" y="45" width="150" height="60" rx="14" fill="#09090b" />
    <text x="755" y="82" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600">Inserieren</text>
  </g>
</svg>`;
}

/**
 * Format 3: Direct Welcome & Invitation to Employers
 */
function generateWelcomeCard() {
  return `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1350" fill="#fafaf9" />

  ${renderLogoHeader('light')}

  <!-- Category Tag -->
  <g transform="translate(100, 235)">
    <rect width="360" height="42" rx="21" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
    <circle cx="25" cy="21" r="5" fill="#10b981" />
    <text x="195" y="26" text-anchor="middle" fill="#065f46" font-family="ui-monospace, monospace" font-size="12" font-weight="700" letter-spacing="1.8">AN ALLE BETRIEBE IN DEUTSCHLAND</text>
  </g>

  <!-- Big Invitation Headline -->
  <g transform="translate(100, 335)">
    <text x="0" y="55" fill="#09090b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="54" font-weight="700" letter-spacing="-1.5">
      Stellenanzeigen schalten
    </text>
    <text x="0" y="125" fill="#09090b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="54" font-weight="700" letter-spacing="-1.5">
      muss nicht teuer sein.
    </text>
    <text x="0" y="195" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="400">
      Dein 1. Inserat auf JOBROOFS ist 100% kostenlos.
    </text>
  </g>

  <!-- 3 Pillars Bento Grid -->
  <g transform="translate(100, 590)">
    <!-- Box 1 -->
    <rect x="0" y="0" width="880" height="130" rx="20" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5" />
    <text x="45" y="52" fill="#09090b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">0 € Erstinserat — Dauerhaft transparent</text>
    <text x="45" y="88" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18">Keine Kreditkarte nötig. Keine Abo-Falle. Keine automatische Verlängerung.</text>
    <rect x="740" y="38" width="95" height="48" rx="10" fill="#f4f4f5" />
    <text x="787" y="69" text-anchor="middle" fill="#09090b" font-family="ui-monospace, monospace" font-size="18" font-weight="700">0 €</text>

    <!-- Box 2 -->
    <rect x="0" y="155" width="880" height="130" rx="20" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5" />
    <text x="45" y="207" fill="#09090b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">1-Klick Direktkontakt via WhatsApp</text>
    <text x="45" y="243" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18">Bewerber landen direkt auf deinem Smartphone. 5x höhere Rückmeldequote.</text>
    <circle cx="787" cy="220" r="24" fill="#dcfce7" />
    <text x="787" y="228" text-anchor="middle" fill="#15803d" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24">💬</text>

    <!-- Box 3 -->
    <rect x="0" y="310" width="880" height="130" rx="20" fill="#ffffff" stroke="#e4e4e7" stroke-width="1.5" />
    <text x="45" y="362" fill="#09090b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="700">Kiez-Reichweite in 14 Metropolen</text>
    <text x="45" y="398" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18">Berlin, Hamburg, München, Köln, Frankfurt &amp; ganz Deutschland mit Stadtteil-Filter.</text>
    <rect x="740" y="348" width="95" height="48" rx="10" fill="#f4f4f5" />
    <text x="787" y="379" text-anchor="middle" fill="#09090b" font-family="ui-monospace, monospace" font-size="14" font-weight="700">14 CITIES</text>
  </g>

  <!-- Big Black CTA Banner -->
  <g transform="translate(100, 1080)">
    <rect width="880" height="145" rx="24" fill="#09090b" />
    <g transform="translate(50, 52)">
      <text x="0" y="0" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="700">
        Inseriere jetzt in 2 Minuten kostenlos
      </text>
      <text x="0" y="34" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18">
        Link in unserer Bio oder direkt auf jobroofs.com/post-a-job
      </text>
    </g>
    <circle cx="810" cy="72" r="28" fill="#10b981" />
    <path d="M803 72H817M817 72L811 66M817 72L811 78" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;
}

function renderSvgToPng(svgString) {
  const scratchResvg = path.join(
    'C:\\Users\\tusha\\.gemini\\antigravity\\brain\\3f78e4f2-4365-423d-9733-8e113c3f1062\\scratch\\node_modules\\@resvg\\resvg-js'
  );
  let ResvgClass;
  try {
    ResvgClass = require('@resvg/resvg-js').Resvg;
  } catch (e) {
    ResvgClass = require(scratchResvg).Resvg;
  }
  const resvg = new ResvgClass(svgString, { fitTo: { mode: 'width', value: 1080 } });
  return resvg.render().asPng();
}

module.exports = {
  generateComparisonCard,
  generateQuoteCard,
  generateWelcomeCard,
  renderSvgToPng,
};
