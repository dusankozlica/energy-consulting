/* Energy Consulting — Kinetic Editorial Dark
   Jede Funktion prüft auf Vorhandensein ihrer Elemente,
   damit die Datei auf jeder Seite gefahrlos eingebunden werden kann. */

const ROT = '#E30613';
const GRID = 'rgba(0,0,0,0.06)';
const TICK = 'rgba(0,0,0,0.5)';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMenu();
  initScrollProgress();
  initReveal();
  initCountUp();
  initSpotlight();
  initMagnetic();
  initMarquee();
  initHero();
  initProcess();
  initCharts();
  initCalculator();
  initMap();
  initForm();
  initFaqSingle();
  /* ── Premium Layer ── */
  initCursor();
  initParallax();

  initBackTop();
  initPageHero();
  initRevealFooter();
});

/* ---------- Reveal-Footer: Body-Padding = Footer-Höhe ---------- */
function initRevealFooter() {
  const footer = document.querySelector('footer.site');
  if (!footer) return;

  function sync() {
    document.body.style.paddingBottom = footer.offsetHeight + 'px';
  }

  sync();
  window.addEventListener('resize', sync, { passive: true });
}

/* ---------- Header: blur beim Scrollen ---------- */
function initHeader() {
  const header = document.querySelector('header.site');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobiles Menü ---------- */
function initMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));
}

/* ---------- Scroll-Fortschrittsbalken ---------- */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scrollbar';
  document.body.appendChild(bar);
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* ---------- Reveal beim Scrollen (gestaffelt, alle Varianten) ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const allClasses = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
      const sibs = Array.from(e.target.parentElement
        ? e.target.parentElement.querySelectorAll(':scope > ' + allClasses)
        : [e.target]);
      const i = Math.max(0, sibs.indexOf(e.target));
      e.target.style.transitionDelay = Math.min(i * 80, 400) + 'ms';
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -6% 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------- Zahlen hochzählen ---------- */
function initCountUp() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1400; const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  nums.forEach(n => io.observe(n));
}

/* ---------- Spotlight: --mx/--my auf Karten ---------- */
function initSpotlight() {
  if (REDUCED) return;
  const cards = document.querySelectorAll('.glass, .proj-card');
  if (!cards.length) return;
  const move = (card) => (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
  };
  cards.forEach(c => c.addEventListener('pointermove', move(c)));
}

/* ---------- Magnetische Buttons – deaktiviert (Boxen sollen sich nicht bewegen) ---------- */
function initMagnetic() { /* bewusst leer: keine Box-Bewegung beim Hover */ }

