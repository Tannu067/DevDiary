import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const COMMON_TAGS = ['arrays', 'strings', 'dp', 'graphs', 'trees', 'binary search', 'recursion', 'hashing', 'two pointers', 'stack'];

export default function LogProblem() {
  const [form, setForm] = useState({
    title: '', platform: 'LeetCode', difficulty: 'Medium',
    tags: [], notes: '', timeSpent: '', solved: true,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleSubmit = async () => {
    if (!form.title) return setError('Problem title is required');
    try {
      await api.post('/problems', { ...form, timeSpent: Number(form.timeSpent) || 0 });
      navigate('/problems');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log problem');
    }
  };

  return (
    <div className="page" style={{ maxWidth: '600px' }}>
      <h2>Log a Problem 📝</h2>
      {error && <p className="error">{error}</p>}

      <input placeholder="Problem title (e.g. Two Sum)" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
          <option>LeetCode</option>
          <option>Codeforces</option>
          <option>HackerRank</option>
          <option>Other</option>
        </select>
        <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <input placeholder="Time spent (minutes)" type="number" value={form.timeSpent}
        onChange={e => setForm({ ...form, timeSpent: e.target.value })} />

      {/* tag picker */}
      <p style={{ marginBottom: '10px', fontSize: '14px', color: '#94a3b8' }}>Tags (select all that apply)</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        {COMMON_TAGS.map(tag => (
          <span key={tag} onClick={() => toggleTag(tag)} style={{
            padding: '5px 12px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
            background: form.tags.includes(tag) ? '#6366f1' : '#334155',
            color: form.tags.includes(tag) ? 'white' : '#94a3b8',
          }}>
            {tag}
          </span>
        ))}
      </div>

      <textarea placeholder="Notes (approach, what was tricky, what you learned...)"
        rows={4} value={form.notes}
        onChange={e => setForm({ ...form, notes: e.target.value })}
        style={{ marginBottom: '14px' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <input type="checkbox" checked={form.solved} id="solved"
          onChange={e => setForm({ ...form, solved: e.target.checked })}
          style={{ width: 'auto', margin: 0 }} />
        <label htmlFor="solved" style={{ fontSize: '14px', color: '#94a3b8' }}>Marked as solved</label>
      </div>

      <button className="btn-primary" onClick={handleSubmit}>Save Problem</button>
    </div>
  );
}
