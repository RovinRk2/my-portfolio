import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/**
 * Marks every [data-reveal] element with `data-shown` once it scrolls into view.
 * (An attribute rather than a class, so React re-rendering className can't remove it.)
 */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.setAttribute('data-shown', ''));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-shown', '');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Returns the id of the section currently in the middle of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids.join(',')]);
  return active;
}

/** 0..1 page scroll progress. */
export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setP(h > 0 ? window.scrollY / h : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return p;
}

/**
 * Pointer effects, wired globally by class name so markup stays simple:
 *  .magnetic   – element drifts toward the cursor
 *  .tilt       – 3D tilt + glare following the cursor
 *  .spotlight  – soft light follows the cursor inside the card
 */
export function usePointerEffects() {
  useEffect(() => {
    if (!finePointer() || prefersReducedMotion()) return;

    const onMove = (e) => {
      const t = e.target instanceof Element ? e.target : null;
      if (!t) return;

      const mag = t.closest('.magnetic');
      if (mag) {
        const r = mag.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        mag.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      }

      const tilt = t.closest('.tilt');
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        tilt.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
        tilt.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
        tilt.style.setProperty('--gx', `${px * 100}%`);
        tilt.style.setProperty('--gy', `${py * 100}%`);
      }

      const spot = t.closest('.spotlight');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    };

    const onOut = (e) => {
      const t = e.target instanceof Element ? e.target : null;
      if (!t) return;
      const related = e.relatedTarget instanceof Element ? e.relatedTarget : null;
      const mag = t.closest('.magnetic');
      if (mag && !mag.contains(related)) mag.style.transform = '';
      const tilt = t.closest('.tilt');
      if (tilt && !tilt.contains(related)) {
        tilt.style.setProperty('--rx', '0deg');
        tilt.style.setProperty('--ry', '0deg');
      }
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerout', onOut);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
    };
  }, []);
}

/** Custom cursor: small dot + trailing ring that grows over interactive elements. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!finePointer() || prefersReducedMotion()) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      const dot = document.getElementById('cursor-dot');
      const ring = document.getElementById('cursor-ring');
      if (dot) dot.style.transform = `translate(${x}px, ${y}px)`;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const hot = e.target instanceof Element && e.target.closest('a, button, summary, input, [role="tab"]');
      document.documentElement.classList.toggle('cursor-hot', !!hot);
    };
    const leave = () => document.documentElement.classList.add('cursor-away');
    const enter = () => document.documentElement.classList.remove('cursor-away');

    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerenter', enter);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerenter', enter);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div id="cursor-ring" className="cursor-ring" aria-hidden="true" />
      <div id="cursor-dot" className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/** Lenis smooth scrolling (mouse/trackpad only; touch keeps native scrolling). */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: { offset: -80 },
    });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}
