import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../API/axios';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '', email: '', mobile: '', password: '', role: 'INSPECTOR',
    assignedArea: '', sponsorOrg: ''
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

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
          <button className="adm-btn adm-btn--primary"
            onClick={() => {
              setShowCreateModal(true);
              setCreateError('');
              setCreateSuccess('');
            }}>
            + Create User
          </button>
          <a href="/admin/applications" className="adm-btn adm-btn--ghost">View Applications</a>
          <a href="/admin/settings"     className="adm-btn adm-btn--ghost">System Settings</a>
        </div>
      </div>

      {showCreateModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal" style={{ width: '100%', maxWidth: '520px' }}>
            <div className="adm-modal-head">
              <h3 className="adm-modal-title">Create Staff User</h3>
              <button className="adm-modal-close"
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({
                    name: '', email: '', mobile: '', password: '', role: 'INSPECTOR',
                    assignedArea: '', sponsorOrg: ''
                  });
                }}>×
              </button>
            </div>

            <form onSubmit={async (e) => {
                e.preventDefault();
                setCreateError('');
                setCreateSuccess('');
                setCreateLoading(true);
                try {
                  await API.post('/superadmin/users', createForm);
                  setCreateSuccess('User created!');
                  setCreateForm({
                    name: '', email: '', mobile: '', password: '', role: 'INSPECTOR',
                    assignedArea: '', sponsorOrg: ''
                  });
                  setShowCreateModal(false);
                } catch (err) {
                  setCreateError(err?.response?.data?.message || 'Failed to create user.');
                } finally {
                  setCreateLoading(false);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {[
                { label: 'Full Name', name: 'name',   type: 'text', placeholder: 'e.g. Rahul Sharma' },
                { label: 'Email',     name: 'email',  type: 'email', placeholder: 'staff@hdt.com' },
                { label: 'Mobile',    name: 'mobile', type: 'tel', placeholder: '10 digit number' },
                { label: 'Password',  name: 'password', type: 'password', placeholder: 'Enter a secure password' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="adm-label">{field.label}</label>
                  <input className="adm-input" type={field.type}
                    placeholder={field.placeholder}
                    value={createForm[field.name]}
                    onChange={(e) => setCreateForm({ ...createForm, [field.name]: e.target.value })}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="adm-label">Role</label>
                <select className="adm-input"
                  value={createForm.role}
                  onChange={(e) => setCreateForm({
                    ...createForm,
                    role: e.target.value,
                    assignedArea: '',
                    sponsorOrg: ''
                  })}>
                  <option value="INSPECTOR">Inspector</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="HO">Head Office</option>
                </select>
              </div>

              {createForm.role === 'INSPECTOR' && (
                <div>
                  <label className="adm-label">Assigned Area</label>
                  <input
                    className="adm-input"
                    type="text"
                    placeholder="e.g. Mehdipatnam, Hyderabad"
                    value={createForm.assignedArea}
                    onChange={(e) => setCreateForm({ ...createForm, assignedArea: e.target.value })}
                  />
                </div>
              )}

              {createForm.role === 'SUPERVISOR' && (
                <div>
                  <label className="adm-label">Sponsor / Organisation</label>
                  <input
                    className="adm-input"
                    type="text"
                    placeholder="e.g. HDT Foundation, Zakat Foundation"
                    value={createForm.sponsorOrg}
                    onChange={(e) => setCreateForm({ ...createForm, sponsorOrg: e.target.value })}
                  />
                </div>
              )}

              {createError && (
                <p style={{ color: '#ef4444', fontSize: '13px' }}>{createError}</p>
              )}
              {createSuccess && (
                <p style={{ color: '#10b981', fontSize: '13px' }}>{createSuccess}</p>
              )}

              <button type="submit" className="adm-btn adm-btn--primary"
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboardPage;