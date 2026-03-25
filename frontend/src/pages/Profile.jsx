import { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { Pencil, Camera, X, Mountain, Bookmark, Ticket, ChevronRight, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=summitsphere&backgroundColor=2d6a4f";

const Profile = () => {
  const { user, dispatch } = useAuthContext();
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || DEFAULT_AVATAR);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState(null);
  const [listData, setListData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [counts, setCounts] = useState({ booked: 0, authored: 0, radar: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${user.token}` };
        const [authRes, bookRes, radarRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/treks?user_id=${user._id}`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/my-bookings`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookmarks`, { headers }),
        ]);
        const [authData, bookData, radarData] = await Promise.all([
          authRes.ok ? authRes.json() : [],
          bookRes.ok ? bookRes.json() : [],
          radarRes.ok ? radarRes.json() : [],
        ]);
        setCounts({
          authored: Array.isArray(authData)  ? authData.length  : 0,
          booked:   Array.isArray(bookData)  ? bookData.length  : 0,
          radar:    Array.isArray(radarData) ? radarData.length : 0,
        });
      } catch (err) { console.log('Stats sync failed', err); }
    };
    if (user) fetchCounts();
  }, [user]);

  useEffect(() => {
    if (!activeTab) return;
    const fetchData = async () => {
      setIsDataLoading(true); setListData([]);
      try {
        // FIX: use /api/bookmarks (not /api/user/bookmarks which doesn't exist)
        let endpoint = activeTab === 'authored' ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/treks?user_id=${user._id}` :
                       activeTab === 'booked'   ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/my-bookings` :
                                                  `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookmarks`;
        const response = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const json = await response.json();
        if (response.ok) {
          setListData(json);
          setCounts(prev => ({ ...prev, [activeTab]: json.length }));
        }
      } catch (err) { console.log("Fetch failed", err); }
      finally { setIsDataLoading(false); }
    };
    fetchData();
  }, [activeTab, user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(null); setSuccess(null);
    const formData = new FormData();
    formData.append('name', name);
    if (selectedFile) formData.append('image', selectedFile);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/update-avatar`, {
        method: 'PUT',
        body: formData,
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({
          type: 'UPDATE_USER',
          payload: {
            name: json.name,
            profilePicture: json.profilePicture,
            email: json.email,
          }
        });
        setPreviewUrl(json.profilePicture || DEFAULT_AVATAR);
        setIsEditing(false);
        setSuccess("Profile updated!");
        setSelectedFile(null);
      } else {
        setError(json.error);
      }
    } catch (err) { setError("Update failed.", err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { document.title = 'My Profile — SummitSphere'; }, []);

  if (!user) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

  const stats = [
    { id: 'booked',   label: 'Booked',  icon: <Ticket size={22} />,   val: counts.booked },
    { id: 'authored', label: 'Created', icon: <Mountain size={22} />, val: counts.authored },
    { id: 'radar',    label: 'Saved',   icon: <Bookmark size={22} />, val: counts.radar },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 24px 80px', transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 38px)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            My Profile
          </h1>
          <button onClick={() => { setIsEditing(!isEditing); setError(null); setSuccess(null); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: isEditing ? 'var(--accent-rose-bg)' : 'var(--bg-card)', border: `1px solid ${isEditing ? 'var(--accent-rose)' : 'var(--border-primary)'}`, borderRadius: '10px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', color: isEditing ? 'var(--accent-rose)' : 'var(--text-secondary)', transition: 'all 0.2s' }}>
            {isEditing ? <><X size={14} /> Cancel</> : <><Pencil size={14} /> Edit Profile</>}
          </button>
        </div>

        {/* PROFILE CARD */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '28px', marginBottom: '20px', boxShadow: 'var(--shadow-sm)', transition: 'background 0.3s ease' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', alignItems: 'center' }}>
            {/* AVATAR */}
            <div style={{ position: 'relative', flexShrink: 0, cursor: isEditing ? 'pointer' : 'default' }}
              onClick={() => isEditing && fileInputRef.current.click()}>
              <img src={previewUrl || DEFAULT_AVATAR} alt="Avatar"
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border-primary)', boxShadow: 'var(--shadow-md)' }}
                onError={e => { e.target.src = DEFAULT_AVATAR; }} />
              {isEditing && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera color="white" size={20} />
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
            </div>

            {/* INFO */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <span style={{ display: 'inline-block', padding: '3px 12px', background: 'var(--accent-green-bg)', color: 'var(--accent-green)', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
                {user?.role === 'admin' ? 'Commander' : 'Explorer'}
              </span>
              {isEditing ? (
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  style={{ display: 'block', width: '100%', fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '26px', color: 'var(--text-primary)', background: 'transparent', border: 'none', borderBottom: '2px solid var(--accent-green)', outline: 'none', marginBottom: '6px' }} />
              ) : (
                <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '26px', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>{user?.name}</h2>
              )}
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{user?.email}</p>
              {error   && <p style={{ fontSize: '12px', color: 'var(--accent-rose)',  marginTop: '8px', fontWeight: 600 }}>{error}</p>}
              {success && <p style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '8px', fontWeight: 600 }}>{success}</p>}
              {isEditing && (
                <button disabled={isLoading} style={{ marginTop: '14px', padding: '9px 22px', background: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '10px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {stats.map(stat => (
            <button key={stat.id} onClick={() => setActiveTab(activeTab === stat.id ? null : stat.id)}
              style={{ padding: '24px 16px', borderRadius: '16px', border: `2px solid ${activeTab === stat.id ? 'var(--accent-green)' : 'var(--border-light)'}`, background: activeTab === stat.id ? 'var(--accent-green-bg)' : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
              <div style={{ color: activeTab === stat.id ? 'var(--accent-green)' : 'var(--text-faint)', display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: '28px', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>{stat.val}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{stat.label}</div>
            </button>
          ))}
        </div>

        {/* REGISTRY LIST */}
        {activeTab && (
          <div className="fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '20px', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{activeTab} Treks</h3>
              <button onClick={() => setActiveTab(null)} style={{ padding: '6px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={16} /></button>
            </div>
            {isDataLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-faint)', fontSize: '13px' }}>Loading...</div>
            ) : listData.length > 0 ? (
              <div style={{ display: 'grid', gap: '10px' }}>
                {listData.map(item => {

                  const isNested = activeTab === 'booked' || activeTab === 'radar';
                  const trek = isNested ? item.trekId : item;
                  const trekId = trek?._id;
                  const trekName = trek?.name || 'Unknown Trek';
                  const trekState = trek?.state || '';
                  const trekImage = trek?.imageUrl || DEFAULT_AVATAR;
                  if (!trekId) return null;
                  return (
                    <Link key={item._id} to={`/trek/${trekId}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-light)', transition: 'all 0.2s', background: 'var(--bg-primary)', textDecoration: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.background = 'var(--accent-green-bg)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}>
                      <img src={trekImage}
                        style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} alt="" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trekName}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {isNested && activeTab === 'booked' && item.trekDate
                            ? new Date(item.trekDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : trekState || 'India'}
                        </p>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyTabState tab={activeTab} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

//  PER-TAB EMPTY STATES
const EmptyTabState = ({ tab }) => {
  const config = {
    authored: {
      icon: <Mountain size={36} style={{ color: 'var(--accent-green)', margin: '0 auto 14px' }} />,
      title: "No treks added yet",
      body: "Share a trail you know with the community. Every great trek starts with someone like you.",
      cta: { label: "Add Your First Trek", to: "/create" },
    },
    booked: {
      icon: <Ticket size={36} style={{ color: 'var(--accent-amber)', margin: '0 auto 14px' }} />,
      title: "No bookings yet",
      body: "You haven't booked any expeditions. Browse treks and secure your next adventure.",
      cta: { label: "Explore Treks", to: "/" },
    },
    radar: {
      icon: <Bookmark size={36} style={{ color: '#7c3aed', margin: '0 auto 14px' }} />,
      title: "Your radar is empty",
      body: "Bookmark treks that catch your eye so you can find them here later.",
      cta: { label: "Browse Treks", to: "/" },
    },
  };
  const c = config[tab] || config.authored;
  return (
    <div style={{ padding: '44px 32px', textAlign: 'center', border: '2px dashed var(--border-primary)', borderRadius: '16px', background: 'var(--bg-card)' }}>
      {c.icon}
      <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>{c.title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', maxWidth: '320px', margin: '0 auto 20px' }}>{c.body}</p>
      <Link to={c.cta.to} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 22px', background: 'var(--accent-green)', color: 'white', borderRadius: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s', boxShadow: 'var(--shadow-accent)' }}>
        <Plus size={14} /> {c.cta.label}
      </Link>
    </div>
  );
};

export default Profile;
