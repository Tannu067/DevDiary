import { useEffect, useState } from 'react';
import api from '../api';

export default function GitHub() {
  const [profile, setProfile] = useState(null);
  const [commits, setCommits] = useState([]);
  const [repoName, setRepoName] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGitHub = async () => {
    try {
      const [p, c] = await Promise.all([
        api.get('/github/profile'),
        api.get('/github/commits'),
      ]);
      setProfile(p.data);
      setCommits(c.data.commits || []);
      setRepoName(c.data.repoName || '');
    } catch (err) {
      // no github username saved yet — that's fine
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGitHub(); }, []);

  const saveUsername = async () => {
    if (!username) return;
    setSaving(true);
    try {
      await api.put('/auth/github', { githubUsername: username });
      await fetchGitHub();
      setError('');
    } catch (err) {
      setError('Could not fetch GitHub data. Check the username.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h2>GitHub Activity 🐙</h2>

      {/* username input */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#94a3b8' }}>
          Connect your GitHub to see recent commits here
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input placeholder="Your GitHub username" value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ marginBottom: 0 }} />
          <button className="btn-primary" onClick={saveUsername} disabled={saving}>
            {saving ? 'Loading...' : 'Connect'}
          </button>
        </div>
        {error && <p className="error" style={{ marginTop: '8px' }}>{error}</p>}
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : profile ? (
        <>
          {/* profile card */}
          <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
            <img src={profile.avatar_url} alt="avatar"
              style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
            <div>
              <a href={profile.html_url} target="_blank" rel="noreferrer"
                style={{ fontWeight: '700', color: '#a5b4fc', fontSize: '18px' }}>
                @{profile.username}
              </a>
              {profile.bio && <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{profile.bio}</p>}
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '13px', color: '#64748b' }}>
                <span>📁 {profile.public_repos} repos</span>
                <span>👥 {profile.followers} followers</span>
              </div>
            </div>
          </div>

          {/* recent commits */}
          {commits.length > 0 && (
            <div className="card">
              <p style={{ marginBottom: '14px', fontWeight: '600' }}>
                Recent commits — <span style={{ color: '#a5b4fc' }}>{repoName}</span>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {commits.map(c => (
                  <div key={c.sha} style={{ borderLeft: '3px solid #6366f1', paddingLeft: '12px' }}>
                    <a href={c.url} target="_blank" rel="noreferrer"
                      style={{ fontSize: '14px', color: '#e2e8f0' }}>
                      {c.message.split('\n')[0]}
                    </a>
                    <p style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>
                      {c.sha} · {new Date(c.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: '#94a3b8' }}>Add your GitHub username above to see your activity here.</p>
      )}
    </div>
  );
}
