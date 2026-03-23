import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useDarkMode } from './context/DarkModeContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TrekDetails from './pages/TrekDetails';
import EditTrek from './pages/EditTrek';
import AdminDashboard from './pages/AdminDashboard';
import CreateTrek from './pages/CreateTrek';
import Booking from './pages/Booking';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Navbar from './components/Navbar';

function App() {
  const { user, authReady } = useAuthContext();
  const { isDark } = useDarkMode();

  if (!authReady) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 900, color: 'var(--accent-green)', letterSpacing: '-0.03em' }}>SummitSphere</div>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Loading Basecamp...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trek/:id" element={<TrekDetails />} />
        <Route path="/create" element={user ? <CreateTrek /> : <Navigate to="/login" />} />
        <Route path="/bookmarks" element={user ? <Bookmarks /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/edit-trek/:id" element={user ? <EditTrek /> : <Navigate to="/login"/>} />
        <Route path="/book/:id" element={user ? <Booking /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/treks/:id" element={<TrekDetails />} />
      </Routes>
    </div>
  );
}

export default App;
