import { Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Footer = () => (
  <footer style={{
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-light)',
    marginTop: '80px',
    padding: '52px 24px 36px',
    transition: 'background 0.3s ease',
  }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>

        <div style={{ flex: '1', minWidth: '220px', maxWidth: '300px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--accent-green)', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-accent)', display: 'flex' }}>
              <Mountain color="white" size={17} strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '21px', color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              Summit<span style={{ color: 'var(--accent-green)' }}>Sphere</span>
            </span>
          </Link>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
            India's trail guide for every peak, ridge, and ridgeline worth chasing.
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href="https://github.com/Chaitanya-970"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'var(--bg-card)', border: '1px solid var(--border-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', transition: 'all 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--text-primary)';
                e.currentTarget.style.color = 'var(--bg-primary)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <GithubIcon />
            </a>

            <a
              href="https://www.linkedin.com/in/chaitanya-bhardwaj-1a1a81372/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'var(--bg-card)', border: '1px solid var(--border-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', transition: 'all 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#0A66C2';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#0A66C2';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <LinkedinIcon />
            </a>
          </div>
        </div>

        {/* LINKS COLUMNS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
          {[
            {
              heading: 'Explore',
              links: [
                { label: 'All Treks', to: '/' },
                { label: 'Saved Treks', to: '/bookmarks' },
                { label: 'Add a Trek', to: '/create' },
              ]
            },
            {
              heading: 'Account',
              links: [
                { label: 'Sign In', to: '/login' },
                { label: 'Join Free', to: '/signup' },
                { label: 'My Profile', to: '/profile' },
              ]
            },
          ].map(col => (
            <div key={col.heading}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '16px' }}>
                {col.heading}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.links.map(l => (
                  <Link
                    key={l.to} to={l.to}
                    style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-green)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={{
        borderTop: '1px solid var(--border-light)',
        paddingTop: '24px',
        display: 'flex', flexWrap: 'wrap', gap: '12px',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
          Crafted with care by{' '}
          <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Chaitanya Bhardwaj</span>
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-faint)', letterSpacing: '0.08em' }}>
          © {new Date().getFullYear()} SummitSphere · All rights reserved
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
