import { Link } from 'react-router-dom';
import { Clock, ArrowUpCircle, MapPin, Navigation, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from 'axios';

// ── SKELETON CARD ─────────────────────────────────────────────
export const TrekCardSkeleton = () => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '20px', overflow: 'hidden' }}>
    {/* Image placeholder */}
    <div className="shimmer" style={{ height: '220px', width: '100%' }} />
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Title */}
      <div className="shimmer" style={{ height: '22px', borderRadius: '6px', width: '70%' }} />
      {/* Subtitle */}
      <div className="shimmer" style={{ height: '14px', borderRadius: '6px', width: '40%' }} />
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '14px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="shimmer" style={{ height: '34px', borderRadius: '10px' }} />
        <div className="shimmer" style={{ height: '34px', borderRadius: '10px' }} />
      </div>
      {/* CTA */}
      <div className="shimmer" style={{ height: '42px', borderRadius: '12px', marginTop: '4px' }} />
    </div>
  </div>
);

// ── TREK CARD ─────────────────────────────────────────────────
const TrekCard = ({ trek }) => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';
  const [imgLoaded, setImgLoaded] = useState(false);

  const fallbackImageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23e8f5e9'/%3E%3Cpath d='M0 300 L150 120 L300 200 L420 80 L600 280 L600 400 L0 400Z' fill='%23a8d5b5'/%3E%3Cpath d='M0 350 L100 200 L250 280 L350 160 L500 240 L600 180 L600 400 L0 400Z' fill='%232d6a4f' opacity='0.6'/%3E%3Ccircle cx='480' cy='80' r='40' fill='%23fff9c4' opacity='0.8'/%3E%3C/svg%3E`;

  const difficultyStyle = {
    Easy:     { background: 'var(--accent-green-bg)',  color: 'var(--accent-green)' },
    Moderate: { background: 'var(--accent-amber-bg)',  color: 'var(--accent-amber)' },
    Hard:     { background: 'var(--accent-rose-bg)',   color: 'var(--accent-rose)'  },
  }[trek.difficulty] || { background: 'var(--bg-secondary)', color: 'var(--text-muted)' };

  const handleAdminDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Delete "${trek.name}" globally?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/treks/${trek._id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      window.location.reload();
    } catch (err) { alert('Failed to delete expedition.', err); }
  };

  return (
    <div className="trek-card" style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-light)',
      borderRadius: '20px', overflow: 'hidden', display: 'flex',
      flexDirection: 'column', position: 'relative', boxShadow: 'var(--shadow-sm)',
    }}>
      {isAdmin && (
        <button onClick={handleAdminDelete} style={{
          position: 'absolute', top: '14px', right: '14px', padding: '9px',
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          borderRadius: '10px', border: 'none', cursor: 'pointer',
          color: 'var(--accent-rose)', zIndex: 20, boxShadow: 'var(--shadow-md)', transition: 'all 0.2s', display: 'flex',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-rose)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* IMAGE with skeleton while loading */}
      <Link to={`/trek/${trek._id}`} style={{ display: 'block', height: '220px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        {/* Skeleton shown until image loads */}
        {!imgLoaded && (
          <div className="shimmer" style={{ position: 'absolute', inset: 0 }} />
        )}
        <img
          src={trek.imageUrl || fallbackImageUrl}
          alt={trek.name}
          onLoad={() => setImgLoaded(true)}
          onError={e => { if (e.currentTarget.src !== fallbackImageUrl) e.currentTarget.src = fallbackImageUrl; setImgLoaded(true); }}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.7s ease, opacity 0.3s ease',
            opacity: imgLoaded ? 1 : 0,
          }}
          referrerPolicy="no-referrer"
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '14px', left: '14px', display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          <span style={{ ...difficultyStyle, padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {trek.difficulty}
          </span>
          {trek.dist && (
            <span style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Navigation size={9} /> {(trek.dist / 1000).toFixed(1)} km
            </span>
          )}
        </div>
      </Link>

      {/* CONTENT */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '14px' }}>
        <div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '6px' }}>
            {trek.name}
          </h3>
          <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <MapPin size={11} style={{ color: 'var(--accent-green)', flexShrink: 0 }} /> {trek.state}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '14px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
          {[
            { icon: <Clock size={15} />, label: 'Duration', value: `${trek.duration} Days` },
            { icon: <ArrowUpCircle size={15} />, label: 'Altitude', value: `${trek.maxAltitude} ft` },
          ].map(stat => (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--accent-green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{stat.label}</p>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <Link to={`/trek/${trek._id}`} style={{
          display: 'block', width: '100%', padding: '13px', textAlign: 'center',
          background: 'var(--text-primary)', color: 'var(--bg-primary)',
          borderRadius: '12px', fontWeight: 700, fontSize: '11px',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 'auto',
          transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)', textDecoration: 'none',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--text-primary)'; e.currentTarget.style.transform = 'none'; }}
        >
          View Trek →
        </Link>
      </div>
    </div>
  );
};

export default TrekCard;
