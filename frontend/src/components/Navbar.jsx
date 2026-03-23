import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { Mountain, Plus, LogOut, Bookmark, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react';

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=summitsphere&backgroundColor=2d6a4f";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const displayName = user?.name || user?.email?.split('@')[0] || 'Explorer';
  const profileImg = user?.profilePicture || DEFAULT_AVATAR;

  return (
    <>
      <header style={{
        background: 'var(--bg-nav)',
        borderBottom: '1px solid var(--border-light)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 1000,
        transition: 'background 0.3s ease',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '66px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>

          {/* LOGO */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, textDecoration: 'none' }}>
            <div style={{ background: 'var(--accent-green)', padding: '7px', borderRadius: '10px', display: 'flex', boxShadow: 'var(--shadow-accent)' }}>
              <Mountain color="white" size={17} strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '21px', letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>
              Summit<span style={{ color: 'var(--accent-green)' }}>Sphere</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="hidden md:flex">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" title="Admin Dashboard" style={iconBtnStyle()}
                    onMouseEnter={e => applyHover(e, true)} onMouseLeave={e => applyHover(e, false)}>
                    <LayoutDashboard size={18} />
                  </Link>
                )}
                <Link to="/bookmarks" title="Saved Treks" style={iconBtnStyle()}
                  onMouseEnter={e => applyHover(e, true)} onMouseLeave={e => applyHover(e, false)}>
                  <Bookmark size={18} />
                </Link>
                <Link to="/create" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-green)', color: 'white', padding: '8px 16px', borderRadius: '10px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s', boxShadow: 'var(--shadow-accent)', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-green-light)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.transform = 'none'; }}>
                  <Plus size={15} strokeWidth={2.5} /> New Trek
                </Link>
                <button onClick={logout} title="Sign Out" style={{ ...iconBtnStyle(), border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-rose-bg)'; e.currentTarget.style.color = 'var(--accent-rose)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                  <LogOut size={18} />
                </button>

                {/* USER PILL */}
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '5px 12px 5px 5px', borderRadius: '50px', border: '1px solid var(--border-primary)', marginLeft: '4px', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.background = 'var(--accent-green-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.background = 'transparent'; }}>
                  <img src={profileImg} alt="profile" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-primary)', flexShrink: 0 }}
                    onError={e => { e.currentTarget.src = DEFAULT_AVATAR; }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-green)', lineHeight: 1 }}>{isAdmin ? 'Commander' : 'Explorer'}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 14px', transition: 'color 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  Sign In
                </Link>
                <Link to="/signup" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: '10px', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-green)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-primary)'; }}>
                  Join Free
                </Link>
              </>
            )}

            {/* DARK MODE TOGGLE — inline responsive hide on mobile */}
            <button onClick={toggle} title={isDark ? 'Light Mode' : 'Dark Mode'}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', color: 'var(--text-muted)', transition: 'all 0.2s', marginLeft: '4px', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.color = 'var(--accent-green)'; e.currentTarget.style.background = 'var(--accent-green-bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}>
              {isDark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
              {isDark ? 'Light' : 'Dark'}
            </button>
          </nav>

          {/* MOBILE: dark toggle + hamburger — only visible below md breakpoint */}
          <div className="flex md:hidden" style={{ alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggle}
              style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{ position: 'fixed', top: '66px', left: 0, right: 0, bottom: 0, background: 'var(--bg-nav)', backdropFilter: 'blur(20px)', zIndex: 999, padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-light)', overflowY: 'auto' }}>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', background: 'var(--bg-secondary)', marginBottom: '4px', textDecoration: 'none' }}>
                <img src={profileImg} alt="profile" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-green)' }}
                  onError={e => { e.currentTarget.src = DEFAULT_AVATAR; }} />
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-green)' }}>{isAdmin ? 'Commander' : 'Explorer'}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '17px', color: 'var(--text-primary)' }}>{displayName}</div>
                </div>
              </Link>
              {[
                { to: '/bookmarks', label: 'Saved Treks', icon: <Bookmark size={17}/> },
                { to: '/create', label: 'Add New Trek', icon: <Plus size={17}/> },
                ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard', icon: <LayoutDashboard size={17}/> }] : []),
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', background: 'var(--bg-card)', border: '1px solid var(--border-light)', textDecoration: 'none' }}>
                  <span style={{ color: 'var(--accent-green)' }}>{item.icon}</span>{item.label}
                </Link>
              ))}
              <button onClick={() => { logout(); setMobileOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--accent-rose)', background: 'var(--accent-rose-bg)', border: 'none', cursor: 'pointer', marginTop: '4px', width: '100%', textAlign: 'left' }}>
                <LogOut size={17} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '15px', textAlign: 'center', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', textDecoration: 'none' }}>Sign In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '15px', textAlign: 'center', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: 'white', background: 'var(--accent-green)', textDecoration: 'none', boxShadow: 'var(--shadow-accent)' }}>Join Free</Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

const iconBtnStyle = () => ({
  padding: '8px', borderRadius: '10px', color: 'var(--text-muted)',
  background: 'transparent', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
  textDecoration: 'none',
});
const applyHover = (e, on) => {
  e.currentTarget.style.background = on ? 'var(--accent-green-bg)' : 'transparent';
  e.currentTarget.style.color = on ? 'var(--accent-green)' : 'var(--text-muted)';
};

export default Navbar;
