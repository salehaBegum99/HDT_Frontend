import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import API from '../../API/axios';

const SupervisorApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/supervisor/my-applications');
        setApplications(res.data.applications || []);
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <StaffLayout title="My Applications" role="SUPERVISOR">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
          Assigned Applications
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          {applications.length} application{applications.length !== 1 ? 's' : ''}
          {' · '}Click to manage disbursement
        </p>
      </div>

      <div className="sl-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="sl-table-wrap">
          <table className="sl-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Applicant</th>
                <th>Status</th>
                <th>Approved Amount</th>
                <th>Tranche</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                  Loading...
                </td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                  No applications assigned
                </td></tr>
              ) : applications.map((app) => (
                <tr key={app._id}
                  onClick={() => navigate(`/supervisor/applications/${app._id}`)}>
                  <td style={{ color: '#10b981', fontWeight: 600, fontSize: '12px' }}>
                    {app.applicationDisplayId || app.candidateId}
                  </td>
                  <td style={{ color: '#f1f5f9', fontWeight: 500 }}>
                    {app.applicantId?.name || '—'}
                  </td>
                  <td>
                    <span className={`sl-badge ${
                      app.status === 'DISBURSED' ? 'sl-badge--green' :
                      app.status === 'APPROVED'  ? 'sl-badge--blue'  : 'sl-badge--gray'
                    }`}>{app.status}</span>
                  </td>
                  <td style={{ color: app.approvedAmount ? '#10b981' : '#64748b', fontWeight: 600 }}>
                    {app.approvedAmount
                      ? `₹${app.approvedAmount.toLocaleString('en-IN')}`
                      : 'Not set'}
                  </td>
                  <td style={{ color: '#94a3b8' }}>
                    {app.currentTranche || 0}/{app.totalTranches || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StaffLayout>
  );
};

export default SupervisorApplicationsPage;