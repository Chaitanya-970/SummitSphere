import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, Edit, Gauge, Mountain, Star, Trash2, MapPin, Bookmark, BookmarkCheck, CloudSun, Image as ImageIcon, X, Share2 } from 'lucide-react';
import TrekMap from '../components/TrekMap';
import ReviewForm from '../components/ReviewForm';
import PageLoader from '../components/PageLoader';
import WeatherWidget from '../components/WeatherWidget';
import TrekPDF from '../components/TrekPDF';
import { useAuthContext } from '../hooks/useAuthContext';

//DETERMINISTIC IMAGE HASH (DO NOT MODIFY) 
const TREK_IMAGES = [
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80",
  "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?w=1200&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=80",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80",
  "https://images.unsplash.com/photo-1465311440653-ba3b0d2d31fac?w=1200&q=80",
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=80",
];
const getTrekImage = (trekName, originalImage) => {
  if (!originalImage || originalImage.includes("1522199710521")) {
    let hash = 0;
    for (let i = 0; i < trekName.length; i++) { hash = trekName.charCodeAt(i) + ((hash << 5) - hash); }
    return TREK_IMAGES[Math.abs(hash) % TREK_IMAGES.length];
  }
  return originalImage;
};

const StatBlock = ({ icon, label, value, color }) => {
  const colors = { emerald: { bg: 'var(--accent-green-bg)', text: 'var(--accent-green)' }, blue: { bg: '#dbeafe', text: '#2563eb' }, purple: { bg: '#ede9fe', text: '#7c3aed' } };
  const c = colors[color] || colors.emerald;
  return (
    <div style={{ padding: '18px 14px', background: c.bg, borderRadius: '14px', textAlign: 'center', border: `1px solid ${c.text}20` }}>
      <div style={{ color: c.text, display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{icon}</div>
      <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '16px', color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
};

// PHOTO LIGHTBOX 
const PhotoLightbox = ({ photos, startIndex, onClose }) => {
  const [current, setCurrent] = React.useState(startIndex);
  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrent(i => (i + 1) % photos.length);
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      onKeyDown={e => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); }}
      tabIndex={0} autoFocus
      style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Close */}
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={18} />
      </button>
      {/* Prev */}
      {photos.length > 1 && (
        <button onClick={prev} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={22} />
        </button>
      )}
      {/* Image + counter */}
      <div style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <img src={photos[current]} alt={`photo ${current + 1}`} style={{ maxWidth: '100%', maxHeight: '72vh', borderRadius: '14px', objectFit: 'contain', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>{current + 1} / {photos.length}</span>
          {photos.length > 1 && photos.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: '7px', height: '7px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: i === current ? 'white' : 'rgba(255,255,255,0.3)', transition: 'background 0.2s' }} />
          ))}
        </div>
      </div>
      {/* Next */}
      {photos.length > 1 && (
        <button onClick={next} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
};

// REVIEW CARD
const ReviewCard = ({ review, user, refresh, setToast, onOpenPhotos }) => {
  if (!review) return null;
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${review._id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      setToast({ show: true, message: 'Review deleted.', variant: 'success' });
      refresh();
    } catch (err) { setToast({ show: true, message: 'Delete failed.', variant: 'error' }); }
  };
  const isAuthor  = user && (review.userId?._id || review.userId) === (user?.id || user?._id);
  const hasPhotos = review.photos?.length > 0;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '5px' }}>{review.userName || 'Anonymous Trekker'}</p>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? 'var(--accent-amber)' : 'none'} style={{ color: i < review.rating ? 'var(--accent-amber)' : 'var(--border-primary)' }} />)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {/* Photo badge */}
          {hasPhotos && (
            <button onClick={() => onOpenPhotos(review.photos, 0)}
              title={`${review.photos.length} photo${review.photos.length > 1 ? 's' : ''} attached`}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 9px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'var(--accent-green-bg)', color: 'var(--accent-green)', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '10px', letterSpacing: '0.04em', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-green-bg)'; e.currentTarget.style.color = 'var(--accent-green)'; }}>
              <ImageIcon size={12} /> {review.photos.length}
            </button>
          )}
          {/* Delete */}
          {isAuthor && (
            <button onClick={handleDelete} style={{ padding: '5px', background: 'var(--accent-rose-bg)', border: 'none', borderRadius: '7px', cursor: 'pointer', color: 'var(--accent-rose)', display: 'flex' }}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic' }}>"{review.comment}"</p>
      {/* Thumbnails */}
      {hasPhotos && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          {review.photos.map((photo, i) => (
            <button key={i} onClick={() => onOpenPhotos(review.photos, i)}
              style={{ padding: 0, border: '2px solid var(--border-light)', borderRadius: '9px', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, background: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}>
              <img src={photo} alt={`photo ${i + 1}`} style={{ width: '64px', height: '64px', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}
      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginTop: '10px' }}>
        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
    </div>
  );
};

const TrekDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [trek, setTrek] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [lightbox, setLightbox] = useState(null); // { photos, index }

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => { document.title = 'SummitSphere'; }; // reset on unmount
  }, [id]);
  useEffect(() => {
    if (toast.show) { const t = setTimeout(() => setToast(p => ({ ...p, show: false })), 3000); return () => clearTimeout(t); }
  }, [toast.show]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
      const [trekRes, reviewRes, bookmarkRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/treks/${id}`, config),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/trek/${id}`),
        user ? axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookmarks`, config) : Promise.resolve({ data: [] })
      ]);
      setTrek(trekRes.data); setReviews(reviewRes.data);
      document.title = `${trekRes.data.name} — SummitSphere`;
      if (user) setIsBookmarked(bookmarkRes.data.some(b => b.trekId?._id === id || b.trekId === id));
    } catch (err) { setError('Trek not found.'); }
    finally { setLoading(false); }
  }, [id, user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isOwner = user && (trek?.user_id?._id === user.id || trek?.user_id === user.id);

  const handleBookmark = async () => {
    if (!user) return setToast({ show: true, message: 'Login to save treks!', variant: 'error' });
    try {
      if (isBookmarked) {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookmarks/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
        setIsBookmarked(false); setToast({ show: true, message: 'Removed from saved.', variant: 'success' });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookmarks`, { trekId: id }, { headers: { Authorization: `Bearer ${user.token}` } });
        setIsBookmarked(true); setToast({ show: true, message: 'Trek saved!', variant: 'success' });
      }
    } catch (err) { setToast({ show: true, message: 'Action failed.', variant: 'error' }); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this trek permanently?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/treks/${trek._id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      navigate('/');
    } catch (err) { setToast({ show: true, message: 'Delete failed.', variant: 'error' }); }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: trek?.name, text: `Check out ${trek?.name} on SummitSphere`, url });
    } else {
      navigator.clipboard.writeText(url).then(() =>
        setToast({ show: true, message: 'Link copied!', variant: 'success' })
      ).catch(() =>
        setToast({ show: true, message: 'Could not copy link.', variant: 'error' })
      );
    }
  };
  // Parallax scroll for hero image
  React.useEffect(() => {
    const handleScroll = () => {
      const img = document.querySelector('.trek-hero-img');
      if (img) img.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background 0.3s ease' }}>
      {/* SKELETON HERO */}
      <div className="shimmer" style={{ height: 'clamp(340px, 58vh, 560px)', width: '100%' }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gap: '32px' }} className="trek-detail-grid">
          {/* LEFT skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="shimmer" style={{ height: '28px', borderRadius: '8px', width: '60%' }} />
            <div className="shimmer" style={{ height: '16px', borderRadius: '8px', width: '100%' }} />
            <div className="shimmer" style={{ height: '16px', borderRadius: '8px', width: '90%' }} />
            <div className="shimmer" style={{ height: '16px', borderRadius: '8px', width: '80%' }} />
            <div className="shimmer" style={{ height: '200px', borderRadius: '14px', marginTop: '8px' }} />
          </div>
          {/* RIGHT skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="shimmer" style={{ height: '180px', borderRadius: '14px' }} />
            <div className="shimmer" style={{ height: '120px', borderRadius: '14px' }} />
            <div className="shimmer" style={{ height: '80px', borderRadius: '14px' }} />
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 1024px) {
          .trek-detail-grid { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );

  if (error && !loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '24px', textAlign: 'center' }}>
      <AlertTriangle size={52} style={{ color: 'var(--accent-rose)', marginBottom: '18px' }} />
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '26px', color: 'var(--text-primary)', marginBottom: '16px' }}>{error}</h2>
      <button onClick={() => navigate('/')} style={{ padding: '11px 26px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Back to Home</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background 0.3s ease' }}>
      {/* TOAST */}
      {toast.show && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 3000, padding: '11px 18px', borderRadius: '10px', boxShadow: 'var(--shadow-lg)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', background: toast.variant === 'error' ? 'var(--accent-rose-bg)' : 'var(--accent-green-bg)', color: toast.variant === 'error' ? 'var(--accent-rose)' : 'var(--accent-green)', border: `1px solid ${toast.variant === 'error' ? 'var(--accent-rose)' : 'var(--accent-green)'}` }}>
          {toast.message}
        </div>
      )}

      {/* HERO  */}
      <div style={{ position: 'relative', height: 'clamp(340px, 58vh, 560px)', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
        {/* Skeleton behind image until loaded */}
        <div className="shimmer" style={{ position: 'absolute', inset: 0 }} />
        <img src={getTrekImage(trek.name, trek.imageUrl)} alt={trek.name}
          style={{ width: '100%', height: '115%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, willChange: 'transform', transition: 'opacity 0.4s ease', opacity: 0 }}
          className="trek-hero-img"
          onLoad={e => { e.currentTarget.style.opacity = '1'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.15) 100%)' }} />
        <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', transition: 'all 0.2s' }}>
            <ChevronLeft size={15} /> Back
          </button>
          {/* Share + Bookmark */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleShare} title="Share this trek"
              style={{ padding: '9px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', cursor: 'pointer', color: 'white', display: 'flex', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; }}>
              <Share2 size={19} />
            </button>
            <button onClick={handleBookmark} style={{ padding: '9px', borderRadius: '11px', border: `1px solid ${isBookmarked ? 'var(--accent-green)' : 'rgba(255,255,255,0.3)'}`, background: isBookmarked ? 'var(--accent-green)' : 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', cursor: 'pointer', color: 'white', display: 'flex', transition: 'all 0.2s' }}>
              {isBookmarked ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '28px', left: '24px', right: '24px', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 13px', background: 'var(--accent-green)', color: 'white', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em' }}>{trek.difficulty}</span>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} /> {trek.state}
            </span>
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(34px, 7vw, 70px)', color: 'white', lineHeight: 0.95, letterSpacing: '-0.04em', textShadow: '0 4px 20px rgba(0,0,0,0.35)' }}>
            {trek.name}
          </h1>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }} className="trek-detail-grid">

          {/* LEFT COLUMN  */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* OWNER CONTROLS */}
            {isOwner && (
              <div style={{ display: 'flex', gap: '10px', padding: '14px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
                <button onClick={() => navigate(`/edit-trek/${trek._id}`)} style={actionBtnStyle('ghost')}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--accent-green)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}>
                  <Edit size={13} /> Edit Trek
                </button>
                <button onClick={handleDelete} style={actionBtnStyle('danger')}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-rose)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-rose-bg)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}

            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <StatBlock icon={<Gauge size={20} />} label="Difficulty" value={trek.difficulty} color="emerald" />
              <StatBlock icon={<Clock size={20} />} label="Duration" value={`${trek.duration} Days`} color="blue" />
              <StatBlock icon={<Mountain size={20} />} label="Altitude" value={`${trek.maxAltitude} ft`} color="purple" />
            </div>

            {/* DESCRIPTION */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '22px', color: 'var(--text-primary)', marginBottom: '12px' }}>About This Trek</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '15px', borderLeft: '3px solid var(--accent-green)', paddingLeft: '16px', fontStyle: 'italic' }}>{trek.description}</p>
            </div>

            {/* ITINERARY */}
            {trek.itinerary?.length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '14px' }}>Day-by-Day</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trek.itinerary.map((day, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '15px 18px', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-green-bg)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px', flexShrink: 0 }}>D{idx + 1}</div>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '3px' }}>{typeof day === 'string' ? `Phase ${idx + 1}` : day.title}</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>{typeof day === 'string' ? day : day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '20px', color: 'var(--text-primary)' }}>Reviews</h3>
                <span style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', fontWeight: 700, fontSize: '13px', padding: '3px 12px', borderRadius: '20px' }}>{reviews.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {reviews.length > 0 ? reviews.map(r => <ReviewCard key={r._id} review={r} user={user} refresh={fetchData} setToast={setToast} onOpenPhotos={(photos, index) => setLightbox({ photos, index })} />) : (
                  <div style={{ padding: '36px', textAlign: 'center', border: '2px dashed var(--border-primary)', borderRadius: '14px' }}>
                    <Star size={32} style={{ margin: '0 auto 10px', color: 'var(--border-primary)' }} />
                    <p style={{ fontSize: '13px', color: 'var(--text-faint)' }}>No reviews yet. Be the first!</p>
                  </div>
                )}
              </div>
              <ReviewForm trekId={trek._id} onReviewSuccess={fetchData} />
            </div>
          </div>

          {/* RIGHT SIDEBAR  */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* WEATHER */}
            {trek.geometry?.coordinates?.length === 2 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
                  <CloudSun size={15} style={{ color: 'var(--accent-green)' }} />
                  <h4 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Trail Weather</h4>
                </div>
                <WeatherWidget lat={trek.geometry.coordinates[1]} lon={trek.geometry.coordinates[0]} />
              </div>
            )}

            {/* MAP */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>Route Map</h4>
              <TrekMap itinerary={trek.itinerary} />
            </div>

            {/* TRIP DETAILS  */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '18px', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>At a Glance</h4>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <DetailRow label="Difficulty"   value={trek.difficulty} />
                <DetailRow label="Duration"     value={`${trek.duration} Days`} />
                <DetailRow label="Max Altitude" value={`${trek.maxAltitude?.toLocaleString()} ft`} />
                {trek.state      && <DetailRow label="State"       value={trek.state} />}
                {trek.startPoint && <DetailRow label="Start Point" value={trek.startPoint} />}
                {trek.endPoint   && <DetailRow label="End Point"   value={trek.endPoint} />}
                {trek.groupSize  && <DetailRow label="Group Size"  value={trek.groupSize} />}
              </div>
            </div>

            {/* BEST SEASON */}
            <BestSeasonCard state={trek.state} />

            {/* READY TO TREK CTA*/}
            <div style={{ background: 'linear-gradient(160deg, #0d1a14 0%, #1a3a2a 100%)', borderRadius: '16px', padding: '22px', color: 'white', border: '1px solid #2d6a4f40' }}>
              <h4 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '20px', marginBottom: '6px', lineHeight: 1.1 }}>Ready to Trek?</h4>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginBottom: '16px', lineHeight: 1.55 }}>
                Download the field manual or secure your spot on this expedition.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <TrekPDF trek={trek} />
                <Link to={`/book/${trek._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '12px', background: 'var(--accent-green)', color: 'white', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s', boxShadow: '0 6px 20px rgba(82,183,136,0.3)', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-green-light)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.transform = 'none'; }}>
                  Book This Trek →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        @media (min-width: 1024px) {
          .trek-detail-grid { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) !important; align-items: start; }
          .trek-detail-grid > div:last-child { position: sticky; top: 82px; }
        }
        .trek-hero-img {
          transform: translateY(0);
          transition: transform 0.1s linear;
        }
        }
      `}</style>

      {lightbox && (
        <PhotoLightbox
          photos={lightbox.photos}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border-light)' }}>
    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{label}</span>
    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
  </div>
);

