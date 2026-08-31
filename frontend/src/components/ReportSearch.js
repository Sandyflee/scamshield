import React, { useState } from 'react';
import { searchReports } from '../api';

export default function ReportSearch({ refreshKey }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    const data = await searchReports({ q: query });
    setResults(data);
    setSearched(true);
  }

  return (
    <div className="search-block">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by phone number, sender, or keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-outline">Search reports</button>
      </form>

      {searched && results.length === 0 && (
        <p className="muted-text">No matching reports yet. That doesn't mean it's safe — stay cautious.</p>
      )}

      {results.length > 0 && (
        <ul className="report-list">
          {results.map((r) => (
            <li key={r.id} className="report-item">
              <div className="report-item-header">
                <span className="report-type">{r.scam_type}</span>
                <span className="report-date">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              {r.title && <h4>{r.title}</h4>}
              <p>{r.description}</p>
              {r.contact_info && <p className="muted-text">Contact used: {r.contact_info}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
