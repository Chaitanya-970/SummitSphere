import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';

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
    { label: "Altitude ↓", value: "alt-high" },
    { label: "Altitude ↑", value: "alt-low" },
    { label: "Longest", value: "dur-long" },
    { label: "Shortest", value: "dur-short" }
  ];

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch suggestions as user types (min 2 chars)
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (search.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/treks?name=${encodeURIComponent(search)}`);
        const names = [...new Set(res.data.map(t => t.name))].slice(0, 6);
        setSuggestions(names);
        setShowSuggestions(names.length > 0);
      } catch { setSuggestions([]); }
    }, 220);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.contains(e.target) && !suggestionsRef.current?.contains(e.target)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestion(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestion(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && activeSuggestion >= 0) { e.preventDefault(); pickSuggestion(suggestions[activeSuggestion]); }
    else if (e.key === 'Escape') { setShowSuggestions(false); setActiveSuggestion(-1); }
  };

  const pickSuggestion = (name) => {
    setSearch(name);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    inputRef.current?.blur();
  };

  // Highlight matching part of suggestion
  const highlightMatch = (name, query) => {
    const idx = name.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return name;
    return (
      <>
        {name.slice(0, idx)}
        <strong style={{ color: 'var(--accent-green)', fontWeight: 800 }}>{name.slice(idx, idx + query.length)}</strong>
        {name.slice(idx + query.length)}
      </>
    );
  };

  const selectStyle = {
    flex: '1', minWidth: '110px', appearance: 'none', WebkitAppearance: 'none',
    background: 'var(--bg-input)', border: '1px solid var(--border-light)',
    borderRadius: '10px', padding: '11px 14px', fontFamily: 'Syne, sans-serif',
    fontWeight: 600, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer', transition: 'all 0.2s'
  };

  return (
    <div style={{ width: '100%', maxWidth: '920px', margin: '0 auto', position: 'relative' }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: '18px',
        border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-md)',
        overflow: showSuggestions ? 'visible' : 'hidden',
        transition: 'background 0.3s ease, border-color 0.3s ease'
      }}>
        {/* SEARCH ROW */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-light)', padding: '4px 18px', gap: '12px', position: 'relative' }}>
          <Search size={18} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search treks by name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveSuggestion(-1); }}
            onFocus={() => search.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1, border: 'none', outline: 'none', padding: '16px 0',
              background: 'transparent', fontFamily: 'Syne, sans-serif',
              fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)',
            }}
          />
          {search && (
            <button onClick={() => { setSearch(''); setSuggestions([]); setShowSuggestions(false); }}
              style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', transition: 'color 0.2s' }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* FILTERS ROW */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px 16px', alignItems: 'center' }}>
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
          <button onClick={onNearMe} disabled={loadingNearMe} style={{
            display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', borderRadius: '10px',
            background: 'var(--accent-green)', color: 'white', border: 'none', cursor: 'pointer',
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em',
            textTransform: 'uppercase', transition: 'all 0.2s', whiteSpace: 'nowrap',
            opacity: loadingNearMe ? 0.7 : 1, flexShrink: 0
          }}>
            {loadingNearMe ? <Loader2 size={13} style={{ animation: 'spin 0.9s linear infinite' }} /> : <MapPin size={13} />}
            Near Me
          </button>
        </div>
      </div>

      {/* AUTOCOMPLETE DROPDOWN */}
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
          background: 'var(--bg-card)', border: '1px solid var(--border-primary)',
          borderRadius: '14px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
        }}>
          {suggestions.map((name, i) => (
            <button key={name} onMouseDown={() => pickSuggestion(name)}
              style={{
                width: '100%', padding: '12px 18px', border: 'none', textAlign: 'left',
                background: i === activeSuggestion ? 'var(--accent-green-bg)' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 500,
                color: 'var(--text-primary)', transition: 'background 0.15s',
                borderBottom: i < suggestions.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}
              onMouseEnter={e => { if (i !== activeSuggestion) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={e => { if (i !== activeSuggestion) e.currentTarget.style.background = 'transparent'; }}
            >
              <Search size={13} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
              <span>{highlightMatch(name, search)}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default DiscoveryBar;
