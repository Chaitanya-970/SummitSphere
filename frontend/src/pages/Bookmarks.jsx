import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import TrekCard, { TrekCardSkeleton } from '../components/TrekCard';
import { Bookmark as BookmarkIcon, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';

const TREK_IMAGES = [
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?w=800&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
  "https://images.unsplash.com/photo-1465311440653-ba3b0d2d31fac?w=800&q=80",
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
];

const getTrekImage = (trekName, originalImage) => {
  if (!originalImage || originalImage.includes("1522199710521")) {
    let hash = 0;
    for (let i = 0; i < trekName.length; i++) { hash = trekName.charCodeAt(i) + ((hash << 5) - hash); }
    return TREK_IMAGES[Math.abs(hash) % TREK_IMAGES.length];
  }
  return originalImage;
};

const Bookmarks = () => {
  const { user } = useAuthContext();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookmarks', { headers: { Authorization: `Bearer ${user.token}` } });
        setSaved(res.data);
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    };
    if (user) fetchSaved();
  }, [user]);

  useEffect(() => { document.title = 'Saved Treks — SummitSphere'; }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 24px 80px', transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <div style={{ width: '52px', height: '52px', background: 'var(--accent-green-bg)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookmarkIcon size={24} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 40px)', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Saved Treks
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
              {saved.length} {saved.length === 1 ? 'trek' : 'treks'} on your radar
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {[...Array(3)].map((_, i) => <TrekCardSkeleton key={i} />)}
          </div>
        ) : saved.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {saved.map((b, i) => b.trekId && (
              <div key={b._id} className="fade-up" style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'both' }}>
                <TrekCard trek={{ ...b.trekId, imageUrl: getTrekImage(b.trekId.name || '', b.trekId.imageUrl) }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '80px 32px', textAlign: 'center', background: 'var(--bg-card)', border: '2px dashed var(--border-primary)', borderRadius: '24px' }}>
            <Mountain size={48} style={{ margin: '0 auto 16px', color: 'var(--border-primary)' }} />
            <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '22px', color: 'var(--text-muted)', marginBottom: '10px' }}>No saved treks yet</p>
            <p style={{ fontSize: '13px', color: 'var(--text-faint)', marginBottom: '24px' }}>Bookmark treks to find them here later</p>
            <Link to="/" style={{ display: 'inline-block', padding: '11px 28px', background: 'var(--accent-green)', color: 'white', borderRadius: '12px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
              Explore Treks
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
