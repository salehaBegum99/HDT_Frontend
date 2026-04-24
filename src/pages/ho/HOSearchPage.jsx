import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HOLayout from '../../components/layout/HOLayout';
import API from '../../API/axios';

const HOSearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await API.get(`/ho/search?query=${encodeURIComponent(query.trim())}`);
      setResults(res.data.applications || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Search failed.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      SUBMITTED: 'ho-badge--blue',
      ASSIGNED:  'ho-badge--yellow',
      INSPECTED: 'ho-badge--yellow',
      APPROVED:  'ho-badge--green',
      REJECTED:  'ho-badge--red',
      DISBURSED: 'ho-badge--green',
    };
    return `ho-badge ${map[status] || 'ho-badge--gray'}`;
  };

  return (
    <HOLayout title="Search">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
          Search Applications
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          Search by applicant name, candidate ID, or school name
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <div style={{
          display: 'flex', gap: '10px',
          marginBottom: '24px', flexWrap: 'wrap'
        }}>
          <input
            className="ho-input"
            style={{ flex: 1, minWidth: '200px', fontSize: '15px', padding: '12px 16px' }}
            type="text"
            placeholder="Search by name, candidate ID, school..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="ho-btn ho-btn--primary"
            style={{ padding: '12px 24px', fontSize: '14px' }}
            disabled={loading || !query.trim()}
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
          {searched && (
            <button
              type="button"
              className="ho-btn ho-btn--ghost"
              onClick={() => { setQuery(''); setResults([]); setSearched(false); setError(''); }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
      )}

      {/* Results */}
      {searched && !loading && (
        <>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px' }}>
            {results.length === 0
              ? `No results found for "${query}"`
              : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </p>

          {results.length > 0 && (
            <div className="ho-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="ho-table-wrap">
                <table className="ho-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Applicant</th>
                      <th>Candidate ID</th>
                      <th>Status</th>
                      <th>Inspector</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((app) => (
                      <tr
                        key={app._id}
                        onClick={() => navigate(`/headoffice/applications/${app._id}`)}
                      >
                        <td style={{ color: '#3b82f6', fontWeight: 600, fontSize: '12px' }}>
                          {app.applicationDisplayId || '—'}
                        </td>
                        <td style={{ color: '#f1f5f9', fontWeight: 500 }}>
                          {app.applicantId?.name || '—'}
                        </td>
                        <td style={{ color: '#94a3b8', fontSize: '12px' }}>
                          {app.candidateId}
                        </td>
                        <td>
                          <span className={statusBadge(app.status)}>{app.status}</span>
                        </td>
                        <td style={{ color: app.assignedInspector ? '#f1f5f9' : '#64748b' }}>
                          {app.assignedInspector?.name || 'Unassigned'}
                        </td>
                        <td style={{ color: '#64748b', fontSize: '12px' }}>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state before search */}
      {!searched && (
        <div className="ho-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
          <p style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
            Search for Applications
          </p>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            Enter an applicant name, candidate ID like{' '}
            <span style={{ color: '#3b82f6' }}>SCH20260001</span>, or school name to find applications.
          </p>
        </div>
      )}
    </HOLayout>
  );
};

export default HOSearchPage;