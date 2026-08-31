const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export async function checkContent(inputType, inputContent) {
  const res = await fetch(`${API_BASE}/api/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input_type: inputType, input_content: inputContent })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Check failed.');
  }
  return res.json();
}

export async function submitReport(payload) {
  const res = await fetch(`${API_BASE}/api/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Report submission failed.');
  }
  return res.json();
}

export async function searchReports(query) {
  const params = new URLSearchParams(query);
  const res = await fetch(`${API_BASE}/api/reports?${params.toString()}`);
  if (!res.ok) throw new Error('Search failed.');
  return res.json();
}
