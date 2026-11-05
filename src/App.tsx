/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ──────────────────────────────────────────────────────────────────────────
//  This file controls the LAYOUT and STYLING of the site.
//  To edit the TEXT, open  src/content.ts  instead — you shouldn't need to
//  touch this file for normal content changes.
// ──────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ExternalLink, Mail, BookOpen, Award,
  ChevronRight, Menu, X,
} from 'lucide-react';
import pic1 from '../Picture1.jpg';
import pic2 from '../Picture2.png';
import headshot from '../hong-headshot.jpg';
import groupPhoto from '../group-photo.jpg';
import { content } from './content';

// Research figures live in the research-figs/ folder. They're keyed by filename
// so content.ts can reference them by name (e.g. image: 'qram.png'). To swap a
// figure, just replace the file in research-figs/ (keeping the same name).
const researchFigs = import.meta.glob('../research-figs/*', { eager: true, import: 'default' }) as Record<string, string>;
const figByName: Record<string, string> = Object.fromEntries(
  Object.entries(researchFigs).map(([path, url]) => [path.split('/').pop()!, url]),
);

// ── PKU Brand Colors ──────────────────────────────────────────────────────────
const C = {
  crimson:     '#8C0A27',
  crimsonDark: '#6B0720',
  crimsonMid:  '#A50E30',
  gold:        '#B5A068',
  goldLight:   '#D4BC89',
  bgLight:     '#FBF6F7',
  white:       '#FFFFFF',
  text:        '#1C1C1C',
  muted:       '#5C5C5C',
  border:      '#E2D8D9',
};

const serif = 'Georgia, "Times New Roman", serif';
const sans  = 'system-ui, -apple-system, sans-serif';

// Group publications by year (newest first) for the Publications section.
const pubsByYear = content.publications.items.reduce<Record<number, typeof content.publications.items>>((acc, p) => {
  (acc[p.year] ??= []).push(p);
  return acc;
}, {});
const years = Object.keys(pubsByYear).map(Number).sort((a, b) => b - a);
// Keep first-author and equal-contribution papers first within each year.
Object.values(pubsByYear).forEach(papers => {
  papers.sort((a, b) => Number(b.isLead) - Number(a.isLead));
});

// ── Markdown renderer ─────────────────────────────────────────────────────────
function openPiBio() {
  const bio = document.getElementById('hong-qiao-bio') as HTMLDetailsElement | null;
  if (bio) bio.open = true;
}

// Renders the Markdown text from content.ts (**bold**, *italic*, [links](url)).
function Rich({ text, pStyle }: { text: string; pStyle?: React.CSSProperties }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p style={pStyle}>{children}</p>,
        a: ({ children, href }) => (
          <a href={href} target={href?.startsWith('#') ? undefined : '_blank'} rel="noopener noreferrer" onClick={href === '#hong-qiao-bio' ? openPiBio : undefined} style={{ color: C.crimson }}>
            {children}
          </a>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

// ── Author highlight component ────────────────────────────────────────────────
function Authors({ s }: { s: string }) {
  const parts = s.split(/(H\. Qiao\*?)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('H. Qiao') ? (
          <strong key={i} style={{ color: C.crimson }}>{p}</strong>
        ) : p
      )}
    </span>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <h2 style={{ color: C.crimson, fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '2rem', fontWeight: 700 }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: '2px', background: `linear-gradient(to right, ${C.gold}, transparent)` }} />
    </div>
  );
}

