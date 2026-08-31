import React, { useState } from 'react';
import './App.css';
import ShieldMark from './components/ShieldMark';
import ScamChecker from './components/ScamChecker';
import ReportForm from './components/ReportForm';
import ReportSearch from './components/ReportSearch';

export default function App() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">
          <ShieldMark size={28} />
          <span className="brand-name">ScamShield</span>
        </div>
      </header>

      <section className="hero">
        <h1>Before you click,<br />check first.</h1>
        <p className="hero-sub">
          Paste a suspicious message or link. ScamShield reads it the way a scammer built it —
          then tells you exactly what to watch for.
        </p>
      </section>

      <main className="content">
        <ScamChecker />

        <section className="reports-section">
          <div className="reports-header">
            <h2>What others have reported</h2>
            <button className="btn-text" onClick={() => setShowReportForm((s) => !s)}>
              {showReportForm ? 'Hide report form' : 'Report a scam'}
            </button>
          </div>

          {showReportForm && (
            <ReportForm onSubmitted={() => { setShowReportForm(false); setRefreshKey((k) => k + 1); }} />
          )}

          <ReportSearch refreshKey={refreshKey} />
        </section>
      </main>

      <footer className="site-footer">
        <p>ScamShield does its best to flag risk, but no tool catches everything. When in doubt, verify independently.</p>
      </footer>
    </div>
  );
}
