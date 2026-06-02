import { useEffect, useState } from 'react';
import api from '../api';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [filters, setFilters] = useState({ difficulty: '', platform: '' });
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.platform) params.platform = filters.platform;
      const { data } = await api.get('/problems', { params });
      setProblems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProblems(); }, [filters]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/problems/${id}`);
      setProblems(p => p.filter(prob => prob._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const diffClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };

  return (
    <div className="page">
      <h2>Problem History 📚</h2>

      {/* filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <select value={filters.difficulty} style={{ width: 'auto', marginBottom: 0 }}
          onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
          <option value="">All Difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select value={filters.platform} style={{ width: 'auto', marginBottom: 0 }}
          onChange={e => setFilters({ ...filters, platform: e.target.value })}>
          <option value="">All Platforms</option>
          <option>LeetCode</option>
          <option>Codeforces</option>
          <option>HackerRank</option>
          <option>Other</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : problems.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No problems logged yet. Start solving! 💪</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {problems.map(p => (
            <div key={p._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600' }}>{p.title}</span>
                  <span className={`badge ${diffClass[p.difficulty]}`}>{p.difficulty}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{p.platform}</span>
                </div>

                {p.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '11px', background: '#334155', padding: '2px 8px', borderRadius: '10px', color: '#94a3b8' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {p.notes && <p style={{ fontSize: '13px', color: '#94a3b8' }}>{p.notes}</p>}

                <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                  {p.timeSpent > 0 && `${p.timeSpent} min · `}
                  {new Date(p.solvedAt).toLocaleDateString()}
                </p>
              </div>

              <button className="btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