function NewsBadge({ label, url }: { label: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
      style={{ border: `1px solid ${C.crimson}`, color: C.crimson, fontFamily: 'sans-serif' }}>
      {label} <ExternalLink size={9} />
    </a>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const revealBio = () => {
      if (window.location.hash === '#hong-qiao-bio') {
        openPiBio();
        document.getElementById('hong-qiao-bio')?.scrollIntoView();
      }
    };
    revealBio();
    window.addEventListener('hashchange', revealBio);
    return () => window.removeEventListener('hashchange', revealBio);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div style={{ color: C.text, background: C.white, fontFamily: serif }}>

      {/* ══════════════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : C.white,
        borderBottom: `3px solid ${C.crimson}`,
        backdropFilter: 'blur(8px)',
      }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ height: '60px' }}>
          <button onClick={() => go('hero')} style={{ color: C.crimson, fontFamily: serif, fontWeight: 700, fontSize: '1.1rem' }}>
            {content.nav.brand}
          </button>
          <div className="hidden md:flex gap-6">
            {content.nav.items.map(n => (
              <button key={n} onClick={() => go(n.toLowerCase().replace(/\s+/g, '-'))}
                className="hover:underline"
                style={{ color: C.text, fontFamily: sans, fontSize: '0.875rem' }}>
                {n}
              </button>
            ))}
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: C.crimson }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3" style={{ background: C.white, borderTop: `1px solid ${C.border}` }}>
            {content.nav.items.map(n => (
              <button key={n} onClick={() => go(n.toLowerCase().replace(/\s+/g, '-'))} className="text-left text-sm" style={{ color: C.text, fontFamily: sans }}>
                {n}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section id="hero" style={{ background: `linear-gradient(120deg, rgba(12,4,22,0.88) 30%, rgba(12,4,22,0.45) 100%), url(${pic2}) center 60% / cover no-repeat`, color: C.white, paddingTop: '80px', minHeight: '75vh' }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p style={{ color: C.goldLight, fontFamily: sans, fontSize: '0.8rem', letterSpacing: '0.12em', marginBottom: 20 }}>{content.hero.eyebrow}</p>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.6rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1.1, maxWidth: 850 }}>Hybrid Quantum Lab</h1>
          <p style={{ fontFamily: sans, fontSize: '1.15rem', lineHeight: 1.8, maxWidth: 680, marginTop: 28, opacity: 0.9 }}>We explore quantum acoustics and hybrid quantum systems, connecting individual quanta of sound with superconducting circuits.</p>
          <div className="flex flex-wrap gap-4 mt-8" style={{ fontFamily: sans }}>
            <button onClick={() => go('research')} style={{ background: C.gold, color: C.crimsonDark, padding: '12px 22px', borderRadius: 6, fontWeight: 600 }}>Explore our research</button>
            <button onClick={() => go('join-us')} style={{ border: '1px solid rgba(255,255,255,0.5)', color: C.white, padding: '12px 22px', borderRadius: 6 }}>Join the lab</button>
          </div>
        </div>
        <div style={{ height: 4, background: C.gold }} />
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════ */}
      <section id="about" style={{ background: C.white, padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle>{content.about.heading}</SectionTitle>
            <figure style={{ margin: '0 0 32px' }}>
              <img src={groupPhoto} alt="Hybrid Quantum Lab group photo" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }} />
              <figcaption style={{ marginTop: 10, color: C.muted, fontFamily: sans, fontSize: '0.875rem' }}>
                {content.group.photoCaption}
              </figcaption>
            </figure>
          {(() => {
            // The Research Interests list is optional — if it's removed from
            // content.ts, the bio simply spans the full width.
            const about = content.about as {
              heading: string; body: string;
              interestsHeading?: string; interests?: string[];
            };
            const hasInterests = Array.isArray(about.interests) && about.interests.length > 0;
            return (
              <div className={hasInterests ? 'grid md:grid-cols-3 gap-12' : ''}>
                <div className={hasInterests ? 'md:col-span-2' : ''} style={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                  <Rich text={about.body} pStyle={{ marginBottom: 16 }} />
                </div>
                {hasInterests && (
                  <div>
                    <h3 style={{ color: C.crimson, fontFamily: sans, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                      {about.interestsHeading}
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {about.interests!.map(r => (
                        <li key={r} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontFamily: sans, fontSize: '0.875rem', color: C.muted }}>
                          <ChevronRight size={14} style={{ color: C.gold, flexShrink: 0, marginTop: 2 }} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          RESEARCH
      ══════════════════════════════════════════════════ */}
      <section id="research" style={{
        position: 'relative',
        background: `linear-gradient(to right, rgba(5,0,10,0.60) 30%, rgba(100,7,25,0.40) 100%), url(${pic1}) center / 100% auto no-repeat`,
        color: C.white,
        padding: '100px 0',
      }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ maxWidth: 820 }}>
            <p style={{ fontFamily: 'sans-serif', fontSize: '0.75rem', letterSpacing: '0.18em', color: C.gold, marginBottom: 14, textTransform: 'uppercase' }}>
              {content.research.eyebrow}
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.6rem', fontWeight: 700, lineHeight: 1.15, marginBottom: 24 }}>
              {content.research.heading}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {content.research.cards.map(r => {
                const fig = r.image ? figByName[r.image] : undefined;
                const Card = r.link ? 'a' : 'div';
                return (
                  <Card
                    key={r.title}
                    {...(r.link ? { href: r.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="research-card"
                    style={{ display: 'flex', gap: 18, alignItems: 'center', padding: 16, borderRadius: 8, background: 'rgba(255,255,255,0.07)', color: C.white, textDecoration: 'none' }}>
                    {fig && (
                      <img src={fig} alt={r.title}
                        style={{
                          width: 176,
                          height: 120,
                          objectFit: ['qip.png', 'qram.png'].includes(r.image || '') ? 'contain' : 'cover',
                          borderRadius: 6,
                          flexShrink: 0,
                          background: ['qip.png', 'qram.png'].includes(r.image || '') ? C.white : 'rgba(255,255,255,0.08)',
                          padding: ['qip.png', 'qram.png'].includes(r.image || '') ? 6 : 0,
                        }} />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.02rem', color: C.gold, marginBottom: 6 }}>
                        <span>{r.title}</span>
                        {r.link && <ExternalLink size={13} style={{ flexShrink: 0, opacity: 0.85 }} />}
                      </div>
                      <div style={{ fontFamily: 'sans-serif', fontSize: '0.85rem', opacity: 0.82, lineHeight: 1.55 }}>{r.desc}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="people" style={{ background: C.white, padding: '80px 0', scrollMarginTop: 60 }}>
        <div className="max-w-6xl mx-auto px-6">
            <SectionTitle>
              {content.group.heading}
            </SectionTitle>

            <div className="grid md:grid-cols-2 gap-6">
              {content.group.members.map(member => (
                <article key={member.name} className="flex flex-col sm:flex-row gap-5 p-6" style={{ background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                  {member.photo ? (
                    <img src={member.photo === 'hong-headshot.jpg' ? headshot : (figByName[member.photo] ?? member.photo)} alt={member.name} className="w-24 h-24 object-cover rounded-full shrink-0" />
                  ) : (
                    <div aria-hidden="true" className="w-24 h-24 rounded-full shrink-0 flex items-center justify-center" style={{ background: C.crimson, color: C.white, fontFamily: sans, fontSize: '1.5rem' }}>
                      {member.name.split(' · ').pop()!.split(' ').map(part => part[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      {member.role === 'Principal Investigator' ? <a href="#hong-qiao-bio" onClick={openPiBio} className="hover:underline" style={{ color: C.crimson }}>{member.name}</a> : member.name}
                    </h4>
                    <p style={{ color: C.crimson, fontFamily: sans, fontSize: '0.8rem', fontWeight: 600, marginTop: 4 }}>{member.role}</p>
                    {member.bio && <p style={{ color: C.muted, fontFamily: sans, fontSize: '0.875rem', lineHeight: 1.7, marginTop: 12 }}>{member.bio}</p>}
                    {member.email && <a href={`mailto:${member.email}`} style={{ display: 'inline-block', color: C.crimson, fontFamily: sans, fontSize: '0.875rem', marginTop: 12 }}>{member.email}</a>}
                  </div>
                </article>
              ))}
            </div>

          <details id="hong-qiao-bio" style={{ marginTop: 32, borderTop: '1px solid ' + C.border, paddingTop: 24, scrollMarginTop: 84 }}>
            <summary style={{ color: C.crimson, fontFamily: sans, cursor: 'pointer', fontWeight: 600 }}>About the PI · Hong Qiao — biography, education &amp; awards</summary>
            <div style={{ marginTop: 24, lineHeight: 1.8 }}><Rich text={content.group.piBio} pStyle={{ marginBottom: 16 }} /></div>
            <a href={content.hero.scholarUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.crimson, fontFamily: sans }}>Hong Qiao on Google Scholar ↗</a>
      <section id="experience" style={{ background: C.bgLight, padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle>{content.experience.heading}</SectionTitle>
          <div style={{ maxWidth: 800 }}>
            {content.experience.items.map((e, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 20 }}>
                {/* Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, background: e.highlight ? C.crimson : C.gold, border: `2px solid ${e.highlight ? C.crimson : C.gold}` }} />
                  {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: C.border, minHeight: 32, margin: '4px 0' }} />}
                </div>
                {/* Content */}
                <div style={{ paddingBottom: i < arr.length - 1 ? 32 : 0 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: serif, fontSize: '1.1rem', fontWeight: 700, color: e.highlight ? C.crimson : C.text }}>
                      {e.role}
                    </span>
                    <span style={{ fontFamily: sans, fontSize: '0.75rem', padding: '2px 8px', borderRadius: 3, background: e.highlight ? C.crimson : C.bgLight, color: e.highlight ? C.white : C.muted }}>
                      {e.period}
                    </span>
                  </div>
                  <div style={{ fontFamily: sans, fontSize: '0.875rem', fontWeight: 600, color: C.gold, marginBottom: 6 }}>
                    {e.orgLink ? (
                      <a href={e.orgLink} target="_blank" rel="noopener noreferrer" style={{ color: C.gold, textDecoration: 'none' }} className="hover:underline">
                        {e.org}
                      </a>
                    ) : e.org}
                  </div>
                  <p style={{ fontFamily: sans, fontSize: '0.875rem', color: C.muted, lineHeight: 1.65, margin: 0 }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="awards" style={{ background: C.white, padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle>{content.awards.heading}</SectionTitle>
          <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {content.awards.items.map(a => (
              <div key={a.title} style={{ display: 'flex', gap: 20, padding: 18, borderRadius: 6, border: `1px solid ${C.border}` }}>
                <div style={{ width: 72, flexShrink: 0, textAlign: 'right' }}>
                  <span style={{ fontFamily: sans, fontWeight: 700, fontSize: '0.875rem', color: C.crimson }}>{a.year}</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Award size={18} style={{ color: C.gold, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontFamily: serif, fontWeight: 600, marginBottom: 4 }}>
                      {a.link ? (
                        <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ color: C.crimsonDark, textDecoration: 'none' }} className="hover:underline">
                          {a.title} <ExternalLink size={12} style={{ display: 'inline' }} />
                        </a>
                      ) : a.title}
                    </div>
                    <div style={{ fontFamily: sans, fontSize: '0.85rem', color: C.muted, lineHeight: 1.5 }}>{a.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
          </details>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PUBLICATIONS
      ══════════════════════════════════════════════════ */}
      <section id="publications" style={{ background: C.bgLight, padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle>{content.publications.heading}</SectionTitle>
          <div style={{ fontFamily: sans, fontSize: '0.875rem', color: C.muted, marginBottom: 32 }}>
            <Rich text={content.publications.note} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {years.map(year => (
              <div key={year}>
                {/* Year divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <span style={{ fontFamily: serif, fontSize: '1.5rem', fontWeight: 700, color: C.crimson }}>{year}</span>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {pubsByYear[year].map((p, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 0,
                      background: C.white, borderRadius: 6,
                      border: `1px solid ${C.border}`,
                      overflow: 'hidden',
                    }}>
                      {/* Lead indicator */}
                      <div style={{ width: 4, flexShrink: 0, background: p.isLead ? C.crimson : 'transparent' }} />
                      <div style={{ padding: '14px 16px', flex: 1 }}>
                        <a href={p.link} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: serif, fontSize: '1rem', fontWeight: 600, color: C.crimsonDark, display: 'block', marginBottom: 6, textDecoration: 'none', lineHeight: 1.4 }}
                          className="hover:underline">
                          {p.title}
                        </a>
                        <div style={{ fontFamily: sans, fontSize: '0.85rem', color: C.muted, marginBottom: 8 }}>
                          <Authors s={p.authors} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontFamily: sans, fontSize: '0.875rem', color: C.text, fontStyle: 'italic' }}>
                            {p.venue}
                          </span>
                          {p.preprint && (
                            <span style={{ fontFamily: sans, fontSize: '0.7rem', padding: '1px 6px', borderRadius: 3, background: C.gold, color: C.crimsonDark, fontWeight: 700 }}>
                              PREPRINT
                            </span>
                          )}
                          {p.news?.map(n => <NewsBadge key={n.label} {...n} />)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, fontFamily: sans, fontSize: '0.875rem', color: C.muted, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            {content.publications.thesis.label}{' '}
            <a href={content.publications.thesis.url} target="_blank" rel="noopener noreferrer" style={{ color: C.crimson }}>
              {content.publications.thesis.title}
            </a>
            {content.publications.thesis.suffix}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          AWARDS
      ══════════════════════════════════════════════════ */}


      {/* ══════════════════════════════════════════════════
          EXPERIENCE
      ══════════════════════════════════════════════════ */}


      {/* ══════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════ */}
      <section id="join-us" style={{ background: C.white, padding: '80px 0', scrollMarginTop: 60 }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle>Join Us</SectionTitle>
          <p style={{ maxWidth: 760, fontSize: '1.1rem', lineHeight: 1.8 }}>Interested in quantum acoustics, superconducting circuits, or hybrid quantum systems? Postdoctoral, PhD, and undergraduate positions are available in the Hybrid Quantum Lab.</p>
          <p style={{ maxWidth: 760, fontFamily: sans, color: C.muted, lineHeight: 1.8, marginTop: 16 }}>Get in touch to discuss research opportunities. Please contact Prof. Hong Qiao with a brief introduction, your research interests, and a CV.</p>
          <a href={'mailto:' + content.contact.email} style={{ display: 'inline-block', background: C.crimson, color: C.white, padding: '12px 22px', borderRadius: 6, fontFamily: sans, marginTop: 24 }}>Contact Hong Qiao</a>
        </div>
      </section>

      <section id="contact" style={{ background: C.crimson, color: C.white, padding: '64px 0 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 style={{ fontFamily: serif, fontSize: '2rem', fontWeight: 700, marginBottom: 32 }}>{content.contact.heading}</h2>
          <div className="grid md:grid-cols-2 gap-12 pb-16">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: sans, fontSize: '0.9rem' }}>
              <a href={`mailto:${content.contact.email}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.white, textDecoration: 'none', opacity: 0.9 }}
                className="hover:opacity-100">
                <Mail size={16} style={{ color: C.gold }} />
                {content.contact.email}
              </a>
              <a href={content.contact.scholarUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.white, textDecoration: 'none', opacity: 0.9 }}
                className="hover:opacity-100">
                <BookOpen size={16} style={{ color: C.gold }} />
                Google Scholar <ExternalLink size={11} />
              </a>
            </div>
            <div style={{ fontFamily: sans, fontSize: '0.9rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: C.gold, marginBottom: 8 }}>{content.contact.labName}</div>
              <div style={{ opacity: 0.85, lineHeight: 1.8 }}>
                {content.contact.address.map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </div>
              <div style={{ marginTop: 12, opacity: 0.65, fontSize: '0.8rem' }}>
                {content.contact.currently}
              </div>
            </div>
          </div>
        </div>
        {/* Gold stripe + footer */}
        <div style={{ height: 4, background: C.gold }} />
        <div style={{ background: C.crimsonDark }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4" style={{ fontFamily: sans, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            <span>{content.contact.footerLeft}</span>
            <span>{content.contact.footerRight}</span>
          </div>
        </div>
      </section>

    </div>
  );
}
