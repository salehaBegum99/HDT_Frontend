import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import API from '../../API/axios';

const InspectorDashboardPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/inspector/my-applications');
        setApplications(res.data.applications || []);
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const total    = applications.length;
  const pending  = applications.filter(a => a.status === 'ASSIGNED').length;
  const visited  = applications.filter(a => a.status === 'INSPECTED').length;

  return (
    <StaffLayout title="Dashboard" role="INSPECTOR">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
          Inspector Dashboard
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          Manage your assigned applications
        </p>
      </div>

      {/* Stats */}
      <div className="sl-stats-grid">
        {[
          { label: 'Total Assigned', value: total,   color: '#f59e0b' },
          { label: 'Pending Visit',  value: pending, color: '#3b82f6' },
          { label: 'Visited',        value: visited, color: '#10b981' },
        ].map((s) => (
          <div key={s.label} className="sl-stat-card">
            <div className="sl-stat-label">{s.label}</div>
            <div className="sl-stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="sl-card">
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', marginBottom: '16px' }}>
          Recent Assignments
        </h3>
        {loading ? (
          <p style={{ color: '#64748b' }}>Loading...</p>
        ) : applications.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '24px' }}>
            No applications assigned yet
          </p>
        ) : (
          <div className="sl-table-wrap">
            <table className="sl-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id}
                    onClick={() => navigate(`/inspector/applications/${app.id}`)}>
                    <td style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 600 }}>
                      {app.applicationDisplayId || app.candidateId}
                    </td>
                    <td style={{ color: '#f1f5f9', fontWeight: 500 }}>
                      {app.applicantId?.name || '—'}
                    </td>
                    <td>
                      <span className={`sl-badge ${app.status === 'INSPECTED' ? 'sl-badge--green' : 'sl-badge--yellow'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <button className="sl-btn sl-btn--yellow sl-btn--sm"
                        onClick={(e) => { e.stopPropagation(); navigate(`/inspector/applications/${app._id}`); }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {applications.length > 5 && (
          <button className="sl-btn sl-btn--ghost"
            style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}
            onClick={() => navigate('/inspector/applications')}>
            View All Applications
          </button>
        )}
      </div>
    </StaffLayout>
  );
};

export default InspectorDashboardPage;