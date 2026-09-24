import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './hooks.jsx';

const SKIN = '#c68b62';
const HAIR = '#1f1a17';
const SHIRT = '#2a3954';
const PANTS = '#23262d';

const MODES = [
  { id: 'code', label: 'Code', time: '09:30', line: 'shipping APIs → git push origin main' },
  { id: 'gym', label: 'Gym', time: '18:30', line: 'progressive overload — same idea as scaling' },
  { id: 'coffee', label: 'Coffee', time: '21:00', line: 'refuel.  then loop again ↻' },
];
const DURATION = 4800;

/** Front-facing head (used in gym + coffee scenes). */
function FrontHead({ cx, cy }) {
  return (
    <g>
      <rect x={cx - 7} y={cy + 14} width="14" height="16" rx="4" fill={SKIN} />
      <circle cx={cx - 21} cy={cy + 2} r="5" fill={SKIN} />
      <circle cx={cx + 21} cy={cy + 2} r="5" fill={SKIN} />
      <circle cx={cx} cy={cy} r="21" fill={SKIN} />
      <path
        d={`M${cx - 22} ${cy} Q${cx - 26} ${cy - 30} ${cx} ${cy - 28} Q${cx + 27} ${cy - 30} ${cx + 22} ${cy} Q${cx + 20} ${cy - 13} ${cx + 8} ${cy - 15} Q${cx - 8} ${cy - 9} ${cx - 22} ${cy} Z`}
        fill={HAIR}
      />
      <path
        d={`M${cx - 20} ${cy + 1} Q${cx - 19} ${cy + 25} ${cx} ${cy + 27} Q${cx + 19} ${cy + 25} ${cx + 20} ${cy + 1} Q${cx + 15} ${cy + 12} ${cx} ${cy + 11} Q${cx - 15} ${cy + 12} ${cx - 20} ${cy + 1} Z`}
        fill={HAIR}
      />
      <ellipse cx={cx} cy={cy + 16} rx="5" ry="2" fill="#8e5a3e" />
      <g className="blink">
        <circle cx={cx - 8} cy={cy - 2} r="2.3" fill={HAIR} />
        <circle cx={cx + 8} cy={cy - 2} r="2.3" fill={HAIR} />
      </g>
      <path d={`M${cx - 12} ${cy - 8} l7 -1 M${cx + 5} ${cy - 9} l7 1`} stroke={HAIR} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function FrontBody({ cx, top }) {
  return (
    <g>
      <rect x={cx - 17} y={top + 64} width="15" height="66" rx="6" fill={PANTS} />
      <rect x={cx + 2} y={top + 64} width="15" height="66" rx="6" fill={PANTS} />
      <rect x={cx - 22} y={top + 124} width="22" height="9" rx="4" fill="#111" />
      <rect x={cx} y={top + 124} width="22" height="9" rx="4" fill="#111" />
      <path d={`M${cx - 27} ${top + 8} Q${cx} ${top - 2} ${cx + 27} ${top + 8} L${cx + 24} ${top + 72} L${cx - 24} ${top + 72} Z`} fill={SHIRT} />
      <path d={`M${cx - 7} ${top + 1} L${cx} ${top + 12} L${cx + 7} ${top + 1}`} fill="none" stroke="#1b2538" strokeWidth="3" />
      <rect x={cx - 24} y={top + 62} width="48" height="6" rx="2" fill="#15171b" />
    </g>
  );
}

function CodeScene() {
  return (
    <g className="scene scene-code">
      {/* window */}
      <rect x="40" y="34" width="92" height="70" rx="6" className="svg-window" />
      <path d="M86 34v70M40 69h92" className="svg-window-frame" />
      <circle cx="112" cy="54" r="9" className="svg-moon" />
      {/* floating glyphs */}
      <text x="250" y="70" className="glyph g1">{'{ }'}</text>
      <text x="318" y="60" className="glyph g2">{'</>'}</text>
      <text x="200" y="84" className="glyph g3">200</text>
      {/* chair */}
      <rect x="92" y="138" width="8" height="72" rx="3" fill="#3a3129" />
      <rect x="96" y="203" width="64" height="8" rx="3" fill="#4a3d31" />
      <rect x="125" y="211" width="6" height="48" fill="#3a3129" />
      <rect x="108" y="256" width="40" height="5" rx="2" fill="#3a3129" />
      {/* legs */}
      <rect x="120" y="188" width="62" height="17" rx="8" fill={PANTS} />
      <rect x="166" y="190" width="16" height="66" rx="7" fill={PANTS} />
      <rect x="163" y="252" width="31" height="9" rx="4" fill="#111" />
      {/* torso */}
      <rect x="108" y="132" width="38" height="68" rx="16" fill={SHIRT} />
      {/* head (side) */}
      <rect x="121" y="120" width="14" height="16" rx="4" fill={SKIN} />
      <circle cx="130" cy="110" r="21" fill={SKIN} />
      <path d="M108 112 Q103 84 130 85 Q153 86 152 104 Q141 95 130 99 Q119 103 118 120 Z" fill={HAIR} />
      <path d="M131 116 Q151 113 151 121 Q149 136 133 136 Q121 134 120 124 Z" fill={HAIR} />
      <circle cx="123" cy="113" r="5" fill="#b87c55" />
      <circle cx="152" cy="109" r="3" fill={SKIN} />
      <circle cx="143" cy="106" r="2.2" fill={HAIR} className="blink" />
      {/* desk */}
      <rect x="180" y="182" width="192" height="8" rx="2" fill="#6d4c31" />
      <rect x="190" y="190" width="6" height="70" fill="#56402c" />
      <rect x="355" y="190" width="6" height="70" fill="#56402c" />
      {/* monitor */}
      <rect x="284" y="160" width="9" height="16" fill="#2c2c31" />
      <rect x="268" y="176" width="42" height="6" rx="2" fill="#2c2c31" />
      <rect x="228" y="92" width="112" height="72" rx="7" fill="#15191f" stroke="#4d4033" strokeWidth="2" />
      <g className="code-lines">
        <rect x="239" y="104" width="44" height="5" rx="2" fill="#cbb2ef" />
        <rect x="246" y="116" width="70" height="5" rx="2" fill="#eac18e" />
        <rect x="246" y="128" width="52" height="5" rx="2" fill="#8fb8c9" />
        <rect x="239" y="140" width="62" height="5" rx="2" fill="#9fd6a8" />
        <rect x="239" y="152" width="30" height="5" rx="2" fill="#6b7682" />
      </g>
      {/* keyboard + mug */}
      <rect x="198" y="177" width="52" height="5" rx="2" fill="#3b3b41" />
      <rect x="348" y="164" width="15" height="18" rx="3" fill="#e9dccb" />
      <path d="M363 168 q7 0 7 6 t-7 6" fill="none" stroke="#e9dccb" strokeWidth="3" />
      <path className="steam s1" d="M352 158 q-4 -6 0 -12 t0 -12" />
      <path className="steam s2" d="M359 158 q-4 -6 0 -12 t0 -12" />
      {/* arm: upper arm + typing forearm */}
      <path d="M134 148 L156 177" stroke={SHIRT} strokeWidth="14" strokeLinecap="round" />
      <g className="typing">
        <path d="M156 177 L199 175" stroke={SHIRT} strokeWidth="12" strokeLinecap="round" />
        <path d="M188 175 L201 175" stroke={SKIN} strokeWidth="10" strokeLinecap="round" />
      </g>
    </g>
  );
}

function GymScene({ reps }) {
  return (
    <g className="scene scene-gym">
      {/* rack + mirror */}
      <rect x="36" y="40" width="80" height="120" rx="6" className="svg-window" />
      <path d="M52 56 l18 -10 M60 80 l36 -22" className="svg-shine" />
      <rect x="300" y="170" width="70" height="6" rx="2" fill="#3a3129" />
      <rect x="306" y="176" width="5" height="84" fill="#3a3129" />
      <rect x="359" y="176" width="5" height="84" fill="#3a3129" />
      {[312, 332, 350].map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y={157 - i * 2} width="4" height={13 + i * 2} rx="2" fill="#6b6b73" />
          <rect x={x - 7} y={163} width="14" height="4" rx="2" fill="#8a8a92" />
        </g>
      ))}
      <text x="306" y="146" className="rep-label">REPS</text>
      <text x="344" y="146" className="rep-count">{String(reps).padStart(2, '0')}</text>
      {/* arms (scale with the press) */}
      <rect className="press-arm" x="154" y="58" width="12" height="92" rx="6" fill={SHIRT} />
      <rect className="press-arm" x="234" y="58" width="12" height="92" rx="6" fill={SHIRT} />
      <FrontBody cx={200} top={128} />
      <FrontHead cx={200} cy={100} />
      <path className="sweat" d="M228 86 q4 6 0 9 q-4 -3 0 -9 z" />
      {/* barbell */}
      <g className="barbell">
        <rect x="104" y="126" width="192" height="5" rx="2" fill="#9a9aa3" />
        <rect x="106" y="110" width="12" height="37" rx="2" fill="#e4a960" />
        <rect x="119" y="115" width="7" height="27" rx="2" fill="#b77641" />
        <rect x="282" y="110" width="12" height="37" rx="2" fill="#e4a960" />
        <rect x="274" y="115" width="7" height="27" rx="2" fill="#b77641" />
        <circle cx="160" cy="129" r="7" fill={SKIN} />
        <circle cx="240" cy="129" r="7" fill={SKIN} />
      </g>
    </g>
  );
}

