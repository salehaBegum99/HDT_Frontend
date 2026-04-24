import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import API from '../../API/axios';

const Field = ({ label, value }) => (
  <div style={{ marginBottom: '12px' }}>
    <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
      {label}
    </p>
    <p style={{ color: '#f1f5f9', fontSize: '14px' }}>{value || '—'}</p>
  </div>
);

const Section = ({ title, color, children }) => (
  <div className="sl-card" style={{ marginBottom: '16px' }}>
    <p className="sl-section-title" style={{ color: color || '#f59e0b' }}>{title}</p>
    {children}
  </div>
);

const InspectorApplicationDetailPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [app, setApp]                   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [showVisitModal, setShowVisitModal]   = useState(false);
  const [showDocModal, setShowDocModal]       = useState(false);
  const [actionLoading, setActionLoading]     = useState(false);
  const [actionError, setActionError]         = useState('');
  const [actionSuccess, setActionSuccess]     = useState('');

  // Visit report form
  const [visitForm, setVisitForm] = useState({
    visitDate: '',
    comments: '',
    isVerified: true,
  });

  // Document request form
  const [docForm, setDocForm] = useState({
    requiredDocuments: '',
    deadline: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/applications/${applicationId}`);
        setApp(res.data.application);
      } catch (err) { console.log(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [applicationId]);

  const handleSubmitVisitReport = async () => {
    if (!visitForm.visitDate || !visitForm.comments) {
      setActionError('Please fill visit date and comments.');
      return;
    }
    setActionLoading(true); setActionError(''); setActionSuccess('');
    try {
      await API.post(`/inspector/${applicationId}/visit-report`, visitForm);
      setActionSuccess('Visit report submitted successfully! ✅');
      setShowVisitModal(false);
      // Refresh app
      const res = await API.get(`/applications/${applicationId}`);
      setApp(res.data.application);
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to submit report.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestDocuments = async () => {
    if (!docForm.requiredDocuments || !docForm.deadline) {
      setActionError('Please fill required documents and deadline.');
      return;
    }
    setActionLoading(true); setActionError(''); setActionSuccess('');
    try {
      await API.post(`/inspector/${applicationId}/request-documents`, {
        requiredDocuments: docForm.requiredDocuments.split(',').map(d => d.trim()),
        deadline: docForm.deadline,
      });
      setActionSuccess('Document request sent! ✅');
      setShowDocModal(false);
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to request documents.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <StaffLayout title="Application Detail" role="INSPECTOR">
      <p style={{ color: '#64748b' }}>Loading...</p>
    </StaffLayout>
  );

  if (!app) return (
    <StaffLayout title="Application Detail" role="INSPECTOR">
      <p style={{ color: '#ef4444' }}>Application not found.</p>
    </StaffLayout>
  );

  return (
    <StaffLayout title="Application Detail" role="INSPECTOR">

      {/* Back + Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className="sl-btn sl-btn--ghost sl-btn--sm"
          onClick={() => navigate('/inspector/applications')}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '18px', marginBottom: '4px' }}>
            {app.applicationDisplayId || app.candidateId}
          </h2>
          <span className={`sl-badge ${app.status === 'INSPECTED' ? 'sl-badge--green' : 'sl-badge--yellow'}`}>
            {app.status}
          </span>
        </div>
      </div>

      {/* Success / Error */}
      {actionSuccess && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#10b981', fontSize: '13px' }}>
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#ef4444', fontSize: '13px' }}>
          {actionError}
        </div>
      )}

      {/* Actions */}
      <div className="sl-card" style={{ marginBottom: '16px' }}>
        <p style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>
          Actions
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="sl-btn sl-btn--yellow"
            onClick={() => { setShowVisitModal(true); setActionError(''); }}>
            📋 Submit Visit Report
          </button>
          <button className="sl-btn sl-btn--ghost"
            onClick={() => { setShowDocModal(true); setActionError(''); }}>
            📄 Request Documents
          </button>
        </div>
      </div>

      {/* Personal */}
      <Section title="Personal Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Field label="First Name"   value={app.personal?.firstName} />
          <Field label="Last Name"    value={app.personal?.lastName} />
          <Field label="Address"      value={app.personal?.address} />
          <Field label="City/Village" value={app.personal?.cityVillage} />
          <Field label="Pincode"      value={app.personal?.pincode} />
          <Field label="Aadhaar"      value={app.personal?.aadhaarNumber} />
        </div>
      </Section>

      {/* Family */}
      <Section title="Family Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Field label="Father Name"       value={app.family?.fatherName} />
          <Field label="Father Profession" value={app.family?.fatherProfession} />
          <Field label="Mother Name"       value={app.family?.motherName} />
          <Field label="Mother Profession" value={app.family?.motherProfession} />
          <Field label="Guardian Status"   value={app.family?.guardianStatus} />
          <Field label="Earning Members"   value={app.family?.numberOfEarningMembers} />
        </div>
      </Section>

      {/* Academic */}
      <Section title="Academic Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Field label="Level"       value={app.academic?.educationalLevel} />
          <Field label="Year"        value={app.academic?.academicYear} />
          <Field label="Grade"       value={app.academic?.currentGrade} />
          <Field label="Percentage"  value={app.academic?.currentGradePercentage + '%'} />
        </div>
      </Section>

      {/* Documents */}
      {app.documents && Object.values(app.documents).some(v => v) && (
        <Section title="Uploaded Documents">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.entries(app.documents).map(([key, url]) =>
              url ? (
                <a key={key} href={url} target="_blank" rel="noreferrer"
                  className="sl-btn sl-btn--ghost sl-btn--sm">
                  📄 {key}
                </a>
              ) : null
            )}
          </div>
        </Section>
      )}

      {/* Document Request Info */}
      {app.documentRequest?.requiredDocuments?.length > 0 && (
        <Section title="Document Requests Sent">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {app.documentRequest.requiredDocuments.map((doc, i) => (
              <span key={i} className="sl-badge sl-badge--yellow">{doc}</span>
            ))}
          </div>
          {app.documentRequest.deadline && (
            <p style={{ color: '#64748b', fontSize: '12px', marginTop: '10px' }}>
              Deadline: {new Date(app.documentRequest.deadline).toLocaleDateString('en-IN')}
            </p>
          )}
        </Section>
      )}

      {/* ── VISIT REPORT MODAL ── */}
      {showVisitModal && (
        <div className="sl-modal-overlay">
          <div className="sl-modal">
            <div className="sl-modal-head">
              <h3 className="sl-modal-title">Submit Visit Report</h3>
              <button className="sl-modal-close" onClick={() => setShowVisitModal(false)}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="sl-label">Visit Date *</label>
                <input className="sl-input" type="date"
                  value={visitForm.visitDate}
                  onChange={(e) => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                />
              </div>
              <div>
                <label className="sl-label">Comments / Observations *</label>
                <textarea className="sl-input" rows={4}
                  placeholder="Describe your visit observations..."
                  value={visitForm.comments}
                  onChange={(e) => setVisitForm({ ...visitForm, comments: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div>
                <label className="sl-label">Verification Status</label>
                <select className="sl-input"
                  value={visitForm.isVerified}
                  onChange={(e) => setVisitForm({ ...visitForm, isVerified: e.target.value === 'true' })}>
                  <option value="true">Verified ✅</option>
                  <option value="false">Not Verified ❌</option>
                </select>
              </div>
              {actionError && <p style={{ color: '#ef4444', fontSize: '13px' }}>{actionError}</p>}
              <button className="sl-btn sl-btn--yellow"
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                onClick={handleSubmitVisitReport} disabled={actionLoading}>
                {actionLoading ? 'Submitting...' : 'Submit Visit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REQUEST DOCUMENTS MODAL ── */}
      {showDocModal && (
        <div className="sl-modal-overlay">
          <div className="sl-modal">
            <div className="sl-modal-head">
              <h3 className="sl-modal-title">Request Documents</h3>
              <button className="sl-modal-close" onClick={() => setShowDocModal(false)}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="sl-label">Required Documents * (comma separated)</label>
                <input className="sl-input" type="text"
                  placeholder="e.g. marksheet, income proof, aadhaar"
                  value={docForm.requiredDocuments}
                  onChange={(e) => setDocForm({ ...docForm, requiredDocuments: e.target.value })}
                />
              </div>
              <div>
                <label className="sl-label">Deadline *</label>
                <input className="sl-input" type="date"
                  value={docForm.deadline}
                  onChange={(e) => setDocForm({ ...docForm, deadline: e.target.value })}
                />
              </div>
              {actionError && <p style={{ color: '#ef4444', fontSize: '13px' }}>{actionError}</p>}
              <button className="sl-btn sl-btn--yellow"
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                onClick={handleRequestDocuments} disabled={actionLoading}>
                {actionLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

    </StaffLayout>
  );
};

export default InspectorApplicationDetailPage;