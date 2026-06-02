import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
      <div className="card" style={{ width: '360px' }}>
        <h2 style={{ marginBottom: '20px', color: '#a5b4fc' }}>Welcome back 👋</h2>
        {error && <p className="error">{error}</p>}
        <input placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
          Login
        </button>
        <p style={{ marginTop: '14px', fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
          No account? <Link to="/register" style={{ color: '#a5b4fc' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
