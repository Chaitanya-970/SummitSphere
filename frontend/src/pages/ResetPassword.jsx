import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setIsLoading(true); setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/user/reset-password/${token}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  const inputStyle = { width: '100%', paddingLeft: '42px', paddingRight: '42px', paddingTop: '13px', paddingBottom: '13px', background: 'var(--bg-input)', border: '2px solid var(--border-light)', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '24px', transition: 'background 0.3s ease' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--accent-green-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={28} style={{ color: 'var(--accent-green)' }} />
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '30px', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>New Password</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Choose a strong new password</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-md)' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <ShieldCheck size={48} style={{ color: 'var(--accent-green)', margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>Password updated!</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'New Password', value: password, set: setPassword },
                { label: 'Confirm Password', value: confirmPassword, set: setConfirmPassword },
              ].map((field, idx) => (
                <div key={field.label}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>{field.label}</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
                    <input type={showPassword ? 'text' : 'password'} required value={field.value} onChange={e => field.set(e.target.value)} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
                    {idx === 0 && (
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex' }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {error && (
                <div style={{ padding: '12px 16px', background: 'var(--accent-rose-bg)', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: 'var(--accent-rose)' }}>{error}</div>
              )}

              <button disabled={isLoading} style={{ width: '100%', padding: '14px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', opacity: isLoading ? 0.7 : 1, boxShadow: 'var(--shadow-accent)', marginTop: '4px' }}>
                {isLoading ? <><Loader2 size={16} style={{ animation: 'spin 0.9s linear infinite' }} /> Updating...</> : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ResetPassword;
