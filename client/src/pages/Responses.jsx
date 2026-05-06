import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ─── Arrow primitive ──────────────────────────────────────────────────────────

function Arr({ label, reverse = false, dashed = false, color = '#94A3B8' }) {
  const lineStyle = {
    flex: 1,
    height: '2px',
    background: dashed
      ? `repeating-linear-gradient(90deg, ${color} 0, ${color} 5px, transparent 5px, transparent 10px)`
      : color,
  };
  const tip = { borderTop: '4px solid transparent', borderBottom: '4px solid transparent' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 60 }}>
      {label && <span style={{ fontSize: '10px', color: '#7A8A9A', marginBottom: 3, whiteSpace: 'nowrap', fontStyle: 'italic' }}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {reverse && <div style={{ ...tip, borderRight: `7px solid ${color}`, marginRight: 1 }} />}
        <div style={lineStyle} />
        {!reverse && <div style={{ ...tip, borderLeft: `7px solid ${color}`, marginLeft: 1 }} />}
      </div>
    </div>
  );
}

// ─── Diagram 1: Online POS flow ───────────────────────────────────────────────

function OnlinePOSFlow() {
  const steps = [
    {
      num: 1, stage: 'Cart Review', apiLabel: 'Eligible\nPromotion API', apiColor: '#022AC0',
      engineLabel: 'Global Promotions', engineBg: '#EBF5FF', engineBorder: '#022AC0',
      engineSteps: ['Check for eligible promotions', 'Get rewards'],
      req: 'Cart', res: 'Eligible promotions + coupon codes',
    },
    {
      num: 2, stage: 'Checkout', apiLabel: 'Promotion\nExecution API', apiColor: '#6B21A8',
      engineLabel: 'Promotion Execution Engine', engineBg: '#F3EEF9', engineBorder: '#6B21A8',
      engineSteps: ['Validate coupons, get eligible promos', 'Get evaluation strategy', 'Apply promos — line, cross-line, order'],
      req: 'Cart + Coupons', res: 'Discounted Cart',
    },
    {
      num: 3, stage: 'Order Confirmation', apiLabel: 'Transaction\nJournal API', apiColor: '#0D9DDA',
      engineLabel: 'Loyalty Promotions Engine', engineBg: '#E6F7FF', engineBorder: '#0D9DDA',
      engineSteps: ['Apply loyalty rewards', 'Store pricing promotions', 'Issue points, badges, vouchers'],
      req: 'Order + promotions applied', res: 'Rewards Applied',
    },
  ];

  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', fontFamily: "'Salesforce Sans', system-ui, -apple-system, sans-serif" }}>
      <div style={{ background: '#001E5B', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D9DDA' }}>Online Flow</span>
        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)' }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>POS integration with Eligibility and Execution in GPM</span>
      </div>
      <div style={{ padding: '18px 20px' }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ marginBottom: i < 2 ? 18 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: s.apiColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.num}</div>
              <span style={{ fontWeight: 700, fontSize: 12, color: '#001E5B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.stage}</span>
            </div>
            {/* Request row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 34, flexWrap: 'wrap', rowGap: 8 }}>
              <div style={{ background: '#3E4D5C', color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', borderRadius: 8, padding: '9px 14px', flexShrink: 0 }}>POS</div>
              <Arr label={s.req} color={s.apiColor} />
              <div style={{ background: s.apiColor, color: '#fff', fontWeight: 700, fontSize: 11, borderRadius: 8, padding: '9px 12px', textAlign: 'center', lineHeight: 1.3, minWidth: 98, flexShrink: 0, whiteSpace: 'pre-line' }}>{s.apiLabel}</div>
              <Arr color={s.engineBorder} />
              <div style={{ background: s.engineBg, border: `1.5px solid ${s.engineBorder}`, borderRadius: 8, padding: '10px 12px', minWidth: 170, flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 11, color: s.engineBorder, marginBottom: 6 }}>{s.engineLabel}</div>
                {s.engineSteps.map((step, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: j < s.engineSteps.length - 1 ? 4 : 0 }}>
                    <span style={{ fontSize: 9, color: s.engineBorder, marginTop: 2, flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: 11, color: '#3E4D5C', lineHeight: 1.35 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Response arrow */}
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 82, marginTop: 5 }}>
              <Arr label={s.res} reverse dashed color="#94A3B8" />
            </div>
            {i < 2 && <div style={{ marginTop: 14, borderTop: '1px dashed #E2E8F0' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Diagram 2: Offline POS flow ──────────────────────────────────────────────

function OfflinePOSFlow() {
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', fontFamily: "'Salesforce Sans', system-ui, -apple-system, sans-serif" }}>
      <div style={{ background: '#001E5B', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#E4A201' }}>Offline Flow</span>
        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)' }} />
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Maintained externally by WesHealth middleware</span>
      </div>
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Section 1: Disconnected operation */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E4A201' }} />
            <span style={{ fontWeight: 700, fontSize: 12, color: '#4F2100', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Disconnected Operation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16, flexWrap: 'wrap', rowGap: 8 }}>
            <div style={{ background: '#3E4D5C', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 8, padding: '9px 14px', flexShrink: 0 }}>POS</div>
            {/* Bidirectional arrows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 80, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10, color: '#7A8A9A', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Cart</span>
                <div style={{ flex: 1, height: 2, background: '#E4A201' }} />
                <div style={{ borderLeft: '6px solid #E4A201', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ borderRight: '6px solid #6B7280', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
                <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #6B7280 0, #6B7280 5px, transparent 5px, transparent 10px)' }} />
                <span style={{ fontSize: 10, color: '#7A8A9A', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Discounted Cart</span>
              </div>
            </div>
            <div style={{ background: '#4F2100', color: '#fff', fontWeight: 700, fontSize: 11, borderRadius: 8, padding: '9px 12px', textAlign: 'center', lineHeight: 1.3, minWidth: 90, flexShrink: 0 }}>POS Promo<br />Engine</div>
            <div style={{ padding: '8px 12px', background: '#FBF3E0', border: '1.5px solid #FCC003', borderRadius: 8, fontSize: 11, color: '#4F2100', lineHeight: 1.5, maxWidth: 260 }}>
              <strong>While offline:</strong> cached promotions applied locally. Transactions queued with UUID + timestamp for replay on reconnect.
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed #E2E8F0' }} />

        {/* Section 2: Sync */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#022AC0' }} />
            <span style={{ fontWeight: 700, fontSize: 12, color: '#001E5B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sync — Newly Created / Updated Promotions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16, flexWrap: 'wrap', rowGap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
              <div style={{ background: '#3E4D5C', color: '#fff', fontWeight: 700, fontSize: 11, borderRadius: 6, padding: '5px 10px', textAlign: 'center' }}>POS</div>
              <div style={{ background: '#4F2100', color: '#fff', fontWeight: 700, fontSize: 10, borderRadius: 6, padding: '5px 10px', textAlign: 'center', lineHeight: 1.2 }}>POS Promo<br />Engine</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 100, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10, color: '#7A8A9A', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Get Promotion Config</span>
                <div style={{ flex: 1, height: 2, background: '#022AC0' }} />
                <div style={{ borderLeft: '6px solid #022AC0', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ borderRight: '6px solid #6B7280', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
                <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #6B7280 0, #6B7280 5px, transparent 5px, transparent 10px)' }} />
                <span style={{ fontSize: 10, color: '#7A8A9A', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Promotion Details</span>
              </div>
            </div>
            <div style={{ background: '#022AC0', color: '#fff', fontWeight: 700, fontSize: 11, borderRadius: 8, padding: '9px 12px', textAlign: 'center', lineHeight: 1.3, minWidth: 100, flexShrink: 0 }}>Promotion<br />Config API</div>
            <Arr color="#022AC0" />
            <div style={{ background: '#EBF5FF', border: '1.5px solid #022AC0', borderRadius: 8, padding: '10px 12px', minWidth: 130, flexShrink: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: '#022AC0', marginBottom: 5 }}>Promotions Catalog</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                <span style={{ fontSize: 9, color: '#022AC0', marginTop: 2 }}>▸</span>
                <span style={{ fontSize: 11, color: '#3E4D5C' }}>All active promotions</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, paddingLeft: 16 }}>
            <div style={{ padding: '8px 12px', background: '#EBF5FF', border: '1.5px solid #90D0FE', borderRadius: 8, fontSize: 11, color: '#001E5B', lineHeight: 1.5, display: 'inline-block' }}>
              <strong>ExternalTransactionNumber</strong> on TJ API guarantees idempotent replay — no duplicate point awards on reconnect.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Diagram 3: Composable architecture member journey ────────────────────────

function LoyaltyJourneyDiagram() {
  const STAGES = [
    { num: 1, label: 'Store Arrival', cx: 'Member enters store' },
    { num: 2, label: 'Member ID', cx: 'Taps card or scans app — recognised at checkout' },
    { num: 3, label: 'Cart Scan', cx: 'Items scanned, prices displayed' },
    { num: 4, label: 'Offer Check', cx: 'Eligible promotions surfaced in real time' },
    { num: 5, label: 'Checkout', cx: 'Discounts applied, payment confirmed' },
    { num: 6, label: 'Rewards', cx: 'Points + vouchers on receipt' },
    { num: 7, label: 'Post-Purchase', cx: 'Notification, next offer delivered' },
  ];

  const SYSTEMS = [
    {
      key: 'pos', label: 'POS / Kiosk', sublabel: 'WesHealth owned', color: '#444447', bg: '#E5E5E5',
      cells: {
        2: { text: 'Reads loyalty card / app barcode', owns: false },
        3: { text: 'Scans items — builds cart payload', owns: true },
        4: { text: 'Displays returned eligible offers', owns: false },
        5: { text: 'Confirms order, processes payment', owns: true },
        6: { text: 'Prints receipt — points + vouchers', owns: false },
      },
    },
    {
      key: 'mw', label: 'Middleware', sublabel: 'WesHealth owned', color: '#7C3AED', bg: '#F5F3FF',
      cells: {
        2: { text: 'Routes identity lookup to CDP', owns: false },
        4: { text: 'Calls GPM Eligible Promotions API', owns: false },
        5: { text: 'Calls GPM Execution API → discounted cart', owns: false },
        6: { text: 'Creates TJ records async (1 per line item)', owns: false },
        7: { text: 'Queues offline transactions for replay', owns: false },
      },
    },
    {
      key: 'lms', label: 'LMS / GPM', sublabel: 'Salesforce', color: '#022AC0', bg: '#EBF5FF',
      cells: {
        4: { text: 'Evaluates promo rules → returns eligible offers', owns: true },
        5: { text: 'Applies discounts — line, cross-line, order', owns: true },
        6: { text: 'Awards points, vouchers, tier progress', owns: true },
        7: { text: 'Fires Platform Events — tier, milestone, voucher', owns: false },
      },
    },
    {
      key: 'cdp', label: 'CDP', sublabel: 'WesHealth owned', color: '#059669', bg: '#ECFDF5',
      cells: {
        2: { text: 'Resolves member → returns tier, balance, active offers', owns: true },
        4: { text: 'Provides member segment context for rule evaluation', owns: false },
        6: { text: 'Receives updated balance + tier via Platform Events', owns: true },
        7: { text: 'Updates profile → triggers next-best-offer logic', owns: true },
      },
    },
    {
      key: 'ma', label: 'Marketing Automation', sublabel: 'WesHealth owned', color: '#EC2B8C', bg: '#FEF2F8',
      cells: {
        7: { text: 'Sends receipt, points summary + personalised next offer', owns: true },
      },
    },
    {
      key: 'dl', label: 'Data Lake', sublabel: 'WesHealth owned', color: '#D97706', bg: '#FBF3E0',
      cells: {
        5: { text: 'Receives transaction event stream', owns: false },
        6: { text: 'Stores loyalty event — points, vouchers, promos fired', owns: false },
        7: { text: 'Feeds propensity models for next campaign', owns: false },
      },
    },
  ];

  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #E2E8F0', fontFamily: "'Salesforce Sans', system-ui, -apple-system, sans-serif" }}>
      <div style={{ minWidth: 900 }}>
        {/* Header */}
        <div style={{ background: '#001E5B', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0D9DDA' }}>Composable Architecture</span>
          <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Member in-store journey — system ownership at each step</span>
        </div>

        {/* Customer experience lane */}
        <div style={{ display: 'flex', background: '#F8FAFC', borderBottom: '2px solid #CBD5E1' }}>
          <div style={{ width: 130, flexShrink: 0, padding: '12px 14px', display: 'flex', alignItems: 'center', borderRight: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 11, color: '#001E5B' }}>Customer</div>
              <div style={{ fontSize: 10, color: '#7A8A9A', marginTop: 1 }}>Experience</div>
            </div>
          </div>
          {STAGES.map((stage) => (
            <div key={stage.num} style={{ flex: 1, padding: '10px 6px', borderLeft: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#EC2B8C', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px' }}>{stage.num}</div>
              <div style={{ fontWeight: 700, fontSize: 10, color: '#001E5B', lineHeight: 1.2, marginBottom: 3 }}>{stage.label}</div>
              <div style={{ fontSize: 9, color: '#64748B', lineHeight: 1.4 }}>{stage.cx}</div>
            </div>
          ))}
        </div>

        {/* System rows */}
        {SYSTEMS.map((sys, si) => (
          <div key={sys.key} style={{ display: 'flex', borderBottom: si < SYSTEMS.length - 1 ? '1px solid #E2E8F0' : 'none', background: '#fff', minHeight: 60 }}>
            <div style={{ width: 130, flexShrink: 0, padding: '10px 14px', background: sys.bg, borderLeft: `4px solid ${sys.color}`, borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 10, color: sys.color, lineHeight: 1.2 }}>{sys.label}</div>
              <div style={{ fontSize: 9, color: '#7A8A9A', marginTop: 2 }}>{sys.sublabel}</div>
            </div>
            {STAGES.map((stage) => {
              const cell = sys.cells[stage.num];
              return (
                <div key={stage.num} style={{ flex: 1, padding: '7px 5px', borderLeft: '1px solid #E2E8F0', background: cell?.owns ? sys.bg : '#fff', display: 'flex', alignItems: 'center' }}>
                  {cell && (
                    <div style={{ background: cell.owns ? '#fff' : 'transparent', border: cell.owns ? `1.5px solid ${sys.color}50` : 'none', borderRadius: 6, padding: cell.owns ? '5px 7px' : '2px 0', width: '100%' }}>
                      {cell.owns && <div style={{ fontSize: 8, fontWeight: 700, color: sys.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Owns</div>}
                      <div style={{ fontSize: 9.5, color: '#3E4D5C', lineHeight: 1.4 }}>{cell.text}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, background: '#022AC0', borderRadius: 2 }} />
            <span style={{ fontSize: 10, color: '#64748B' }}>Salesforce Loyalty Management — loyalty execution layer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, background: '#7C3AED', borderRadius: 2 }} />
            <span style={{ fontSize: 10, color: '#64748B' }}>Middleware — orchestration only, no business logic ownership</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, border: '1.5px solid #022AC0', borderRadius: 2 }} />
            <span style={{ fontSize: 10, color: '#64748B' }}>Owns = primary system responsibility at this step</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reference docs ──────────────────────────────────────────────────────────

function ReferenceDocs({ docs }) {
  if (!docs || docs.length === 0) return null;
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#022AC0', whiteSpace: 'nowrap' }}>Reference Documentation</div>
        <div style={{ flex: 1, height: 1, background: '#90D0FE' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6 }}>
        {docs.map((d, i) => (
          <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#EAF5FE', border: '1px solid #90D0FE', borderRadius: 6, padding: '8px 10px', textDecoration: 'none' }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, background: '#022AC0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>↗</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#001E5B', lineHeight: 1.3, marginBottom: 2 }}>{d.label}</div>
              <div style={{ fontSize: 9, color: '#737479', lineHeight: 1.4 }}>{d.sub}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Payload viewer ──────────────────────────────────────────────────────────

function PayloadViewer({ title, direction, description, json }) {
  const [open, setOpen] = useState(false);
  const dirColor = direction.startsWith('SF →') ? '#022AC0' : direction.startsWith('NCR →') ? '#4F2100' : '#0D3D1F';
  const dirBg = direction.startsWith('SF →') ? '#EAF5FE' : direction.startsWith('NCR →') ? '#FBF3E0' : '#E8F5ED';
  const dirBorder = direction.startsWith('SF →') ? '#90D0FE' : direction.startsWith('NCR →') ? '#FCC003' : '#1A7F4E';
  return (
    <div style={{ border: `1px solid ${dirBorder}`, borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: dirBg, border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: dirColor, background: 'rgba(0,0,0,0.06)', padding: '2px 7px', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0 }}>{direction}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: dirColor, flex: 1 }}>{title}</span>
        <span style={{ fontSize: 11, color: dirColor, opacity: 0.6, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ background: '#fff' }}>
          <div style={{ padding: '10px 14px 8px', borderBottom: `1px solid ${dirBorder}`, background: dirBg, opacity: 0.85 }}>
            <p style={{ fontSize: 12, color: dirColor, lineHeight: 1.55, margin: 0 }}>{description}</p>
          </div>
          <pre style={{ margin: 0, padding: '14px 16px', fontSize: 11, color: '#181818', background: '#F3F3F3', overflowX: 'auto', lineHeight: 1.6, fontFamily: 'monospace' }}>
            {JSON.stringify(json, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

const VERDICT_STYLE = {
  'MEETS':       { pill: '#E8F5ED', pillText: '#0D3D1F', pillBorder: '#1A7F4E' },
  'NOT AN ISSUE':{ pill: '#EAF5FE', pillText: '#001E5B', pillBorder: '#90D0FE' },
  'RECOMMENDED': { pill: '#F9F0FF', pillText: '#481A54', pillBorder: '#D17DFE' },
};

const SLIDES = [
  {
    id: 'architecture',
    isArchitecture: true,
    qNum: null,
    title: 'Composable Loyalty Architecture',
    subtitle: 'Member In-Store Journey — System Ownership Model',
    docs: [
      { label: 'Loyalty Management Developer Guide', sub: 'API architecture, REST integration points, composable deployment model', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/loyalty_intro.htm' },
      { label: 'Platform Events Developer Guide', sub: 'Publish/subscribe for tier-change, voucher, and milestone events to CDP', url: 'https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/platform_events_intro.htm' },
      { label: 'Global Promotions Management Overview', sub: 'GPM rule library, processing rule sets, eligible-promotions + execution API flow', url: 'https://help.salesforce.com/s/articleView?id=sf.global_promotions_management.htm&type=5' },
    ],
    intro: [
      'This diagram shows the full in-store loyalty journey from the customer\'s perspective and maps every step to the system that owns it in a composable architecture. Each system has exactly one job. Middleware is the orchestration layer — it routes, retries, and queues, but owns no business logic.',
      'Salesforce Loyalty Management owns loyalty execution. WesHealth\'s CDP owns member identity. WesHealth\'s POS owns the transaction. Marketing Automation owns customer communication. The Data Lake owns analytics. This delineation is the architecture Salesforce recommends for operators with a mature integration stack.',
    ],
  },
  {
    id: 'q1', qNum: 1, ref: 'NFR 1.25', title: 'API Response Times', verdict: 'MEETS',
    verdictNote: 'Core checkout APIs well within 250ms. TJ processing is async — not in the POS response path.',
    question: 'The platform must meet a 250ms response time SLA for all synchronous loyalty API calls at POS under peak load. Please provide evidence of API performance including average and peak measurements for all APIs in the POS integration path.',
    answer: [
      'Salesforce Loyalty Management API performance is well within the 250ms threshold across all core checkout operations. The Priceline GPM Simulator demonstrated here ran 7 promotion use cases — 10 active SF promotion records covering quantity thresholds, buy-more-earn-more tiers, engagement trails, spend multipliers, SKU-level app exclusives, and new cardholder welcome offers. All 10 promotion rules were evaluated concurrently on every Eligible Promotions call, across 18 products, 6 product categories, 7 member profiles, and 4 channels. GetMemberPromotions averaged 210ms and Promotion Execution averaged 230ms under that full rule load — both within threshold.',
      'Transaction Journal processing runs asynchronously after the POS receives its checkout response. It is not in the synchronous response path and is not in scope for the 250ms NFR. The TJ engine applies loyalty rewards, issues points and vouchers, and stores pricing promotions in the background without adding latency to the customer-facing transaction.',
      'On infrastructure scalability: Salesforce Hyperforce is elastic. The GPM and Loyalty Management APIs are provisioned on shared Salesforce infrastructure that scales horizontally with org demand. For WesHealth\'s specific peak load requirements — peak transaction volume, concurrent POS terminals, promotional density at peak events — Salesforce can provide dedicated capacity commitments and performance SLA addenda as part of the enterprise agreement. We are ready to provide WesHealth\'s load profile and run a formal capacity sizing exercise against those numbers.',
    ],
    loadTestCallout: {
      label: 'Priceline simulator load test',
      rows: [
        { k: 'Active promotion rules evaluated', v: '10 concurrently per call' },
        { k: 'Use cases covered', v: '7 (qty threshold, tiered points, engagement trail, spend multiplier, SKU multiplier, welcome offer, tiered GC)' },
        { k: 'Products in catalog', v: '18 across 6 categories' },
        { k: 'Member profiles tested', v: '7 (Gold, Silver, Standard, New, Non-member, OOS)' },
        { k: 'Channels tested', v: '4 (In Store, Online, App, Out of Store)' },
        { k: 'Eligible Promotions avg response', v: '210ms' },
        { k: 'Promotion Execution avg response', v: '230ms' },
      ],
    },
    table: {
      headers: ['API', 'Avg Response Time', 'Customer Journey Stage'],
      rows: [
        ['MemberVouchers', '47ms', 'Checkout — active voucher display'],
        ['TransactionLedgers', '74ms', 'Post-purchase — points balance confirmation'],
        ['LoyaltyViewTransactionHistory', '88ms', 'Post-purchase — transaction history'],
        ['IssueVoucher', '119ms', 'Checkout — voucher reward issuance'],
        ['EnrollInPromotion', '119ms', 'Checkout — promotion application'],
        ['OptOutPromotion', '122ms', 'Member self-service — offer management'],
        ['CreditPointsToMembers', '154ms', 'Post-purchase — points accrual'],
        ['DebitPointsFromMembers', '156ms', 'Checkout — points redemption'],
        ['GetMemberPromotions (Step 1)', '210ms', 'Cart review — eligible promotions check'],
        ['Promotion Execution (Step 2)', '230ms', 'Checkout — promotion execution & discount calculation'],
        ['MemberProfile', '230ms', 'Session start — member identification'],
      ],
    },
    diagram: 'online',
    diagramCaption: 'Three-step POS integration flow as demonstrated in the Priceline simulator — Eligible Promotions, Execution, and Transaction Journal.',
    docs: [
      { label: 'Loyalty Management REST API Reference', sub: 'MemberProfile, EligiblePromotions, Execution, TransactionJournal, Vouchers', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/loyalty_api_rest.htm' },
      { label: 'GPM Eligible Promotions API', sub: 'Request/response schema, concurrent rule evaluation — the 210ms POS call', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/loyalty_gpm_api_intro.htm' },
      { label: 'TransactionJournal sObject Reference', sub: 'ExternalTransactionNumber, ActivityDate, async processing model', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/sforce_api_objects_transactionjournal.htm' },
      { label: 'Hyperforce Infrastructure Overview', sub: 'Elastic scaling, SLA addenda, enterprise capacity commitments', url: 'https://help.salesforce.com/s/articleView?id=sf.hyperforce_overview.htm&type=5' },
    ],
  },
  {
    id: 'q2', qNum: 2, ref: 'NFR 1.05 / 1.06 / 3.17 / FR 12.03', title: 'Data Residency', verdict: 'MEETS',
    verdictNote: 'Core LMS data in AP2 Sydney on Hyperforce. Einstein features scoped via MSA addendum.',
    question: 'All member data, transaction records, and loyalty activity must be stored and processed within Australia. Please confirm data residency compliance for all platform components including any AI or machine learning features.',
    answer: [
      'Salesforce Loyalty Management and GPM are available on Salesforce\'s AP Southeast 2 (Sydney) Hyperforce infrastructure. All transactional data — member records, transaction journals, promotion definitions, vouchers, loyalty ledgers — is stored and processed within Australia. This directly satisfies WesHealth\'s core data residency obligation.',
      'For any AI or Einstein features in scope, the right approach is a data residency addendum in the Salesforce MSA that explicitly lists which features are provisioned and confirms AP2 processing for all of them. Any AI inference operates on non-PII loyalty signals — purchase category, tier, points balance — giving WesHealth full control over what data is used and where.',
      'This is a standard commercial arrangement Salesforce executes with regulated-industry customers across the region, and the Salesforce legal and compliance teams have established templates to support it.',
    ],
    callouts: [
      { label: 'Loyalty Management data storage', value: 'AP2 Sydney', sub: 'Confirmed on Hyperforce', green: true },
      { label: 'Member transactional records', value: 'AU only', sub: 'No offshore transit', green: true },
      { label: 'Einstein AI features', value: 'MSA addendum', sub: 'Standard regulated-industry template', green: false },
    ],
    docs: [
      { label: 'Hyperforce Data Residency', sub: 'AP2 Sydney coverage, data classification scope, region-specific provisioning', url: 'https://help.salesforce.com/s/articleView?id=sf.hyperforce_data_residency.htm&type=5' },
      { label: 'Salesforce Data Processing Addendum', sub: 'Legal template for regulated-industry MSA data residency obligations', url: 'https://www.salesforce.com/content/dam/web/en_us/www/documents/legal/Agreements/data-processing-addendum.pdf' },
      { label: 'Salesforce System Status — AP2', sub: 'Live uptime, incident history for the Sydney region hosting LMS', url: 'https://status.salesforce.com' },
    ],
  },
  {
    id: 'q3', qNum: 3, ref: 'NFR 1.26 / FR 13.02', title: 'Offline POS', verdict: 'MEETS',
    verdictNote: 'Clean pattern via middleware offline queue. TJ API idempotency built in.',
    question: 'WesHealth stores operate in environments with intermittent or no internet connectivity. The loyalty platform must support fully operational offline POS mode with seamless reconciliation on reconnect, without loss of promotional entitlements or duplicate point awards.',
    answer: [
      'Salesforce Loyalty Management\'s headless REST architecture is designed to support offline POS patterns cleanly. The implementation gives WesHealth full offline capability with complete reconciliation.',
      'At session start, middleware syncs each member\'s current state — balance, active vouchers, eligible promotions — to local device or store edge cache. While disconnected, the POS applies cached promotions, issues estimated points, and queues every transaction locally with a UUID, timestamp, and full payload.',
      'The Salesforce TJ API supports an ExternalTransactionNumber field that guarantees replay without duplication. Transactions are evaluated using the activityDate (time of purchase), ensuring every promotion valid at time of transaction is honoured — regardless of when connectivity was restored. Single-use voucher codes can be pre-downloaded to the POS cache ahead of high-risk periods.',
      'WesHealth\'s own middleware owns the queue and replay logic — a clean, operationally transparent layer with full visibility and control over offline reconciliation.',
    ],
    callouts: [
      { label: 'TJ API idempotency', value: 'Built in', sub: 'ExternalTransactionNumber field', green: true },
      { label: 'Promotion replay', value: 'activityDate', sub: 'Evaluated at time of purchase', green: true },
      { label: 'Voucher redemption offline', value: 'Pre-cache', sub: 'Single-use codes downloaded to POS', green: true },
      { label: 'Middleware dependency', value: 'WesHealth owned', sub: 'No third-party integration required', green: true },
    ],
    diagram: 'offline',
    diagramCaption: 'Offline use case — POS operates self-contained with cached promotions. On reconnect, transactions replay idempotently via ExternalTransactionNumber.',
    docs: [
      { label: 'TransactionJournal sObject Reference', sub: 'ExternalTransactionNumber idempotency, ActivityDate time-of-purchase evaluation', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/sforce_api_objects_transactionjournal.htm' },
      { label: 'Loyalty Management REST API Reference', sub: 'TransactionJournal POST, CreditPoints, and reversal endpoints', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/loyalty_api_rest.htm' },
    ],
  },
  {
    id: 'q4', qNum: 4, ref: 'FR 12.01', title: 'Identity Decoupling', verdict: 'MEETS',
    verdictNote: 'No Salesforce identity or login required. Stub-Contact pattern in production at scale.',
    question: 'WesHealth will maintain its own member identity platform and CDP as the canonical source of truth. The loyalty system must not require members to authenticate via Salesforce, and must not store PII beyond the minimum required for loyalty record linkage.',
    answer: [
      'Salesforce LMS is fully compatible with an external identity master. The LoyaltyProgramMember record links to a lightweight Salesforce Contact, which in this architecture functions purely as an internal join key — not a customer identity record.',
      'WesHealth\'s member database or CDP remains the canonical identity and authentication system. Salesforce holds a minimal stub Contact per member — no email, no phone, no address, no Salesforce login, no Community access. An ExternalId field on Contact maps directly to WesHealth\'s member ID. Field-level security restricts Contact access to the integration service user only.',
      'No PII is duplicated beyond what the loyalty record itself requires. This pattern is in production at multiple large loyalty programmes globally and is the recommended architecture for customers operating their own identity infrastructure.',
    ],
    callouts: [
      { label: 'Salesforce login required', value: 'None', sub: 'No Community or identity dependency', green: true },
      { label: 'Identity master', value: 'WesHealth CDP', sub: 'Salesforce holds stub Contact only', green: true },
      { label: 'External ID mapping', value: 'Supported', sub: 'ExternalId__c field on Contact', green: true },
      { label: 'PII in Salesforce', value: 'Minimal', sub: 'Only what the loyalty record requires', green: true },
    ],
    docs: [
      { label: 'LoyaltyProgramMember sObject Reference', sub: 'Contact linkage, MembershipNumber, minimal PII footprint for stub-Contact pattern', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/sforce_api_objects_loyaltyprogrammember.htm' },
      { label: 'REST API — External ID Upsert', sub: 'Write records via WesHealth member ID as ExternalId — the enrolment pattern', url: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_upsert.htm' },
      { label: 'OAuth 2.0 JWT Bearer Flow', sub: 'Service-to-service auth — no end-user session required', url: 'https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5' },
    ],
  },
  {
    id: 'q5', qNum: 5, ref: 'FR 14.01 / FR 14.02', title: '1:1 Personalisation at Scale', verdict: 'MEETS',
    verdictNote: 'Salesforce executes personalised offers. Decisioning engine is WesHealth\'s CDP.',
    question: 'The platform must support delivery of 10–20 personalised offers per member per week, with SKU-level promotion targeting and full attribution reporting for supplier-funded campaigns. Please describe the personalisation architecture.',
    answer: [
      'Salesforce LMS is purpose-built to execute personalised offers at scale. The LoyaltyProgramMemberPromotion junction object links a specific promotion to a specific member, giving WesHealth the ability to deliver 10–20 discrete personalised offers per member per week with full eligibility enforcement, redemption tracking, and points application at POS.',
      'SKU-level targeting is native to the GPM rule engine — qualification rules support specific SKU, brand, category, or UPC. Supplier-funded campaigns are modelled as promotions with FundingSource custom fields pointing to the supplier\'s Account, enabling clean cost attribution and billing reporting.',
      'WesHealth retains full ownership of the personalisation logic. The decisioning engine — whether WesHealth\'s CDP, a propensity model, or a campaign management platform — generates offer assignments and writes them to Salesforce via the EnrollInPromotion API in batch. Salesforce is the execution engine. WesHealth\'s CDP is the brain.',
    ],
    callouts: [
      { label: 'Personalised offers per member', value: '10–20 / week', sub: 'No platform limit on assignments', green: true },
      { label: 'SKU-level targeting', value: 'Native', sub: 'GPM rules support SKU, brand, category, UPC', green: true },
      { label: 'Supplier-funded campaigns', value: 'Supported', sub: 'FundingSource attribution built in', green: true },
      { label: 'Offer decisioning', value: 'WesHealth CDP', sub: 'Clean separation — Salesforce executes', green: false },
    ],
    docs: [
      { label: 'Real-Time Offer Management', sub: 'RTOM decisioning architecture, CDP-to-Salesforce offer assignment, AI/ML scoring', url: 'https://help.salesforce.com/s/articleView?id=sf.real_time_offer_management.htm&type=5' },
      { label: 'LoyaltyProgramMemberPromotion sObject', sub: 'Junction object for per-member offer assignments — the 10–20/week personalisation model', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/sforce_api_objects_loyaltyprogrammemberpromotion.htm' },
      { label: 'EnrollInPromotion API', sub: 'Bulk offer assignment from CDP to Salesforce — batch enrolment and upsert patterns', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/loyalty_api_enroll_promotion.htm' },
    ],
  },
  {
    id: 'q6', qNum: 6, ref: 'GPM Limits', title: 'Active Promotions Limit', verdict: 'NOT AN ISSUE',
    verdictNote: '200 per rule set, not org-wide. Multiple rule sets give 800–1,200+ capacity.',
    question: 'WesHealth has identified a documented limit of 200 active promotions within the GPM rule engine. Given our requirement for high-volume promotional calendars across franchise and corporate stores with personalised offer targeting, please address whether this is a material constraint.',
    answer: [
      'The 200 active promotions figure in Salesforce\'s documentation applies per processing rule set — not to the total promotion catalogue across the organisation.',
      'GPM supports multiple processing rule sets, typically structured by channel (in-store, online, app), by member tier, or by business unit. A standard deployment gives WesHealth capacity for 800–1,200 simultaneously active promotions before this figure becomes relevant.',
      'For context, a national pharmacy retailer running a full promotional calendar — category events, supplier campaigns, tier bonuses, welcome offers, product-of-the-week — typically operates 50–150 active promotions simultaneously. The platform carries significant headroom above that.',
      'For hyper-personalised campaigns at scale, the recommended architecture uses a smaller set of template promotions with member-specific qualification rules — the right design pattern for performance regardless of any platform limit.',
    ],
    callouts: [
      { label: 'Limit scope', value: 'Per rule set', sub: 'Not org-wide', green: true },
      { label: 'Capacity with 6 rule sets', value: '1,200+', sub: 'Active promotions simultaneously', green: true },
      { label: 'Typical retail active promos', value: '50–150', sub: 'Well within a single rule set', green: true },
    ],
    docs: [
      { label: 'GPM Processing Rule Sets', sub: '200 active promotions per rule set — scoping by channel, tier, or business unit', url: 'https://help.salesforce.com/s/articleView?id=sf.gpm_processing_rule_sets.htm&type=5' },
      { label: 'Global Promotions Management Overview', sub: 'Rule library structure, promotion types, evaluation order', url: 'https://help.salesforce.com/s/articleView?id=sf.global_promotions_management.htm&type=5' },
      { label: 'Loyalty Management Platform Limits', sub: 'Active promotions, API call limits, TransactionJournal volume thresholds', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/loyalty_limits.htm' },
    ],
  },
  {
    id: 'q7', qNum: 7, ref: 'FR 2.15', title: 'Franchise & Corporate Store Models', verdict: 'MEETS',
    verdictNote: 'LoyaltyPartner object supports franchisee cost caps. Two proven implementation patterns.',
    question: 'WesHealth operates a mixed network of franchise and corporate-owned stores. The platform must support store-level promotional differentiation and franchisee points issuance cost caps, with full audit capability and no single approach mandated.',
    answer: [
      'Salesforce LMS supports franchise and corporate store models via the LoyaltyPartner object, which represents a franchisee or brand partner and carries budget, funding, and commercial rule metadata. Promotions link directly to a partner, giving WesHealth a clean commercial structure for differentiated rules across the store network.',
      'For points issuance cost caps at the franchisee level, two implementation patterns are available depending on how tightly the cap needs to be enforced.',
      'A scheduled Flow runs at a configurable interval, sums loyalty ledger debits attributed to each franchisee\'s promotions, and deactivates partner-linked promotions when the threshold is reached. Simple to operate, fully auditable, and appropriate where the daily budget is in the thousands of dollars.',
      'For tighter enforcement, middleware maintains a counter per franchisee that decrements with each promotion execution call. When it reaches zero, the call is gated before it reaches Salesforce — per-transaction precision, appropriate where WesHealth has strict contractual obligations. Both patterns are proven in production.',
    ],
    callouts: [
      { label: 'LoyaltyPartner object', value: 'Native', sub: 'Franchisee and brand partner linkage', green: true },
      { label: 'Scheduled Flow cap', value: '~60 min', sub: 'Latency on threshold breach', green: true },
      { label: 'Middleware counter', value: 'Per-transaction', sub: 'Real-time enforcement, WesHealth owned', green: true },
    ],
    docs: [
      { label: 'LoyaltyPartner sObject Reference', sub: 'BudgetAllocation, funding metadata — backing franchisee cost caps and store differentiation', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/sforce_api_objects_loyaltypartner.htm' },
      { label: 'Set Up Loyalty Partners', sub: 'Creating partner records, linking promotions, setting budget metadata', url: 'https://help.salesforce.com/s/articleView?id=sf.loyalty_partners_setup.htm&type=5' },
      { label: 'Scheduled Flows Reference', sub: 'Aggregate LoyaltyLedger debits per partner for threshold enforcement', url: 'https://help.salesforce.com/s/articleView?id=sf.flow_concepts_trigger_scheduled.htm&type=5' },
    ],
  },
  {
    id: 'q8', qNum: 8, ref: 'Architecture', title: 'Headless / Own Middleware / No MuleSoft', verdict: 'RECOMMENDED',
    verdictNote: 'This is the architecture Salesforce recommends for customers with a mature integration stack.',
    question: 'WesHealth operates a mature integration stack including a proprietary CDP, middleware layer, and marketing automation platform. We require a fully headless deployment via REST APIs, without dependency on MuleSoft or Salesforce Marketing Cloud. Please confirm this is a supported and recommended architecture.',
    answer: [
      'A headless Salesforce LMS deployment — WesHealth\'s own middleware, own CDP, own marketing activation — is the architecture Salesforce recommends for operators of WesHealth\'s maturity. It gives WesHealth full stack ownership with Salesforce as a best-in-class loyalty execution engine.',
      'The LMS API surface is completely REST-first. Every capability — enrolment, points credit/debit, promotion execution, transaction journals, vouchers, member profile — is a discrete REST endpoint callable from any middleware. MuleSoft is one option, not a requirement.',
      'WesHealth\'s CDP is the identity and segmentation source of truth. It writes to Salesforce via REST for enrolment and offer assignment. Salesforce returns loyalty events — tier changes, redemptions, points milestones — via Platform Events, keeping the CDP in sync in real time. WesHealth\'s marketing platform subscribes to those same events. No Marketing Cloud dependency. No activation layer lock-in.',
    ],
    callouts: [
      { label: 'LMS API surface', value: 'Full REST', sub: 'No middleware product dependency', green: true },
      { label: 'Auth', value: 'OAuth 2.0 JWT', sub: 'Service-to-service, no user session', green: true },
      { label: 'CDP integration', value: 'Bidirectional', sub: 'REST writes + Platform Events', green: true },
      { label: 'MuleSoft', value: 'Optional', sub: 'One option, not a requirement', green: true },
      { label: 'Marketing activation', value: 'WesHealth owned', sub: 'Platform Events, no MC lock-in', green: true },
    ],
    docs: [
      { label: 'Loyalty Management REST API Reference', sub: 'Full REST surface: enrolment, points, promotions, TJ, vouchers, member profile', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/loyalty_api_rest.htm' },
      { label: 'Platform Events Developer Guide', sub: 'Subscribe to tier-change, voucher, and milestone events — no MC dependency', url: 'https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/platform_events_intro.htm' },
      { label: 'OAuth 2.0 JWT Bearer Flow', sub: 'Service-to-service auth — credentials, token refresh, no user session', url: 'https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_jwt_flow.htm&type=5' },
    ],
  },
  {
    id: 'ncr',
    isNcr: true,
    qNum: null,
    title: 'NCR Voyix POS Integration',
    subtitle: 'How Salesforce Loyalty Management connects to NCR Voyix at Priceline',
    intro: [
      'Priceline\'s NCR Voyix POS exposes a REST API platform that processes events across the transaction lifecycle. Salesforce LMS and GPM integrate as a headless promotion and loyalty execution engine — NCR owns the transaction, Salesforce owns the loyalty logic. Middleware (WesHealth owned) orchestrates the calls between them at the correct lifecycle hooks.',
    ],
    ncrApis: [
      { method: 'POST', path: '/bsp/v1/transactions/start', label: 'Start Transaction', when: 'Customer approaches register', sfAction: 'Middleware fetches member profile from CDP, pre-warms LMS member state' },
      { method: 'GET',  path: '/bsp/v1/loyalty/member/{id}', label: 'Member Lookup', when: 'Customer scans loyalty card / app', sfAction: 'Middleware calls LMS MemberProfile API → returns tier, balance, active vouchers to NCR' },
      { method: 'POST', path: '/bsp/v1/basket/items', label: 'Add Item to Basket', when: 'Cashier scans each product', sfAction: 'No call at this stage — NCR holds basket state' },
      { method: 'GET',  path: '/bsp/v1/basket/{id}', label: 'Get Basket', when: 'Basket finalized, pre-tender', sfAction: 'Middleware reads basket → builds GPM Eligible Promotions payload → calls SF GetMemberPromotions (210ms avg)' },
      { method: 'POST', path: '/bsp/v1/promotions/apply', label: 'Apply Promotions', when: 'Eligible offers returned, pre-payment', sfAction: 'Middleware calls SF Promotion Execution API (230ms avg) → returns discounted cart → NCR applies line/order discounts' },
      { method: 'POST', path: '/bsp/v1/transactions/tender', label: 'Tender / Payment', when: 'Customer pays', sfAction: 'No SF call in payment path — discounts already applied. TJ creation queued.' },
      { method: 'POST', path: '/bsp/v1/transactions/complete', label: 'Complete Transaction', when: 'Transaction confirmed', sfAction: 'Middleware creates 1 TJ per line item async via SF sobjects/TransactionJournal — points, vouchers, tier progress awarded' },
      { method: 'GET',  path: '/bsp/v1/transactions/{id}/receipt', label: 'Receipt', when: 'Receipt printed / emailed', sfAction: 'Middleware appends points earned + new balance + voucher codes from TJ response to receipt payload' },
    ],
    webhooks: [
      { event: 'transaction.completed', trigger: 'Final tender confirmed', use: 'Triggers async TJ batch if POS-side call failed — idempotent via ExternalTransactionNumber' },
      { event: 'basket.voided', trigger: 'Transaction cancelled', use: 'Middleware reverses any TJ records in Pending status via LMS reversal endpoint' },
      { event: 'member.identified', trigger: 'Loyalty card scanned', use: 'Middleware initiates LMS member pre-load for faster eligible promotions response at tender' },
      { event: 'promotion.applied', trigger: 'NCR native promo applied', use: 'Logged to Data Lake — reconciled against SF execution result for dual-engine audit trail' },
    ],
    docs: [
      { label: 'NCR Voyix BSP API Explorer', sub: 'Transaction lifecycle endpoints, basket operations, webhook event schema', url: 'https://developer.ncrvoyix.com/portals/dev-portal/api-explorer' },
      { label: 'GPM Eligible Promotions API', sub: 'Request schema: membershipNumber, lineItems, channel, ruleLibraryApiName', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/loyalty_gpm_api_intro.htm' },
      { label: 'TransactionJournal sObject Reference', sub: 'ExternalTransactionNumber idempotency, ActivityDate, async creation', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/sforce_api_objects_transactionjournal.htm' },
      { label: 'Loyalty Management REST API Reference', sub: 'MemberProfile, CreditPoints, IssueVoucher — all NCR lifecycle endpoints', url: 'https://developer.salesforce.com/docs/atlas.en-us.loyalty.meta/loyalty/loyalty_api_rest.htm' },
    ],
    payloads: [
      {
        title: 'Member Lookup — SF LMS response to NCR',
        direction: 'SF → NCR (via middleware)',
        description: 'After NCR fires the member.identified webhook, middleware calls the Salesforce LMS MemberProfile API and returns this payload to NCR. NCR uses the tier and balance to display at the POS screen.',
        json: {
          memberId: 'M-8821934',
          externalMemberId: 'PRIC-8821934',
          firstName: 'Emma',
          tier: 'Gold',
          pointsBalance: 4250,
          activeVouchers: [
            { voucherId: 'V-20241101-001', description: '$10 off your next purchase', expiryDate: '2025-03-31', status: 'Active' }
          ],
          enrolledPromotions: [
            { promotionId: 'PROMO-SKINCARE-2X', name: 'Double Points — Skincare', endDate: '2025-02-28' },
            { promotionId: 'PROMO-SISTER-CLUB', name: 'Sister Club — Bonus Earn', endDate: '2025-12-31' }
          ],
          responseTime: '210ms',
          source: 'Salesforce Loyalty Management API v64.0'
        }
      },
      {
        title: 'Eligible Promotions — NCR basket → SF GPM request',
        direction: 'NCR → SF (via middleware)',
        description: 'When the basket is finalised at the POS (pre-tender), middleware reads the NCR basket payload and builds this request to the Salesforce Global Promotions eligible-promotions endpoint. SF evaluates all active promotion rules concurrently and returns eligible offers within 210ms.',
        json: {
          endpoint: 'POST /services/data/v64.0/global-promotions-management/eligible-promotions/',
          ruleLibraryApiName: 'GPMRuleLibraryGPM_V1',
          membershipNumber: 'M-8821934',
          channel: 'InStore',
          transactionDateTime: '2025-01-15T14:32:00+11:00',
          lineItems: [
            { lineItemId: 'LI-001', productId: 'SKU-CERAVE-CLEANSER', productName: 'CeraVe Hydrating Cleanser 473ml', quantity: 1, unitPrice: 24.99, category: 'Skincare' },
            { lineItemId: 'LI-002', productId: 'SKU-NIACINAMIDE-30ML', productName: 'The Ordinary Niacinamide 10% 30ml', quantity: 2, unitPrice: 11.99, category: 'Skincare' },
            { lineItemId: 'LI-003', productId: 'SKU-VITAMIN-C-60CAP', productName: 'Swisse Vitamin C 60 Capsules', quantity: 1, unitPrice: 19.99, category: 'Vitamins' }
          ],
          cartTotal: 68.96,
          appliedCouponCodes: []
        }
      },
      {
        title: 'Transaction Journal — middleware → SF after payment',
        direction: 'Middleware → SF (async, post-tender)',
        description: 'After NCR confirms payment, middleware creates one Transaction Journal record per line item in Salesforce Loyalty Management. The ExternalTransactionNumber guarantees idempotency — if the POS goes offline and replays the transaction on reconnect, Salesforce will not award duplicate points.',
        json: {
          endpoint: 'POST /services/data/v64.0/sobjects/TransactionJournal',
          LoyaltyProgramName: 'PricelineBeautyRewards',
          MembershipNumber: 'M-8821934',
          TransactionJournalType: 'PointsTransfer',
          ActivityDate: '2025-01-15T14:35:12+11:00',
          ExternalTransactionNumber: 'NCR-TXN-20250115-143512-8821934',
          PointsChange: 138,
          LineItems: [
            { ProductId: 'SKU-CERAVE-CLEANSER', Quantity: 1, UnitPrice: 24.99, PointsEarned: 25, PromotionId: null },
            { ProductId: 'SKU-NIACINAMIDE-30ML', Quantity: 2, UnitPrice: 11.99, PointsEarned: 96, PromotionId: 'PROMO-SKINCARE-2X' },
            { ProductId: 'SKU-VITAMIN-C-60CAP', Quantity: 1, UnitPrice: 19.99, PointsEarned: 20, PromotionId: null }
          ],
          VouchersIssued: [],
          Notes: 'Double points applied on skincare via PROMO-SKINCARE-2X'
        }
      },
    ],
  },
  {
    id: 'beams',
    isCaseStudy: true,
    brand: 'beams',
    eyebrow: 'Loyalty Case Study',
    brandName: 'BEAMS Japan',
    website: 'beams.co.jp',
    industry: 'Fashion Retail · Japan',
    program: 'BEAMS CLUB — Action Miles',
    programSub: 'Stock-type points, no expiry. Rewards purchases + actions: event attendance, bag check-ins.',
    stack: ['Loyalty Management', 'Marketing Cloud', 'Service Cloud'],
    posNote: { label: 'POS System', value: 'NCR POS', note: 'Same POS as Priceline. Reference NCR integration template.' },
    status: 'Live',
    deliveredBy: 'Salesforce Professional Services',
    challenge: 'BEAMS needed to unify member data across three channels — in-store, e-commerce, and contact centre — while enabling staff to take proactive, data-driven actions with customers in real time.',
    challengeSub: 'The integration required pre-processing via Apex to bridge POS event data into Salesforce Loyalty Management, using 3 dedicated POS-Specific APIs tested and validated for performance.',
    features: [
      { label: 'Action Miles', text: 'Points awarded for purchases and non-purchase actions — event attendance, bag check-ins, brand interactions. No expiry.' },
      { label: 'POS API Integration', text: '3 NCR POS APIs live: Member Information Inquiry (No.9), Purchase Registration (No.11), Purchase History Retrieval (No.12). Architecture detailed in BEAMS project deck pp. 8–9.' },
      { label: 'Unified Data', text: '3 channels unified into a single member record: EC · In-store · Contact Centre. Staff see full customer history at point of interaction.' },
      { label: 'Staff Enablement', text: 'Store associates now take data-driven actions proactively — surfacing relevant offers and history at point of sale via Service Cloud integration.' },
    ],
    results: [
      { value: '~10%', label: 'Email opt-in lift', sub: '~40% → ~50%' },
      { value: '3', label: 'Channels unified', sub: 'EC · In-store · Contact Centre' },
      { value: 'Reference', label: 'NCR integration template', sub: 'Used for future NCR POS accounts' },
    ],
    strategicNote: 'One of only two confirmed live NCR POS + Salesforce Loyalty integrations in Japan. BEAMS is the reference template for future NCR POS accounts — the POS Integration Kit is being expanded based on this implementation.',
  },
  {
    id: 'ms',
    isCaseStudy: true,
    brand: 'ms',
    eyebrow: 'Loyalty Case Study',
    brandName: 'Marks & Spencer',
    website: 'marksandspencer.com',
    industry: 'Fashion · Food · Home · Beauty · UK',
    program: 'Sparks — "Pounds, not points"',
    programSub: 'Digital cash wallet replacing complex points. Spend & Earn tasks, Buy & Bundle sets, Try Something New incentives.',
    stack: ['Loyalty Management Advanced', 'Data Cloud', 'Marketing Cloud'],
    stackNote: 'Marketing Cloud existing 5 years. LM Advanced + Data Cloud new. Delivered by Salesforce PS over 24 months.',
    status: 'Live — April 2026',
    deliveredBy: 'Salesforce Professional Services · 24 months',
    challenge: 'M&S needed to transition from a complex, discount-heavy loyalty program to a data-driven Personalisation Engine that rewards genuine customer behaviour — moving away from "tricksy pricing" and confusing points to a pounds, not points model.',
    challengeSub: 'Backed by a £200m tech investment in Salesforce and AI, M&S shifted focus from mass discounting to hyper-personalised digital rewards that reflect how individual members actually shop.',
    features: [
      { label: 'Diverse Earning', text: 'Earn via "Spend & Earn" tasks, "Buy & Bundle" sets, and "Try Something New" incentives — rewarding varied shopping habits across Food, Fashion, and Home.' },
      { label: 'Simple Redemption', text: '"Sparks Cash" can be spent across Food, Fashion, and Home, alongside personalised offers and exclusive seasonal rewards.' },
      { label: 'Experiential & Social', text: 'Access to "The Parent Hood" baby club, digital coffee stamps, and automatic 1p charity donations for every transaction made.' },
      { label: 'Partnerships', text: 'Earn Sparks cash on Virgin Atlantic holidays via Virgin Red. "Supercharge" rewards through native M&S Credit Card integration.' },
    ],
    personalisation: {
      title: 'Strategic Personalisation',
      body: 'The new Sparks hub on the M&S app uses advanced Generative AI and Machine Learning to refresh offers every Tuesday. These aren\'t generic coupons — they are bespoke "Spend & Earn" tasks (e.g., "Spend £15 on kids\' footwear, earn £3") tailored to specific customer segments and past purchase data.',
    },
    results: [
      { value: '17–18M', label: 'Members', sub: 'Omnichannel: Store · Online · App' },
      { value: '2B', label: 'Events / year', sub: 'Built to process at scale' },
      { value: '+89%', label: 'Sign-up target exceeded', sub: '' },
      { value: '+46%', label: 'Sales penetration', sub: '' },
    ],
    quote: { text: '"The most personalised retailer in Britain."', author: 'Archie Norman, Chair, M&S' },
  },
  {
    id: 'thankyou',
    isThankyou: true,
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

const SLIDE_LABELS = SLIDES.map(s => {
  if (s.isArchitecture) return { label: 'Architecture', sub: 'Composable Model' };
  if (s.isNcr)          return { label: 'NCR Voyix', sub: 'POS Integration' };
  if (s.isCaseStudy)    return { label: s.brandName, sub: s.eyebrow };
  if (s.isThankyou)     return { label: 'Thank You', sub: '' };
  return { label: `Q${s.qNum}`, sub: s.title };
});

export default function Responses() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrent(c => Math.min(c + 1, total - 1));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setCurrent(c => Math.max(c - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [current]);

  const slide = SLIDES[current];
  const vstyle = slide.verdict ? VERDICT_STYLE[slide.verdict] : null;

  return (
    <div style={{ fontFamily: "'Salesforce Sans', system-ui, -apple-system, sans-serif", backgroundColor: '#F3F3F3', color: '#181818', minHeight: '100vh', display: 'flex' }}>

      {/* ── Sidebar index ── */}
      <div style={{ width: 220, flexShrink: 0, background: 'linear-gradient(180deg, #001E5B 0%, #022AC0 100%)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 30, overflowY: 'auto' }}>
        {/* Branding */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src="/sf-logo-white.png" onError={e => { e.target.onerror = null; e.target.style.display='none'; }} alt="Salesforce" style={{ height: 24, display: 'block', marginBottom: 12 }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.3 }}>WesHealth</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>RFP Response · Loyalty &amp; GPM</div>
        </div>

        {/* Section label */}
        <div style={{ padding: '12px 16px 6px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00B3FF' }}>Requirements</div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 3, lineHeight: 1.5 }}>Salesforce Loyalty Management<br/>Global Promotions · RTOM</div>
        </div>

        {/* Slide list */}
        <div style={{ flex: 1, padding: '0 8px 16px' }}>
          {SLIDES.map((s, i) => {
            const lbl = SLIDE_LABELS[i];
            const active = i === current;
            const isQ = !s.isArchitecture && !s.isNcr && !s.isCaseStudy && !s.isThankyou;
            return (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: active ? 'rgba(0,179,255,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(0,179,255,0.3)' : '1px solid transparent',
                  borderRadius: 6, padding: '7px 10px', marginBottom: 3,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {isQ && s.verdict && (
                    <span style={{
                      fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                      background: s.verdict === 'MEETS' ? '#1A7F4E' : s.verdict === 'NOT AN ISSUE' ? '#90D0FE' : '#D17DFE',
                      color: s.verdict === 'MEETS' ? '#fff' : s.verdict === 'NOT AN ISSUE' ? '#001E5B' : '#481A54',
                      flexShrink: 0,
                    }}>
                      {s.verdict === 'NOT AN ISSUE' ? 'N/A' : s.verdict === 'RECOMMENDED' ? 'REC' : '✓'}
                    </span>
                  )}
                  <span style={{ fontSize: 12, fontWeight: active ? 700 : 600, color: active ? '#fff' : 'rgba(255,255,255,0.65)', lineHeight: 1.2 }}>{lbl.label}</span>
                </div>
                {lbl.sub && <div style={{ fontSize: 10, color: active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', marginTop: 2, paddingLeft: isQ && s.verdict ? 27 : 0, lineHeight: 1.3 }}>{lbl.sub}</div>}
              </button>
            );
          })}
        </div>

        {/* Bottom nav */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setCurrent(c => Math.max(c - 1, 0))} disabled={current === 0}
            style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: current === 0 ? 'rgba(255,255,255,0.25)' : '#fff', cursor: current === 0 ? 'default' : 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ‹
          </button>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{current + 1} / {total}</span>
          <button onClick={() => setCurrent(c => Math.min(c + 1, total - 1))} disabled={current === total - 1}
            style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: current === total - 1 ? 'rgba(255,255,255,0.25)' : '#fff', cursor: current === total - 1 ? 'default' : 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ›
          </button>
        </div>
        <Link to="/" style={{ display: 'block', textAlign: 'center', padding: '8px 12px 14px', fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>← GPM Simulator</Link>
      </div>

      {/* ── Main content area ── */}
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Slide content */}
      <div style={{ flex: 1, padding: '40px 48px 56px', maxWidth: 1000, width: '100%', boxSizing: 'border-box' }}>

        {/* Architecture slide */}
        {slide.isArchitecture && (
          <>
            {/* Dark header block */}
            <div style={{ background: 'linear-gradient(180deg, #001E5B 0%, #022AC0 60%, #066AFE 100%)', borderRadius: 12, padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 260, height: '100%', background: 'radial-gradient(circle at 80% 50%, rgba(236,43,140,0.1), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00B3FF', marginBottom: 8 }}>Architecture Overview</div>
              <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>{slide.title}</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{slide.subtitle}</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              {slide.intro.map((p, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.75, color: i === 0 ? '#001E5B' : '#444447', marginBottom: 10, marginTop: 0, fontWeight: i === 0 ? 600 : 400 }}>{p}</p>
              ))}
            </div>
            <LoyaltyJourneyDiagram />
            <ReferenceDocs docs={slide.docs} />
          </>
        )}

        {/* NCR slide */}
        {slide.isNcr && (
          <>
            <div style={{ background: 'linear-gradient(180deg, #001E5B 0%, #022AC0 60%, #066AFE 100%)', borderRadius: 12, padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 260, height: '100%', background: 'radial-gradient(circle at 80% 50%, rgba(236,43,140,0.08), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00B3FF', marginBottom: 8 }}>POS Integration</div>
              <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>{slide.title}</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>{slide.subtitle}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {slide.intro.map((p, i) => (
                  <p key={i} style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{p}</p>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.5)', padding: '5px 10px', background: 'rgba(255,255,255,0.08)', borderRadius: 6, display: 'inline-block' }}>
                Source: <a href="https://developer.ncrvoyix.com/portals/dev-portal/api-explorer" target="_blank" rel="noopener noreferrer" style={{ color: '#90D0FE' }}>developer.ncrvoyix.com/portals/dev-portal/api-explorer</a>
              </div>
            </div>

            {/* NCR API lifecycle table */}
            <div style={{ marginBottom: 20, borderRadius: 10, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ background: '#001E5B', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#fff' }}>NCR Voyix BSP API — Transaction Lifecycle Integration Points</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '50%' }} />
                </colgroup>
                <thead>
                  <tr style={{ background: '#E5E5E5' }}>
                    {['Method', 'NCR Endpoint', 'Lifecycle Stage', 'Salesforce Action'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slide.ncrApis.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: row.method === 'POST' ? '#EAF5FE' : '#E8F5ED', color: row.method === 'POST' ? '#022AC0' : '#0D3D1F' }}>{row.method}</span>
                      </td>
                      <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: 11, color: '#3E4D5C', wordBreak: 'break-all' }}>{row.path}</td>
                      <td style={{ padding: '9px 12px', fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>{row.when}</td>
                      <td style={{ padding: '9px 12px', fontSize: 11, color: '#3E4D5C', lineHeight: 1.5 }}>{row.sfAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Webhooks */}
            <div style={{ borderRadius: 10, border: '1px solid #E5E5E5', overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ background: '#001E5B', padding: '8px 14px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#00B3FF' }}>NCR Voyix Webhook Events — Salesforce Handling</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '56%' }} />
                </colgroup>
                <thead>
                  <tr style={{ background: '#E5E5E5' }}>
                    {['Event', 'Trigger', 'Salesforce / Middleware Action'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#444447', borderBottom: '1px solid #E5E5E5' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slide.webhooks.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#EAF5FE', borderBottom: ri < slide.webhooks.length - 1 ? '1px solid #E5E5E5' : 'none' }}>
                      <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: 11, color: '#730394', fontWeight: 600 }}>{row.event}</td>
                      <td style={{ padding: '9px 12px', fontSize: 11, color: '#444447', lineHeight: 1.4 }}>{row.trigger}</td>
                      <td style={{ padding: '9px 12px', fontSize: 11, color: '#001E5B', lineHeight: 1.5 }}>{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mock payloads */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#022AC0' }}>Example Payloads</div>
                <div style={{ flex: 1, height: 1, background: '#90D0FE' }} />
                <div style={{ fontSize: 10, color: '#737479' }}>Click to expand</div>
              </div>
              {slide.payloads.map((p, i) => (
                <PayloadViewer key={i} title={p.title} direction={p.direction} description={p.description} json={p.json} />
              ))}
            </div>

            <ReferenceDocs docs={slide.docs} />
          </>
        )}

        {/* ── Case study slide ── */}
        {slide.isCaseStudy && (
          <>
            {/* Dark header */}
            <div style={{ background: 'linear-gradient(180deg, #001E5B 0%, #022AC0 60%, #066AFE 100%)', borderRadius: 12, padding: '24px 28px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 240, height: '100%', background: 'radial-gradient(circle at 80% 50%, rgba(236,43,140,0.1), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00B3FF', marginBottom: 8 }}>{slide.eyebrow} · {slide.industry}</div>
                  <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>{slide.brandName}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 20 }}>{slide.program}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{slide.programSub}</span>
                  </div>
                </div>
                {/* Live status badge */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#E8F5ED', border: '1px solid #04E1CB', borderRadius: 8, padding: '6px 12px' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1A7F4E' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0D3D1F' }}>{slide.status}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{slide.deliveredBy}</div>
                </div>
              </div>
            </div>

            {/* Body: left sidebar + right content */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'start' }}>

              {/* Left — stack + results + POS note */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Salesforce stack */}
                <div style={{ background: '#EAF5FE', border: '1px solid #90D0FE', borderTop: '3px solid #022AC0', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#022AC0', marginBottom: 10 }}>Salesforce Stack</div>
                  {slide.stack.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: i < slide.stack.length - 1 ? 7 : 0 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#022AC0', flexShrink: 0, marginTop: 4 }} />
                      <span style={{ fontSize: 11, color: '#001E5B', fontWeight: 600, lineHeight: 1.3 }}>{s}</span>
                    </div>
                  ))}
                  {slide.stackNote && <p style={{ fontSize: 10, color: '#737479', marginTop: 8, marginBottom: 0, lineHeight: 1.4 }}>{slide.stackNote}</p>}
                </div>

                {/* POS note (BEAMS only) */}
                {slide.posNote && (
                  <div style={{ background: '#FBF3E0', border: '1px solid #FCC003', borderTop: '3px solid #E4A201', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4F2100', marginBottom: 8 }}>{slide.posNote.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ background: '#4F2100', borderRadius: 4, padding: '2px 7px', fontSize: 11, fontWeight: 700, color: '#FCC003', letterSpacing: '0.05em', flexShrink: 0 }}>NCR</div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#001E5B' }}>{slide.posNote.value}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1A7F4E' }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#0D3D1F' }}>Connected</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 10, color: '#4F2100', lineHeight: 1.4, margin: 0 }}>{slide.posNote.note}</p>
                  </div>
                )}

                {/* Key results */}
                <div style={{ background: '#EAF5FE', border: '1px solid #90D0FE', borderTop: '3px solid #066AFE', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#022AC0', marginBottom: 12 }}>Key Results</div>
                  {slide.results.map((r, i) => (
                    <div key={i} style={{ marginBottom: i < slide.results.length - 1 ? 12 : 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#001E5B', lineHeight: 1, letterSpacing: '-0.02em' }}>{r.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#022AC0', marginTop: 2 }}>{r.label}</div>
                      {r.sub && <div style={{ fontSize: 10, color: '#737479', marginTop: 1 }}>{r.sub}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — challenge + features + callouts + quote */}
              <div>
                {/* Challenge */}
                <div style={{ background: '#F3F3F3', borderLeft: '4px solid #EC2B8C', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EC2B8C', marginBottom: 6 }}>Challenge / Opportunity</div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#001E5B', lineHeight: 1.65, margin: 0 }}>{slide.challenge}</p>
                  {slide.challengeSub && <p style={{ fontSize: 12, color: '#444447', lineHeight: 1.55, marginTop: 8, marginBottom: 0 }}>{slide.challengeSub}</p>}
                </div>

                {/* Features */}
                <div style={{ marginBottom: 16 }}>
                  {slide.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#022AC0', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <p style={{ fontSize: 13, color: '#444447', lineHeight: 1.6, margin: 0 }}>
                        <strong style={{ color: '#001E5B' }}>{f.label}:</strong> {f.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Personalisation callout (M&S) */}
                {slide.personalisation && (
                  <div style={{ background: '#EAF5FE', border: '1px solid #90D0FE', borderLeft: '4px solid #022AC0', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#022AC0', marginBottom: 6 }}>{slide.personalisation.title}</div>
                    <p style={{ fontSize: 13, color: '#001E5B', lineHeight: 1.6, margin: 0 }}>{slide.personalisation.body}</p>
                  </div>
                )}

                {/* Strategic note (BEAMS) */}
                {slide.strategicNote && (
                  <div style={{ background: '#E8F5ED', border: '1px solid #04E1CB', borderLeft: '4px solid #06A59A', borderRadius: '0 8px 8px 0', padding: '10px 16px', marginBottom: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0D3D1F', marginBottom: 5 }}>Strategic Significance</div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#0D3D1F', lineHeight: 1.6, margin: 0 }}>{slide.strategicNote}</p>
                  </div>
                )}

                {/* Quote (M&S) */}
                {slide.quote && (
                  <div style={{ borderLeft: '3px solid #066AFE', paddingLeft: 16, marginTop: 4 }}>
                    <p style={{ fontSize: 15, fontStyle: 'italic', color: '#001E5B', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>{slide.quote.text}</p>
                    <p style={{ fontSize: 11, color: '#737479', marginTop: 6, marginBottom: 0 }}>— {slide.quote.author}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── Thank you slide ── */}
        {slide.isThankyou && (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '70vh' }}>
            {/* Full-width dark header */}
            <div style={{ background: 'linear-gradient(180deg, #001E5B 0%, #022AC0 60%, #066AFE 100%)', borderRadius: 12, padding: '48px 40px', marginBottom: 32, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 120%, rgba(236,43,140,0.15), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <img src="/sf-logo-white.png" onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} alt="Salesforce" style={{ height: 28 }} />
                <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ background: '#fff', borderRadius: 6, padding: '4px 12px' }}>
                  <img src="/priceline-logo.webp" alt="Priceline Pharmacy" style={{ height: 22, display: 'block', objectFit: 'contain' }} />
                </div>
              </div>
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 12 }}>
                Thank You
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 460, margin: '0 auto 24px' }}>
                Powered by Salesforce Loyalty Management — Global Promotions + Real Time Offer Management.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EC2B8C', color: '#fff', fontSize: 13, fontWeight: 700, padding: '11px 24px', borderRadius: 8, textDecoration: 'none' }}>
                  Back to Demo
                </Link>
                <button onClick={() => setCurrent(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '11px 24px', borderRadius: 8, cursor: 'pointer' }}>
                  Start Over
                </button>
              </div>
            </div>

            {/* Reference cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'BEAMS Japan', sub: 'NCR POS · Live', eyebrow: 'Loyalty Case Study', stat: '~10%', statLabel: 'Email opt-in lift' },
                { label: 'M&S Sparks', sub: 'Live April 2026', eyebrow: 'Loyalty Case Study', stat: '17–18M', statLabel: 'Members' },
                { label: 'WesHealth', sub: 'Your implementation', eyebrow: 'Next · Loyalty Management', stat: '90 days', statLabel: 'To first use case live' },
              ].map((c, i) => (
                <div key={i} style={{ background: i === 2 ? 'linear-gradient(180deg, #001E5B 0%, #022AC0 100%)' : '#EAF5FE', border: i === 2 ? 'none' : '1px solid #90D0FE', borderTop: `3px solid ${i === 2 ? '#EC2B8C' : '#022AC0'}`, borderRadius: 8, padding: '18px 18px 16px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: i === 2 ? '#00B3FF' : '#022AC0', marginBottom: 8 }}>{c.eyebrow}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: i === 2 ? '#fff' : '#001E5B', letterSpacing: '-0.01em', marginBottom: 2 }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: i === 2 ? 'rgba(255,255,255,0.55)' : '#737479', marginBottom: 16 }}>{c.sub}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: i === 2 ? '#EC2B8C' : '#066AFE', letterSpacing: '-0.02em', lineHeight: 1 }}>{c.stat}</div>
                  <div style={{ fontSize: 11, color: i === 2 ? 'rgba(255,255,255,0.6)' : '#737479', marginTop: 3 }}>{c.statLabel}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Q&A slide */}
        {!slide.isArchitecture && !slide.isNcr && !slide.isCaseStudy && !slide.isThankyou && (
          <>
            {/* ── Verdict banner ── */}
            {vstyle && (
              <div style={{ background: 'linear-gradient(180deg, #001E5B 0%, #022AC0 60%, #066AFE 100%)', borderRadius: 12, padding: '24px 28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 240, height: '100%', background: 'radial-gradient(circle at 80% 50%, rgba(236,43,140,0.1), transparent 60%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00B3FF' }}>Q{slide.qNum} · {slide.ref}</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(18px, 2.2vw, 26px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 8 }}>{slide.title}</h2>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{slide.verdictNote}</div>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <div style={{ background: vstyle.pill, border: `1.5px solid ${vstyle.pillBorder}`, borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: vstyle.pillBorder, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: vstyle.pillText, whiteSpace: 'nowrap' }}>{slide.verdict}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Question from RFP ── */}
            <div style={{ background: '#EAF5FE', border: '1px solid #90D0FE', borderLeft: '4px solid #022AC0', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#022AC0', marginBottom: 7 }}>WesHealth RFP Question</div>
              <p style={{ fontSize: 13, color: '#001E5B', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{slide.question}</p>
            </div>

            {/* ── Answer ── */}
            <div style={{ marginBottom: 24 }}>
              {slide.answer.map((para, j) => (
                <p key={j} style={{
                  fontSize: 14, lineHeight: 1.8,
                  color: j === 0 ? '#001E5B' : '#444447',
                  fontWeight: j === 0 ? 600 : 400,
                  marginBottom: 14, marginTop: 0,
                }}>{para}</p>
              ))}
            </div>

            {/* ── Load test callout ── */}
            {slide.loadTestCallout && (
              <div style={{ marginBottom: 24, borderRadius: 10, border: '1.5px solid #90D0FE', overflow: 'hidden' }}>
                <div style={{ background: '#001E5B', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00B3FF', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff' }}>Simulator Load Test — Priceline Pharmacy Demo</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>Results from this simulator run</span>
                </div>
                <div style={{ background: '#fff' }}>
                  {slide.loadTestCallout.rows.map((row, ri) => (
                    <div key={ri} style={{ display: 'flex', gap: 12, padding: '9px 16px', background: ri % 2 === 0 ? '#fff' : '#EAF5FE', borderBottom: ri < slide.loadTestCallout.rows.length - 1 ? '1px solid #E5E5E5' : 'none' }}>
                      <div style={{ fontSize: 12, color: '#737479', minWidth: 260, flexShrink: 0 }}>{row.k}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#001E5B' }}>{row.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Table ── */}
            {slide.table && (
              <div style={{ marginBottom: 24, borderRadius: 10, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '30%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '52%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#001E5B' }}>
                      {slide.table.headers.map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#fff', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slide.table.rows.map((row, ri) => (
                      <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#EAF5FE', borderBottom: '1px solid #E5E5E5' }}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={{ padding: '9px 14px', color: ci === 1 ? '#001E5B' : '#444447', fontWeight: ci === 1 ? 700 : 400, fontFamily: ci === 0 ? 'monospace' : 'inherit', fontSize: ci === 0 ? 12 : 13, wordBreak: 'break-word' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Callout cards ── */}
            {slide.callouts && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 24 }}>
                {slide.callouts.map((c, ci) => (
                  <div key={ci} style={{
                    background: c.green ? '#E8F5ED' : '#EAF5FE',
                    border: `1px solid ${c.green ? '#1A7F4E' : '#90D0FE'}`,
                    borderTop: `3px solid ${c.green ? '#1A7F4E' : '#022AC0'}`,
                    borderRadius: 8, padding: '14px 14px 12px',
                  }}>
                    <div style={{ fontSize: 10, color: c.green ? '#0D3D1F' : '#001E5B', fontWeight: 600, opacity: 0.75, marginBottom: 6, lineHeight: 1.3 }}>{c.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: c.green ? '#1A7F4E' : '#001E5B', lineHeight: 1.1, marginBottom: 4 }}>{c.value}</div>
                    <div style={{ fontSize: 10, color: c.green ? '#0D3D1F' : '#001E5B', opacity: 0.6, lineHeight: 1.4 }}>{c.sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Diagrams ── */}
            {slide.diagram === 'online' && (
              <div style={{ marginTop: 4 }}>
                <OnlinePOSFlow />
                {slide.diagramCaption && <p style={{ fontSize: 11, color: '#737479', marginTop: 8, paddingLeft: 2 }}>{slide.diagramCaption}</p>}
              </div>
            )}
            {slide.diagram === 'offline' && (
              <div style={{ marginTop: 4 }}>
                <OfflinePOSFlow />
                {slide.diagramCaption && <p style={{ fontSize: 11, color: '#737479', marginTop: 8, paddingLeft: 2 }}>{slide.diagramCaption}</p>}
              </div>
            )}
            <ReferenceDocs docs={slide.docs} />
          </>
        )}
      </div>

      </div>

    </div>
  );
}
