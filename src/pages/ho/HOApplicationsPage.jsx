import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HOLayout from '../../components/layout/HOLayout';
import API from '../../API/axios';

const STATUSES = ['', 'SUBMITTED', 'ASSIGNED', 'INSPECTED', 'APPROVED', 'REJECTED', 'DISBURSED'];

const HOApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/applications/all${filterStatus ? `?status=${filterStatus}` : ''}`);
        setApplications(res.data.applications);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filterStatus]);

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
    <HOLayout title="Applications">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
          All Applications
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          {applications.length} application{applications.length !== 1 ? 's' : ''} found
          {' · '}Click any row to manage
        </p>
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '6px 14px', borderRadius: '20px',
              border: '1px solid',
              borderColor: filterStatus === s ? '#3b82f6' : '#1e2535',
              background: filterStatus === s ? 'rgba(59,130,246,0.12)' : 'transparent',
              color: filterStatus === s ? '#3b82f6' : '#94a3b8',
              fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
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
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                  Loading...
                </td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                  No applications found
                </td></tr>
              ) : applications.map((app) => (
                <tr key={app.id} onClick={() => navigate(`/headoffice/applications/${app.id}`)}>
                  <td style={{ color: '#3b82f6', fontWeight: 600, fontSize: '12px' }}>
                    {app.applicationDisplayId || '—'}
                  </td>
                  <td style={{ color: '#f1f5f9', fontWeight: 500 }}>
                    {app.applicantId?.name || '—'}
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '12px' }}>{app.candidateId}</td>
                  <td><span className={statusBadge(app.status)}>{app.status}</span></td>
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
    </HOLayout>
  );
};

export default HOApplicationsPage;