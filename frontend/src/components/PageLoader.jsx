const PageLoader = () => (
  <div style={{
    minHeight: '60vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '20px'
  }}>
    <div style={{ position: 'relative', width: '56px', height: '56px' }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '3px solid var(--border-primary)',
        borderTopColor: 'var(--accent-green)',
        animation: 'spin 0.9s linear infinite'
      }} />
    </div>
    <p style={{
      fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700,
      fontSize: '15px', color: 'var(--text-muted)', letterSpacing: '0.04em'
    }}>
      Loading expedition data...
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default PageLoader;