/* ---------- Marquee: Inhalt duplizieren für Endlosschleife ---------- */
function initMarquee() {
  document.querySelectorAll('.marquee__track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });
}

/* ---------- Hero: Energie-Netzwerk-Canvas + Text-Reveal ---------- */
function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const ready = () => hero.classList.add('ready');
  requestAnimationFrame(ready);
  setTimeout(ready, 220); // Fallback, falls rAF (z. B. im Hintergrund) verzögert ist

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || REDUCED) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes, raf;
  const COUNT = 58;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const seed = () => {
    nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const o = (1 - dist / 130) * 0.5;
          ctx.strokeStyle = `rgba(227,6,19,${o})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = 'rgba(227,6,19,0.85)';
      ctx.beginPath(); ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  resize(); seed(); draw();
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); seed(); draw(); });
}

/* ---------- Prozess: gepinnte Timeline, aktiver Schritt ---------- */
function initProcess() {
  const root = document.querySelector('.process');
  if (!root) return;
  const steps = Array.from(root.querySelectorAll('.step'));
  const count = root.querySelector('.process__count');
  const bar = root.querySelector('.process__bar i');
  if (!steps.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      steps.forEach(s => s.classList.remove('active'));
      e.target.classList.add('active');
      const i = steps.indexOf(e.target);
      const total = steps.length;
      if (count) count.textContent = String(i + 1).padStart(2, '0');
      if (bar) bar.style.width = ((i + 1) / total) * 100 + '%';
    });
  }, { threshold: 0.6, rootMargin: '-20% 0px -30% 0px' });
  steps.forEach(s => io.observe(s));
}

/* ---------- Charts (Chart.js) ---------- */
let mixChart, savingChart, donutChart;
function initCharts() {
  if (typeof Chart === 'undefined') return;

  // Globale Chart-Defaults: Brand-Mono-Font, sehr subtile Farben
  Chart.defaults.font.family = "'Overpass Mono', ui-monospace, monospace";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = 'rgba(0,0,0,0.45)';

  // Gemeinsame Tooltip-Konfiguration — weißes Card-Design
  const tooltipDefaults = {
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.10)',
    borderWidth: 1,
    titleColor: '#1A1A1A',
    bodyColor: '#555',
    padding: 14,
    cornerRadius: 0,
    boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
    displayColors: false,
  };

  // Gemeinsame Achsen-Konfiguration — kaum sichtbare Linien
  const scaleDefaults = {
    border: { display: false },
    grid: { color: 'rgba(0,0,0,0.05)', drawTicks: false },
    ticks: {
      font: { family: "'Overpass Mono', monospace", size: 10 },
      padding: 8,
      color: 'rgba(0,0,0,0.38)',
    },
  };

  // ── Strommix-Entwicklung Schweiz ──────────────────────────────────
  // Richtwerte CH: Wasserkraft + neue Erneuerbare (hoch), fossil-thermisch (sehr gering)
  const mixEl = document.getElementById('chart-mix');
  if (mixEl) {
    const years = ['2010','2012','2014','2016','2018','2020','2022','2024'];
    const data = {
      erneuerbar: [57, 58, 58, 60, 62, 64, 66, 68],
      fossil:     [3,  3,  4,  3,  3,  2,  2,  2],
    };
    const makeGrad = (ctx, r, g, b) => {
      const gr = ctx.createLinearGradient(0, 0, 0, 300);
      gr.addColorStop(0,   `rgba(${r},${g},${b},0.30)`);
      gr.addColorStop(0.7, `rgba(${r},${g},${b},0.06)`);
      gr.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      return gr;
    };
    const makeSet = (key) => {
      const isRenew = key === 'erneuerbar';
      return {
        label: isRenew ? 'Erneuerbare Energien' : 'Fossile Energieträger',
        data: data[key],
        borderColor: isRenew ? ROT : '#888',
        backgroundColor: makeGrad(mixEl.getContext('2d'), isRenew ? 227 : 120, isRenew ? 6 : 120, isRenew ? 19 : 120),
        fill: true, tension: 0.42, borderWidth: 2,
        pointBackgroundColor: isRenew ? ROT : '#888',
        pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: isRenew ? ROT : '#888',
        pointHitRadius: 24,
      };
    };
    mixChart = new Chart(mixEl, {
      type: 'line',
      data: { labels: years, datasets: [makeSet('erneuerbar')] },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        animation: { duration: 600, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipDefaults, callbacks: {
            title: (c) => c[0].label,
            label: (c) => `${c.dataset.label}: ${c.parsed.y} %`,
          }},
        },
        scales: {
          x: { ...scaleDefaults, grid: { display: false } },
          y: { ...scaleDefaults, ticks: { ...scaleDefaults.ticks, callback: (v) => v + ' %' }, suggestedMin: 0, suggestedMax: 70 },
        },
      },
    });
    document.querySelectorAll('[data-mix]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-mix]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        mixChart.data.datasets = [makeSet(btn.dataset.mix)];
        mixChart.update('active');
      });
    });
  }

  // ── Einsparpotenzial nach Branche — horizontal bars ──────────────
  const saveEl = document.getElementById('chart-saving');
  if (saveEl) {
    savingChart = new Chart(saveEl, {
      type: 'bar',
      data: {
        labels: ['Kommunal', 'Logistik', 'Gewerbe', 'Industrie', 'Immobilien'],
        datasets: [{
          label: 'Ø Einsparpotenzial',
          data: [26, 19, 28, 22, 35],
          backgroundColor: [
            'rgba(227,6,19,0.65)', 'rgba(227,6,19,0.70)',
            'rgba(227,6,19,0.78)', 'rgba(227,6,19,0.85)', ROT,
          ],
          hoverBackgroundColor: '#b00410',
          borderRadius: 0, borderSkipped: false, maxBarThickness: 28,
          barPercentage: 0.65,
        }],
      },
      options: {
        indexAxis: 'y',            // ← horizontal
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipDefaults, callbacks: {
            title: (c) => c[0].label,
            label: (c) => `Ø Einsparung: ${c.parsed.x} %`,
          }},
        },
        scales: {
          x: { ...scaleDefaults, ticks: { ...scaleDefaults.ticks, callback: (v) => v + ' %' }, suggestedMax: 40 },
          y: { ...scaleDefaults, grid: { display: false },
               ticks: { ...scaleDefaults.ticks, font: { family: "'Overpass Mono', monospace", size: 10 } } },
        },
      },
    });
  }
}

/* ---------- Energiekosten-Rechner ---------- */
function initCalculator() {
  const root = document.getElementById('calc');
  if (!root) return;
  const verbrauch = root.querySelector('#in-verbrauch');
  const preis = root.querySelector('#in-preis');
  const grad = root.querySelector('#in-grad');
  if (!verbrauch || !preis || !grad) return;

  const fmtEur = (n) => 'CHF ' + n.toLocaleString('de-CH', { maximumFractionDigits: 0 });
  const fmtNum = (n, u) => n.toLocaleString('de-CH', { maximumFractionDigits: 0 }) + (u ? ' ' + u : '');

  const donutEl = root.querySelector('#calc-donut');
  if (donutEl && typeof Chart !== 'undefined') {
    donutChart = new Chart(donutEl, {
      type: 'doughnut',
      data: { labels: ['Einsparung', 'Restkosten'], datasets: [{
        data: [30, 70], backgroundColor: [ROT, 'rgba(0,0,0,0.08)'], borderWidth: 0, cutout: '76%'
      }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    });
  }

  // Pulsiert ein Element kurz wenn sich der Wert ändert
  const pulse = (el) => {
    if (!el || REDUCED) return;
    el.classList.remove('num-pulse');
    void el.offsetWidth; // Reflow damit Animation neu startet
    el.classList.add('num-pulse');
    el.addEventListener('animationend', () => el.classList.remove('num-pulse'), { once: true });
  };

  const setText = (sel, txt) => {
    const el = root.querySelector(sel);
    if (!el) return;
    if (el.textContent !== txt) { el.textContent = txt; pulse(el); }
  };

  const update = () => {
    const kwh = +verbrauch.value;
    const ct = +preis.value;
    const g = +grad.value;
    const jahr = kwh * (ct / 100);
    const ersparnis = jahr * (g / 100);
    const optimiert = jahr - ersparnis;
    const co2 = (kwh * (g / 100) * 0.13) / 1000; // t CO2 (~130 g/kWh CH-Verbrauchermix)

    setText('[data-val="verbrauch"]', fmtNum(kwh, 'kWh'));
    setText('[data-val="preis"]', ct.toLocaleString('de-CH') + ' Rp.');
    setText('[data-val="grad"]', g + ' %');

    setText('[data-out="aktuell"]', fmtEur(jahr));
    setText('[data-out="optimiert"]', fmtEur(optimiert));
    setText('[data-out="ersparnis"]', fmtEur(ersparnis));
    setText('[data-out="co2"]', co2.toLocaleString('de-CH', { maximumFractionDigits: 1 }) + ' t');
    setText('[data-out="pct"]', g);
    // Amortisation: ca. Invest = 10% der Jahreskosten, ROI = ersparnis/invest
    const invest = jahr * 0.10;
    const amortYears = invest > 0 ? invest / ersparnis : 0;
    setText('[data-out="amort"]', amortYears < 2 ? '< 2 Jahre' : amortYears < 4 ? 'ca. 2–4 J.' : 'ca. 4–6 J.');

    if (donutChart) { donutChart.data.datasets[0].data = [g, 100 - g]; donutChart.update(); }

    [verbrauch, preis, grad].forEach(sl => {
      const pct = ((sl.value - sl.min) / (sl.max - sl.min)) * 100;
      sl.style.background = `linear-gradient(90deg, ${ROT} ${pct}%, rgba(0,0,0,0.12) ${pct}%)`;
    });
  };
  [verbrauch, preis, grad].forEach(sl => sl.addEventListener('input', update));
  update();
}

/* ---------- Leaflet-Projektkarte ---------- */
const PROJECTS = [
  { id: 'hh', stadt: 'Basel', lat: 47.5596, lng: 7.5886, branche: 'Logistik', titel: 'Elektrifizierung Terminalbetrieb', text: 'Umstellung der Umschlaggeräte auf Strom inkl. Lastmanagement und PV-Eigenversorgung.', big: '−34 %', lbl: 'Energiekosten' },
  { id: 'b', stadt: 'Zürich', lat: 47.3769, lng: 8.5417, branche: 'Immobilienportfolio', titel: 'Wärmewende Bestandsgebäude', text: 'Dekarbonisierungsfahrplan für 42 Liegenschaften mit Wärmepumpen-Roadmap.', big: '−41 %', lbl: 'CO₂-Emissionen' },
  { id: 'm', stadt: 'Winterthur', lat: 47.5001, lng: 8.7240, branche: 'Industrie', titel: 'Abwärmenutzung Fertigung', text: 'Wärmerückgewinnung und Prozessoptimierung an drei Produktionslinien.', big: '−28 %', lbl: 'Gasverbrauch' },
  { id: 'k', stadt: 'Visp', lat: 46.2937, lng: 7.8815, branche: 'Chemie', titel: 'PPA & Beschaffungsstrategie', text: 'Strukturierung eines langfristigen Grünstrom-Liefervertrags (PPA) über 12 Jahre.', big: '15 J.', lbl: 'Preissicherheit' },
  { id: 'f', stadt: 'Genf', lat: 46.2044, lng: 6.1432, branche: 'Rechenzentrum', titel: 'Effizienz & Redundanz', text: 'PUE-Optimierung, Lastflexibilisierung und Netzanschluss-Konzept.', big: 'PUE 1,2', lbl: 'erreicht' },
  { id: 's', stadt: 'St. Gallen', lat: 47.4245, lng: 9.3767, branche: 'Maschinenbau', titel: 'Werks-Energiekonzept', text: 'Integriertes Energiemonitoring und Peak-Shaving über alle Werksbereiche.', big: '−22 %', lbl: 'Spitzenlast' },
  { id: 'l', stadt: 'Luzern', lat: 47.0502, lng: 8.3093, branche: 'Kommunal', titel: 'Quartiers-Energiekonzept', text: 'Wärmenetz-Planung und Sektorenkopplung für ein Neubauquartier.', big: '100 %', lbl: 'erneuerbar' },
];

function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('map', { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap, &copy; CARTO', subdomains: 'abcd', maxZoom: 19
  }).addTo(map);

  const icon = L.divIcon({ className: 'ec-marker', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] });
  const markers = {};
  const group = [];

  // nur Projekte einzeichnen, zu denen es eine Karte gibt (sonst alle)
  const cards = Array.from(document.querySelectorAll('.proj-card'));
  const wanted = cards.length ? cards.map(c => c.dataset.proj) : PROJECTS.map(p => p.id);

  PROJECTS.filter(p => wanted.includes(p.id)).forEach(p => {
    const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
    m.bindPopup(
      `<b>${p.titel}</b><span class="pmeta">${p.stadt} · ${p.branche}</span>${p.text}` +
      `<div style="margin-top:8px"><b style="color:#E30613;font-size:1.1rem">${p.big}</b> <span style="color:rgba(255,255,255,0.6);font-size:.8rem">${p.lbl}</span></div>`
    );
    m.on('click', () => highlight(p.id));
    markers[p.id] = m;
    group.push([p.lat, p.lng]);
  });

  if (group.length) map.fitBounds(group, { padding: [50, 50] });

  function highlight(id) {
    document.querySelectorAll('.proj-card').forEach(c => c.classList.toggle('is-active', c.dataset.proj === id));
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.proj;
      const m = markers[id];
      if (m) { map.flyTo(m.getLatLng(), 7, { duration: 0.6 }); m.openPopup(); }
      highlight(id);
    });
  });
}

/* ---------- Kontaktformular (Demo, kein Versand) ---------- */
function initForm() {
  const form = document.querySelector('form.ec');
  if (!form) return;
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (status) {
      status.textContent = 'Vielen Dank — Ihre Anfrage ist eingegangen. Wir melden uns innerhalb von 24 Stunden.';
      status.classList.add('ok');
    }
    form.reset();
  });
}

/* ---------- FAQ: nur eine offen ---------- */
function initFaqSingle() {
  const items = document.querySelectorAll('.faq details');
  if (!items.length) return;
  items.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
  }));
}

/* ════════════════════════════════════════════════════════════════
   PREMIUM LAYER — Custom Cursor · 3D Tilt · Parallax · Back-Top
   ════════════════════════════════════════════════════════════════ */

/* ---------- Custom Cursor: quadratischer Dot + Spring-Ring ---------- */
function initCursor() {
  if (REDUCED || window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -200, my = -200; // Startposition außerhalb des Sichtbereichs
  let rx = -200, ry = -200;
  let hidden = false;

  // Dot folgt Maus sofort
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    if (hidden) {
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
      hidden = false;
    }
  });

  // Ring folgt mit Lerp (Spring-Effekt)
  const lerp = (a, b, t) => a + (b - a) * t;
  (function loop() {
    rx = lerp(rx, mx, 0.18);
    ry = lerp(ry, my, 0.18);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Cursor verlässt Fenster
  document.addEventListener('mouseleave', () => {
    dot.classList.add('is-hidden'); ring.classList.add('is-hidden'); hidden = true;
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('is-hidden'); ring.classList.remove('is-hidden'); hidden = false;
  });

  // Hover-State: Cursor vergrößert sich über interaktiven Elementen
  const interactable = 'a, button, [role="button"], .proj-card, .pillar, input, select, textarea, label, summary, .logos .lg, .bento .cell, .card, .figure, .value, .glass';
  document.querySelectorAll(interactable).forEach(el => {
    // Heller Hintergrund? (Footer, helle Sections) → Cursor bleibt rot statt weiß
    const onLight = !!el.closest('footer.site, .section--light.lht, .section--white:not(.section--img)');
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hover'); ring.classList.add('is-hover');
      dot.classList.toggle('on-light', onLight); ring.classList.toggle('on-light', onLight);
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hover'); ring.classList.remove('is-hover');
      dot.classList.remove('on-light'); ring.classList.remove('on-light');
    });
  });

  // Click-Feedback: Cursor komprimiert
  document.addEventListener('mousedown', () => {
    dot.classList.add('is-click'); ring.classList.add('is-click');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('is-click'); ring.classList.remove('is-click');
  });
}

/* ---------- Parallax: Hero-Foto bewegt sich langsamer beim Scrollen ---------- */
function initParallax() {
  if (REDUCED) return;
  const photo = document.querySelector('.hero__photo');
  if (!photo) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.4) {
      photo.style.transform = `translateY(${y * 0.26}px)`;
    }
  }, { passive: true });
}

/* ---------- 3D Tilt auf Karten ---------- */
function initTilt() { /* deaktiviert – Tilt-Effekt entfernt */ }

/* ---------- Scroll-nach-oben Button ---------- */
function initBackTop() {
  const btn = document.createElement('button');
  btn.className = 'back-top';
  btn.setAttribute('aria-label', 'Nach oben scrollen');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polyline points="18 15 12 9 6 15"/>
  </svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Page-Hero Unterseiten: Clip-Reveal + Text-Animation ---------- */
function initPageHero() {
  const ph = document.querySelector('.page-hero');
  if (!ph) return;

  // H1 in .ph-line > span aufteilen für Clip-Reveal
  const h1 = ph.querySelector('h1');
  if (h1) {
    // Zeilenweise aufteilen (bei kurzen Titeln eine Zeile, sonst zwei)
    const text = h1.textContent.trim();
    // Einfach: ganzen Text in eine Linie
    h1.innerHTML = `<span class="ph-line"><span>${text}</span></span>`;
  }

  // Reveal auslösen
  requestAnimationFrame(() => ph.classList.add('ready'));
  setTimeout(() => ph.classList.add('ready'), 100);
}
