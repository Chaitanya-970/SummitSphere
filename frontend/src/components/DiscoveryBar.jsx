import { useRef, useState, useEffect } from 'react';
import { Search, MapPin, Loader2, ChevronDown } from 'lucide-react';

/* ─── Custom Dropdown (mobile only) ──────────────────────────────────────── */
const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler); };
  }, []);

  const selected = options.find(o => o.value === value);
  const label = selected ? selected.label : placeholder;

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-input)', border: '1px solid var(--border-light)',
          borderRadius: '10px', padding: '11px 14px',
          fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '11px',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer',
          gap: '6px', boxSizing: 'border-box',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        <ChevronDown size={13} style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {/* Dropdown panel — rendered in a portal-like fixed layer to avoid clipping */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          width: '100%', zIndex: 9999,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        }}>
          {options.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
              style={{
                width: '100%', display: 'block', textAlign: 'left',
                padding: '13px 16px',
                background: opt.value === value ? 'rgba(74,197,143,0.15)' : 'transparent',
                border: 'none',
                borderTop: i > 0 ? '1px solid var(--border-light)' : 'none',
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: opt.value === value ? 'var(--accent-green)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── DiscoveryBar ────────────────────────────────────────────────────────── */
const DiscoveryBar = ({
  search, setSearch,
  difficulty, setDifficulty,
  stateFilter, setStateFilter,
  durationFilter, setDurationFilter,
  sort, setSort,
  onNearMe, loadingNearMe
}) => {
  const states = ["Uttarakhand", "Himachal Pradesh", "Jammu & Kashmir", "Sikkim", "Lahaul and Spiti"];
  const durations = [
    { label: "Short (1-3 Days)", value: "short" },
    { label: "Medium (4-7 Days)", value: "medium" },
    { label: "Long (8+ Days)", value: "long" }
  ];
  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Altitude ↓",   value: "alt-high" },
    { label: "Altitude ↑",   value: "alt-low"  },
    { label: "Longest",      value: "dur-long" },
    { label: "Shortest",     value: "dur-short" }
  ];

  const stateOptions    = [{ label: "All States",   value: "" }, ...states.map(s => ({ label: s, value: s }))];
  const levelOptions    = [{ label: "All Levels",   value: "" }, { label: "Easy", value: "Easy" }, { label: "Moderate", value: "Moderate" }, { label: "Hard", value: "Hard" }];
  const durationOptions = [{ label: "Any Duration", value: "" }, ...durations];
  const allSortOptions  = sortOptions;

  const selectStyle = {
    width: '100%', appearance: 'none', WebkitAppearance: 'none',
    background: 'var(--bg-input)', border: '1px solid var(--border-light)',
    borderRadius: '10px', padding: '11px 14px', fontFamily: 'Syne, sans-serif',
    fontWeight: 600, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer', transition: 'all 0.2s'
  };

  return (
    <div style={{ width: '100%', maxWidth: '920px', margin: '0 auto' }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: '18px',
        border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)',
        overflow: 'visible',
        transition: 'background 0.3s ease, border-color 0.3s ease'
      }}>
        {/* SEARCH ROW */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-light)', padding: '4px 18px', gap: '12px' }}>
          <Search size={18} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search treks by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', padding: '16px 0',
              background: 'transparent', fontFamily: 'Syne, sans-serif',
              fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', flexShrink: 0 }}>
              ✕
            </button>
          )}
        </div>

        {/* FILTERS — native <select> on desktop, custom dropdowns on mobile */}
        <div className="discovery-filters">

          {/* Desktop selects (hidden on mobile) */}
          <select className="desktop-select" value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={selectStyle}>
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="desktop-select" value={difficulty} onChange={e => setDifficulty(e.target.value)} style={selectStyle}>
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
          </select>
          <select className="desktop-select" value={durationFilter} onChange={e => setDurationFilter(e.target.value)} style={selectStyle}>
            <option value="">Any Duration</option>
            {durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <select className="desktop-select" value={sort} onChange={e => setSort(e.target.value)} style={selectStyle}>
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Mobile custom dropdowns (hidden on desktop) */}
          <div className="mobile-select"><CustomSelect value={stateFilter}    onChange={setStateFilter}    options={stateOptions}    placeholder="All States" /></div>
          <div className="mobile-select"><CustomSelect value={difficulty}     onChange={setDifficulty}     options={levelOptions}    placeholder="All Levels" /></div>
          <div className="mobile-select"><CustomSelect value={durationFilter} onChange={setDurationFilter} options={durationOptions} placeholder="Any Duration" /></div>
          <div className="mobile-select"><CustomSelect value={sort}           onChange={setSort}           options={allSortOptions}  placeholder="Newest First" /></div>

          <button onClick={onNearMe} disabled={loadingNearMe} className="near-me-btn"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              padding: '11px 16px', borderRadius: '10px',
              background: 'var(--accent-green)', color: 'white', border: 'none', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em',
              textTransform: 'uppercase', transition: 'all 0.2s', whiteSpace: 'nowrap',
              opacity: loadingNearMe ? 0.7 : 1, flexShrink: 0,
            }}>
            {loadingNearMe ? <Loader2 size={13} style={{ animation: 'spin 0.9s linear infinite' }} /> : <MapPin size={13} />}
            Near Me
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Desktop layout ── */
        .discovery-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 12px 16px;
          align-items: center;
        }
        .discovery-filters .desktop-select { flex: 1; min-width: 110px; }
        .mobile-select { display: none; }
        .near-me-btn { flex-shrink: 0; }

        /* ── Mobile layout ── */
        @media (max-width: 640px) {
          .discovery-filters {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          /* Hide native selects on mobile */
          .discovery-filters .desktop-select { display: none; }
          /* Show custom dropdowns on mobile */
          .mobile-select { display: block; min-width: 0; }
          .near-me-btn { grid-column: 1 / -1; }
        }
      `}</style>
    </div>
  );
};

export default DiscoveryBar;
