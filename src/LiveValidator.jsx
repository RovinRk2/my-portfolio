import React, { useMemo, useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ email, quantity }) {
  const errors = {};
  if (!email.trim()) errors.email = 'This field is required.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (quantity === '') errors.quantity = 'This field is required.';
  else if (!/^-?\d+$/.test(quantity)) errors.quantity = 'A valid integer is required.';
  else if (Number(quantity) < 1) errors.quantity = 'Ensure this value is greater than or equal to 1.';
  return errors;
}

const PRESETS = [
  { label: 'Valid', email: 'client@shop.in', quantity: '3' },
  { label: 'Bad email', email: 'client@shop', quantity: '3' },
  { label: 'Zero qty', email: 'client@shop.in', quantity: '0' },
];

/** A tiny, runnable imitation of a DRF serializer — type and watch it validate. */
export default function LiveValidator() {
  const [data, setData] = useState(PRESETS[0]);
  const [pulse, setPulse] = useState(0);
  const errors = useMemo(() => validate(data), [data]);
  const ok = Object.keys(errors).length === 0;

  const update = (patch) => {
    setData((d) => ({ ...d, ...patch }));
    setPulse((p) => p + 1);
  };

  return (
    <div className="validator">
      <div className="terminal-bar">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>serializers.py</span>
        <span className="live-pill"><i className="dot-live" aria-hidden="true" /> live</span>
      </div>

      <pre className="terminal-code" aria-hidden="true">
        <code>
          <span className="c-kw">class</span> <span className="c-cls">IncomingData</span>(serializers.Serializer):{'\n'}
          {'    '}email    = serializers.<span className="c-fn">EmailField</span>(){'\n'}
          {'    '}quantity = serializers.<span className="c-fn">IntegerField</span>(min_value=<span className="c-num">1</span>){'\n\n'}
          <span className="c-muted"># Good systems start with good data.</span>
        </code>
      </pre>

      <div className="payload">
        <p className="payload-title">POST /api/orders/ <span>— edit the payload</span></p>
        <label className={errors.email ? 'has-error' : ''}>
          <span>email</span>
          <input
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            spellCheck="false"
            autoComplete="off"
          />
        </label>
        <label className={errors.quantity ? 'has-error' : ''}>
          <span>quantity</span>
          <input
            value={data.quantity}
            onChange={(e) => update({ quantity: e.target.value })}
            inputMode="numeric"
            autoComplete="off"
          />
        </label>
        <div className="presets">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" onClick={() => update({ email: p.email, quantity: p.quantity })}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`flow ${ok ? 'ok' : 'bad'}`} key={pulse} aria-hidden="true">
        <span>Request</span><i />
        <span>Validate</span><i />
        <span>{ok ? 'Store' : 'Reject'}</span>
      </div>

      <div className={`terminal-response ${ok ? 'success' : 'invalid'}`} role="status">
        <span>{ok ? '201 · CREATED' : '400 · BAD REQUEST'}</span>
        <code>
          {ok
            ? `{ "email": "${data.email.trim()}", "quantity": ${Number(data.quantity)} }`
            : Object.entries(errors).map(([k, v]) => `"${k}": ["${v}"]`).join('\n')}
        </code>
      </div>
    </div>
  );
}
