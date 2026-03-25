import { Link } from 'react-router-dom';
import { Mountain, Star, MapPin, TrendingUp } from 'lucide-react';

const HomeSidebar = ({ user }) => {
  if (user) return null;

  return (
    <div style={{ position: 'sticky', top: '82px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{
        background: 'linear-gradient(150deg, #0d1a14 0%, #1a3a2a 100%)',
        borderRadius: '18px', padding: '28px 24px', textAlign: 'center',
        border: '1px solid #2d6a4f40', overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(82,183,136,0.12)', borderRadius: '50%', filter: 'blur(24px)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ width: '52px', height: '52px', background: 'rgba(82,183,136,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Mountain size={24} color="#52b788" strokeWidth={2} />
          </div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '22px', color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '10px' }}>
            Join the expedition.
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: '20px' }}>
            Save treks, write reviews, and share your own Himalayan adventures with thousands of trekkers.
          </p>
          <Link to="/signup" style={{
            display: 'block', width: '100%', padding: '12px',
            background: 'var(--accent-green)', color: 'white',
            borderRadius: '12px', fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em',
            textTransform: 'uppercase', textDecoration: 'none',
            transition: 'all 0.2s', boxShadow: '0 6px 20px rgba(82,183,136,0.3)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#74c69d'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.transform = 'none'; }}>
            Create Free Account
          </Link>
          <Link to="/login" style={{ display: 'block', marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            Already a member? Sign in
          </Link>
        </div>
      </div>

      {/* QUICK STATS */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '14px' }}>India's Trek Network</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: <Mountain size={14} />, label: '25+ Verified Treks',      sub: 'Across 5 Himalayan states' },
            { icon: <MapPin size={14} />,   label: 'From 8,000 to 18,000 ft', sub: 'All difficulty levels' },
            { icon: <Star size={14} />,     label: 'Real Trekker Reviews',    sub: 'Written by the community' },
            { icon: <TrendingUp size={14}/>, label: 'Live Weather Intel',     sub: 'For every trail location' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'var(--accent-green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)', flexShrink: 0, marginTop: '1px' }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{item.label}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSidebar;
