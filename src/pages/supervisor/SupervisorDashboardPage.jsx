import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import API from '../../API/axios';

const SupervisorDashboardPage = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/supervisor/dashboard');
        setDashboard(res.data);
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const stats = [
    { label: 'Total Assigned',  value: dashboard?.totalAssigned  || 0, color: '#10b981' },
    { label: 'Pending Disburse',value: dashboard?.pendingDisburse|| 0, color: '#f59e0b' },
    { label: 'Disbursed',       value: dashboard?.disbursed      || 0, color: '#3b82f6' },
    { label: 'Flagged',         value: dashboard?.flagged        || 0, color: '#ef4444' },
  ];

  return (
    <StaffLayout title="Dashboard" role="SUPERVISOR">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
          Supervisor Dashboard
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          Manage disbursements for assigned applications
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading...</p>
      ) : (
        <div className="sl-stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="sl-stat-card">
              <div className="sl-stat-label">{s.label}</div>
              <div className="sl-stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="sl-card">
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', marginBottom: '16px' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="sl-btn sl-btn--green"
            onClick={() => navigate('/supervisor/applications')}>
            View Applications
          </button>
        </div>
      </div>
    </StaffLayout>
  );
};

export default SupervisorDashboardPage;