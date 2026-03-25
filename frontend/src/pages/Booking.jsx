import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BookingForm from '../components/BookingForm';
import { Mountain } from 'lucide-react';

const Booking = () => {
  const { id } = useParams();
  const [trekName, setTrekName] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/treks/${id}`)
      .then(res => setTrekName(res.data?.name || ''))
      .catch(() => {});
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '48px 24px 80px', transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent-green-bg)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mountain size={20} style={{ color: 'var(--accent-green)' }} />
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {trekName ? `Book — ${trekName}` : 'Book Expedition'}
          </h1>
        </div>
        <BookingForm trekId={id} trekName={trekName} />
      </div>
    </div>
  );
};

export default Booking;
