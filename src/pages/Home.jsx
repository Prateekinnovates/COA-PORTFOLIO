import { Link } from 'react-router-dom';
import { Mail, MapPin, BookOpen, Cpu, Award, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { PROJECTS } from '../data/projects';

const FEATURED_PROJECTS = PROJECTS.filter(p => p.featured);

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* ─── Header ─────────────────────────────────────────── */}
      <section className="mb-16 animate-slide-up" aria-labelledby="home-name">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar placeholder */}
          <div
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400/20 to-teal-400/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="font-bold text-3xl text-amber-400">P</span>
          </div>

          <div className="flex-1">
            <p className="section-label">Student Portfolio</p>
            <h1 id="home-name" className="text-4xl sm:text-5xl font-bold text-base-100 mb-2">
              Prateek
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="chip-amber">UID: 25BAI10050</span>
              <span className="chip-teal">AI & ML / Gen AI</span>
              <span className="chip-base">First Year</span>
            </div>
            <p className="text-base-300 leading-relaxed max-w-2xl">
              B.Tech Computer Science &amp; Engineering student at Chandigarh University, specialising in AI &amp; ML / Generative AI (CS235).
              Interested in AI engineering, cybersecurity tooling, and practical developer utilities.
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href="https://github.com/Prateekinnovates"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="btn-ghost text-sm"
              >
                <GithubIcon size={16} aria-hidden="true" /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/prateek-singh-48250b387/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="btn-ghost text-sm"
              >
                <LinkedinIcon size={16} aria-hidden="true" /> LinkedIn
              </a>
              <a href="mailto:25BAI10050@cuchd.in" aria-label="Send email" className="btn-ghost text-sm">
                <Mail size={16} aria-hidden="true" /> Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="divider mb-12" />

      {/* ─── Quick Info Grid ──────────────────────────────────── */}
      <section className="mb-16" aria-labelledby="info-heading">
        <h2 id="info-heading" className="section-title">Academic Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'University',    value: 'Chandigarh University' },
            { label: 'Degree',        value: 'B.Tech — Computer Science & Engineering' },
            { label: 'Specialization',value: 'AI & ML / Generative AI (CS235)' },
            { label: 'Year',          value: 'First Year (2025–2026)' },
            { label: 'UID',           value: '25BAI10050', mono: true },
            { label: 'Email',         value: '25BAI10050@cuchd.in', mono: true },
          ].map(({ label, value, mono }) => (
            <div key={label} className="card p-4">
              <p className="text-xs text-base-500 uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-base-100 font-medium text-sm ${mono ? 'font-mono' : ''}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 card p-4 flex items-center gap-3">
          <MapPin size={16} className="text-teal-400 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs text-base-500 uppercase tracking-wider mb-0.5">Location</p>
            <p className="text-base-200 text-sm">From Lucknow · Studying in Chandigarh</p>
          </div>
        </div>
      </section>

      <div className="divider mb-12" />

      {/* ─── Interests & Direction ────────────────────────────── */}
      <section className="mb-16" aria-labelledby="interests-heading">
        <h2 id="interests-heading" className="section-title">Interests & Career Direction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-accent">
            <h3 className="font-semibold text-base-100 mb-3 flex items-center gap-2">
              <Cpu size={16} className="text-amber-400" aria-hidden="true" />
              Technical Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {['AI / ML', 'Generative AI', 'Cybersecurity Tooling', 'Developer Utilities', 'Computer Architecture', 'Browser-based Tools'].map(t => (
                <span key={t} className="chip-base text-xs">{t}</span>
              ))}
            </div>
          </div>
          <div className="card-teal">
            <h3 className="font-semibold text-base-100 mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-teal-400" aria-hidden="true" />
              Other Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Sports', 'Event Anchoring / Hosting', 'Scripting & Storytelling', 'Cultural Events'].map(t => (
                <span key={t} className="chip-base text-xs">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 card p-4">
          <p className="text-xs text-base-500 uppercase tracking-wider mb-1">Career Direction</p>
          <p className="text-base-200">AI Engineering roles</p>
        </div>
      </section>

      <div className="divider mb-12" />

      {/* ─── Featured Projects ────────────────────────────────── */}
      <section className="mb-16" aria-labelledby="projects-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="projects-heading" className="section-title mb-0">Featured Projects</h2>
          <Link to="/about" className="text-sm text-amber-400 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {FEATURED_PROJECTS.map(project => (
            <article key={project.id} className="card-accent flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base-100 text-base">{project.name}</h3>
                  <p className="text-xs text-amber-400 mt-0.5">{project.tagline}</p>
                </div>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} on GitHub`}
                    className="text-base-500 hover:text-amber-400 transition-colors ml-2 flex-shrink-0"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
              <p className="text-sm text-base-400 leading-relaxed flex-1 mb-4">{project.description}</p>
              {project.note && (
                <p className="text-xs text-teal-400/70 italic mb-3">{project.note}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.tags.slice(0, 4).map(t => (
                  <span key={t} className="chip-base text-xs">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="divider mb-12" />

      {/* ─── Certifications ───────────────────────────────────── */}
      <section aria-labelledby="certs-heading">
        <h2 id="certs-heading" className="section-title">Certifications</h2>
        <div className="card-accent flex items-start gap-4 max-w-lg">
          <div className="w-10 h-10 rounded-lg bg-teal-400/10 flex items-center justify-center flex-shrink-0">
            <Award size={18} className="text-teal-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-base-100">Microsoft Azure Fundamentals</h3>
            <p className="text-sm text-base-400 mt-0.5">AZ-900 · Microsoft</p>
            <p className="text-xs text-base-500 mt-2">Credential URL: <em className="text-base-600">— placeholder, to be added —</em></p>
          </div>
        </div>
      </section>
    </div>
  );
}
