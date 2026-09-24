import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import DailyLoop from './DailyLoop.jsx';
import LiveValidator from './LiveValidator.jsx';
import DeveloperFeed from './DeveloperFeed.jsx';
import LayersIntro from './LayersIntro.jsx';
import {
  Cursor,
  useActiveSection,
  usePointerEffects,
  useReveal,
  useScrollProgress,
  useSmoothScroll,
  prefersReducedMotion,
} from './hooks.jsx';

const email = 'rovinrk12@gmail.com';
const github = 'https://github.com/RovinRk2';
const linkedin = 'https://www.linkedin.com/in/rovin-rk-672092414/';
const instagram = 'https://www.instagram.com/do_pa_mine_/';
const whatsapp = `https://wa.me/919345409964?text=${encodeURIComponent('Hi Rovin, I’d like to discuss a project.')}`;
const mailto = `mailto:${email}?subject=${encodeURIComponent('Let’s build something')}`;

const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'feed', label: 'Dev Feed' },
  { id: 'about', label: 'About' },
];
const NAV_IDS = [...NAV.map((n) => n.id), 'contact'];

const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>;

const Icon = {
  web: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></svg>
  ),
  app: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><path d="M17.25 14v6.5M14 17.25h6.5" /></svg>
  ),
  api: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="5" r="2.5" /><circle cx="19" cy="19" r="2.5" /><path d="M7.3 11l9.4-4.8M7.3 13l9.4 4.8" /></svg>
  ),
};

const services = [
  ['01', 'Business websites', 'A standout home for your business. Fast, responsive websites that turn visitors into enquiries.', 'Landing pages · Company websites · Portfolios', Icon.web],
  ['02', 'Custom web applications', 'Your business has its own way of working. Get a platform built around your requirements.', 'Dashboards · Customer portals · Internal tools', Icon.app],
  ['03', 'Backend & integrations', 'Reliable systems behind a great experience. Connect your tools and keep your operations moving.', 'Django · REST APIs · E-commerce integrations', Icon.api],
];

const skillGroups = [
  ['Backend', 'Python • Django • Django REST Framework • REST APIs • OAuth • Webhooks'],
  ['Frontend', 'HTML5 • CSS3 • Bootstrap • JavaScript'],
  ['Database', 'PostgreSQL • SQL • Django ORM'],
  ['Tools & Development', 'Git • GitHub • Postman • Docker • Linux • Ruff'],
  ['Core Expertise', 'API Integration • Data Validation • Data Synchronization • Third-Party Integrations • Authentication & Authorization • Debugging • Error Handling • Unit & Regression Testing'],
];

const marquee = ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'Webhooks', 'OAuth', 'Git', 'Linux', 'Postman'];

const steps = [
  ['01', 'Discover', 'We talk through your business, your audience and what you need your website to do.'],
  ['02', 'Design & build', 'I bring the direction to life, sharing progress and refining the details with you.'],
  ['03', 'Launch & support', 'We test, polish and launch, with a clear handover and support options for what’s next.'],
];

const projects = [
  {
    id: 'quicksync',
    name: 'QuickSync',
    kind: 'E-commerce integration platform',
    tone: 'amber',
    cta: 'Explore my contributions',
    body: 'Professional backend work connecting Shopify, Amazon, Etsy, WooCommerce and Wix. Developed REST APIs, product synchronization, third-party webhooks, optimized database queries and asynchronous processing with Redis queues.',
    tags: ['Python', 'Django', 'PostgreSQL', 'Redis'],
  },
  {
    id: 'rivon',
    name: 'Rivon HRM',
    kind: 'People & organization management',
    tone: 'sage',
    cta: 'Explore the project',
    body: 'A personal, API-first HR platform for employee management, authentication, role-based access and leave approvals. Built with Django REST Framework, PostgreSQL, Redis and Docker.',
    tags: ['DRF', 'Docker', 'REST APIs', 'PostgreSQL'],
  },
];

/* ------------------------------------------------------------------ */

function RotatingWord({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="rotator" aria-live="polite">
      <span key={i} className="rotator-word">{words[i]}</span>
    </span>
  );
}

