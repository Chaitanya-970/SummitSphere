import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Mountain, Wind, FilterX, Compass } from 'lucide-react';
import TrekCard, { TrekCardSkeleton } from '../components/TrekCard';
import DiscoveryBar from '../components/DiscoveryBar';
import { useDebounce } from '../hooks/useDebounce';
import Footer from '../components/Footer';

// --- THE DETERMINISTIC IMAGE HASH (DO NOT MODIFY) ---
const TREK_IMAGES = [
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?w=800&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
  "https://images.unsplash.com/photo-1465311440653-ba3b0d2d31fac?w=800&q=80",
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
];

const getTrekImage = (trekName, originalImage) => {
  if (!originalImage || originalImage.includes("1522199710521")) {
    let hash = 0;
    for (let i = 0; i < trekName.length; i++) {
      hash = trekName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % TREK_IMAGES.length;
    return TREK_IMAGES[index];
  }
  return originalImage;
};

const HERO_BG = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80";

const Home = () => {
  const [treks, setTreks] = useState([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingNearMe, setLoadingNearMe] = useState(false);
  const [stateFilter, setStateFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const resultsRef = useRef(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchTreks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('name', debouncedSearch);
      if (difficulty && difficulty !== 'all') params.append('difficulty', difficulty);
      if (stateFilter && stateFilter !== 'all') params.append('state', stateFilter);
      if (durationFilter && durationFilter !== 'all') params.append('duration', durationFilter);
      if (sort) params.append('sort', sort);
      if (coords) { params.append('lat', coords.lat); params.append('lng', coords.lng); }
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/treks?${params.toString()}`);
      setTreks(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, difficulty, stateFilter, durationFilter, coords, sort]);

  useEffect(() => { fetchTreks(); }, [fetchTreks]);

  // Auto-scroll to results when user types a search or applies a filter
  useEffect(() => {
    if ((debouncedSearch || difficulty || stateFilter || durationFilter) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [debouncedSearch, difficulty, stateFilter, durationFilter]);
  useEffect(() => { document.title = "SummitSphere — Discover India's Finest Treks"; }, []);

  const handleNearMe = () => {
    setLoadingNearMe(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLoadingNearMe(false); },
      () => { alert("Location denied."); setLoadingNearMe(false); }
    );
  };

  const hasFilters = search || difficulty || stateFilter || durationFilter || sort !== 'newest';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background 0.3s ease' }}>

      {/* HERO */}
      <header style={{ position: 'relative', height: 'clamp(420px, 70vh, 640px)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={HERO_BG}
          alt="Himalayan peaks"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.04)', transition: 'transform 12s ease' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, var(--bg-primary) 100%)' }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', width: '100%' }}>
          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 18px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '24px' }}>
            <Mountain size={13} color="white" strokeWidth={2.5} />
            <span style={{ color: 'white', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>India's Trail Network</span>
          </div>

          <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(36px, 9vw, 100px)', color: 'white', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '20px', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
            Find Your<br/><span style={{ color: 'var(--accent-green-light)' }}>Perfect Trail.</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 500, marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Discover, plan and explore the finest treks across India's Himalayas.
          </p>

          {/* Discovery Bar */}
          <DiscoveryBar
            search={search} setSearch={setSearch}
            difficulty={difficulty} setDifficulty={setDifficulty}
            stateFilter={stateFilter} setStateFilter={setStateFilter}
            durationFilter={durationFilter} setDurationFilter={setDurationFilter}
            sort={sort} setSort={setSort}
            onNearMe={handleNearMe} loadingNearMe={loadingNearMe}
          />
        </div>
      </header>

      {/* RESULTS */}
      <main ref={resultsRef} style={{ maxWidth: '1400px', margin: '0 auto', padding: '56px 24px 0' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 38px)', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {hasFilters ? 'Filtered Results' : 'All Expeditions'}
            </h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '6px' }}>
              <Wind size={12} style={{ color: 'var(--accent-green)' }} />
              {hasFilters ? 'Filters active' : 'All routes synced'}
            </p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '14px 20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', minWidth: '80px' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: '32px', color: 'var(--text-primary)', lineHeight: 1 }}>{treks.length}</div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-faint)', marginTop: '3px' }}>Treks</div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {[...Array(6)].map((_, i) => <TrekCardSkeleton key={i} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {treks.length > 0 ? (
              treks.map((trek, i) => (
                <div key={trek._id} style={{ opacity: 1 }}>
                  <TrekCard trek={{ ...trek, imageUrl: getTrekImage(trek.name, trek.imageUrl) }} />
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '64px 32px', textAlign: 'center', background: 'var(--bg-card)', border: '2px dashed var(--border-primary)', borderRadius: '24px' }}>
                <FilterX size={40} style={{ margin: '0 auto 16px', color: 'var(--border-primary)' }} />
                <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '20px', color: 'var(--text-muted)', marginBottom: '12px' }}>No treks found</p>
                <p style={{ fontSize: '13px', color: 'var(--text-faint)', marginBottom: '20px' }}>Try adjusting your filters or search term</p>
                <button
                  onClick={() => { setSearch(''); setDifficulty(''); setStateFilter(''); setDurationFilter(''); setSort('newest'); }}
                  style={{ padding: '10px 24px', background: 'var(--accent-green)', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
