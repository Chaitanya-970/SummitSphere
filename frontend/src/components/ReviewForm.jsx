import { useState, useRef } from 'react';
import axios from 'axios';
import { AlertCircle, LogIn, Send, Star, X, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const ReviewAuthPrompt = () => (
  <div style={{ background: 'var(--bg-secondary)', border: '2px dashed var(--border-primary)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
    <h4 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>Share Your Experience</h4>
    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Sign in to write a review</p>
    <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 24px', background: 'var(--accent-green)', color: 'white', borderRadius: '10px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      <LogIn size={15} /> Sign In
    </Link>
  </div>
);

const ReviewForm = ({ trekId, onReviewSuccess }) => {
  const { user } = useAuthContext();
  const fileInputRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [hover, setHover] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleRemovePhoto = (e) => {
    e.preventDefault(); setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!rating) return setError('Please select a star rating.');
    setLoading(true); setError(null);
    const formData = new FormData();
    formData.append('trekId', trekId); formData.append('rating', rating); formData.append('comment', comment);
    if (userName.trim()) formData.append('userName', userName.trim());
    if (selectedFile) formData.append('photos', selectedFile);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, formData, { headers: { 'Authorization': `Bearer ${user.token}` } });
      setComment(""); setRating(0); setSelectedFile(null); setPreviewUrl(null); setUserName("");
      if (onReviewSuccess) onReviewSuccess();
    } catch (err) { setError(err.response?.data?.error || "Submission failed."); }
    finally { setLoading(false); }
  };

  if (!user) return <ReviewAuthPrompt />;

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'background 0.3s ease' }}>
      <div>
        <h4 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '4px' }}>Write a Review</h4>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Share your experience</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* STAR RATING */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', padding: '12px 20px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            {[1,2,3,4,5].map(val => (
              <button key={val} type="button"
                onMouseEnter={() => setHover(val)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(val)}
                onTouchStart={() => { setHover(val); setRating(val); }}
                onTouchEnd={() => setHover(0)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.15s' }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(1.3)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Star size={26} fill={(hover || rating) >= val ? 'var(--accent-amber)' : 'none'} style={{ color: (hover || rating) >= val ? 'var(--accent-amber)' : 'var(--border-primary)', transition: 'all 0.15s' }} />
              </button>
            ))}
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
            {rating > 0 ? `${rating} / 5 stars` : 'Select a rating'}
          </span>
        </div>

        {/* INPUTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          <input type="text" placeholder="Your name (optional)" value={userName} onChange={e => setUserName(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '2px solid var(--border-light)', borderRadius: '10px', fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '13px', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />

          <div style={{ position: 'relative' }}>
            <input type="file" hidden accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
            <div onClick={() => !selectedFile && fileInputRef.current.click()}
              style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '2px solid var(--border-light)', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                {previewUrl ? <img src={previewUrl} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} alt="" /> : <Camera size={16} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />}
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile ? 'Photo ready' : 'Add photo'}</span>
              </div>
              {selectedFile && <X size={15} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} onClick={handleRemovePhoto} />}
            </div>
          </div>
        </div>

        <textarea placeholder="Tell others about the trail, views, difficulty..." rows={4} value={comment} onChange={e => setComment(e.target.value)}
          style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-card)', border: '2px solid var(--border-light)', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)', outline: 'none', resize: 'none', lineHeight: 1.6, transition: 'border-color 0.2s' }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--accent-rose-bg)', borderRadius: '10px', fontSize: '12px', color: 'var(--accent-rose)', fontWeight: 600 }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '13px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: 'var(--shadow-accent)' }}>
          <Send size={15} style={{ transform: 'rotate(-45deg)' }} />
          {loading ? 'Submitting...' : 'Post Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
