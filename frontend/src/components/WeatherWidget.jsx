import { useState, useEffect } from 'react';
import { Wind, Droplets, Thermometer } from 'lucide-react';

const WeatherWidget = ({ lat, lon }) => {
  const [forecast, setForecast] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/weather?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        // Backend now returns first-entry-per-day, already sliced to 5.
        // We just consume it directly.
        setForecast(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [lat, lon]);

  if (loading) return (
    <div className="shimmer" style={{ height: '250px', borderRadius: '14px' }} />
  );
  if (!forecast.length) return null;

  const current = forecast[selectedIndex];

  // Always show real weekday — never "Today/Yesterday"
  const weekday = (entry) =>
    new Date(entry.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* ── 5-DAY STRIP ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
        {forecast.map((day, i) => {
          const sel = selectedIndex === i;
          return (
            <button key={i} onClick={() => setSelectedIndex(i)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '9px 3px', borderRadius: '11px', cursor: 'pointer',
              transition: 'all 0.2s', gap: '2px',
              border: `2px solid ${sel ? 'var(--accent-green)' : 'var(--border-light)'}`,
              background: sel ? 'var(--accent-green-bg)' : 'var(--bg-card)',
            }}>
              <span style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em',
                color: sel ? 'var(--accent-green)' : 'var(--text-faint)',
              }}>
                {weekday(day)}
              </span>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                style={{ width: '28px', height: '28px' }} alt=""
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {Math.round(day.main.temp)}°
              </span>
            </button>
          );
        })}
      </div>

      {/* ── DETAIL CARD ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1a14 0%, #1a3a2a 100%)',
        borderRadius: '14px', padding: '18px 20px', color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-24px', right: '-24px', width: '90px', height: '90px', background: 'rgba(82,183,136,0.12)', borderRadius: '50%', filter: 'blur(20px)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', position: 'relative' }}>
          <div>
            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(82,183,136,0.85)', marginBottom: '5px' }}>
              {new Date(current.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: '50px', lineHeight: 1, letterSpacing: '-0.05em' }}>
                {Math.round(current.main.temp)}
              </span>
              <span style={{ fontSize: '19px', fontWeight: 700, marginTop: '7px', color: 'rgba(82,183,136,0.6)' }}>°C</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', textTransform: 'capitalize', marginTop: '2px' }}>
              {current.weather[0].description}
            </p>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
            style={{ width: '62px', height: '62px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))', flexShrink: 0 }} alt=""
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { icon: <Droplets size={13} />, label: 'Humidity', value: `${current.main.humidity}%` },
            { icon: <Wind size={13} />,     label: 'Wind',     value: `${Math.round(current.wind.speed * 3.6)} km/h` },
            { icon: <Thermometer size={13} />, label: 'H / L', value: `${Math.round(current.main.temp_max)}° / ${Math.round(current.main.temp_min)}°` },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <span style={{ color: 'rgba(82,183,136,0.75)' }}>{s.icon}</span>
              <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>{s.label}</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
