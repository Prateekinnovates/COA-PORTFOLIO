import { lazy, Suspense } from 'react';
import { NavLink, useParams, Navigate } from 'react-router-dom';
import { Cpu, Hash, BookOpen, Plus } from 'lucide-react';

// Tool registry — add new tools here, no other file needs changing
const TOOLS = [
  {
    id: 'simulator',
    label: 'ISS',
    fullLabel: 'Instruction Set Simulator',
    icon: Cpu,
    description: 'Generate three-, two-, one-, and zero-address code from an arithmetic expression.',
    component: lazy(() => import('../components/tools/InstructionSetSimulator')),
  },
  {
    id: 'converter',
    label: 'Number Converter',
    fullLabel: 'Number System Converter',
    icon: Hash,
    description: 'Convert between binary, octal, decimal, hex, or any base 2–36 using BigInt.',
    component: lazy(() => import('../components/tools/NumberConverter')),
  },
  {
    id: 'assignments',
    label: 'Assignments',
    fullLabel: 'COA Assignments',
    icon: BookOpen,
    description: 'Browse, search, and manage COA assignments. Admin mode enables CRUD operations.',
    component: lazy(() => import('../components/tools/Assignments')),
  },
];

function ToolLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-base-500">Loading tool…</span>
      </div>
    </div>
  );
}

export default function COALab() {
  const { tool } = useParams();
  const activeTool = TOOLS.find(t => t.id === tool) || TOOLS[0];

  // If tool param doesn't match any known tool, redirect to base lab
  if (tool && !TOOLS.find(t => t.id === tool)) {
    return <Navigate to="/lab" replace />;
  }

  const ToolComponent = activeTool.component;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="section-label">Interactive Laboratory</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-base-100 mb-2">COA Lab</h1>
        <p className="text-base-400 max-w-2xl text-sm">
          Interactive tools for Computer Organization & Architecture — instruction set simulation,
          number system conversion, and persistent assignment management.
        </p>
      </div>

      {/* ─── Secondary Nav ──────────────────────────────────── */}
      <nav aria-label="COA Lab tools" className="mb-8">
        <ul className="flex flex-wrap gap-2" role="list">
          {TOOLS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <NavLink
                to={`/lab/${id}`}
                className={({ isActive }) => {
                  const base = isActive || (!tool && id === 'simulator');
                  return `inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 border
                    ${base
                      ? 'bg-amber-400/10 border-amber-400/40 text-amber-400'
                      : 'bg-base-900 border-base-800 text-base-300 hover:border-base-600 hover:text-base-100'
                    }`;
                }}
                aria-current={activeTool.id === id ? 'page' : undefined}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}

          {/* Extensible hint */}
          <li className="flex items-center" aria-hidden="true">
            <span className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs text-base-600 border border-dashed border-base-800">
              <Plus size={12} />
              Add new tool
            </span>
          </li>
        </ul>
      </nav>

      {/* ─── Active Tool Description ─────────────────────────── */}
      <div className="mb-6 px-4 py-3 bg-base-900 border border-base-800 rounded-xl flex items-center gap-3">
        <activeTool.icon size={16} className="text-amber-400 flex-shrink-0" aria-hidden="true" />
        <div>
          <span className="font-semibold text-base-100 text-sm">{activeTool.fullLabel}</span>
          <span className="text-base-500 text-xs ml-2">— {activeTool.description}</span>
        </div>
      </div>

      {/* ─── Tool Panel ──────────────────────────────────────── */}
      <div
        className="bg-base-900 border border-base-800 rounded-2xl overflow-hidden"
        role="region"
        aria-label={`${activeTool.fullLabel} tool`}
      >
        <Suspense fallback={<ToolLoader />}>
          <ToolComponent />
        </Suspense>
      </div>
    </div>
  );
}
