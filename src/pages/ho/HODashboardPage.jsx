import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HOLayout from '../../components/layout/HOLayout';
import API from '../../API/axios';

const HODashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/ho/dashboard');
        setStats(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statCards = [
    { label: 'Total',      value: stats?.total      || 0, color: '#3b82f6' },
    { label: 'Submitted',  value: stats?.submitted  || 0, color: '#94a3b8' },
    { label: 'Assigned',   value: stats?.assigned   || 0, color: '#f59e0b' },
    { label: 'Inspected',  value: stats?.inspected  || 0, color: '#8b5cf6' },
    { label: 'Approved',   value: stats?.approved   || 0, color: '#10b981' },
    { label: 'Rejected',   value: stats?.rejected   || 0, color: '#ef4444' },
    { label: 'Disbursed',  value: stats?.disbursed  || 0, color: '#06b6d4' },
    { label: 'Flagged 🚩', value: stats?.flagged    || 0, color: '#ef4444' },
    { label: 'Unassigned', value: stats?.unassigned || 0, color: '#f59e0b' },
  ];

  return (
    <HOLayout title="Dashboard">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
          Applications Overview
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          Monitor and manage all scholarship applications
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading stats...</p>
      ) : (
        <div className="ho-stats-grid">
          {statCards.map((card) => (
            <div key={card.label} className="ho-stat-card">
              <div className="ho-stat-label">{card.label}</div>
              <div className="ho-stat-value" style={{ color: card.color }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="ho-card">
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', marginBottom: '16px' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="ho-btn ho-btn--primary"
            onClick={() => navigate('/headoffice/applications')}>
            View All Applications
          </button>
          <button className="ho-btn ho-btn--ghost"
            onClick={() => navigate('/headoffice/applications?status=SUBMITTED')}>
            Unassigned Applications
          </button>
        </div>
      </div>
    </HOLayout>
  );
};

export default HODashboardPage;