import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, w] = await Promise.all([
          api.get('/problems/summary'),
          api.get('/problems/weekly'),
        ]);
        setSummary(s.data);
        setWeekly(w.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page" style={{ color: '#94a3b8' }}>Loading...</div>;

  // last 7 days for x-axis
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const weeklyData = {
    labels: last7Days.map(d => d.slice(5)),
    datasets: [{
      label: 'Problems Solved',
      data: last7Days.map(d => weekly[d] || 0),
      backgroundColor: '#6366f1',
      borderRadius: 6,
    }],
  };

  const diffData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      data: [summary?.easy || 0, summary?.medium || 0, summary?.hard || 0],
      backgroundColor: ['#86efac', '#fcd34d', '#fca5a5'],
      borderWidth: 0,
    }],
  };

  const topTags = Object.entries(summary?.tags || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="page">
      <h2>Hey {user?.name?.split(' ')[0]} 👋</h2>

      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Solved', value: summary?.total || 0, color: '#a5b4fc' },
          { label: 'Easy', value: summary?.easy || 0, color: '#86efac' },
          { label: 'Medium', value: summary?.medium || 0, color: '#fcd34d' },
          { label: 'Hard', value: summary?.hard || 0, color: '#fca5a5' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: '700', color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* weekly bar chart */}
        <div className="card">
          <p style={{ marginBottom: '14px', fontWeight: '600' }}>This week</p>
          <Bar data={weeklyData} options={{
            plugins: { legend: { display: false } },
            scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' }, beginAtZero: true } },
          }} />
        </div>

        {/* difficulty donut */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ marginBottom: '14px', fontWeight: '600' }}>By Difficulty</p>
          <Doughnut data={diffData} options={{ plugins: { legend: { labels: { color: '#e2e8f0' } } } }} />
        </div>
      </div>

      {/* top tags */}
      {topTags.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <p style={{ marginBottom: '14px', fontWeight: '600' }}>Top Tags</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {topTags.map(([tag, count]) => (
              <span key={tag} style={{
                background: '#334155', padding: '6px 14px', borderRadius: '20px',
                fontSize: '13px', color: '#a5b4fc'
              }}>
                {tag} <span style={{ color: '#94a3b8' }}>({count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <Link to="/log">
        <button className="btn-primary">+ Log a Problem</button>
      </Link>
    </div>
  );
}
