import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import PageLoader from '../components/PageLoader';
import { ShieldAlert, Trash2, Check, Ticket, Inbox, LayoutDashboard, Eye } from 'lucide-react';

const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 24px', background: 'var(--bg-card)', border: '2px dashed var(--border-primary)', borderRadius: '18px', textAlign: 'center' }}>
    <div style={{ width: '52px', height: '52px', background: 'var(--bg-secondary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
      <Icon size={24} style={{ color: 'var(--text-faint)' }} />
    </div>
    <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '5px' }}>{title}</h3>
    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{subtitle}</p>
  </div>
);

const AdminDashboard = () => {
  const { user, authReady } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [reportedReviews, setReportedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authReady) return;
    if (!user || user.role !== 'admin') { navigate('/', { replace: true }); return; }
    const fetch = async () => {
      setLoading(true);
      try {
        const cfg = { headers: { 'Authorization': `Bearer ${user.token}` } };
        const [bookRes, modRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/bookings`, cfg),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/reported`, cfg),
        ]);
        setBookings(bookRes.data);
        setReportedReviews(modRes.data);
      } catch (err) { console.error('Fetch failed:', err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [authReady, user, navigate]);

  const handleBookingClear = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/bookings/${id}/clear`, {}, { headers: { 'Authorization': `Bearer ${user.token}` } });
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch { alert('Could not clear booking.'); }
  };

  const handleReviewAction = async (id, action) => {
    const cfg = { headers: { 'Authorization': `Bearer ${user.token}` } };
    try {
      if (action === 'delete') await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${id}`, cfg);
      else await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${id}/resolve`, {}, cfg);
      setReportedReviews(prev => prev.filter(r => r._id !== id));
    } catch { alert('Moderation failed.'); }
  };

  useEffect(() => { document.title = 'Command Centre — SummitSphere'; }, []);

  if (loading) return <PageLoader />;

  const tabs = [
    { id: 'bookings',   label: 'Bookings', icon: <Ticket size={14} />,      count: bookings.length },
    { id: 'moderation', label: 'Reports',  icon: <ShieldAlert size={14} />, count: reportedReviews.length },
  ];

  const actionBtn = (label, onClick, variant = 'green') => {
    const c = variant === 'green'
      ? { bg: 'var(--accent-green-bg)', color: 'var(--accent-green)', hover: 'var(--accent-green)' }
      : { bg: 'var(--accent-rose-bg)',  color: 'var(--accent-rose)',  hover: 'var(--accent-rose)'  };
    return (
      <button onClick={onClick} style={{ padding: '7px 14px', background: c.bg, color: c.color, border: `1px solid ${c.color}22`, borderRadius: '9px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
        onMouseEnter={e => { e.currentTarget.style.background = c.hover; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={e => { e.currentTarget.style.background = c.bg; e.currentTarget.style.color = c.color; }}>
        {label}
      </button>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 24px 80px', transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--accent-green-bg)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={19} style={{ color: 'var(--accent-green)' }} />
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Command Centre
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', marginLeft: '52px' }}>
            Logged in as <span style={{ color: 'var(--accent-green)' }}>{user?.name}</span>
          </p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '13px', padding: '5px' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '9px',
              border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.2s',
              background: activeTab === tab.id ? 'var(--accent-green)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
            }}>
              {tab.icon} {tab.label}
              {tab.count > 0 && (
                <span style={{ background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-secondary)', color: activeTab === tab.id ? 'white' : 'var(--text-muted)', fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '20px' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* BOOKINGS  */}
        {activeTab === 'bookings' && (
          bookings.length === 0
            ? <EmptyState icon={Inbox} title="All Clear" subtitle="No active bookings to review." />
            : (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '580px' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
                        {['Trek', 'Explorer', 'Date', 'Group', ''].map(h => (
                          <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <tr key={b._id} style={{ borderBottom: i < bookings.length - 1 ? '1px solid var(--border-light)' : 'none', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '14px 18px' }}>
                            <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{b.trekId?.name || 'Deleted'}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>{b.trekId?.maxAltitude ? `${b.trekId.maxAltitude} ft · ${b.trekId.duration || '?'} days` : ''}</p>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{b.userId?.name || 'Unknown'}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>{b.userId?.email}</p>
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {b.trekDate ? new Date(b.trekDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {b.groupSize || 1}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <Link to={`/trek/${b.trekId?._id}`} title="View Trek"
                                style={{ padding: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '8px', display: 'flex', color: 'var(--text-muted)', transition: 'all 0.2s', textDecoration: 'none' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.color = 'var(--accent-green)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                <Eye size={14} />
                              </Link>
                              {actionBtn(<><Check size={12} /> Clear</>, () => handleBookingClear(b._id), 'green')}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
        )}

        {/* MODERATION */}
        {activeTab === 'moderation' && (
          reportedReviews.length === 0
            ? <EmptyState icon={ShieldAlert} title="All Clear" subtitle="No reported reviews to moderate." />
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {reportedReviews.map(review => (
                  <div key={review._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-rose)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-light)'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ display: 'inline-block', padding: '2px 10px', background: 'var(--accent-rose-bg)', color: 'var(--accent-rose)', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Reported</span>
                          {review.userName && <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>by {review.userName}</span>}
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>"{review.comment}"</p>
                        {review.trekId?.name && (
                          <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '6px' }}>On trek: <strong style={{ color: 'var(--text-muted)' }}>{review.trekId.name}</strong></p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        {actionBtn('Dismiss', () => handleReviewAction(review._id, 'resolve'), 'green')}
                        {actionBtn(<><Trash2 size={12} /> Delete</>, () => handleReviewAction(review._id, 'delete'), 'rose')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
