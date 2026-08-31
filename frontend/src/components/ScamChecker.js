import React, { useState } from 'react';
import { checkContent } from '../api';

const RISK_COPY = {
  low: { label: 'Low risk', color: 'var(--risk-low)' },
  medium: { label: 'Medium risk', color: 'var(--risk-medium)' },
  high: { label: 'High risk', color: 'var(--risk-high)' }
};

export default function ScamChecker() {
  const [inputType, setInputType] = useState('text');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await checkContent(inputType, content.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checker-card">
      <div className="checker-tabs" role="tablist" aria-label="Input type">
        <button
          type="button"
          role="tab"
          aria-selected={inputType === 'text'}
          className={`tab ${inputType === 'text' ? 'tab-active' : ''}`}
          onClick={() => setInputType('text')}
        >
          Message or text
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={inputType === 'url'}
          className={`tab ${inputType === 'url' ? 'tab-active' : ''}`}
          onClick={() => setInputType('url')}
        >
          Link
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="checker-input"
          placeholder={
            inputType === 'text'
              ? 'Paste the message, email, or offer you want checked…'
              : 'Paste the link you want checked…'
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={inputType === 'text' ? 6 : 2}
        />
        <button type="submit" className="btn-primary" disabled={loading || !content.trim()}>
          {loading ? 'Checking…' : 'Check for scams'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-panel">
          <div className="result-header">
            <span
              className="risk-badge"
              style={{ backgroundColor: RISK_COPY[result.risk_level]?.color || 'var(--ink-soft)' }}
            >
              {RISK_COPY[result.risk_level]?.label || 'Unknown risk'}
            </span>
          </div>
          {result.red_flags?.length > 0 && (
            <ul className="flag-list">
              {result.red_flags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          )}
          <p className="result-explanation">{result.explanation}</p>
          <p className="result-action"><strong>Do this next:</strong> {result.suggested_action}</p>
        </div>
      )}
    </div>
  );
}