function CoffeeScene() {
  return (
    <g className="scene scene-coffee">
      {/* window with sunset */}
      <rect x="248" y="38" width="112" height="92" rx="6" className="svg-window" />
      <circle cx="304" cy="100" r="18" className="svg-sun" />
      <path d="M248 110 q28 -14 56 -2 t56 -4 v26 h-112 z" className="svg-hill" />
      <path d="M304 38v92M248 84h112" className="svg-window-frame" />
      {/* plant */}
      <rect x="54" y="226" width="30" height="34" rx="4" fill="#6d4c31" />
      <path d="M69 226 q-18 -30 -10 -52 M69 226 q2 -34 14 -50 M69 226 q-6 -22 -24 -30" stroke="#6f9a6a" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* resting left arm */}
      <rect x="162" y="140" width="12" height="58" rx="6" fill={SHIRT} transform="rotate(3 168 142)" />
      <circle cx="165" cy="200" r="6.5" fill={SKIN} />
      <FrontBody cx={200} top={128} />
      <FrontHead cx={200} cy={100} />
      {/* sipping right arm */}
      <g className="sip-arm">
        <rect className="sip-limb" x="225" y="140" width="12" height="54" rx="6" fill={SHIRT} />
        <g className="sip-mug">
          <circle cx="231" cy="196" r="6.5" fill={SKIN} />
          <rect x="222" y="186" width="19" height="21" rx="3" fill="#e9dccb" />
          <rect x="222" y="190" width="19" height="4" fill="#b77641" />
          <path d="M241 190 q8 0 8 7 t-8 7" fill="none" stroke="#e9dccb" strokeWidth="3" />
          <path className="steam s1" d="M227 181 q-4 -6 0 -12 t0 -12" />
          <path className="steam s2" d="M235 181 q-4 -6 0 -12 t0 -12" />
        </g>
      </g>
    </g>
  );
}

