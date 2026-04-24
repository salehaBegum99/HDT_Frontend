import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../API/axios';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/superadmin/stats');
        setStats(res.data);
      } catch (err) {
        console.log('Stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
  { label: 'Total Users',        value: stats?.users?.total       || 0, color: '#3b82f6' },
  { label: 'Total Applicants',   value: stats?.users?.applicants  || 0, color: '#10b981' },
  { label: 'Inspectors',         value: stats?.users?.inspectors  || 0, color: '#f59e0b' },
  { label: 'Supervisors',        value: stats?.users?.supervisors || 0, color: '#8b5cf6' },
  { label: 'HO Staff',           value: stats?.users?.ho          || 0, color: '#06b6d4' },
  { label: 'Total Applications', value: stats?.applications?.total    || 0, color: '#ef4444' },
  { label: 'Approved',           value: stats?.applications?.approved || 0, color: '#10b981' },
  { label: 'Rejected',           value: stats?.applications?.rejected || 0, color: '#ef4444' },
];

  return (
    <AdminLayout title="Dashboard">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
          System Overview
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          Real-time stats across all users and applications
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading stats...</p>
      ) : (
        <div className="adm-stats-grid">
          {statCards.map((card) => (
            <div key={card.label} className="adm-stat-card">
              <div className="adm-stat-label">{card.label}</div>
              <div className="adm-stat-value" style={{ color: card.color }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="adm-card">
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', marginBottom: '16px' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/admin/users"        className="adm-btn adm-btn--primary">+ Create User</a>
          <a href="/admin/applications" className="adm-btn adm-btn--ghost">View Applications</a>
          <a href="/admin/settings"     className="adm-btn adm-btn--ghost">System Settings</a>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;