const SEASON_MAP = {
  'Uttarakhand':       { months: 'Apr – Jun  ·  Sep – Nov', note: 'Avoid monsoon (Jul–Aug) on high passes' },
  'Himachal Pradesh':  { months: 'May – Jun  ·  Sep – Oct', note: 'Winter treks possible Dec–Feb at lower altitudes' },
  'Jammu & Kashmir':   { months: 'Jun – Sep', note: 'Passes close with snowfall from October' },
  'Sikkim':            { months: 'Mar – May  ·  Oct – Dec', note: 'Rhododendrons bloom March–April' },
  'Lahaul and Spiti':  { months: 'Jun – Sep', note: 'Accessible only when Rohtang Pass is open' },
};

const BestSeasonCard = ({ state }) => {
  const info = state ? SEASON_MAP[state] : null;
  if (!info) return null;
  return (
    <div style={{ background: 'var(--accent-green-bg)', border: '1px solid var(--accent-green)', borderRadius: '16px', padding: '16px 18px' }}>
      <h4 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-green)', marginBottom: '10px' }}>Best Season</h4>
      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '5px' }}>{info.months}</p>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{info.note}</p>
    </div>
  );
};

const actionBtnStyle = (variant) => ({
  flex: 1, minWidth: '110px', padding: '10px', cursor: 'pointer',
  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px',
  letterSpacing: '0.08em', textTransform: 'uppercase',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
  borderRadius: '10px', transition: 'all 0.2s',
  ...(variant === 'ghost'
    ? { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }
    : { background: 'var(--accent-rose-bg)', color: 'var(--accent-rose)', border: '1px solid var(--accent-rose-bg)' })
});

export default TrekDetails;
