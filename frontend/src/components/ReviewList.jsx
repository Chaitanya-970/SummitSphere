import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { Star, Flag, Trash2, CheckCircle, Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

// ── LIGHTBOX MODAL ────────────────────────────────────────────────────────────
const PhotoLightbox = ({ photos, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrent(i => (i + 1) % photos.length);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };


  const handleKey = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  return (
    <div
      onClick={handleBackdropClick}
      onKeyDown={handleKey}
      tabIndex={0}
      autoFocus
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Close */}
      <button onClick={onClose} style={{
        position: 'absolute', top: '20px', right: '20px',
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
        color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', zIndex: 1,
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        <X size={18} />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button onClick={prev} style={{
          position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <div style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <img
          src={photos[current]}
          alt={`Review photo ${current + 1}`}
          style={{
            maxWidth: '100%', maxHeight: '72vh',
            borderRadius: '14px', objectFit: 'contain',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}
        />
        {/* Counter + thumbnails */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>
            {current + 1} / {photos.length}
          </span>
          {photos.length > 1 && photos.map((p, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0,
              background: i === current ? 'white' : 'rgba(255,255,255,0.3)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button onClick={next} style={{
          position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const ReviewList = ({ reviews, setReviews }) => {
  const { user } = useAuthContext();
  const [reportStatus, setReportStatus] = useState({});
  const [lightbox, setLightbox] = useState(null); // { photos, index }

  const handleReport = async (reviewId) => {
    if (!user) return alert('Login to report reviews.');
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${reviewId}/report`, {}, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.status === 200) setReportStatus(prev => ({ ...prev, [reviewId]: true }));
    } catch (err) { console.log('Report failed', err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.status === 200) setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Delete failed.'); }
  };

  if (!reviews || reviews.length === 0) return (
    <div style={{ padding: '32px', textAlign: 'center', border: '2px dashed var(--border-primary)', borderRadius: '14px' }}>
      <Star size={28} style={{ margin: '0 auto 10px', color: 'var(--border-primary)' }} />
      <p style={{ fontSize: '13px', color: 'var(--text-faint)', fontStyle: 'italic' }}>No reviews yet. Be the first!</p>
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reviews.map(review => {
          const isOwner   = user?._id === review.userId;
          const isAdmin   = user?.role === 'admin';
          const isFlagged = review.isReported || reportStatus[review._id];
          const initials  = review.userName?.substring(0, 2)?.toUpperCase() || '??';
          const hasPhotos = review.photos?.length > 0;

          return (
            <div key={review._id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-light)',
              borderRadius: '14px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)',
              transition: 'box-shadow 0.2s',
            }}>
              {/* TOP ROW */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'var(--accent-green-bg)', border: '1px solid var(--accent-green)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px',
                    color: 'var(--accent-green)', flexShrink: 0,
                  }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      {review.userName || 'Anonymous'}
                    </p>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11}
                          fill={i < review.rating ? 'var(--accent-amber)' : 'none'}
                          style={{ color: i < review.rating ? 'var(--accent-amber)' : 'var(--border-primary)' }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {/* PHOTO INDICATOR — camera icon badge if photos exist */}
                  {hasPhotos && (
                    <button
                      onClick={() => setLightbox({ photos: review.photos, index: 0 })}
                      title={`${review.photos.length} photo${review.photos.length > 1 ? 's' : ''} attached`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '5px 9px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: 'var(--accent-green-bg)', color: 'var(--accent-green)',
                        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '10px',
                        letterSpacing: '0.04em', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-green-bg)'; e.currentTarget.style.color = 'var(--accent-green)'; }}
                    >
                      <Image size={12} />
                      {review.photos.length}
                    </button>
                  )}

                  {/* REPORT */}
                  {!isOwner && user && (
                    <button onClick={() => handleReport(review._id)} disabled={isFlagged}
                      title={isFlagged ? 'Reported' : 'Report review'}
                      style={{ padding: '6px', borderRadius: '8px', background: isFlagged ? 'var(--accent-green-bg)' : 'transparent', border: 'none', cursor: isFlagged ? 'default' : 'pointer', color: isFlagged ? 'var(--accent-green)' : 'var(--text-faint)', display: 'flex', transition: 'all 0.2s' }}
                      onMouseEnter={e => { if (!isFlagged) { e.currentTarget.style.background = 'var(--accent-rose-bg)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}}
                      onMouseLeave={e => { if (!isFlagged) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-faint)'; }}}>
                      {isFlagged ? <CheckCircle size={14} /> : <Flag size={14} />}
                    </button>
                  )}

                  {/* DELETE */}
                  {(isOwner || (isAdmin && isFlagged)) && (
                    <button onClick={() => handleDelete(review._id)}
                      style={{ padding: '6px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-rose-bg)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-faint)'; }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* COMMENT */}
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic' }}>
                "{review.comment}"
              </p>

              {/* PHOTO THUMBNAILS — clickable, open lightbox at that index */}
              {hasPhotos && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {review.photos.map((photo, i) => (
                    <button key={i} onClick={() => setLightbox({ photos: review.photos, index: i })}
                      style={{ padding: 0, border: '2px solid var(--border-light)', borderRadius: '9px', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, transition: 'border-color 0.2s', background: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-green)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                    >
                      <img src={photo} alt={`photo ${i + 1}`}
                        style={{ width: '68px', height: '68px', objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* DATE */}
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', marginTop: '10px' }}>
                {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          );
        })}
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <PhotoLightbox
          photos={lightbox.photos}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
};

export default ReviewList;
