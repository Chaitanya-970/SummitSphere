import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { Mail, Lock, AlertCircle, Mountain } from 'lucide-react';

const HERO = "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=80";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  useEffect(() => { document.title = 'Sign In — SummitSphere'; }, []);

  const handleSubmit = async (e) => { e.preventDefault(); await login(email, password); };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', background: 'var(--bg-primary)' }}>

      {/* LEFT - Image panel (hidden on small screens) */}
      <div className="hidden lg:block" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
        <img src={HERO} alt="Mountain trek" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,18,8,0.7) 0%, rgba(45,106,79,0.5) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '48px', left: '48px', right: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--accent-green)', padding: '8px', borderRadius: '10px' }}>
              <Mountain color="white" size={17} strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '22px', color: 'white' }}>SummitSphere</span>
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '38px', color: 'white', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Every summit<br/>starts here.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.6 }}>
            Log in to track your expeditions, save treks, and connect with India's hiking community.
          </p>
        </div>
      </div>

      {/* RIGHT - Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: 'var(--bg-primary)', transition: 'background 0.3s ease' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ marginBottom: '32px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: 'var(--text-primary)' }}>
              Summit<span style={{ color: 'var(--accent-green)' }}>Sphere</span>
            </span>
          </div>

          <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
            Welcome back
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '36px' }}>Sign in to your basecamp account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '13px', paddingBottom: '13px', background: 'var(--bg-input)', border: '2px solid var(--border-light)', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-green)', transition: 'opacity 0.2s' }}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '13px', paddingBottom: '13px', background: 'var(--bg-input)', border: '2px solid var(--border-light)', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                />
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--accent-rose-bg)', borderRadius: '10px', border: '1px solid var(--accent-rose)' }}>
                <AlertCircle size={15} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-rose)' }}>{typeof error === 'string' ? error : 'Login failed. Try again.'}</span>
              </div>
            )}

            <button
              disabled={isLoading}
              style={{ width: '100%', padding: '14px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '4px', boxShadow: 'var(--shadow-accent)' }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            New to SummitSphere?{' '}
            <Link to="/signup" style={{ fontWeight: 700, color: 'var(--accent-green)' }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
