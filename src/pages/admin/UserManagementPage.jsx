import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../API/axios';

const UserManagementPage = () => {
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterRole, setFilterRole]     = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [createForm, setCreateForm]     = useState({
    name: '', email: '', mobile: '', role: 'INSPECTOR',
    assignedArea: '', sponsorOrg: ''
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError]     = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/superadmin/users${filterRole ? `?role=${filterRole}` : ''}`
      );
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [filterRole]);

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await API.patch(`/superadmin/users/${userId}/deactivate`);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || 'Error');
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await API.patch(`/superadmin/users/${userId}/reactivate`);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || 'Error');
    }
  };

  const handleResetPassword = async (userId) => {
    if (!window.confirm('Reset password for this user?')) return;
    try {
      await API.patch(`/superadmin/users/${userId}/reset-password`);
      alert('Password reset! New credentials sent via email.');
    } catch (err) {
      alert(err?.response?.data?.message || 'Error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');
    setCreateLoading(true);
    try {
      await API.post('/admin/create-user', createForm);
      setCreateSuccess('User created! Credentials sent via email ✅');
      setCreateForm({
        name: '', email: '', mobile: '', role: 'INSPECTOR',
        assignedArea: '', sponsorOrg: ''
      });
      fetchUsers();
    } catch (err) {
      setCreateError(err?.response?.data?.message || 'Failed to create user.');
    } finally {
      setCreateLoading(false);
    }
  };

  const roleBadgeClass = (role) => {
    const map = {
      INSPECTOR:  'adm-badge--yellow',
      SUPERVISOR: 'adm-badge--green',
      HO:         'adm-badge--blue',
      SUPERADMIN: 'adm-badge--red',
      APPLICANT:  'adm-badge--gray',
    };
    return `adm-badge ${map[role] || 'adm-badge--gray'}`;
  };

  const FILTERS = ['', 'INSPECTOR', 'SUPERVISOR', 'HO', 'APPLICANT'];

  return (
    <AdminLayout title="User Management">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
            Staff Users
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            {users.length} user{users.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button className="adm-btn adm-btn--primary"
          onClick={() => {
            setShowModal(true);
            setCreateError('');
            setCreateSuccess('');
          }}>
          + Create User
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {FILTERS.map((r) => (
          <button key={r} onClick={() => setFilterRole(r)}
            style={{
              padding: '6px 14px', borderRadius: '20px', border: '1px solid',
              borderColor: filterRole === r ? '#ef4444' : '#1e2535',
              background: filterRole === r ? 'rgba(239,68,68,0.12)' : 'transparent',
              color: filterRole === r ? '#ef4444' : '#94a3b8',
              fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
            {r || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Area / Sponsor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center',
                    color: '#64748b', padding: '32px' }}>
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center',
                    color: '#64748b', padding: '32px' }}>
                    No users found
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u._id}>
                  <td style={{ color: '#f1f5f9', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: '#94a3b8' }}>{u.email}</td>
                  <td style={{ color: '#94a3b8' }}>{u.mobile}</td>
                  <td><span className={roleBadgeClass(u.role)}>{u.role}</span></td>
                  <td>
                    {u.role === 'INSPECTOR' && u.assignedArea && (
                      <span style={{
                        background: 'rgba(245,158,11,0.12)',
                        color: '#f59e0b',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}>
                        📍 {u.assignedArea}
                      </span>
                    )}
                    {u.role === 'SUPERVISOR' && u.sponsorOrg && (
                      <span style={{
                        background: 'rgba(16,185,129,0.12)',
                        color: '#10b981',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}>
                        🏢 {u.sponsorOrg}
                      </span>
                    )}
                    {!u.assignedArea && !u.sponsorOrg && (
                      <span style={{ color: '#475569', fontSize: '12px' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`adm-badge ${u.isActive
                      ? 'adm-badge--green' : 'adm-badge--red'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {u.role !== 'SUPERADMIN' && (
                        <>
                          {u.isActive ? (
                            <button className="adm-btn adm-btn--ghost adm-btn--sm"
                              onClick={() => handleDeactivate(u._id)}>
                              Deactivate
                            </button>
                          ) : (
                            <button className="adm-btn adm-btn--sm"
                              style={{ background: 'rgba(16,185,129,0.12)',
                                color: '#10b981',
                                border: '1px solid rgba(16,185,129,0.3)' }}
                              onClick={() => handleReactivate(u._id)}>
                              Reactivate
                            </button>
                          )}
                          <button className="adm-btn adm-btn--ghost adm-btn--sm"
                            onClick={() => handleResetPassword(u._id)}>
                            Reset Pwd
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <div className="adm-modal-head">
              <h3 className="adm-modal-title">Create Staff User</h3>
              <button className="adm-modal-close"
                onClick={() => {
                  setShowModal(false);
                  setCreateForm({
                    name: '', email: '', mobile: '', role: 'INSPECTOR',
                    assignedArea: '', sponsorOrg: ''
                  });
                }}>×
              </button>
            </div>

            <form onSubmit={handleCreate}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Name, Email, Mobile */}
              {[
                { label: 'Full Name', name: 'name',   type: 'text',
                  placeholder: 'e.g. Rahul Sharma' },
                { label: 'Email',     name: 'email',  type: 'email',
                  placeholder: 'staff@hdt.com' },
                { label: 'Mobile',    name: 'mobile', type: 'tel',
                  placeholder: '10 digit number' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="adm-label">{f.label}</label>
                  <input className="adm-input" type={f.type}
                    placeholder={f.placeholder}
                    value={createForm[f.name]}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, [f.name]: e.target.value })}
                    required
                  />
                </div>
              ))}

              {/* Role */}
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

              {/* Inspector → Area text field */}
              {createForm.role === 'INSPECTOR' && (
                <div>
                  <label className="adm-label">
                    Assigned Area
                    <span style={{ color: '#64748b', fontWeight: 400,
                      marginLeft: '4px', fontSize: '11px' }}>(optional)</span>
                  </label>
                  <input
                    className="adm-input"
                    type="text"
                    placeholder="e.g. Mehdipatnam, Hyderabad"
                    value={createForm.assignedArea}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, assignedArea: e.target.value })}
                  />
                </div>
              )}

              {/* Supervisor → Sponsor/Org text field */}
              {createForm.role === 'SUPERVISOR' && (
                <div>
                  <label className="adm-label">
                    Sponsor / Organisation
                    <span style={{ color: '#64748b', fontWeight: 400,
                      marginLeft: '4px', fontSize: '11px' }}>(optional)</span>
                  </label>
                  <input
                    className="adm-input"
                    type="text"
                    placeholder="e.g. HDT Foundation, Zakat Foundation"
                    value={createForm.sponsorOrg}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, sponsorOrg: e.target.value })}
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
                {createLoading ? 'Creating...' : 'Create User & Send Credentials'}
              </button>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default UserManagementPage;