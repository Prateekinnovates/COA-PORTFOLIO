import { useState, useMemo } from 'react';
import { Search, Filter, ExternalLink, Calendar, Tag } from 'lucide-react';
import { ACHIEVEMENTS, CATEGORIES } from '../data/achievements';

const CATEGORY_COLORS = {
  Academics:       'chip-teal',
  Certifications:  'chip-amber',
  Hackathons:      'chip-amber',
  Projects:        'chip-teal',
  Other:           'chip-base',
};

function AchievementCard({ achievement }) {
  const chipClass = CATEGORY_COLORS[achievement.category] || 'chip-base';
  return (
    <article
      className="card-accent group"
      aria-label={`Achievement: ${achievement.title}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`${chipClass} flex-shrink-0`}>{achievement.category}</span>
        {achievement.date && (
          <div className="flex items-center gap-1 text-xs text-base-500 flex-shrink-0">
            <Calendar size={11} aria-hidden="true" />
            {achievement.date}
          </div>
        )}
      </div>

      <h3 className="font-bold text-base-100 text-base mb-1 leading-snug">{achievement.title}</h3>
      {achievement.organization && (
        <p className="text-xs text-amber-400 mb-2">{achievement.organization}</p>
      )}
      <p className="text-sm text-base-400 leading-relaxed mb-3">{achievement.description}</p>

      {achievement.note && (
        <p className="text-xs text-teal-400/70 italic mb-3">{achievement.note}</p>
      )}

      {achievement.tags && achievement.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {achievement.tags.map(tag => (
            <span key={tag} className="chip-base text-xs">{tag}</span>
          ))}
        </div>
      )}

      {achievement.verificationUrl && (
        <a
          href={achievement.verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Verify ${achievement.title}`}
          className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors"
        >
          <ExternalLink size={12} aria-hidden="true" /> Verify credential
        </a>
      )}
    </article>
  );
}

export default function Achievements() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return ACHIEVEMENTS.filter(a => {
      const matchCat  = category === 'All' || a.category === category;
      const needle    = search.toLowerCase();
      const matchText = !needle ||
        a.title.toLowerCase().includes(needle) ||
        (a.organization || '').toLowerCase().includes(needle) ||
        (a.description  || '').toLowerCase().includes(needle) ||
        (a.tags || []).some(t => t.toLowerCase().includes(needle));
      return matchCat && matchText;
    });
  }, [search, category]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* ─── Header ─────────────────────────────────────── */}
      <section className="mb-10 animate-slide-up" aria-labelledby="ach-heading">
        <p className="section-label">Track Record</p>
        <h1 id="ach-heading" className="text-4xl font-bold text-base-100 mb-3">
          Achievements &amp; Activities
        </h1>
        <p className="text-base-400 leading-relaxed max-w-2xl">
          A chronological record of academic results, certifications, hackathon participation, and extracurricular activities.
          All entries represent factual, verified information only.
        </p>
      </section>

      {/* ─── Filters ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-500 pointer-events-none"
            aria-hidden="true"
          />
          <label htmlFor="search-achievements" className="sr-only">Search achievements</label>
          <input
            id="search-achievements"
            type="search"
            placeholder="Search achievements…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
            aria-controls="achievements-list"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-base-500 flex-shrink-0" aria-hidden="true" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                category === cat
                  ? 'bg-amber-400 text-base-950'
                  : 'bg-base-800 text-base-300 hover:bg-base-700 hover:text-base-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Results ────────────────────────────────────── */}
      <div>
        <p className="text-xs text-base-500 mb-4" aria-live="polite">
          Showing {filtered.length} of {ACHIEVEMENTS.length} entries
          {category !== 'All' ? ` in "${category}"` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>

        {filtered.length === 0 ? (
          <div className="card text-center py-16">
            <Tag size={32} className="text-base-600 mx-auto mb-3" aria-hidden="true" />
            <p className="text-base-400">No achievements match your filters.</p>
            <button
              type="button"
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="btn-ghost text-sm mt-4 mx-auto"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul
            id="achievements-list"
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            role="list"
          >
            {filtered.map(a => (
              <li key={a.id}>
                <AchievementCard achievement={a} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
