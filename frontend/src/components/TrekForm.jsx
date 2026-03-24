import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { AlertCircle, ImagePlus, Mountain, Send, Check } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '13px 16px',
  background: 'var(--bg-input)', border: '2px solid var(--border-light)',
  borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 500,
  fontSize: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
};

const InputField = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
    <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</label>
    <input {...props} step="any" style={inputStyle}
      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
  </div>
);

const TrekForm = ({ onTrekCreated }) => {
  const { user } = useAuthContext();
  const [values, setValues] = useState({ name: '', state: '', difficulty: 'Moderate', duration: '', maxAltitude: '', description: '', lat: '', lng: '' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field, value) => setValues(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError('You must be logged in to contribute.');
    if (!image) return setError('Please upload a trek photo.');
    setIsSubmitting(true); setError(null);
    const formData = new FormData();
    Object.keys(values).forEach(key => formData.append(key, values[key]));
    formData.append('image', image);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/treks`, formData, { headers: { 'Authorization': `Bearer ${user.token}` } });
      setValues({ name: '', state: '', difficulty: 'Moderate', duration: '', maxAltitude: '', description: '', lat: '', lng: '' });
      setImage(null);
      if (onTrekCreated) onTrekCreated();
      alert("Trek successfully published!");
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.error || 'Submission failed. Check your inputs.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', maxWidth: '680px', margin: '0 auto', transition: 'background 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div style={{ width: '44px', height: '44px', background: 'var(--accent-green-bg)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Mountain size={22} style={{ color: 'var(--accent-green)' }} />
        </div>
        <div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>New Trek</h3>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-faint)', marginTop: '2px' }}>Fill in the details below</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <InputField label="Trek Name" placeholder="e.g. Kedarkantha" value={values.name} onChange={e => setField('name', e.target.value)} required />
          <InputField label="State" placeholder="e.g. Uttarakhand" value={values.state} onChange={e => setField('state', e.target.value)} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Difficulty</label>
            <select value={values.difficulty} onChange={e => setField('difficulty', e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
              <option>Easy</option><option>Moderate</option><option>Hard</option>
            </select>
          </div>
          <InputField label="Duration (days)" type="number" placeholder="6" value={values.duration} onChange={e => setField('duration', e.target.value)} required />
          <InputField label="Max Altitude (ft)" type="number" placeholder="12500" value={values.maxAltitude} onChange={e => setField('maxAltitude', e.target.value)} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <InputField label="Latitude" type="number" placeholder="31.23" value={values.lat} onChange={e => setField('lat', e.target.value)} />
          <InputField label="Longitude" type="number" placeholder="78.14" value={values.lng} onChange={e => setField('lng', e.target.value)} />
        </div>

        {/* IMAGE UPLOAD */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', border: `2px dashed ${image ? 'var(--accent-green)' : 'var(--border-primary)'}`, borderRadius: '14px', cursor: 'pointer', background: image ? 'var(--accent-green-bg)' : 'var(--bg-input)', transition: 'all 0.2s' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: image ? 'var(--accent-green)' : 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
            {image ? <Check size={18} color="white" /> : <ImagePlus size={18} style={{ color: 'var(--text-faint)' }} />}
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: image ? 'var(--accent-green)' : 'var(--text-muted)' }}>{image ? image.name.substring(0, 30) : 'Upload Trek Photo'}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>JPG or PNG recommended</p>
          </div>
          <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => setImage(e.target.files[0])} />
        </label>

        {/* DESCRIPTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Description</label>
          <textarea placeholder="Describe the trail, views, experience..." rows={4} value={values.description} onChange={e => setField('description', e.target.value)} required
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.6, fontStyle: 'italic' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--accent-rose-bg)', borderRadius: '10px', fontSize: '12px', color: 'var(--accent-rose)', fontWeight: 600 }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <button disabled={isSubmitting} type="submit" style={{ width: '100%', padding: '14px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-accent)', marginTop: '4px' }}>
          <Send size={16} style={{ transform: 'rotate(-45deg)' }} />
          {isSubmitting ? 'Publishing...' : 'Publish Trek'}
        </button>
      </div>
    </form>
  );
};

export default TrekForm;
