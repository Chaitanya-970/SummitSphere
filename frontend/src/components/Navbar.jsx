import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { Mountain, Plus, LogOut, Bookmark, LayoutDashboard, Menu, X, Sun, Moon, User } from 'lucide-react';

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=summitsphere&backgroundColor=2d6a4f";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { isDark, toggle } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isAdmin = user?.role === 'admin';
  const displayName = user?.name || user?.email?.split('@')[0] || 'Explorer';
  const profileImg = user?.profilePicture || DEFAULT_AVATAR;
  const close = () => setMobileOpen(false);

  const menuLink = {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 16px', borderRadius: '12px',
    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
    textDecoration: 'none', color: 'var(--text-primary)',
    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px',
  };

  const menuBtn = {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 16px', borderRadius: '12px',
    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
    cursor: 'pointer', width: '100%', textAlign: 'left',
    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px',
    color: 'var(--text-primary)',
  };

  return (
    <>
      <header style={{
        background: 'var(--bg-nav)', borderBottom: '1px solid var(--border-light)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 1000,
        transition: 'background 0.3s ease', width: '100%',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>

          {/* LOGO */}
          <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, textDecoration: 'none' }}>
            <div style={{ background: 'var(--accent-green)', padding: '6px', borderRadius: '9px', display: 'flex', boxShadow: 'var(--shadow-accent)' }}>
              <Mountain color="white" size={16} strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '19px', letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>
              Summit<span style={{ color: 'var(--accent-green)' }}>Sphere</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {user ? (
                <>
                  {isAdmin && <Link to="/admin" title="Admin" style={iconBtnStyle()} onMouseEnter={e => applyHover(e, true)} onMouseLeave={e => applyHover(e, false)}><LayoutDashboard size={18} /></Link>}
                  <Link to="/bookmarks" title="Saved" style={iconBtnStyle()} onMouseEnter={e => applyHover(e, true)} onMouseLeave={e => applyHover(e, false)}><Bookmark size={18} /></Link>
                  <Link to="/create" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-green)', color: 'white', padding: '8px 16px', borderRadius: '10px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-green-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-green)'}>
                    <Plus size={15} strokeWidth={2.5} /> New Trek
                  </Link>
                  <button onClick={logout} title="Sign Out" style={{ ...iconBtnStyle(), border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-rose-bg)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                    <LogOut size={18} />
                  </button>
                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '5px 12px 5px 5px', borderRadius: '50px', border: '1px solid var(--border-primary)', marginLeft: '4px', transition: 'all 0.2s', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.background = 'var(--accent-green-bg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.background = 'transparent'; }}>
                    <img src={profileImg} alt="profile" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-primary)' }} onError={e => { e.currentTarget.src = DEFAULT_AVATAR; }} />
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-green)', lineHeight: 1 }}>{isAdmin ? 'Commander' : 'Explorer'}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 14px', textDecoration: 'none' }}>Sign In</Link>
                  <Link to="/signup" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: '10px', textDecoration: 'none' }}>Join Free</Link>
                </>
              )}
              <button onClick={toggle} style={{ ...iconBtnStyle(), border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', marginLeft: '4px' }}>
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </nav>
          )}

          {/* MOBILE HAMBURGER */}
          {isMobile && (
            <button onClick={() => setMobileOpen(o => !o)}
              style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </header>

      {/* ── MOBILE FULL-SCREEN OVERLAY ──
          Fixed to cover entire screen including behind the header.
          Has its own header row with logo + close button so it's always accessible. */}
      {mobileOpen && isMobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          background: 'var(--bg-primary)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Menu header — always visible, never scrolls away */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px', height: '60px', flexShrink: 0,
            borderBottom: '1px solid var(--border-light)',
            background: 'var(--bg-nav)',
          }}>
            <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div style={{ background: 'var(--accent-green)', padding: '6px', borderRadius: '9px', display: 'flex' }}>
                <Mountain color="white" size={16} strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '19px', letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>
                Summit<span style={{ color: 'var(--accent-green)' }}>Sphere</span>
              </span>
            </Link>
            <button onClick={close}
              style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
              <X size={20} />
            </button>
          </div>

          {/* Scrollable menu content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* USER CARD or SIGN IN/JOIN */}
            {user ? (
              <Link to="/profile" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '16px', background: 'var(--accent-green-bg)', border: '1px solid var(--accent-green)', textDecoration: 'none' }}>
                <img src={profileImg} alt="profile" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-green)', flexShrink: 0 }} onError={e => { e.currentTarget.src = DEFAULT_AVATAR; }} />
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-green)', marginBottom: '3px' }}>{isAdmin ? 'Commander' : 'Explorer'}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '18px', color: 'var(--text-primary)' }}>{displayName}</div>
                </div>
              </Link>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link to="/login" onClick={close} style={{ ...menuLink, justifyContent: 'center', border: '1px solid var(--border-primary)' }}>Sign In</Link>
                <Link to="/signup" onClick={close} style={{ ...menuLink, justifyContent: 'center', background: 'var(--accent-green)', color: 'white', border: 'none' }}>Join Free</Link>
              </div>
            )}

            <div style={{ height: '1px', background: 'var(--border-light)' }} />

            {/* NAV LINKS */}
            {user && (
              <>
                {[
                  { to: '/bookmarks', label: 'Saved Treks',     icon: <Bookmark size={18} /> },
                  { to: '/create',    label: 'Add New Trek',    icon: <Plus size={18} /> },
                  { to: '/profile',   label: 'My Profile',      icon: <User size={18} /> },
                  ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard', icon: <LayoutDashboard size={18} /> }] : []),
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={close} style={menuLink}>
                    <span style={{ color: 'var(--accent-green)', display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <div style={{ height: '1px', background: 'var(--border-light)' }} />
              </>
            )}

            {/* DARK MODE */}
            <button onClick={toggle} style={menuBtn}>
              <span style={{ color: isDark ? '#f59e0b' : '#7c3aed', display: 'flex', flexShrink: 0 }}>
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </span>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* SIGN OUT */}
            {user && (
              <button onClick={() => { logout(); close(); }} style={{ ...menuBtn, color: 'var(--accent-rose)', background: 'var(--accent-rose-bg)', border: '1px solid var(--accent-rose)33' }}>
                <LogOut size={18} style={{ flexShrink: 0 }} />
                Sign Out
              </button>
            )}

          </div>
        </div>
      )}
    </>
  );
};

const iconBtnStyle = () => ({
  padding: '8px', borderRadius: '10px', color: 'var(--text-muted)',
  background: 'transparent', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.2s', textDecoration: 'none',
});

const applyHover = (e, on) => {
  e.currentTarget.style.background = on ? 'var(--accent-green-bg)' : 'transparent';
  e.currentTarget.style.color = on ? 'var(--accent-green)' : 'var(--text-muted)';
};

export default Navbar;
