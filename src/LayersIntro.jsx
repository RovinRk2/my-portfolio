import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './hooks.jsx';

/*
 * Opening scroll story: a website "peels apart" in 3D to show the backend
 * layers behind it — Interface → API → Validation → PostgreSQL.
 * Pure CSS 3D driven by one scroll-progress value; no WebGL, no libraries.
 */

const LAYERS = [
  { key: 'ui', no: '01', name: 'Interface', note: 'What your customers see and click.' },
  { key: 'api', no: '02', name: 'API', note: 'Django REST Framework endpoints that move the data.' },
  { key: 'val', no: '03', name: 'Validation', note: 'Rules that stop bad data at the door.' },
  { key: 'db', no: '04', name: 'PostgreSQL', note: 'Where it lands: consistent, indexed, safe.' },
];

const clamp = (v) => Math.min(1, Math.max(0, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Layer 01: a live ride tracker — Kanyakumari → Munnar. */
const ROUTE = 'M104 162 C 98 152, 92 146, 96 138 S 118 118, 124 106 S 146 74, 150 58 S 118 34, 96 34 S 64 30, 52 24';
const TOTAL_KM = 392;
const STOPS = [
  { name: 'Kanyakumari', km: 0 },
  { name: 'Tirunelveli', km: 85 },
  { name: 'Madurai', km: 245 },
  { name: 'Munnar', km: 392 },
];
const LOOP_MS = 14000;

function RideTracker() {
  const pathRef = useRef(null);
  const doneRef = useRef(null);
  const bikeRef = useRef(null);
  const rootRef = useRef(null);
  const [km, setKm] = useState(163);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const place = (t) => {
      const pt = path.getPointAtLength(len * t);
      bikeRef.current?.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      if (doneRef.current) doneRef.current.style.strokeDashoffset = String(len * (1 - t));
    };
    if (doneRef.current) doneRef.current.style.strokeDasharray = String(len);

    if (prefersReducedMotion()) {
      const t = 163 / TOTAL_KM;
      place(t);
      return;
    }

    let raf = 0;
    let visible = true;
    let lastKm = -1;
    const start = performance.now() - LOOP_MS * 0.35;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = ((now - start) % LOOP_MS) / LOOP_MS;
      const eased = t < 0.92 ? t / 0.92 : 1; // brief pause on arrival
      place(eased);
      const k = Math.round(eased * TOTAL_KM);
      if (k !== lastKm) setKm((lastKm = k));
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (rootRef.current) io.observe(rootRef.current);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const toGo = TOTAL_KM - km;
  const next = STOPS.find((s) => s.km > km) || STOPS[STOPS.length - 1];
  const arrived = toGo === 0;
  const mins = Math.round((km / 52) * 60);
  const speed = arrived ? 0 : 48 + Math.round(14 * Math.abs(Math.sin(km / 23)));

  return (
    <div className="plate plate-ui" ref={rootRef}>
      <div className="rt-top">
        <span className="rt-logo"><i>↗</i>ride.log</span>
        <span className="rt-live"><i /> {arrived ? 'ARRIVED' : 'LIVE'}</span>
        <span className="rt-avatar">RK</span>
      </div>

      <div className="rt-body">
        <div className="rt-map">
          <svg viewBox="0 0 200 170" preserveAspectRatio="xMidYMid slice">
            <g className="rt-contours">
              <path d="M-10 40 C40 18 70 52 120 30 S200 18 220 8" />
              <path d="M-10 64 C30 44 80 78 130 56 S200 42 220 36" />
              <path d="M-10 92 C40 74 100 112 150 88 S205 76 220 72" />
              <path d="M-10 120 C50 102 110 142 160 118 S205 108 220 104" />
            </g>
            <path className="rt-hills" d="M20 40 q14 -26 30 -6 q10 -14 22 2 q-26 18 -52 4z" />
            <path className="rt-sea" d="M0 170 V150 Q40 140 80 162 Q100 172 120 162 Q160 142 200 150 V170 Z" />
            <path ref={pathRef} className="rt-route-bg" d={ROUTE} />
            <path className="rt-route-left" d={ROUTE} />
            <path ref={doneRef} className="rt-route-done" d={ROUTE} />
            <circle cx="104" cy="162" r="4" className="rt-stop" />
            <circle cx="124" cy="106" r="3" className="rt-stop" />
            <circle cx="150" cy="58" r="3" className="rt-stop" />
            <g className="rt-dest">
              <circle cx="52" cy="24" r="10" className="rt-ring" />
              <circle cx="52" cy="24" r="4.5" />
            </g>
            <text x="112" y="158" className="rt-label">Kanyakumari</text>
            <text x="131" y="108" className="rt-label">Tirunelveli</text>
            <text x="143" y="52" className="rt-label" textAnchor="end">Madurai</text>
            <text x="30" y="14" className="rt-label">Munnar</text>
            <g ref={bikeRef} className="rt-bike">
              <circle r="11" className="rt-bike-glow" />
              <circle r="5" className="rt-bike-dot" />
            </g>
          </svg>
          <span className="rt-chip">🏍 {speed} km/h</span>
        </div>

        <div className="rt-card">
          <span className="rt-eyebrow">{arrived ? 'MADE IT · 1,532 m UP' : 'ON THE ROAD · NH44'}</span>
          <strong className="rt-title">Kanyakumari → Munnar</strong>
          <div className="rt-big-row">
            <span className="rt-big">{toGo}</span>
            <small>km to go</small>
          </div>
          <ol className="rt-steps">
            {STOPS.map((s, i) => {
              const prev = STOPS[i - 1]?.km ?? 0;
              const fill = i === 0 ? 1 : Math.min(1, Math.max(0, (km - prev) / (s.km - prev)));
              return (
                <li key={s.name} className={km >= s.km ? 'done' : fill > 0 ? 'now' : ''} style={{ '--f': fill }}>
                  {i === 0 ? 'Start' : s.name}
                </li>
              );
            })}
          </ol>
          <div className="rt-stats">
            <p><span>Riding for</span><b>{Math.floor(mins / 60)}h {String(mins % 60).padStart(2, '0')}m</b></p>
            <p><span>Next stop</span><b>{arrived ? 'Chai, finally' : `${next.name} · ${next.km - km} km`}</b></p>
            <p><span>Covered</span><b>{km} / {TOTAL_KM} km</b></p>
          </div>
          <span className="rt-btn">Share ride ↗</span>
        </div>
      </div>
    </div>
  );
}

function Plate({ layer }) {
  switch (layer.key) {
    case 'ui':
      return <RideTracker />;
    case 'api':
      return (
        <div className="plate plate-api">
          <span className="plate-tag">api/views.py</span>
          <p><b className="m-get">GET</b> /api/products/ <em>200</em></p>
          <p><b className="m-post">POST</b> /api/orders/ <em>201</em></p>
          <p><b className="m-patch">PATCH</b> /api/stock/42/ <em>200</em></p>
          <p><b className="m-post">POST</b> /webhooks/shopify/ <em>202</em></p>
        </div>
      );
    case 'val':
      return (
        <div className="plate plate-val">
          <span className="plate-tag">serializers.py</span>
          <p className="ok">✓ email is valid</p>
          <p className="ok">✓ quantity ≥ 1</p>
          <p className="ok">✓ sku exists</p>
          <p className="bad">✕ price missing → 400</p>
        </div>
      );
    default:
      return (
        <div className="plate plate-db">
          <span className="plate-tag">postgres · orders</span>
          <div className="db-grid">
            {['id', 'email', 'qty', 'status'].map((h) => <b key={h}>{h}</b>)}
            {[
              ['1042', 'a@shop.in', '3', 'paid'],
              ['1043', 'k@mail.co', '1', 'paid'],
              ['1044', 'r@corp.io', '12', 'sync'],
            ].flatMap((r) => r.map((c, j) => <span key={r[0] + j}>{c}</span>))}
          </div>
        </div>
      );
  }
}

export default function LayersIntro() {
  const ref = useRef(null);
  const [phase, setPhase] = useState(0); // 0 = surface, 1 = behind
  const [active, setActive] = useState(-1);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setStaticMode(true);
      setPhase(1);
      setActive(4);
      return;
    }

    let raf = 0;
    let lastPhase = -1;
    let lastActive = -2;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp(-r.top / total) : 0;

      const tilt = ease(seg(p, 0.04, 0.38));
      const spread = ease(seg(p, 0.18, 0.62));
      const reveal = seg(p, 0.55, 0.72);
      const exit = seg(p, 0.9, 1);
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--tilt', tilt.toFixed(4));
      el.style.setProperty('--spread', spread.toFixed(4));
      el.style.setProperty('--reveal', reveal.toFixed(4));
      el.style.setProperty('--exit', exit.toFixed(4));

      const ph = p > 0.3 ? 1 : 0;
      if (ph !== lastPhase) setPhase((lastPhase = ph));
      const a = p < 0.42 ? -1 : Math.min(4, Math.floor(seg(p, 0.42, 0.86) * 5));
      if (a !== lastActive) setActive((lastActive = a));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={ref} id="top" className={`layers-intro ${staticMode ? 'is-static' : ''}`} aria-label="Introduction">
      <div className="li-sticky">
        <div className="li-inner container">
        <div className="li-copy">
          <p className="eyebrow">Rovin · Python backend developer</p>
          <h2 className="li-title" aria-live="polite">
            <span className={phase === 0 ? 'on' : ''}>This is what<br />people see.</span>
            <span className={phase === 1 ? 'on' : ''}>This is what<br /><em className="grad">I build.</em></span>
          </h2>
          <ol className="li-list">
            {LAYERS.map((l, i) => (
              <li key={l.key} className={active >= i ? (active === i ? 'lit current' : 'lit') : ''}>
                <span className="li-no">{l.no}</span>
                <span>
                  <b>{l.name}</b>
                  <small>{l.note}</small>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="li-stage-wrap" aria-hidden="true">
          <div className="li-stage">
            <div className="li-shadow" />
            {[...LAYERS].reverse().map((l) => {
              const depth = LAYERS.length - 1 - LAYERS.indexOf(l); // ui = 3 (top) … db = 0
              const idx = LAYERS.indexOf(l);
              return (
                <div
                  key={l.key}
                  className={`li-layer layer-${l.key} ${active >= idx ? 'lit' : ''}`}
                  style={{ '--depth': depth }}
                >
                  <Plate layer={l} />
                </div>
              );
            })}
            <div className="li-packets">
              <i /><i /><i />
            </div>
          </div>
        </div>
        </div>

        <a href="#hero" className="li-hint">
          <span>Scroll to look behind</span>
          <i />
        </a>
      </div>
    </section>
  );
}
