import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, Terminal } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',             label: 'Landing'      },
  { to: '/home',         label: 'Home'         },
  { to: '/about',        label: 'About'        },
  { to: '/achievements', label: 'Achievements' },
  { to: '/lab',          label: 'COA Lab'      },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-base-950/90 backdrop-blur-md border-b border-base-800 shadow-lg shadow-base-950/50'
                 : 'bg-transparent'
      }`}
    >
      <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
            aria-label="Prateek — Home"
          >
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(251,191,36,0.5)] transition-all">
              <Cpu size={16} className="text-base-950" aria-hidden="true" />
            </div>
            <div>
              <span className="font-bold text-base-100 text-sm group-hover:text-amber-400 transition-colors">Prateek</span>
              <span className="font-mono text-xs text-base-500 block leading-none">25BAI10050</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isActive
                        ? 'text-amber-400 bg-amber-400/10'
                        : 'text-base-300 hover:text-base-100 hover:bg-base-800'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* COA Lab CTA (desktop) */}
          <Link
            to="/lab"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-sm font-semibold rounded-lg hover:bg-amber-400/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Open COA Lab"
          >
            <Terminal size={14} aria-hidden="true" />
            COA Lab
          </Link>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-base-300 hover:text-base-100 hover:bg-base-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div id="mobile-menu" role="dialog" aria-label="Mobile navigation">
            <ul
              className="md:hidden py-4 border-t border-base-800 space-y-1"
              role="list"
            >
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-base-300 hover:text-base-100 hover:bg-base-800'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
