import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1e293b',
      borderBottom: '1px solid #334155',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ fontSize: '20px', fontWeight: '700', color: '#a5b4fc' }}>
        📓 DevDiary
      </Link>

      {user && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#94a3b8', fontSize: '14px' }}>Dashboard</Link>
          <Link to="/log" style={{ color: '#94a3b8', fontSize: '14px' }}>Log Problem</Link>
          <Link to="/problems" style={{ color: '#94a3b8', fontSize: '14px' }}>History</Link>
          <Link to="/github" style={{ color: '#94a3b8', fontSize: '14px' }}>GitHub</Link>
          <button onClick={handleLogout} className="btn-danger btn-sm">Logout</button>
        </div>
      )}
    </nav>
  );
}
