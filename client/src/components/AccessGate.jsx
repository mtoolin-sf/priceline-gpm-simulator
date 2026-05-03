import React, { useState, useEffect } from 'react';

const GATE_KEY = 'pbr_access_v1';
const VISITS_KEY = 'pbr_visits_v1';
const PASSWORD = 'Priceline2026!';

// Cloudflare Worker endpoint for visit logging (optional — fails silently if not set)
const WORKER_URL = import.meta.env.VITE_GATE_WORKER_URL || '';

async function logVisit(visitor) {
  if (!WORKER_URL) return;
  try {
    await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'access',
        app: 'priceline-gpm-simulator',
        ...visitor,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
      }),
    });
  } catch {
    // silent
  }
}

export default function AccessGate({ children }) {
  const [authed, setAuthed] = useState(() => {
    try { return !!localStorage.getItem(GATE_KEY); } catch { return false; }
  });
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authed) return children;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pass !== PASSWORD) {
      setError('Incorrect password. Contact your Salesforce account team.');
      return;
    }
    setSubmitting(true);
    const visitor = { name, company, role };
    try { localStorage.setItem(GATE_KEY, JSON.stringify({ ...visitor, ts: Date.now() })); } catch {}
    // Track visit count
    try {
      const visits = JSON.parse(localStorage.getItem(VISITS_KEY) || '[]');
      visits.push({ ...visitor, ts: new Date().toISOString() });
      localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
    } catch {}
    await logVisit(visitor);
    setSubmitting(false);
    setAuthed(true);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'linear-gradient(135deg, #0D0A1A 0%, #1A0A2E 50%, #0A1628 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: 24,
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(236,43,140,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(6,106,254,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: '44px 40px',
        width: '100%', maxWidth: 420, textAlign: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <img
            src="/priceline-logo.webp"
            alt="Priceline"
            style={{ height: 32, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 12 }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#EC2B8C', marginBottom: 6 }}>
            GPM + Loyalty Simulator
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Identify yourself to continue
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8, lineHeight: 1.6 }}>
            Enter your details and the access password<br />provided by your Salesforce account team.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { id: 'name',    val: name,    set: setName,    placeholder: 'Full Name',       type: 'text' },
            { id: 'company', val: company, set: setCompany, placeholder: 'Company',          type: 'text' },
            { id: 'role',    val: role,    set: setRole,    placeholder: 'Position / Role',  type: 'text' },
            { id: 'pass',    val: pass,    set: setPass,    placeholder: 'Access Password',  type: 'password' },
          ].map(f => (
            <input
              key={f.id}
              type={f.type}
              placeholder={f.placeholder}
              value={f.val}
              onChange={e => { f.set(e.target.value); setError(''); }}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff', fontSize: 14, outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          ))}

          {error && (
            <div style={{ fontSize: 12, color: '#f87171', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px', textAlign: 'left' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 6, padding: '14px', borderRadius: 14, border: 'none', cursor: submitting ? 'wait' : 'pointer',
              background: submitting ? 'rgba(236,43,140,0.5)' : 'linear-gradient(135deg, #EC2B8C, #C01070)',
              color: '#fff', fontSize: 14, fontWeight: 800,
              boxShadow: '0 8px 24px rgba(236,43,140,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {submitting ? 'Verifying…' : 'Enter Demo →'}
          </button>
        </form>

        <div style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
          Powered by Salesforce GPM + Loyalty Management
        </div>
      </div>
    </div>
  );
}
