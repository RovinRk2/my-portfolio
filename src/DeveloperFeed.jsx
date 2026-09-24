import React, { Component, useCallback, useEffect, useRef, useState } from 'react';

/*
 * Developer Feed
 * Live stories from Hacker News via the public Algolia HN Search API.
 * No key, CORS-enabled, safe to call from the browser.
 * Docs: https://hn.algolia.com/api
 */

const API = 'https://hn.algolia.com/api/v1/search';
const TOPICS = [
  { tag: 'Python', query: 'python' },
  { tag: 'Django', query: 'django' },
  { tag: 'Backend', query: 'backend' },
  { tag: 'REST APIs', query: 'api' },
  { tag: 'PostgreSQL', query: 'postgres' },
  { tag: 'AI', query: 'llm' },
  { tag: 'Open Source', query: 'open source' },
  { tag: 'System Design', query: 'distributed systems' },
];
const MAX_ITEMS = 4;
const WINDOW_DAYS = 21;
const MIN_POINTS = 15;
const CACHE_KEY = 'dev-feed-v1';
const CACHE_MS = 10 * 60 * 1000;
const TIMEOUT_MS = 8000;

/* ---------- data ---------- */

async function fetchTopic({ tag, query }, signal) {
  const since = Math.floor(Date.now() / 1000) - WINDOW_DAYS * 86400;
  const params = new URLSearchParams({
    query,
    tags: 'story',
    numericFilters: `created_at_i>${since},points>${MIN_POINTS}`,
    hitsPerPage: '8',
  });
  const res = await fetch(`${API}?${params}`, { signal });
  if (!res.ok) throw new Error(`HN ${res.status}`);
  const data = await res.json();
  return (data.hits || [])
    .filter((h) => h.title && h.objectID)
    .map((h) => toItem(h, tag));
}

function toItem(hit, tag) {
  const discussion = `https://news.ycombinator.com/item?id=${hit.objectID}`;
  const url = hit.url || discussion;
  let source = 'news.ycombinator.com';
  try {
    source = new URL(url).hostname.replace(/^www\./, '');
  } catch { /* keep default */ }
  const created = hit.created_at_i ? hit.created_at_i * 1000 : Date.parse(hit.created_at);
  return {
    id: hit.objectID,
    title: hit.title,
    url,
    discussion,
    source,
    tag,
    points: hit.points || 0,
    comments: hit.num_comments || 0,
    created: Number.isFinite(created) ? created : null,
  };
}

/** HN-style ranking: popular but still fresh. */
const score = (item) => {
  const hours = item.created ? (Date.now() - item.created) / 36e5 : 72;
  return item.points / Math.pow(hours + 2, 0.8);
};

/** Pick the best story per topic first, then fill with the next-best overall. */
function curate(lists) {
  const seen = new Set();
  const perTopic = lists.map((list) => list.sort((a, b) => score(b) - score(a)));
  const picked = [];
  const take = (item) => {
    if (!item || seen.has(item.id) || picked.length >= MAX_ITEMS) return;
    seen.add(item.id);
    picked.push(item);
  };
  perTopic
    .map((list) => list.find((i) => !seen.has(i.id)))
    .filter(Boolean)
    .sort((a, b) => score(b) - score(a))
    .forEach(take);
  perTopic.flat().sort((a, b) => score(b) - score(a)).forEach(take);
  return picked.sort((a, b) => score(b) - score(a));
}

async function loadFeed() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const results = await Promise.allSettled(TOPICS.map((t) => fetchTopic(t, controller.signal)));
    const ok = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
    if (ok.length === 0) throw new Error('All sources failed');
    return curate(ok);
  } finally {
    clearTimeout(timer);
  }
}

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    return Date.now() - c.at < CACHE_MS && Array.isArray(c.items) ? c : null;
  } catch {
    return null;
  }
};
const writeCache = (items, at) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ items, at }));
  } catch { /* storage unavailable – fine */ }
};

/* ---------- formatting ---------- */

function timeAgo(ms) {
  if (!ms) return '';
  const s = Math.max(1, Math.round((Date.now() - ms) / 1000));
  const units = [['y', 31536000], ['mo', 2592000], ['d', 86400], ['h', 3600], ['m', 60]];
  for (const [u, n] of units) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return 'just now';
}
const fullDate = (ms) =>
  ms ? new Date(ms).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';

/* ---------- UI ---------- */

