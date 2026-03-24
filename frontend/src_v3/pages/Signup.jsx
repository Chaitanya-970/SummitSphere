import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import { User, Mail, Lock, AlertCircle, Mountain } from 'lucide-react';

const HERO = "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=80";

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();

  useEffect(() => { document.title = 'Create Account — SummitSphere'; }, []);

  const handleSubmit = async (e) => { e.preventDefault(); await signup(name, email, password); };

  const inputStyle = {
    width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '13px', paddingBottom: '13px',
    background: 'var(--bg-input)', border: '2px solid var(--border-light)', borderRadius: '12px',
    fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)',
    outline: 'none', transition: 'border-color 0.2s'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', background: 'var(--bg-primary)' }}>

      {/* LEFT - Image panel */}
      <div className="hidden lg:block" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
        <img src={HERO} alt="Mountain trek" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,18,8,0.75) 0%, rgba(45,106,79,0.5) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '48px', left: '48px', right: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--accent-green)', padding: '8px', borderRadius: '10px' }}>
              <Mountain color="white" size={17} strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '22px', color: 'white' }}>SummitSphere</span>
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '38px', color: 'white', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Join the<br/>expedition.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.6 }}>
            Thousands of trekkers already discover, share and plan their Himalayan adventures here.
          </p>
        </div>
      </div>

      {/* RIGHT - Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: 'var(--bg-primary)', transition: 'background 0.3s ease' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          <div className="lg:hidden" style={{ marginBottom: '32px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: 'var(--text-primary)' }}>
              Summit<span style={{ color: 'var(--accent-green)' }}>Sphere</span>
            </span>
          </div>

          <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
            Create account
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>Start your trekking journey today</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Full Name', type: 'text', value: name, set: setName, placeholder: 'Chaitanya Bhardwaj', icon: <User size={16} /> },
              { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com', icon: <Mail size={16} /> },
              { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '••••••••', icon: <Lock size={16} /> },
            ].map(field => (
              <div key={field.label}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none', display: 'flex' }}>{field.icon}</span>
                  <input
                    type={field.type} required value={field.value} onChange={e => field.set(e.target.value)}
                    placeholder={field.placeholder} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                  />
                </div>
              </div>
            ))}

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--accent-rose-bg)', borderRadius: '10px', border: '1px solid var(--accent-rose)' }}>
                <AlertCircle size={15} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-rose)' }}>{typeof error === 'string' ? error : 'Registration failed.'}</span>
              </div>
            )}

            <button
              disabled={isLoading}
              style={{ width: '100%', padding: '14px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '4px' }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.color = 'white'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-primary)'; }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            Already a member?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--accent-green)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
