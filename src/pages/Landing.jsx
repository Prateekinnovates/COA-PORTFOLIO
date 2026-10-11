import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, ChevronDown, Terminal, BookOpen, Layers } from 'lucide-react';

// Animated binary / hex matrix strings for the background
const MATRIX_CHARS = '01ABCDEFx0110100110010REG[PC][SP][IR]0xDEAD0xFF25BAI10050'.split('');

function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const cols = Math.floor(w / 22);
    const drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10,11,14,0.07)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = '13px "JetBrains Mono", monospace';

      drops.forEach((y, i) => {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const alpha = Math.random() > 0.85 ? 0.6 : 0.12;
        ctx.fillStyle = `rgba(251,191,36,${alpha})`;
        ctx.fillText(char, i * 22, y * 22);
        if (y * 22 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const id = setInterval(draw, 60);

    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearInterval(id);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-40 pointer-events-none"
      aria-hidden="true"
    />
  );
}

// Technical detail chips shown in the hero
const TECH_CHIPS = [
  { label: 'REG[PC]', color: 'amber' },
  { label: '0x1A2B', color: 'teal' },
  { label: 'PUSH A', color: 'amber' },
  { label: 'B.Tech CSE', color: 'base' },
  { label: 'AI & ML', color: 'teal' },
  { label: 'T1=A+B*C', color: 'amber' },
  { label: '0b11001010', color: 'base' },
  { label: '[MEM:04]', color: 'teal' },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Canvas background */}
      <MatrixBackground />

      {/* Radial gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(251,191,36,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 80% 60%, rgba(45,212,191,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(251,191,36,0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(rgba(251,191,36,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ─── Hero Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-4 sm:px-6 pt-24 pb-16">
        {/* Status chip */}
        <div className="mb-8 animate-fade-in">
          <span className="chip-amber text-xs" role="text">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse-slow inline-block" aria-hidden="true" />
            COA Portfolio · First Year · Chandigarh University
          </span>
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4 animate-slide-up">
          <span className="text-base-100">Prateek</span>
        </h1>

        {/* UID chip */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span
            className="font-mono text-base sm:text-lg px-4 py-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 tracking-widest"
            aria-label="University UID: 25BAI10050"
          >
            UID: 25BAI10050
          </span>
        </div>

        {/* Tagline */}
        <p
          className="text-lg sm:text-xl text-base-300 max-w-2xl leading-relaxed mb-3 animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          B.Tech Computer Science & Engineering (AI & ML / Generative AI)
        </p>
        <p
          className="text-sm sm:text-base text-base-500 max-w-xl leading-relaxed mb-10 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          Building towards AI Engineering — Interested in AI/ML, Generative AI, cybersecurity tooling, and practical developer utilities.
        </p>

        {/* Evaluator message */}
        <div
          className="mb-10 max-w-lg px-5 py-4 bg-base-900/80 border border-base-700 rounded-xl text-left animate-slide-up"
          style={{ animationDelay: '0.25s' }}
        >
          <p className="font-mono text-xs text-teal-400 mb-1.5 uppercase tracking-widest">For Evaluators</p>
          <p className="text-sm text-base-300 leading-relaxed">
            Welcome! This site is my COA academic portfolio. The <strong className="text-amber-400">COA Lab</strong> section
            contains an interactive Instruction Set Simulator (ISS), Number System Converter, and persistent Assignments tracker —
            all built as part of my Computer Organization & Architecture coursework.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Link to="/home" className="btn-primary text-base" id="cta-explore-portfolio">
            Explore Portfolio
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link to="/lab" className="btn-teal text-base" id="cta-open-lab">
            <Terminal size={18} aria-hidden="true" />
            Open COA Lab
          </Link>
        </div>

        {/* Feature chips */}
        <div
          className="mt-14 flex flex-wrap justify-center gap-2 max-w-2xl animate-fade-in"
          style={{ animationDelay: '0.4s' }}
          aria-label="Technical features"
        >
          {TECH_CHIPS.map(({ label, color }) => (
            <span
              key={label}
              className={color === 'amber' ? 'chip-amber' : color === 'teal' ? 'chip-teal' : 'chip-base'}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Feature cards row */}
        <div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          {[
            { icon: Cpu,      label: 'ISS',       desc: 'Instruction Set Simulator — 4 addressing modes', to: '/lab' },
            { icon: Layers,   label: 'Converter',  desc: 'Number system converter — bases 2–36 via BigInt', to: '/lab/converter' },
            { icon: BookOpen, label: 'Assignments', desc: 'Persistent COA assignment tracker with CRUD API', to: '/lab/assignments' },
          ].map(({ icon: Icon, label, desc, to }) => (
            <Link
              key={label}
              to={to}
              className="card-accent text-left group"
              aria-label={`Go to ${label}`}
            >
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center mb-3 group-hover:bg-amber-400/20 transition-colors">
                <Icon size={18} className="text-amber-400" aria-hidden="true" />
              </div>
              <p className="font-semibold text-base-100 mb-1">{label}</p>
              <p className="text-xs text-base-500 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8 animate-bounce" aria-hidden="true">
        <ChevronDown size={20} className="text-base-600" />
      </div>
    </div>
  );
}
