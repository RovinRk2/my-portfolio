import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './hooks.jsx';

/*
 * Hero + scroll story.
 * The top layer is a live API request trace ("what happens behind the screen").
 * On desktop, scrolling peels the stack apart in CSS 3D to show the layers a
 * request moves through: Interface → API → Validation → PostgreSQL.
 * On mobile only the stack is pinned (the copy scrolls normally above it); with
 * reduced motion nothing is pinned — it's a normal section.
 */

const github = 'https://github.com/RovinRk2';

const FLOW = [
  { key: 'ui', no: '01', name: 'Interface', note: 'What your customers see and interact with.' },
  { key: 'api', no: '02', name: 'API', note: 'Where requests become actions.' },
  { key: 'val', no: '03', name: 'Validation', note: 'Keeping invalid data out of the system.' },
  { key: 'db', no: '04', name: 'PostgreSQL', note: 'Where application data stays consistent and reliable.' },
];

const TRACE = [
  { name: 'Request received', detail: 'application/json · 184 B', ms: 3 },
  { name: 'Authentication', detail: 'Authorized', ms: 8 },
  { name: 'Validation', detail: 'Payload valid', ms: 12 },
  { name: 'Business logic', detail: 'Order processed', ms: 41 },
  { name: 'PostgreSQL', detail: 'Saved · 1 row', ms: 23 },
];
const STEP_MS = 650;
const HOLD_MS = 2600;

const clamp = (v) => Math.min(1, Math.max(0, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Top layer: a request moving through a Django backend, step by step. */
function RequestTrace() {
  const rootRef = useRef(null);
  const [step, setStep] = useState(TRACE.length); // TRACE.length = finished

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let visible = true;
    let timer = 0;
    let current = 0;
    setStep(0);
    const tick = () => {
      if (visible) {
        current = current >= TRACE.length ? 0 : current + 1;
        setStep(current);
      }
      timer = setTimeout(tick, current >= TRACE.length ? HOLD_MS : STEP_MS);
    };
    timer = setTimeout(tick, STEP_MS);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (rootRef.current) io.observe(rootRef.current);
    return () => { clearTimeout(timer); io.disconnect(); };
  }, []);

  const done = step >= TRACE.length;
  const elapsed = TRACE.slice(0, step).reduce((t, s) => t + s.ms, 0);

  return (
    <div className="plate plate-trace" ref={rootRef}>
      <div className="tr-head">
        <span className="tr-method">POST</span>
        <span className="tr-path">/api/orders/</span>
        <span className={`tr-status ${done ? 'is-done' : ''}`}>
          <i aria-hidden="true" />
          {done ? '201 Created' : 'Processing'}
        </span>
      </div>

      <ol className="tr-steps">
        {TRACE.map((s, i) => {
          const state = i < step ? 'done' : i === step ? 'active' : 'pending';
          return (
            <li key={s.name} className={state}>
              <span className="tr-dot" aria-hidden="true">{state === 'done' ? '✓' : ''}</span>
              <span className="tr-name">{s.name}</span>
              <span className="tr-detail">{state === 'done' ? s.detail : state === 'active' ? 'running…' : ''}</span>
              <span className="tr-ms">{state === 'done' ? `${s.ms} ms` : ''}</span>
            </li>
          );
        })}
      </ol>

      <div className={`tr-response ${done ? 'is-done' : ''}`}>
        <code>{done ? '{ "id": 1045, "status": "confirmed" }' : 'waiting for response…'}</code>
        <span>{elapsed} ms</span>
      </div>

      <div className="tr-tech">
        <span>Python</span><span>Django</span><span>REST API</span><span>PostgreSQL</span>
      </div>
    </div>
  );
}

function Plate({ layer }) {
  switch (layer) {
    case 'ui':
      return <RequestTrace />;
    case 'api':
      return (
        <div className="plate plate-api">
          <span className="plate-tag">api/views.py</span>
          <p><b>GET</b> /api/products/ <em>200</em></p>
          <p><b className="m-post">POST</b> /api/orders/ <em>201</em></p>
          <p><b>PATCH</b> /api/stock/42/ <em>200</em></p>
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
              ['1043', 'k@mail.co', '1', 'paid'],
              ['1044', 'r@corp.io', '12', 'paid'],
              ['1045', 'a@shop.in', '3', 'confirmed'],
            ].flatMap((r) => r.map((c, j) => <span key={r[0] + j}>{c}</span>))}
          </div>
        </div>
      );
  }
}

