import { useState } from 'react';
import { Mail, Loader2, ArrowLeft, ShieldAlert, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Transmission failed.');
      setMessage(data.message);
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '24px', transition: 'background 0.3s ease' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--bg-secondary)', border: '2px solid var(--border-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShieldAlert size={28} style={{ color: 'var(--accent-green)' }} />
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '30px', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>Reset Password</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>We'll send a recovery link to your email</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-md)' }}>
          {!message ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
                  <input
                    type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', paddingTop: '13px', paddingBottom: '13px', background: 'var(--bg-input)', border: '2px solid var(--border-light)', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                  />
                </div>
              </div>

              {error && (
                <div style={{ padding: '12px 16px', background: 'var(--accent-rose-bg)', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: 'var(--accent-rose)' }}>{error}</div>
              )}

              <button disabled={isLoading} style={{ width: '100%', padding: '14px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', opacity: isLoading ? 0.7 : 1, boxShadow: 'var(--shadow-accent)' }}>
                {isLoading ? <><Loader2 size={16} style={{ animation: 'spin 0.9s linear infinite' }} /> Sending...</> : 'Send Recovery Link'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <CheckCircle size={48} style={{ color: 'var(--accent-green)', margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '10px' }}>Email sent!</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{message}</p>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '24px', paddingTop: '20px', textAlign: 'center' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-green)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ForgotPassword;
