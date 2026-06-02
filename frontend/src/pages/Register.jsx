import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
      <div className="card" style={{ width: '360px' }}>
        <h2 style={{ marginBottom: '20px', color: '#a5b4fc' }}>Create account 🚀</h2>
        {error && <p className="error">{error}</p>}
        <input placeholder="Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
          Register
        </button>
        <p style={{ marginTop: '14px', fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#a5b4fc' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
