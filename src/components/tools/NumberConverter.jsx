import { useState } from 'react';
import { ArrowLeftRight, RotateCcw, AlertCircle, ChevronDown } from 'lucide-react';
import { convert, quickReferenceTable } from '../../utils/numberConverter';

const COMMON_BASES = [
  { value: 2,  label: 'Binary (2)'  },
  { value: 8,  label: 'Octal (8)'   },
  { value: 10, label: 'Decimal (10)'},
  { value: 16, label: 'Hex (16)'    },
];

const ALL_BASES = Array.from({ length: 35 }, (_, i) => i + 2).map(b => ({
  value: b,
  label: b <= 16
    ? COMMON_BASES.find(c => c.value === b)?.label || `Base ${b}`
    : `Base ${b}`,
}));

function BaseSelect({ id, label, value, onChange }) {
  return (
    <div className="flex-1 min-w-0">
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="input pr-8 appearance-none cursor-pointer"
          aria-label={label}
        >
          {ALL_BASES.map(b => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-500 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

const REF_TABLE = quickReferenceTable();

export default function NumberConverter() {
  const [input,    setInput]    = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase,   setToBase]   = useState(2);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState('');
  const [showRef,  setShowRef]  = useState(false);

  const run = () => {
    const trimmed = input.trim();
    if (!trimmed) { setError('Please enter a value.'); setResult(null); return; }
    const { result: r, error: e } = convert(trimmed, fromBase, toBase);
    if (e) { setError(e); setResult(null); }
    else   { setResult(r); setError(''); }
  };

  const swap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    // If we have a result, move it to input
    if (result) { setInput(result); setResult(null); }
    setError('');
  };

  const reset = () => { setInput(''); setResult(null); setError(''); };

  const handleKey = e => { if (e.key === 'Enter') run(); };

  // Live convert on input change
  const handleInputChange = e => {
    setInput(e.target.value);
    setError('');
    setResult(null);
    if (e.target.value.trim()) {
      const { result: r, error: er } = convert(e.target.value.trim(), fromBase, toBase);
      if (!er) setResult(r);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ─── Converter Card ───────────────────────────────── */}
      <section aria-labelledby="converter-heading">
        <h2 id="converter-heading" className="sr-only">Number System Converter</h2>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* From base */}
          <BaseSelect id="from-base" label="From Base" value={fromBase} onChange={b => { setFromBase(b); setResult(null); setError(''); }} />

          {/* Swap button */}
          <div className="flex justify-center sm:pb-0 pb-0">
            <button
              id="btn-swap-bases"
              type="button"
              onClick={swap}
              aria-label="Swap from and to bases"
              className="btn-ghost p-2.5 border border-base-700 rounded-xl self-end mb-0"
            >
              <ArrowLeftRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* To base */}
          <BaseSelect id="to-base" label="To Base" value={toBase} onChange={b => { setToBase(b); setResult(null); setError(''); }} />
        </div>

        {/* Input */}
        <div className="mt-4">
          <label htmlFor="number-input" className="label">
            Input Value
            <span className="ml-1 text-base-500 font-normal text-xs">
              (valid digits for base {fromBase}:{' '}
              <code className="font-mono text-amber-400">
                {'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, fromBase).toLowerCase()}
              </code>)
            </span>
          </label>
          <div className="flex gap-3">
            <input
              id="number-input"
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKey}
              placeholder={`Enter base-${fromBase} value…`}
              className="input font-mono text-lg flex-1 tracking-wider"
              aria-invalid={!!error}
              aria-describedby={error ? 'conv-error' : undefined}
              autoComplete="off"
              spellCheck={false}
            />
            <button id="btn-reset-conv" type="button" onClick={reset} className="btn-ghost" aria-label="Reset">
              <RotateCcw size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div id="conv-error" role="alert" className="flex items-start gap-2 mt-3 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Result */}
        {result !== null && !error && (
          <div
            className="mt-4 p-4 bg-amber-400/5 border border-amber-400/30 rounded-xl"
            aria-live="polite"
            aria-label="Conversion result"
          >
            <p className="text-xs text-base-500 mb-1">
              {input.toUpperCase()} (base {fromBase}) → base {toBase}
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-amber-400 break-all">
              {result}
            </p>
            <p className="text-xs text-base-500 mt-1 font-mono">
              {result.length} character{result.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Common conversions quick panel */}
        {input.trim() && !error && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="All-base comparison">
            {[2, 8, 10, 16].map(b => {
              const { result: r, error: e } = convert(input.trim(), fromBase, b);
              return (
                <div key={b} className="card p-3 text-center">
                  <p className="text-xs text-base-500 mb-1">Base {b}</p>
                  <p className="font-mono text-sm text-base-200 break-all">
                    {e ? <span className="text-red-400 text-xs">invalid</span> : r}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── Quick Reference ──────────────────────────────── */}
      <section aria-labelledby="ref-heading">
        <button
          type="button"
          id="btn-toggle-ref"
          onClick={() => setShowRef(!showRef)}
          aria-expanded={showRef}
          aria-controls="ref-table"
          className="flex items-center gap-2 text-sm font-medium text-base-400 hover:text-base-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
        >
          <ChevronDown size={14} className={`transition-transform ${showRef ? 'rotate-180' : ''}`} aria-hidden="true" />
          <span id="ref-heading">Quick Reference Table (0–15)</span>
        </button>

        {showRef && (
          <div id="ref-table" className="mt-4 overflow-x-auto rounded-xl border border-base-800">
            <table className="w-full text-sm font-mono" aria-label="Number system reference table 0 to 15">
              <thead className="bg-base-800">
                <tr>
                  {['Decimal', 'Binary', 'Octal', 'Hex'].map(h => (
                    <th key={h} scope="col" className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-base-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REF_TABLE.map(row => (
                  <tr key={row.decimal} className="border-t border-base-800 hover:bg-base-800/40 transition-colors">
                    <td className="px-4 py-2 text-amber-400">{row.decimal}</td>
                    <td className="px-4 py-2 text-base-300">{row.binary}</td>
                    <td className="px-4 py-2 text-base-300">{row.octal}</td>
                    <td className="px-4 py-2 text-teal-400">{row.hex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
