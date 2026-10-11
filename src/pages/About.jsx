import { useState } from 'react';
import { Download, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';
import { PROJECTS } from '../data/projects';

const SKILLS = {
  'Languages': ['Python', 'JavaScript', 'C', 'SQL', 'HTML/CSS'],
  'AI / ML':   ['Machine Learning fundamentals', 'Generative AI concepts', 'Python ML ecosystem (learning)'],
  'Tools':     ['Git', 'VS Code', 'Arduino IDE', 'FastAPI', 'React'],
  'Platforms': ['Microsoft Azure (AZ-900)', 'Linux basics', 'Render (deployment)'],
  'Other':     ['Event anchoring / hosting', 'Technical writing', 'Team collaboration'],
};

function ResumeSection() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'missing'

  const handleDownload = async () => {
    setStatus('checking');
    try {
      const res = await fetch('/resume.pdf', { method: 'HEAD' });
      if (res.ok && res.headers.get('content-type')?.includes('pdf')) {
        setStatus('available');
        window.open('/resume.pdf', '_blank', 'noopener');
      } else {
        setStatus('missing');
      }
    } catch {
      setStatus('missing');
    }
  };

  return (
    <div className="card-accent p-6">
      <h3 className="font-semibold text-base-100 mb-1">Resume</h3>
      <p className="text-sm text-base-400 mb-4">
        Two-column, navy-accented resume targeting AI Engineering roles.
      </p>

      <button
        id="btn-download-resume"
        type="button"
        onClick={handleDownload}
        disabled={status === 'checking'}
        className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        aria-live="polite"
        aria-label="Download resume PDF"
      >
        <Download size={16} aria-hidden="true" />
        {status === 'checking' ? 'Checking…' : 'Download Resume'}
      </button>

      {status === 'available' && (
        <p className="flex items-center gap-2 text-teal-400 text-xs mt-3" role="status">
          <CheckCircle size={14} aria-hidden="true" /> Opened in new tab.
        </p>
      )}
      {status === 'missing' && (
        <p className="flex items-center gap-2 text-amber-400 text-xs mt-3" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          Resume PDF not yet available. Please check back soon.
        </p>
      )}
    </div>
  );
}

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* ─── Intro ─────────────────────────────────────────────── */}
      <section className="mb-14 animate-slide-up" aria-labelledby="about-heading">
        <p className="section-label">About Me</p>
        <h1 id="about-heading" className="text-4xl font-bold text-base-100 mb-6">
          Hi, I'm Prateek
        </h1>
        <div className="prose-dark">
          <p>
            I'm a first-year B.Tech student in Computer Science &amp; Engineering (AI &amp; ML / Generative AI)
            at Chandigarh University (UID: 25BAI10050). Originally from Lucknow, I'm currently studying in Chandigarh.
          </p>
          <p>
            I'm passionate about building practical tools at the intersection of AI, security, and developer experience.
            Outside of tech, I enjoy sports and have anchored and organised cultural events at university.
          </p>
        </div>
      </section>

      <div className="divider mb-12" />

      {/* ─── Academic Background ──────────────────────────────── */}
      <section className="mb-14" aria-labelledby="academic-heading">
        <h2 id="academic-heading" className="section-title">Academic Background</h2>
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base-100">B.Tech — Computer Science &amp; Engineering</h3>
                <p className="text-sm text-amber-400 mt-0.5">Chandigarh University</p>
                <p className="text-xs text-base-500 mt-1">Specialization: AI &amp; ML / Generative AI · Program Code: CS235</p>
              </div>
              <span className="chip-amber flex-shrink-0">2025 – Present</span>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base-100">Class XII — 86%</h3>
                <p className="text-sm text-base-400 mt-0.5">Montfort Inter College, Lucknow · CBSE</p>
              </div>
              <span className="chip-base flex-shrink-0">2025</span>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base-100">Class X — 92%</h3>
                <p className="text-sm text-base-400 mt-0.5">Montfort Inter College, Lucknow · CBSE</p>
              </div>
              <span className="chip-base flex-shrink-0">2023</span>
            </div>
          </div>
        </div>
      </section>

      <div className="divider mb-12" />

      {/* ─── Skills ───────────────────────────────────────────── */}
      <section className="mb-14" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="section-title">Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(SKILLS).map(([category, items]) => (
            <div key={category} className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map(skill => (
                  <span key={skill} className="chip-base text-xs">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-base-500 mt-3 italic">
          * Skills reflect current learning stage. No metrics or proficiency percentages are fabricated.
        </p>
      </section>

      <div className="divider mb-12" />

      {/* ─── Projects ─────────────────────────────────────────── */}
      <section className="mb-14" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="section-title">Projects</h2>
        <div className="space-y-4">
          {PROJECTS.map(project => (
            <article key={project.id} className="card-accent p-5">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-base-100">{project.name}</h3>
                    <span className="chip-base text-xs">{project.status}</span>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} GitHub repository`}
                        className="text-base-500 hover:text-amber-400 transition-colors"
                      >
                        <GithubIcon size={14} aria-hidden="true" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} live demo`}
                        className="text-base-500 hover:text-teal-400 transition-colors"
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-amber-400 mb-2">{project.tagline}</p>
                  <p className="text-sm text-base-400 leading-relaxed">{project.description}</p>
                  {project.note && (
                    <p className="text-xs text-teal-400/70 italic mt-2">{project.note}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.map(t => (
                      <span key={t} className="chip-base text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="divider mb-12" />

      {/* ─── Resume ───────────────────────────────────────────── */}
      <section aria-labelledby="resume-heading">
        <h2 id="resume-heading" className="section-title">Resume</h2>
        <ResumeSection />
      </section>
    </div>
  );
}
