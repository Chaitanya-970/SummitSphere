import { useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

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
        overflow: 'hidden',
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

        {/* FILTERS — 2×2 grid on mobile, 4-in-a-row on desktop */}
        <div className="discovery-filters">
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={selectStyle}>
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={selectStyle}>
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={durationFilter} onChange={e => setDurationFilter(e.target.value)} style={selectStyle}>
            <option value="">Any Duration</option>
            {durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={selectStyle}>
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={onNearMe} disabled={loadingNearMe} className="near-me-btn"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              padding: '11px 16px', borderRadius: '10px',
              background: 'var(--accent-green)', color: 'white', border: 'none', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em',
              textTransform: 'uppercase', transition: 'all 0.2s', whiteSpace: 'nowrap',
              opacity: loadingNearMe ? 0.7 : 1,
            }}>
            {loadingNearMe ? <Loader2 size={13} style={{ animation: 'spin 0.9s linear infinite' }} /> : <MapPin size={13} />}
            Near Me
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .discovery-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 12px 16px;
          align-items: center;
        }
        .discovery-filters select { flex: 1; min-width: 110px; }
        .near-me-btn { flex-shrink: 0; }

        /* Mobile: 2×2 grid + full-width Near Me */
        @media (max-width: 640px) {
          .discovery-filters {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .discovery-filters select { min-width: 0; }
          .near-me-btn { grid-column: 1 / -1; }
        }
      `}</style>
    </div>
  );
};

export default DiscoveryBar;
