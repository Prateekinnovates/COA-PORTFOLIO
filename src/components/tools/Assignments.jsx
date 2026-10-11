import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Plus, Edit2, Trash2, ChevronDown, X, AlertCircle,
  BookOpen, Eye, EyeOff, Lock, Unlock, Loader2, CheckCircle
} from 'lucide-react';
import {
  fetchAssignments, createAssignment, updateAssignment, deleteAssignment
} from '../../services/api';

const DIFFICULTIES = ['', 'Easy', 'Medium', 'Hard'];
const EMPTY_FORM = {
  title: '', question: '', topic: '', category: '',
  date: '', difficulty: '', notes: '', answer: '', solution: '', reference: '',
};

// ─── Admin Token Prompt ───────────────────────────────────────────────────────
function AdminPanel({ onToken, token, onClear }) {
  const [val, setVal] = useState('');
  const [show, setShow] = useState(false);

  if (token) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="chip-teal flex items-center gap-1">
          <Unlock size={11} aria-hidden="true" /> Admin mode
        </span>
        <button type="button" onClick={onClear} className="text-base-500 hover:text-red-400 transition-colors text-xs focus-visible:outline-none focus-visible:underline">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={e => { e.preventDefault(); if (val.trim()) { onToken(val.trim()); setVal(''); } }}
      className="flex items-center gap-2"
      aria-label="Admin sign-in"
    >
      <div className="relative">
        <label htmlFor="admin-token" className="sr-only">Admin token</label>
        <input
          id="admin-token"
          type={show ? 'text' : 'password'}
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="Admin token"
          className="input text-xs py-1.5 pr-8 w-36"
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Hide token' : 'Show token'}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-base-600 hover:text-base-300"
        >
          {show ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      </div>
      <button type="submit" className="btn-ghost text-xs py-1.5 px-3" aria-label="Sign in as admin">
        <Lock size={12} aria-hidden="true" /> Sign in
      </button>
    </form>
  );
}

// ─── Assignment Form ──────────────────────────────────────────────────────────
function AssignmentForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit(form); }}
      className="space-y-4"
      aria-label={initial ? 'Edit assignment' : 'Create assignment'}
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="f-title" className="label">Title *</label>
          <input id="f-title" required value={form.title} onChange={e => set('title', e.target.value)} className="input" placeholder="e.g. Memory Addressing Modes" />
        </div>
        <div>
          <label htmlFor="f-topic" className="label">Topic</label>
          <input id="f-topic" value={form.topic} onChange={e => set('topic', e.target.value)} className="input" placeholder="e.g. Addressing" />
        </div>
        <div>
          <label htmlFor="f-category" className="label">Category</label>
          <input id="f-category" value={form.category} onChange={e => set('category', e.target.value)} className="input" placeholder="e.g. Short Answer" />
        </div>
        <div>
          <label htmlFor="f-date" className="label">Date</label>
          <input id="f-date" type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input" />
        </div>
        <div>
          <label htmlFor="f-difficulty" className="label">Difficulty</label>
          <div className="relative">
            <select id="f-difficulty" value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className="input appearance-none pr-8">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d || '— Select —'}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-500 pointer-events-none" aria-hidden="true" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="f-question" className="label">Question *</label>
          <textarea id="f-question" required value={form.question} onChange={e => set('question', e.target.value)} rows={3} className="input resize-y" placeholder="Enter the full assignment question…" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="f-answer" className="label">Answer / Solution</label>
          <textarea id="f-answer" value={form.answer} onChange={e => set('answer', e.target.value)} rows={3} className="input resize-y" placeholder="Your answer (optional)" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="f-reference" className="label">Reference</label>
          <input id="f-reference" value={form.reference} onChange={e => set('reference', e.target.value)} className="input" placeholder="Textbook, lecture notes, URL…" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="f-notes" className="label">Notes</label>
          <textarea id="f-notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="input resize-y" placeholder="Additional notes…" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-60">
          {loading ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <CheckCircle size={15} aria-hidden="true" />}
          {initial ? 'Save Changes' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost text-sm">Cancel</button>
      </div>
    </form>
  );
}

