/**
 * API service layer for the Assignments backend.
 * Reads VITE_API_URL from environment. Falls back to localhost:8000 for dev.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body.detail || body.message || msg;
    } catch {
      // ignore parse error
    }
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function fetchHealth() {
  return request('/api/health');
}

// ─── Assignments ──────────────────────────────────────────────────────────────

/**
 * Fetch all assignments with optional filters.
 * @param {{ search?: string, topic?: string, category?: string, difficulty?: string }} params
 */
export async function fetchAssignments(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, v); });
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request(`/api/assignments${query}`);
}

/** @param {number} id */
export async function fetchAssignment(id) {
  return request(`/api/assignments/${id}`);
}

/**
 * @param {object} data
 * @param {string} token  — admin token
 */
export async function createAssignment(data, token) {
  return request('/api/assignments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

/**
 * @param {number} id
 * @param {object} data
 * @param {string} token
 */
export async function updateAssignment(id, data, token) {
  return request(`/api/assignments/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

/**
 * @param {number} id
 * @param {string} token
 */
export async function deleteAssignment(id, token) {
  return request(`/api/assignments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