export default function LayersIntro() {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(-1);
  // 'pinned' (desktop) | 'mobile' (only the stack is pinned) | 'static' | 'flat' (reduced motion)
  const [mode, setMode] = useState('pinned');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mobile = window.matchMedia('(max-width: 1024px)');
    let raf = 0;
    let lastActive = -2;
    let target = el;

    const update = () => {
      raf = 0;
      const r = target.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp(-r.top / total) : 0;
      el.style.setProperty('--tilt', ease(seg(p, 0.04, 0.38)).toFixed(4));
      el.style.setProperty('--spread', ease(seg(p, 0.18, 0.62)).toFixed(4));
      el.style.setProperty('--reveal', seg(p, 0.55, 0.72).toFixed(4));
      el.style.setProperty('--exit', seg(p, 0.9, 1).toFixed(4));
      const a = p < 0.08 ? -1 : Math.min(3, Math.floor(seg(p, 0.08, 0.7) * 4));
      if (a !== lastActive) setActive((lastActive = a));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    const apply = () => {
      window.removeEventListener('scroll', onScroll);
      ['--tilt', '--spread', '--reveal', '--exit'].forEach((v) => el.style.removeProperty(v));
      if (prefersReducedMotion()) { setMode(mobile.matches ? 'flat' : 'static'); setActive(3); return; }
      target = mobile.matches && trackRef.current ? trackRef.current : el;
      setMode(mobile.matches ? 'mobile' : 'pinned');
      lastActive = -2;
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
    };

    apply();
    mobile.addEventListener('change', apply);
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      mobile.removeEventListener('change', apply);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={ref} id="top" className={`layers-intro is-${mode}`} aria-labelledby="hero-title">
      <div className="li-sticky">
        <div className="li-inner container">
          <div className="li-copy">
            <p className="eyebrow">Rovin · Python backend developer</p>
            <h1 id="hero-title" className="li-title">
              <span>I build what</span>
              <span>happens behind</span>
              <span className="grad">the screen.</span>
            </h1>
            <p className="li-lead">
              Building reliable APIs, integrations and backend systems with Python &amp; Django.
            </p>
            <div className="li-actions">
              <a className="button primary" href="#projects">View projects <span aria-hidden="true">↓</span></a>
              <a className="button ghost" href={github} target="_blank" rel="noreferrer">GitHub <span className="arrow" aria-hidden="true">↗</span></a>
            </div>

            <ol className="li-flow" aria-label="How a request moves through the backend" style={{ '--active': active }}>
              {FLOW.map((l, i) => (
                <li key={l.key} className={`${active >= i ? 'lit' : ''} ${active === i ? 'current' : ''}`}>
                  <span className="li-node" aria-hidden="true" />
                  <span className="li-no">{l.no}</span>
                  <span className="li-text">
                    <b>{l.name}</b>
                    <small>{l.note}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="li-stage-track" ref={trackRef} aria-hidden="true">
            <div className="li-stage-wrap">
              <div className="li-stage">
                <div className="li-shadow" />
                {[...FLOW].reverse().map((l) => {
                  const idx = FLOW.indexOf(l);
                  return (
                    <div
                      key={l.key}
                      className={`li-layer layer-${l.key} ${active >= idx ? 'lit' : ''}`}
                      style={{ '--depth': FLOW.length - 1 - idx }}
                    >
                      <Plate layer={l.key} />
                    </div>
                  );
                })}
                <div className="li-packets"><i /><i /><i /></div>
              </div>
              {/* mobile: the flow list has scrolled away, so name the current layer here */}
              <p className="li-caption">
                {FLOW.map((l, i) => (
                  <span key={l.key} className={active === i || (active < 0 && i === 0) ? 'on' : ''}>
                    <em>{l.no}</em> <b>{l.name}</b> {l.note}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        <a href="#projects" className="li-hint">
          <span>Scroll to look behind</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