function Nav() {
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const active = useActiveSection(NAV_IDS);
  const progress = useScrollProgress();
  const lastY = useRef(0);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenu(false);
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 300 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header className={`site-header ${hidden && !menu ? 'is-hidden' : ''} ${progress > 0.01 ? 'is-scrolled' : ''}`}>
      <nav className="nav container" aria-label="Main navigation">
        <a className="logo" href="#top" aria-label="Rovin home">
          <span className="logo-symbol">R.</span>Rovin
        </a>
        <div id="nav-links" className={`nav-links ${menu ? 'open' : ''}`}>
          {NAV.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'active' : ''}
              aria-current={active === id ? 'true' : undefined}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
        </div>
        <a className="nav-cta magnetic" href="#contact">Let’s talk <Arrow /></a>
        <button
          className={`menu ${menu ? 'open' : ''}`}
          aria-label={menu ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menu}
          aria-controls="nav-links"
          onClick={() => setMenu(!menu)}
        >
          <span /><span />
        </button>
      </nav>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </header>
  );
}

function Hero() {
  return (
    <section className="hero container" id="hero">
      <div className="hero-copy">
        <a href="#contact" className="availability" data-reveal>
          <i className="dot-live" /> Available for freelance projects <span>→</span>
        </a>
        <p className="eyebrow" data-reveal style={{ '--d': '80ms' }}>Python backend developer · Bangalore</p>
        <h1 data-reveal style={{ '--d': '140ms' }}>
          Behind every great idea.
          <span className="grad">A reliable backend.</span>
        </h1>
        <p className="lead" data-reveal style={{ '--d': '220ms' }}>
          I’m Rovin. I <RotatingWord words={['build clean APIs', 'connect platforms', 'validate messy data', 'ship dependable Django apps']} /> — turning complex data into
          applications you can rely on.
        </p>
        <div className="actions" data-reveal style={{ '--d': '300ms' }}>
          <a className="button primary magnetic" href="#contact">Let’s build something <Arrow /></a>
          <a className="button ghost magnetic" href="#work">Explore my work <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className="hero-visual" data-reveal style={{ '--d': '200ms' }}>
        <DailyLoop />
      </div>
      <a href="#work" className="scroll-cue" aria-label="Scroll to work"><span /></a>
    </section>
  );
}

function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-label="Technologies">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i} aria-hidden={i >= marquee.length}>{t}<i>✦</i></span>
        ))}
      </div>
    </div>
  );
}

function Preview({ kind }) {
  if (kind === 'quicksync') {
    return (
      <div className="mock sync">
        <div className="mock-nav"><b>✳ QuickSync</b><span>Overview · Products · Orders</span><i>RK</i></div>
        <div className="mock-content">
          <span className="mock-eyebrow">YOUR COMMERCE, CONNECTED</span>
          <h3>Everything in sync.</h3>
          <p>One workspace. Every sales channel.</p>
          <div className="channels"><span>Shopify</span><span>amazon</span><span>Etsy</span></div>
          <svg className="sync-lines" viewBox="0 0 300 60" aria-hidden="true">
            <path d="M60 0 C60 30 150 20 150 50 M150 0 V50 M240 0 C240 30 150 20 150 50" />
          </svg>
          <div className="sync-hub">✳</div>
        </div>
      </div>
    );
  }
  return (
    <div className="mock hr">
      <div className="hr-sidebar"><b>r.</b><span /><span /><span /><span /></div>
      <div className="hr-main">
        <div className="mock-nav"><b>Workspace</b><i>RK</i></div>
        <span className="mock-eyebrow">A LITTLE MORE HUMAN</span>
        <h3>People come first.</h3>
        <p>A simpler way to manage your team.</p>
        <div className="hr-stats">
          <div><small>People</small><strong>Team directory</strong></div>
          <div><small>Time off</small><strong>Leave requests</strong></div>
        </div>
        <div className="people"><span>JD</span><span>AM</span><span>SK</span><b>Built around your people</b></div>
      </div>
    </div>
  );
}