export default function DailyLoop() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loops, setLoops] = useState(1);
  const [reps, setReps] = useState(1);
  const [cycleKey, setCycleKey] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  // Auto-advance through code → gym → coffee → repeat
  useEffect(() => {
    if (paused || reduced.current) return;
    const t = setTimeout(() => {
      setIndex((i) => {
        const next = (i + 1) % MODES.length;
        if (next === 0) setLoops((l) => l + 1);
        return next;
      });
      setCycleKey((k) => k + 1);
    }, DURATION);
    return () => clearTimeout(t);
  }, [index, paused, cycleKey]);

  // Rep counter while lifting
  useEffect(() => {
    if (MODES[index].id !== 'gym') return;
    setReps(1);
    const t = setInterval(() => setReps((r) => (r % 12) + 1), 1600);
    return () => clearInterval(t);
  }, [index]);

  const mode = MODES[index];
  const select = (i) => {
    setIndex(i);
    setCycleKey((k) => k + 1);
  };

  return (
    <div
      className={`loop-card tilt ${paused ? 'is-paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="loop-glare" aria-hidden="true" />
      <div className="loop-head">
        <span className="loop-file">
          <i className="dot-live" aria-hidden="true" /> rovin.daily_loop()
        </span>
        <span className="loop-count">loop #{String(loops).padStart(3, '0')}</span>
      </div>

      <svg
        className={`loop-svg mode-${mode.id}`}
        viewBox="0 0 400 270"
        role="img"
        aria-label={`Illustration: Rovin at ${mode.label.toLowerCase()}`}
      >
        <rect x="0" y="260" width="400" height="10" className="svg-floor" />
        <CodeScene />
        <GymScene reps={reps} />
        <CoffeeScene />
      </svg>

      <div className="loop-tabs" role="tablist" aria-label="Daily loop">
        {MODES.map((m, i) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={i === index}
            className={i === index ? 'active' : i < index ? 'done' : ''}
            onClick={() => select(i)}
          >
            <span className="tab-bar">
              <span
                key={i === index ? cycleKey : 'idle'}
                className="tab-fill"
                style={{ animationDuration: `${DURATION}ms` }}
              />
            </span>
            <span className="tab-label">
              <small>{m.time}</small> {m.label}
            </span>
          </button>
        ))}
        <span className="tab-repeat" aria-hidden="true">↻ Repeat</span>
      </div>

      <p className="loop-line" aria-live="polite">
        <span className="prompt">$</span> {mode.line}
        <span className="caret" aria-hidden="true" />
      </p>
    </div>
  );
}