// ─── Assignment Row ───────────────────────────────────────────────────────────
function AssignmentRow({ assignment, onEdit, onDelete, isAdmin, expanded, onToggle }) {
  const diffColor = { Easy: 'text-teal-400', Medium: 'text-amber-400', Hard: 'text-red-400' };

  return (
    <div className="border border-base-800 rounded-xl overflow-hidden hover:border-base-700 transition-colors">
      {/* Header row */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-base-800/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-base-100 text-sm">{assignment.title}</h3>
            {assignment.difficulty && (
              <span className={`font-mono text-xs ${diffColor[assignment.difficulty] || 'text-base-500'}`}>
                {assignment.difficulty}
              </span>
            )}
          </div>
          <p className="text-xs text-base-500 line-clamp-2 leading-relaxed">{assignment.question}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {assignment.topic    && <span className="chip-base text-xs">{assignment.topic}</span>}
            {assignment.category && <span className="chip-base text-xs">{assignment.category}</span>}
            {assignment.date     && <span className="text-xs text-base-600 font-mono">{assignment.date}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onEdit(assignment); }}
                aria-label={`Edit ${assignment.title}`}
                className="p-1.5 text-base-500 hover:text-amber-400 transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
              >
                <Edit2 size={13} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onDelete(assignment.id); }}
                aria-label={`Delete ${assignment.title}`}
                className="p-1.5 text-base-500 hover:text-red-400 transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
              >
                <Trash2 size={13} aria-hidden="true" />
              </button>
            </>
          )}
          <ChevronDown
            size={14}
            className={`text-base-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-base-800 pt-3 space-y-3">
          <div>
            <p className="text-xs font-semibold text-base-500 uppercase tracking-wider mb-1">Question</p>
            <p className="text-sm text-base-200 leading-relaxed whitespace-pre-wrap break-words">{assignment.question}</p>
          </div>
          {assignment.answer && (
            <div>
              <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">Answer</p>
              <p className="text-sm text-base-300 leading-relaxed whitespace-pre-wrap break-words">{assignment.answer}</p>
            </div>
          )}
          {assignment.solution && (
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Solution</p>
              <p className="text-sm text-base-300 leading-relaxed whitespace-pre-wrap break-words">{assignment.solution}</p>
            </div>
          )}
          {assignment.notes && (
            <div>
              <p className="text-xs font-semibold text-base-500 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-base-400 leading-relaxed whitespace-pre-wrap break-words">{assignment.notes}</p>
            </div>
          )}
          {assignment.reference && (
            <div>
              <p className="text-xs font-semibold text-base-500 uppercase tracking-wider mb-1">Reference</p>
              <p className="text-sm text-base-400 break-all">{assignment.reference}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [token,       setToken]       = useState('');
  const [search,      setSearch]      = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [filterDiff,  setFilterDiff]  = useState('');
  const [showForm,    setShowForm]    = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [expanded,    setExpanded]    = useState({});
  const [toast,       setToast]       = useState('');
  const abortRef = useRef(null);

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search)      params.search     = search;
      if (filterTopic) params.topic      = filterTopic;
      if (filterDiff)  params.difficulty = filterDiff;
      const data = await fetchAssignments(params);
      setAssignments(data);
    } catch (e) {
      setError(e.message || 'Could not connect to API. The backend may not be running.');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterTopic, filterDiff]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async form => {
    setSaving(true);
    try {
      await createAssignment(form, token);
      setShowForm(false);
      showToast('Assignment created.');
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async form => {
    setSaving(true);
    try {
      await updateAssignment(editItem.id, form, token);
      setEditItem(null);
      showToast('Assignment updated.');
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this assignment? This cannot be undone.')) return;
    try {
      await deleteAssignment(id, token);
      showToast('Assignment deleted.');
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const topics = [...new Set(assignments.map(a => a.topic).filter(Boolean))];

  return (
    <div className="p-6 space-y-6">
      {/* ─── Toolbar ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-500 pointer-events-none" aria-hidden="true" />
            <label htmlFor="assign-search" className="sr-only">Search assignments</label>
            <input
              id="assign-search"
              type="search"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-8 py-1.5 text-sm w-44"
            />
          </div>

          {/* Topic filter */}
          <div className="relative">
            <label htmlFor="filter-topic" className="sr-only">Filter by topic</label>
            <select
              id="filter-topic"
              value={filterTopic}
              onChange={e => setFilterTopic(e.target.value)}
              className="input py-1.5 text-sm appearance-none pr-7 w-36"
            >
              <option value="">All topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-base-500 pointer-events-none" aria-hidden="true" />
          </div>

          {/* Difficulty filter */}
          <div className="relative">
            <label htmlFor="filter-diff" className="sr-only">Filter by difficulty</label>
            <select
              id="filter-diff"
              value={filterDiff}
              onChange={e => setFilterDiff(e.target.value)}
              className="input py-1.5 text-sm appearance-none pr-7 w-36"
            >
              <option value="">All difficulties</option>
              {DIFFICULTIES.filter(Boolean).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-base-500 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <AdminPanel token={token} onToken={setToken} onClear={() => setToken('')} />
          {token && (
            <button
              id="btn-new-assignment"
              type="button"
              onClick={() => { setShowForm(true); setEditItem(null); }}
              className="btn-primary text-sm py-1.5"
            >
              <Plus size={15} aria-hidden="true" /> New
            </button>
          )}
        </div>
      </div>

      {/* ─── Create / Edit Form ──────────────────────────── */}
      {(showForm || editItem) && (
        <div className="border border-amber-400/30 bg-base-800/40 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base-100 text-sm">{editItem ? 'Edit Assignment' : 'New Assignment'}</h2>
            <button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} aria-label="Close form" className="text-base-500 hover:text-base-100">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <AssignmentForm
            initial={editItem}
            onSubmit={editItem ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditItem(null); }}
            loading={saving}
          />
        </div>
      )}

      {/* ─── Error ───────────────────────────────────────── */}
      {error && (
        <div role="alert" className="flex items-start gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm text-red-300 font-medium">API Error</p>
            <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
            <button type="button" onClick={load} className="text-xs text-red-400 hover:text-red-300 underline mt-1">Retry</button>
          </div>
        </div>
      )}

      {/* ─── Toast ───────────────────────────────────────── */}
      {toast && (
        <div role="status" aria-live="polite" className="flex items-center gap-2 px-4 py-2.5 bg-teal-400/10 border border-teal-400/30 rounded-xl text-teal-400 text-sm">
          <CheckCircle size={14} aria-hidden="true" /> {toast}
        </div>
      )}

      {/* ─── List ────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20" aria-label="Loading assignments">
          <Loader2 size={24} className="text-amber-400 animate-spin" aria-hidden="true" />
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-base-800 rounded-xl">
          <BookOpen size={32} className="text-base-700 mx-auto mb-3" aria-hidden="true" />
          <p className="text-base-500 text-sm">No assignments yet.</p>
          {token && (
            <button type="button" onClick={() => setShowForm(true)} className="btn-primary text-sm mt-4 mx-auto">
              <Plus size={15} aria-hidden="true" /> Add first assignment
            </button>
          )}
          {!token && <p className="text-base-600 text-xs mt-2">Sign in as admin to add assignments.</p>}
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label="Assignments list">
          <p className="text-xs text-base-500" aria-live="polite">
            {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
          </p>
          {assignments.map(a => (
            <div key={a.id} role="listitem">
              <AssignmentRow
                assignment={a}
                onEdit={item => { setEditItem(item); setShowForm(false); }}
                onDelete={handleDelete}
                isAdmin={!!token}
                expanded={!!expanded[a.id]}
                onToggle={() => setExpanded(e => ({ ...e, [a.id]: !e[a.id] }))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
