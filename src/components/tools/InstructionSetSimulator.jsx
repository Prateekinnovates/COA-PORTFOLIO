import { useState } from 'react';
import { Play, RotateCcw, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { simulate } from '../../utils/instructionSetSimulator';

const EXAMPLES = [
  'A + B * (C - D)',
  '(A + B) * (C + D)',
  'A - B - C',
  'A * B + C * D',
  'A + B',
];

const FORMAT_META = [
  {
    key: 'threeAddr',
    label: 'Three-Address',
    description: 'result = operand1 op operand2',
    color: 'amber',
    detail: 'Uses temporary registers T1, T2, … Each operation needs a destination and two operands.',
  },
  {
    key: 'twoAddr',
    label: 'Two-Address',
    description: 'MOV dest, src  +  OP dest, src',
    color: 'teal',
    detail: 'Destination doubles as first operand. Uses MOV to set up, then in-place operation.',
  },
  {
    key: 'oneAddr',
    label: 'One-Address (Accumulator)',
    description: 'LOAD / STORE / ADD / SUB / MUL / DIV',
    color: 'amber',
    detail: 'Accumulator register holds intermediate result. Explicit LOAD/STORE for memory access.',
  },
  {
    key: 'zeroAddr',
    label: 'Zero-Address (Stack)',
    description: 'PUSH operand  +  opcode',
    color: 'teal',
    detail: 'All operands on stack. Operators implicitly pop two values and push the result.',
  },
];

function CodePanel({ meta, instructions, isVisible, onToggle }) {
  const isAmber = meta.color === 'amber';
  const borderColor = isAmber ? 'border-amber-400/30' : 'border-teal-400/30';
  const accentColor = isAmber ? 'text-amber-400' : 'text-teal-400';
  const countBg    = isAmber ? 'bg-amber-400/10 text-amber-400' : 'bg-teal-400/10 text-teal-400';

  return (
    <div className={`border ${borderColor} rounded-xl overflow-hidden`}>
      {/* Panel header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-base-800/50 hover:bg-base-800 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
        aria-expanded={isVisible}
        aria-controls={`panel-${meta.key}`}
      >
        <div>
          <span className={`font-semibold text-sm ${accentColor}`}>{meta.label}</span>
          <span className="text-xs text-base-500 ml-2">{meta.description}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          {instructions.length > 0 && (
            <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${countBg}`}>
              {instructions.length} instr.
            </span>
          )}
          {isVisible
            ? <ChevronUp size={14} className="text-base-500" aria-hidden="true" />
            : <ChevronDown size={14} className="text-base-500" aria-hidden="true" />
          }
        </div>
      </button>

      {isVisible && (
        <div id={`panel-${meta.key}`}>
          {/* Detail tooltip */}
          <div className="px-4 pt-3 pb-0 flex items-center gap-1.5 text-xs text-base-500">
            <Info size={11} aria-hidden="true" />
            {meta.detail}
          </div>

          {instructions.length === 0 ? (
            <p className="px-4 py-4 text-xs text-base-600 italic">Run an expression to see code.</p>
          ) : (
            <pre
              className="px-4 py-4 font-mono text-sm text-base-200 leading-7 overflow-x-auto"
              aria-label={`${meta.label} code output`}
            >
              {instructions.map((line, i) => (
                <div key={i} className="flex gap-3 hover:bg-base-800/50 px-1 rounded">
                  <span className="text-base-700 select-none w-5 text-right flex-shrink-0">{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default function InstructionSetSimulator() {
  const [expr,    setExpr]    = useState('');
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [visible, setVisible] = useState({ threeAddr: true, twoAddr: true, oneAddr: true, zeroAddr: true });

  const run = () => {
    const trimmed = expr.trim();
    if (!trimmed) { setError('Please enter an expression.'); setResult(null); return; }
    const res = simulate(trimmed);
    if (res.error) { setError(res.error); setResult(null); }
    else           { setResult(res); setError(''); }
  };

  const reset = () => { setExpr(''); setResult(null); setError(''); };

  const togglePanel = key =>
    setVisible(v => ({ ...v, [key]: !v[key] }));

  const handleKey = e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run();
  };

  // Comparison summary
  const counts = result
    ? { threeAddr: result.threeAddr.length, twoAddr: result.twoAddr.length, oneAddr: result.oneAddr.length, zeroAddr: result.zeroAddr.length }
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Input area */}
      <section aria-labelledby="iss-input-heading">
        <h2 id="iss-input-heading" className="sr-only">Expression Input</h2>

        <label htmlFor="expr-input" className="label">
          Arithmetic Expression
          <span className="ml-1 text-base-500 font-normal text-xs">(variables A–Z, operators + − × ÷, parentheses)</span>
        </label>
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            id="expr-input"
            type="text"
            value={expr}
            onChange={e => { setExpr(e.target.value); setError(''); }}
            onKeyDown={handleKey}
            placeholder="e.g.  A + B * (C - D)"
            className="input font-mono text-base flex-1"
            aria-describedby={error ? 'expr-error' : 'expr-hint'}
            aria-invalid={!!error}
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex gap-2 flex-shrink-0">
            <button
              id="btn-run-iss"
              type="button"
              onClick={run}
              className="btn-primary"
              aria-label="Run simulation (Ctrl+Enter)"
            >
              <Play size={16} aria-hidden="true" />
              Run
            </button>
            <button
              id="btn-reset-iss"
              type="button"
              onClick={reset}
              className="btn-ghost"
              aria-label="Reset expression and results"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>

        <p id="expr-hint" className="text-xs text-base-500 mt-1.5">
          Ctrl+Enter to run · Single-letter variables only
        </p>

        {/* Error */}
        {error && (
          <div
            id="expr-error"
            role="alert"
            className="flex items-start gap-2 mt-3 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Examples */}
        <div className="flex flex-wrap gap-2 mt-3" aria-label="Example expressions">
          <span className="text-xs text-base-600 self-center">Examples:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              type="button"
              onClick={() => { setExpr(ex); setError(''); setResult(null); }}
              className="font-mono text-xs px-2.5 py-1 bg-base-800 hover:bg-base-700 text-base-300 hover:text-base-100 rounded-lg border border-base-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
              aria-label={`Use example: ${ex}`}
            >
              {ex}
            </button>
          ))}
        </div>
      </section>

      {/* Postfix + comparison summary */}
      {result && (
        <section aria-labelledby="postfix-heading">
          <div className="bg-base-800/60 border border-base-700 rounded-xl p-4">
            <div className="flex flex-wrap gap-6 items-start">
              <div>
                <p className="section-label mb-1">Postfix (RPN)</p>
                <code className="font-mono text-amber-400 text-base" id="postfix-output">
                  {result.postfix}
                </code>
              </div>
              <div className="h-px w-full sm:h-auto sm:w-px bg-base-700" aria-hidden="true" />
              <div>
                <p className="section-label mb-1">Instruction Count Comparison</p>
                <div className="flex flex-wrap gap-3">
                  {FORMAT_META.map(m => (
                    <div key={m.key} className="text-center">
                      <p className={`font-mono text-lg font-bold ${m.color === 'amber' ? 'text-amber-400' : 'text-teal-400'}`}>
                        {counts[m.key]}
                      </p>
                      <p className="text-xs text-base-500">{m.label.split(' ')[0]}-Addr</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Code panels */}
      <section aria-label="Generated instruction code">
        <div className="space-y-3">
          {FORMAT_META.map(meta => (
            <CodePanel
              key={meta.key}
              meta={meta}
              instructions={result ? result[meta.key] : []}
              isVisible={visible[meta.key]}
              onToggle={() => togglePanel(meta.key)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
