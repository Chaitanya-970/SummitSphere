import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ChevronRight, Globe, Trash2, ImagePlus, Check, AlertCircle, Mountain } from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const MapEvents = ({ onPointAdded, points }) => {
  useMapEvents({ click(e) { onPointAdded([e.latlng.lat, e.latlng.lng]); } });
  return (
    <>
      {points.map((coord, idx) => <Marker key={idx} position={coord} />)}
      {points.length > 1 && <Polyline positions={points} pathOptions={{ color: 'var(--accent-green, #2d6a4f)', weight: 3, dashArray: '8, 8' }} />}
    </>
  );
};

const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '2px solid var(--border-light)', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' };

const InputField = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
    <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</label>
    <input {...props} style={inputStyle}
      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
      onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
  </div>
);

const CreateTrek = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', state: '', difficulty: 'Moderate', duration: '', maxAltitude: '', description: '' });
  const [image, setImage] = useState(null);
  const [itinerary, setItinerary] = useState([]);

  const points = useMemo(() => itinerary.map(i => i.coordinates), [itinerary]);

  const handlePointAdded = (coords) => {
    setItinerary(curr => [...curr, { day: curr.length + 1, title: `Day ${curr.length + 1} Camp`, coordinates: coords }]);
  };

  const removePoint = (index) => {
    setItinerary(curr => curr.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError('Login required.');
    if (itinerary.length === 0) return setError('Plot at least one point on the map.');
    if (!image) return setError('Trek photo required.');
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('image', image);
    data.append('itinerary', JSON.stringify(itinerary));
    const [lat, lon] = itinerary[0].coordinates;
    data.append('geometry', JSON.stringify({ type: 'Point', coordinates: [lon, lat] }));
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/treks`, data, { headers: { Authorization: `Bearer ${user.token}` } });
      navigate('/');
    } catch (err) { setError(err.response?.data?.error || 'Submission failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 24px 80px', transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* PAGE HEADER */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 42px)', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
            Add New Trek
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Fill in the details and plot your route on the map
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }} className="create-grid">

          {/* LEFT — FORM */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '18px', transition: 'background 0.3s ease' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <InputField label="Trek Name" placeholder="e.g. Kedarkantha" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <InputField label="State / Region" placeholder="e.g. Uttarakhand" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Difficulty</label>
                <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                  <option>Easy</option><option>Moderate</option><option>Hard</option>
                </select>
              </div>
              <InputField label="Days" type="number" placeholder="6" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} required />
              <InputField label="Altitude (ft)" type="number" placeholder="12500" value={formData.maxAltitude} onChange={e => setFormData({ ...formData, maxAltitude: e.target.value })} required />
            </div>

            {/* PHOTO UPLOAD */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', border: `2px dashed ${image ? 'var(--accent-green)' : 'var(--border-primary)'}`, borderRadius: '14px', cursor: 'pointer', background: image ? 'var(--accent-green-bg)' : 'var(--bg-input)', transition: 'all 0.2s' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: image ? 'var(--accent-green)' : 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                {image ? <Check size={17} color="white" /> : <ImagePlus size={17} style={{ color: 'var(--text-faint)' }} />}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: image ? 'var(--accent-green)' : 'var(--text-muted)' }}>{image ? image.name.substring(0, 30) : 'Upload Hero Photo'}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '1px' }}>JPG or PNG</p>
              </div>
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => setImage(e.target.files[0])} />
            </label>

            {/* DESCRIPTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Description</label>
              <textarea placeholder="Describe the trail experience, views, terrain..." rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.7, fontStyle: 'italic' }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
            </div>

            {/* WAYPOINTS LIST */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Globe size={15} style={{ color: 'var(--accent-green)' }} />
                <h4 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Route Waypoints</h4>
                <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>— click the map to add</span>
              </div>
              <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {itinerary.length === 0 ? (
                  <div style={{ padding: '28px', textAlign: 'center', border: '2px dashed var(--border-primary)', borderRadius: '12px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-faint)', fontStyle: 'italic' }}>No waypoints yet. Click the map →</p>
                  </div>
                ) : itinerary.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '10px 14px' }}>
                    <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-green-bg)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px', flexShrink: 0 }}>D{item.day}</span>
                    <input value={item.title} onChange={e => { const next = [...itinerary]; next[idx].title = e.target.value; setItinerary(next); }}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }} />
                    <button type="button" onClick={() => removePoint(idx)} style={{ padding: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-rose)', display: 'flex', borderRadius: '6px', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-rose-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--accent-rose-bg)', borderRadius: '10px', fontSize: '12px', color: 'var(--accent-rose)', fontWeight: 600 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button disabled={loading} type="submit" style={{ width: '100%', padding: '14px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-accent)' }}>
              {loading ? 'Publishing...' : <><Mountain size={16} /> Publish Trek <ChevronRight size={16} /></>}
            </button>
          </div>

          {/* RIGHT — MAP */}
          <div style={{ position: 'sticky', top: '88px', height: 'clamp(400px, 65vh, 680px)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', background: 'var(--bg-secondary)' }}>
            {/* Shimmer shows while Leaflet tiles load */}
            <div className="shimmer" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
            <MapContainer center={[30.12, 78.56]} zoom={8} style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapEvents onPointAdded={handlePointAdded} points={points} />
            </MapContainer>
          </div>
        </form>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .create-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CreateTrek;