function ProjectCard({ p, i }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`project ${open ? 'open' : ''}`} data-reveal style={{ '--d': `${i * 120}ms` }}>
      <button className={`project-visual tilt tone-${p.tone}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={`${p.id}-details`} aria-label={`${p.name}: ${p.cta}`}>
        <span className="visual-glare" aria-hidden="true" />
        <Preview kind={p.id} />
        <span className="concept">Illustrative preview</span>
      </button>
      <div className="project-title">
        <div>
          <h3>{p.name}</h3>
          <p>{p.kind}</p>
        </div>
        <button className="round-btn" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={`${p.id}-details`} aria-label={p.cta}>
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <button className="project-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={`${p.id}-details`}>
        {p.cta} <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <div className="collapse" id={`${p.id}-details`}>
        <div>
          <p>{p.body}</p>
          <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
        </div>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section className="section container" id="work">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Selected work</p>
          <h2>Ideas into<br /><span>real-world products.</span></h2>
        </div>
        <p>Tap a project to see what I built behind the interface.</p>
      </div>
      <div className="project-grid">
        {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section container" id="experience">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Work experience</p>
          <h2>Behind the product.<br /><span>Inside the details.</span></h2>
        </div>
        <p>Reliable applications start with accurate, consistent data. Try it, break the payload on the right.</p>
      </div>
      <div className="experience-grid">
        <article className="experience-card spotlight" data-reveal>
          <span className="eyebrow">Product</span>
          <h3>CREOL</h3>
          <p className="role">Backend data validation</p>
          <p>
            Worked on backend data validation to ensure incoming data was accurate, consistent, and compliant with
            application requirements before being processed or stored.
          </p>
          <ul>
            <li>Implemented and improved validation rules for invalid, missing, and inconsistent data.</li>
            <li>Added clear error handling for validation failures.</li>
            <li>Checked incoming data against application requirements before processing or storage.</li>
          </ul>
          <div className="tags"><span>Data Validation</span><span>Error Handling</span><span>Backend Development</span></div>
        </article>
        <div data-reveal style={{ '--d': '120ms' }}>
          <LiveValidator />
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section container" id="skills">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">My toolkit</p>
          <h2>Built on experience.<br /><span>Backed by the right tools.</span></h2>
        </div>
        <p>The technologies I work with, from the first API request to the last database query.</p>
      </div>
      <div className="skill-grid">
        {skillGroups.map(([title, items], i) => (
          <article className="skill-card spotlight" key={title} data-reveal style={{ '--d': `${i * 70}ms` }}>
            <div className="skill-head">
              <h3>{title}</h3>
              <span>0{i + 1}</span>
            </div>
            <div className="chips">
              {items.split(' • ').map((item, j) => (
                <span key={item} style={{ '--i': j }}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section container" id="services">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Built around your business</p>
          <h2>Whatever you’re building.<br /><span>Let’s make it happen.</span></h2>
        </div>
        <p>A new venture. A growing business. A better way to work. I turn your requirements into a digital experience that fits.</p>
      </div>
      <div className="service-grid">
        {services.map(([n, title, desc, tags, icon], i) => (
          <article className="service spotlight" key={n} data-reveal style={{ '--d': `${i * 90}ms` }}>
            <div className="service-top">
              <span className="service-icon">{icon}</span>
              <span className="num">{n}</span>
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <small>{tags}</small>
            <a href={`mailto:${email}?subject=${encodeURIComponent(`Project enquiry: ${title}`)}`}>
              Discuss your project <Arrow />
            </a>
          </article>
        ))}
      </div>
      <div className="service-foot" data-reveal>
        <span>Have something different in mind? Every business is unique.</span>
        <a href="#contact" className="link-underline">Tell me what you need <Arrow /></a>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section container process">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Simple process. Thoughtful execution.</p>
          <h2>From “what if”<br /><span>to “it’s live”.</span></h2>
        </div>
        <p>Clear communication and collaboration, from our first conversation to your website’s launch.</p>
      </div>
      <ol className="steps" data-reveal>
        {steps.map(([n, t, d], i) => (
          <li key={n} style={{ '--d': `${i * 250}ms` }}>
            <span className="step-num">{n}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function About() {
  return (
    <section className="section container about" id="about">
      <div className="portrait tilt" data-reveal>
        <img src="/images/rovin-photo.jpg" alt="Portrait of Rovin" loading="lazy" />
        <span>The person behind the pixels</span>
      </div>
      <div className="about-copy" data-reveal style={{ '--d': '120ms' }}>
        <p className="eyebrow">Hello, I’m Rovin</p>
        <h2>A builder at heart.<br /><span>A partner in your idea.</span></h2>
        <p>I’m a Python backend developer based in Bangalore, India. I build reliable APIs, validate data, and connect third-party platforms to keep applications working smoothly.</p>
        <p>My foundation is Python, Django and clean API architecture. I care about the details: maintainable code, dependable integrations and a great experience for the people who use what we build.</p>
        <div className="about-links">
          <a className="pill-link magnetic" href={github} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
          <a className="pill-link magnetic" href={linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
          <a className="pill-link magnetic" href={instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const photos = ['bike-travel.jpeg', ...Array.from({ length: 8 }, (_, i) => `image${i + 1}.jpeg`)];
  const [i, setI] = useState(0);
  const startX = useRef(null);
  const go = (d) => setI((n) => (n + d + photos.length) % photos.length);

  return (
    <section className="personal container" data-reveal>
      <div className="personal-copy">
        <span className="eyebrow">Beyond the screen</span>
        <h3>New roads.<br />New perspectives.</h3>
        <p>When I’m not building, you’ll find me exploring on two wheels.</p>
        <div className="gallery-controls">
          <button className="round-btn" onClick={() => go(-1)} aria-label="Previous photo">←</button>
          <span aria-live="polite">{String(i + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
          <button className="round-btn" onClick={() => go(1)} aria-label="Next photo">→</button>
        </div>
      </div>
      <div
        className="gallery"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Motorcycle travel photos"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current == null) return;
          const dx = e.clientX - startX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          startX.current = null;
        }}
      >
        {photos.map((src, n) => (
          <img
            key={src}
            src={`/images/${src}`}
            alt={`Motorcycle travels — photo ${n + 1}`}
            loading="lazy"
            draggable="false"
            className={n === i ? 'current' : ''}
          />
        ))}
        <div className="dots">
          {photos.map((_, n) => (
            <button key={n} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`Show photo ${n + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

/** "Start a conversation" → choose WhatsApp or email. */
function StartConversation() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={`convo ${open ? 'open' : ''}`} ref={ref}>
      <button
        className="button primary big magnetic"
        aria-expanded={open}
        aria-controls="convo-menu"
        onClick={() => setOpen(!open)}
      >
        Start a conversation <span className="convo-caret" aria-hidden="true">↗</span>
      </button>
      <div className="convo-menu" id="convo-menu" role="menu" aria-hidden={!open}>
        <p className="convo-title">How would you like to reach me?</p>
        <a role="menuitem" className="convo-option wa" href={whatsapp} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          <span className="convo-icon"><WhatsAppIcon /></span>
          <span><b>WhatsApp</b><small>Usually the fastest reply</small></span>
          <Arrow />
        </a>
        <a role="menuitem" className="convo-option mail" href={mailto} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          <span className="convo-icon"><MailIcon /></span>
          <span><b>Email</b><small>{email}</small></span>
          <Arrow />
        </a>
      </div>
    </div>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.getSelection()?.selectAllChildren(document.getElementById('email-text'));
    }
  }
  return (
    <section className="contact section" id="contact">
      <div className="container">
        <span className="availability" data-reveal><i className="dot-live" /> Let’s create something great</span>
        <h2 data-reveal style={{ '--d': '80ms' }}>You bring the idea.<br /><span className="grad">Let’s build what’s behind it.</span></h2>
        <p data-reveal style={{ '--d': '160ms' }}>Need a website for your business or a custom solution? Tell me what you have in mind. Let’s figure it out together.</p>
        <div className="contact-actions" data-reveal style={{ '--d': '240ms' }}>
          <StartConversation />
          <button className={`email-chip ${copied ? 'copied' : ''}`} onClick={copy} aria-label={`Copy email address ${email}`}>
            <span id="email-text">{email}</span>
            <span className="chip-action">{copied ? 'Copied ✓' : 'Copy'}</span>
          </button>
        </div>
        <div className="contact-bottom">
          <span>Kanyakumari, Tamil Nadu, India · Open to remote collaborations</span>
          <div>
            <a className="link-underline" href={github} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
            <a className="link-underline" href={linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
            <a className="link-underline" href={instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  useReveal();
  usePointerEffects();
  useSmoothScroll();
  return (
    <>
      <Cursor />
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <LayersIntro />
        <Hero />
        <Marquee />
        <Work />
        <Experience />
        <Skills />
        <DeveloperFeed />
        <Services />
        <Process />
        <About />
        <Gallery />
        <Contact />
      </main>
      <footer className="container">
        <a className="logo" href="#top"><span className="logo-symbol">R.</span>Rovin</a>
        <span>© {new Date().getFullYear()} Rovin. Made with intention.</span>
        <a href="#top" className="link-underline">Back to top ↑</a>
      </footer>
    </>
  );
}

document.documentElement.classList.add('js');
createRoot(document.getElementById('root')).render(<App />);
