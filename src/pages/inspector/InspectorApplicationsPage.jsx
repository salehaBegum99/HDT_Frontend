import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import API from '../../API/axios';

const InspectorApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingOnly, setPendingOnly] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/inspector/my-applications${pendingOnly ? '?pendingOnly=true' : ''}`
        );
        setApplications(res.data.applications || []);
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [pendingOnly]);

  return (
    <StaffLayout title="My Applications" role="INSPECTOR">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
            Assigned Applications
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'All',     value: false },
            { label: 'Pending', value: true  },
          ].map((f) => (
            <button key={f.label}
              onClick={() => setPendingOnly(f.value)}
              style={{
                padding: '6px 14px', borderRadius: '20px',
                border: '1px solid',
                borderColor: pendingOnly === f.value ? '#f59e0b' : '#1e2535',
                background: pendingOnly === f.value ? 'rgba(245,158,11,0.12)' : 'transparent',
                color: pendingOnly === f.value ? '#f59e0b' : '#94a3b8',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sl-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="sl-table-wrap">
          <table className="sl-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Applicant</th>
                <th>Location</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                  Loading...
                </td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                  No applications found
                </td></tr>
              ) : applications.map((app) => (
                <tr key={app.id}
                  onClick={() => navigate(`/inspector/applications/${app.id}`)}>
                  <td style={{ color: '#f59e0b', fontWeight: 600, fontSize: '12px' }}>
                    {app.applicationDisplayId || app.candidateId}
                  </td>
                  <td style={{ color: '#f1f5f9', fontWeight: 500 }}>
                    {app.applicantId?.name || '—'}
                  </td>
                  <td style={{ color: '#94a3b8' }}>
                    {app.personal?.cityVillage || '—'}
                  </td>
                  <td>
                    <span className={`sl-badge ${app.status === 'INSPECTED' ? 'sl-badge--green' : 'sl-badge--yellow'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>
                    {new Date(app.createdAt).toLocaleDateString('en-IN')}
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

export default InspectorApplicationsPage;