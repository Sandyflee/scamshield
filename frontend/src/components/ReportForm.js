import React, { useState } from 'react';
import { submitReport } from '../api';

const SCAM_TYPES = ['phishing', 'romance', 'job', 'crypto', 'delivery', 'other'];

export default function ReportForm({ onSubmitted }) {
  const [form, setForm] = useState({
    scam_type: 'phishing',
    title: '',
    description: '',
    url: '',
    contact_info: '',
    reporter_name: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim()) return;
    setSubmitting(true);
    setStatus(null);
    try {
      await submitReport(form);
      setStatus({ type: 'success', message: 'Thanks — your report helps protect others.' });
      setForm({ scam_type: 'phishing', title: '', description: '', url: '', contact_info: '', reporter_name: '' });
      onSubmitted?.();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <label className="field-label">
        Scam type
        <select value={form.scam_type} onChange={(e) => update('scam_type', e.target.value)}>
          {SCAM_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </label>

      <label className="field-label">
        Title (optional)
        <input
          type="text"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Short summary, e.g. Fake bank SMS asking to verify account"
        />
      </label>

      <label className="field-label">
        What happened
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Describe the scam attempt…"
          required
        />
      </label>

      <label className="field-label">
        Link involved (optional)
        <input type="text" value={form.url} onChange={(e) => update('url', e.target.value)} />
      </label>

      <label className="field-label">
        Scammer's phone/email/handle (optional)
        <input type="text" value={form.contact_info} onChange={(e) => update('contact_info', e.target.value)} />
      </label>

      <label className="field-label">
        Your name (optional — leave blank to stay anonymous)
        <input type="text" value={form.reporter_name} onChange={(e) => update('reporter_name', e.target.value)} />
      </label>

      <button type="submit" className="btn-secondary" disabled={submitting || !form.description.trim()}>
        {submitting ? 'Submitting…' : 'Submit report'}
      </button>

      {status && (
        <p className={status.type === 'success' ? 'success-text' : 'error-text'}>{status.message}</p>
      )}
    </form>
  );
}
