import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../API/axios';

const SystemSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/superadmin/settings');
        setSettings(res.data.settings);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true); setSuccess(''); setError('');
    try {
      await API.patch('/superadmin/settings', settings);
      setSuccess('Settings saved successfully! ✅');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: 'Default Total Tranches',    key: 'defaultTotalTranches',    type: 'number' },
    { label: 'Max Scholarship Amount (₹)', key: 'maxScholarshipAmount',   type: 'number' },
    { label: 'Min Scholarship Amount (₹)', key: 'minScholarshipAmount',   type: 'number' },
    { label: 'Application Deadline',       key: 'applicationDeadline',    type: 'date'   },
    { label: 'Document Retention (Days)',  key: 'documentRetentionDays',  type: 'number' },
  ];

  return (
    <AdminLayout title="System Settings">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '20px', marginBottom: '4px' }}>
          System Settings
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          Configure system-wide scholarship parameters
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading settings...</p>
      ) : (
        <div className="adm-card" style={{ maxWidth: '560px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {fields.map((f) => (
              <div key={f.key}>
                <label className="adm-label">{f.label}</label>
                <input
                  className="adm-input"
                  type={f.type}
                  value={
                    f.type === 'date'
                      ? (settings?.[f.key]?.toString().split('T')[0] || '')
                      : (settings?.[f.key] || '')
                  }
                  onChange={(e) =>
                    setSettings({ ...settings, [f.key]: e.target.value })
                  }
                />
              </div>
            ))}

            {error   && <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>}
            {success && <p style={{ color: '#10b981', fontSize: '13px' }}>{success}</p>}

            <button
              className="adm-btn adm-btn--primary"
              style={{ alignSelf: 'flex-start', padding: '10px 28px', fontSize: '14px' }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>

          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SystemSettingsPage;