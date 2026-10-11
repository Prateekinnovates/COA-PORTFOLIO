import { Link } from 'react-router-dom';
import { Mail, Cpu } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-base-800 bg-base-950/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center">
                <Cpu size={14} className="text-base-950" aria-hidden="true" />
              </div>
              <span className="font-bold text-base-100">Prateek</span>
            </div>
            <p className="font-mono text-xs text-base-500 mb-1">UID: 25BAI10050</p>
            <p className="text-xs text-base-500">B.Tech CSE (AI &amp; ML / Gen AI)</p>
            <p className="text-xs text-base-500">Chandigarh University</p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-widest text-base-500 mb-3">Quick Links</p>
            <ul className="space-y-2" role="list">
              {[
                ['/home', 'Home'],
                ['/about', 'About'],
                ['/achievements', 'Achievements'],
                ['/lab', 'COA Lab'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-base-400 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-base-500 mb-3">Connect</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/Prateekinnovates"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex items-center gap-2 text-sm text-base-400 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:underline"
              >
                <GithubIcon size={14} aria-hidden="true" />
                Prateekinnovates
              </a>
              <a
                href="https://www.linkedin.com/in/prateek-singh-48250b387/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="flex items-center gap-2 text-sm text-base-400 hover:text-teal-400 transition-colors focus-visible:outline-none focus-visible:underline"
              >
                <LinkedinIcon size={14} aria-hidden="true" />
                Prateek Singh
              </a>
              <a
                href="mailto:25BAI10050@cuchd.in"
                aria-label="Send email"
                className="flex items-center gap-2 text-sm text-base-400 hover:text-base-100 transition-colors focus-visible:outline-none focus-visible:underline"
              >
                <Mail size={14} aria-hidden="true" />
                25BAI10050@cuchd.in
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-base-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-base-600">
            © {year} Prateek · 25BAI10050 · Chandigarh University
          </p>
          <p className="font-mono text-xs text-base-600">
            COA Portfolio + Interactive Laboratory
          </p>
        </div>
      </div>
    </footer>
  );
}
