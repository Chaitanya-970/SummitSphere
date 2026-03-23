import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, ChevronLeft, Image as ImageIcon, Save, Check } from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';
import PageLoader from '../components/PageLoader';

const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '2px solid var(--border-light)', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' };

const EditTrek = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authReady } = useAuthContext();

  const [formData, setFormData] = useState({ name: '', description: '', difficulty: 'Moderate', duration: '', maxAltitude: '', state: '' });
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authReady) return;
    const fetchTrek = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/treks/${id}`);
        const trek = res.data;
        const ownerId = trek.user_id?._id || trek.user_id;
        if (user && ownerId !== user.id) { navigate(`/trek/${id}`, { replace: true }); return; }
        setFormData({ name: trek.name, description: trek.description, difficulty: trek.difficulty, duration: trek.duration, maxAltitude: trek.maxAltitude, state: trek.state });
        setCurrentImageUrl(trek.imageUrl);
      } catch (err) { console.log(err); setError('Trek not found.'); }
      finally { setLoading(false); }
    };
    fetchTrek();
  }, [id, user, authReady, navigate]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setUpdating(true); setError(null);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);
    try {
      await axios.patch(`http://localhost:5000/api/treks/${id}`, data, { headers: { Authorization: `Bearer ${user.token}` } });
      navigate(`/trek/${id}`);
    } catch (err) { setError(err.response?.data?.error || 'Update failed.'); setUpdating(false); }
  };

  if (loading) return <PageLoader />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 24px 80px', transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>

        {/* BACK BUTTON */}
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ChevronLeft size={16} /> Discard Changes
        </button>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-md)', transition: 'background 0.3s ease' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '32px', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>Edit Trek</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Update trek information</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* HERO IMAGE */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Hero Photo</p>
              <label style={{ position: 'relative', height: '240px', borderRadius: '14px', overflow: 'hidden', border: '2px solid var(--border-light)', cursor: 'pointer', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.querySelector('.img-overlay').style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.querySelector('.img-overlay').style.opacity = '0'; }}
              >
                <img
                  src={image ? URL.createObjectURL(image) : currentImageUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                  alt="Trek preview"
                />
                <div className="img-overlay" style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none',
                }}>
                  <ImageIcon size={28} color="white" />
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Replace Photo</span>
                </div>
                <input type="file" style={{ display: 'none' }} onChange={e => setImage(e.target.files[0])} accept="image/*" />
              </label>
            </div>

            {/* FIELDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { label: 'Trek Name', name: 'name', type: 'text' },
                { label: 'State / Region', name: 'state', type: 'text' },
              ].map(f => (
                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{f.label}</label>
                  <input name={f.name} type={f.type} value={formData[f.name]} onChange={handleChange} required style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                  <option>Easy</option><option>Moderate</option><option>Hard</option>
                </select>
              </div>
              {[
                { label: 'Duration (days)', name: 'duration', type: 'number' },
                { label: 'Max Altitude (ft)', name: 'maxAltitude', type: 'number' },
              ].map(f => (
                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{f.label}</label>
                  <input name={f.name} type={f.type} value={formData[f.name]} onChange={handleChange} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={5} required
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.7, fontStyle: 'italic' }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--accent-rose-bg)', borderRadius: '10px', fontSize: '12px', color: 'var(--accent-rose)', fontWeight: 600 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button disabled={updating} type="submit" style={{ width: '100%', padding: '14px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: updating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: updating ? 0.7 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-accent)' }}>
              <Save size={16} />
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTrek;
