import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../API/axios';

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetch = async () => {
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
      SUBMITTED:  'adm-badge--blue',
      ASSIGNED:   'adm-badge--yellow',
      INSPECTED:  'adm-badge--yellow',
      APPROVED:   'adm-badge--green',
      REJECTED:   'adm-badge--red',
      DISBURSED:  'adm-badge--green',
    };
    return `adm-badge ${map[status] || 'adm-badge--gray'}`;
  };

  const STATUSES = ['', 'SUBMITTED', 'ASSIGNED', 'INSPECTED', 'APPROVED', 'REJECTED', 'DISBURSED'];

  return (
    <AdminLayout title="All Applications">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', margin: '0 0 4px' }}>Applications</h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          {applications.length} total applications
        </p>
      </div>

      {/* Status Filter */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {STATUSES.map((s) => (
          <button key={s}
            className={`adm-btn adm-btn--ghost adm-btn--sm ${filterStatus === s ? 'adm-btn--primary' : ''}`}
            onClick={() => setFilterStatus(s)}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="adm-card" style={{ padding: 0 }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Candidate ID</th>
                <th>Applicant</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Inspector</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b' }}>No applications found</td></tr>
              ) : applications.map((app) => (
                <tr key={app._id}>
                  <td style={{ color: '#ef4444', fontWeight: 500, fontSize: '12px' }}>
                    {app.applicationDisplayId || '—'}
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '12px' }}>{app.candidateId}</td>
                  <td style={{ color: '#f1f5f9' }}>{app.applicantId?.name || '—'}</td>
                  <td><span className={statusBadge(app.status)}>{app.status}</span></td>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ color: '#94a3b8' }}>
                    {app.assignedInspector?.name || <span style={{ color: '#64748b' }}>Unassigned</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicationsPage;