import { useState } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, LogIn, Send, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const BookingForm = ({ trekId, trekName }) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({ fullName: '', groupSize: 1, trekDate: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setStatus('loading');
    try {
      await axios.post('http://localhost:5000/api/bookings', { ...formData, trekId, trekName, email: user.email }, { headers: { 'Authorization': `Bearer ${user.token}` } });
      setStatus('success');
    } catch (err) { console.log(err); setStatus('error'); }
  };

  const inputStyle = { width: '100%', padding: '13px 16px', background: 'var(--bg-input)', border: '2px solid var(--border-light)', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' };

  if (!user) return (
    <div style={{ background: 'var(--bg-card)', padding: '40px 32px', borderRadius: '20px', border: '1px solid var(--border-light)', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
      <LogIn size={36} style={{ margin: '0 auto 16px', color: 'var(--text-faint)' }} />
      <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Sign In to Book</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Create a free account to book your expedition</p>
      <Link to="/login" style={{ display: 'block', padding: '13px', background: 'var(--accent-green)', color: 'white', borderRadius: '12px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', boxShadow: 'var(--shadow-accent)' }}>
        Sign In to Continue
      </Link>
    </div>
  );

  if (status === 'success') return (
    <div style={{ background: 'var(--accent-green-bg)', border: '2px dashed var(--accent-green)', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
      <CheckCircle size={52} style={{ margin: '0 auto 16px', color: 'var(--accent-green)' }} />
      <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '26px', color: 'var(--text-primary)', marginBottom: '10px' }}>Booking Sent!</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
        Your request for <strong>{trekName}</strong> has been logged. You'll receive a confirmation email shortly.
      </p>
      <Link to="/" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        ← Back to Treks
      </Link>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-card)', padding: '36px 32px', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', transition: 'background 0.3s ease' }}>
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
          Book Your Slot
        </h3>
        {trekName && <p style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{trekName}</p>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Full Name</label>
          <input required style={inputStyle} placeholder="Your full name" onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <Users size={11} /> Group Size
            </label>
            <input type="number" min="1" required style={inputStyle} defaultValue={1} onChange={e => setFormData({ ...formData, groupSize: Number(e.target.value) })}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <Calendar size={11} /> Trek Date
            </label>
            <input type="date" required min={new Date().toISOString().split('T')[0]} style={{ ...inputStyle, colorScheme: 'light dark' }} onChange={e => setFormData({ ...formData, trekDate: e.target.value })}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
          </div>
        </div>

        {status === 'error' && (
          <p style={{ fontSize: '12px', color: 'var(--accent-rose)', fontWeight: 600, padding: '12px 16px', background: 'var(--accent-rose-bg)', borderRadius: '10px' }}>
            Booking failed. Please try again.
          </p>
        )}

        <button disabled={status === 'loading'} style={{ width: '100%', padding: '14px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: status === 'loading' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: status === 'loading' ? 0.7 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-accent)', marginTop: '4px' }}>
          <Send size={15} />
          {status === 'loading' ? 'Sending...' : 'Send Booking Request'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