function FeedCard({ item, i }) {
  return (
    <article className="feed-card spotlight" style={{ '--i': i }}>
      <div className="feed-meta">
        <span className="feed-tag">{item.tag}</span>
        {item.created && (
          <time dateTime={new Date(item.created).toISOString()} title={fullDate(item.created)}>
            {timeAgo(item.created)}
          </time>
        )}
      </div>
      <h3>
        <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
      </h3>
      <p className="feed-source">
        <span className="feed-favicon" aria-hidden="true">{item.source[0]}</span>
        {item.source}
      </p>
      <div className="feed-foot">
        <a className="feed-read" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Read article: ${item.title}`}>
          Read article <span className="arrow" aria-hidden="true">↗</span>
        </a>
        <a className="feed-stats" href={item.discussion} target="_blank" rel="noopener noreferrer" aria-label={`${item.points} points, ${item.comments} comments on Hacker News`}>
          ▲ {item.points} · {item.comments} comments
        </a>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="feed-card is-skeleton" aria-hidden="true">
      <span className="sk sk-tag" />
      <span className="sk sk-line" />
      <span className="sk sk-line short" />
      <span className="sk sk-source" />
    </div>
  );
}

function FeedMessage({ icon, title, text, onRetry }) {
  return (
    <div className="feed-message" role="status">
      <span className="feed-message-icon" aria-hidden="true">{icon}</span>
      <p><b>{title}</b>{text}</p>
      {onRetry && <button className="pill-link" onClick={onRetry}>Try again</button>}
    </div>
  );
}

function Feed() {
  const [state, setState] = useState({ status: 'loading', items: [], at: null });
  const [, tick] = useState(0);
  const busy = useRef(false);

  const load = useCallback(async (force = false) => {
    if (busy.current) return;
    const cached = !force && readCache();
    if (cached) {
      setState({ status: 'ready', items: cached.items, at: cached.at });
      return;
    }
    busy.current = true;
    setState((s) => ({ ...s, status: s.items.length ? 'refreshing' : 'loading' }));
    try {
      const items = await loadFeed();
      const at = Date.now();
      writeCache(items, at);
      setState({ status: 'ready', items, at });
    } catch {
      // keep any stories we already have; only show the error if there's nothing to show
      setState((s) => (s.items.length ? { ...s, status: 'stale' } : { status: 'error', items: [], at: null }));
    } finally {
      busy.current = false;
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(() => tick((n) => n + 1), 60000); // keep "x min ago" fresh
    return () => clearInterval(t);
  }, [load]);

  const { status, items, at } = state;
  const spinning = status === 'loading' || status === 'refreshing';

  return (
    <section className="section container feed" id="feed" aria-busy={spinning}>
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Developer feed</p>
          <h2>Trending in backend.<br /><span>Live from the dev world.</span></h2>
        </div>
        <div className="feed-controls">
          <p>Trending stories on Python, Django, APIs, databases, AI and system design, pulled live from Hacker News.</p>
          <div className="feed-refresh">
            <span className="feed-updated" aria-live="polite">
              {status === 'stale' ? 'Couldn’t refresh, showing earlier results' : at ? `Updated ${timeAgo(at)}` : ''}
            </span>
            <button className={`round-btn ${spinning ? 'spinning' : ''}`} onClick={() => load(true)} disabled={spinning} aria-label="Refresh developer feed">
              <span aria-hidden="true">↻</span>
            </button>
          </div>
        </div>
      </div>

      {status === 'loading' && (
        <div className="feed-grid">{Array.from({ length: MAX_ITEMS }, (_, i) => <Skeleton key={i} />)}</div>
      )}
      {status === 'error' && (
        <FeedMessage icon="⚠" title="The feed is taking a break. " text="Hacker News couldn’t be reached right now. The rest of the site works as normal." onRetry={() => load(true)} />
      )}
      {(status === 'ready' || status === 'refreshing' || status === 'stale') && items.length === 0 && (
        <FeedMessage icon="∅" title="Nothing trending right now. " text="Check back soon, or refresh to try again." onRetry={() => load(true)} />
      )}
      {items.length > 0 && status !== 'loading' && status !== 'error' && (
        <div className={`feed-grid ${status === 'refreshing' ? 'is-refreshing' : ''}`}>
          {items.map((item, i) => <FeedCard key={item.id} item={item} i={i} />)}
        </div>
      )}

      <p className="feed-credit">
        Source: <a className="link-underline" href="https://news.ycombinator.com" target="_blank" rel="noopener noreferrer">Hacker News</a>. Titles and links belong to their original publishers.
      </p>
    </section>
  );
}

/** Contains any unexpected render error so it can never take down the page. */
class FeedBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export default function DeveloperFeed() {
  return (
    <FeedBoundary>
      <Feed />
    </FeedBoundary>
  );
}
