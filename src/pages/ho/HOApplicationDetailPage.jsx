import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HOLayout from '../../components/layout/HOLayout';
import API from '../../API/axios';

const Section = ({ title, children }) => (
  <div className="ho-card" style={{ marginBottom: '16px' }}>
    <h3 style={{ color: '#3b82f6', fontSize: '13px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, value }) => (
  <div style={{ marginBottom: '12px' }}>
    <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
      {label}
    </p>
    <p style={{ color: '#f1f5f9', fontSize: '14px' }}>{value || '—'}</p>
  </div>
);

const HOApplicationDetailPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inspectors, setInspectors] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  // Modal states
  const [showInspectorModal, setShowInspectorModal]   = useState(false);
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [showRejectModal, setShowRejectModal]         = useState(false);

  const [selectedInspector,  setSelectedInspector]  = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [rejectionReason,    setRejectionReason]    = useState('');
  const [hoNotes,            setHoNotes]            = useState('');
  const [actionLoading,      setActionLoading]      = useState(false);
  const [actionError,        setActionError]        = useState('');
  const [actionSuccess,      setActionSuccess]      = useState('');

  const fetchApp = async () => {
    try {
      const res = await API.get(`/applications/${applicationId}`);
      setApp(res.data.application);
      setHoNotes(res.data.application.hoNotes || '');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInspectors = async () => {
    try {
      const res = await API.get('/ho/inspectors/list');
      setInspectors(res.data.inspectors);
    } catch (err) { console.log(err); }
  };

  const fetchSupervisors = async () => {
    try {
      const res = await API.get('/ho/supervisors/list');
      setSupervisors(res.data.supervisors);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchApp();
    fetchInspectors();
    fetchSupervisors();
  }, [applicationId]);

  const handleAssignInspector = async () => {
    if (!selectedInspector) return;
    setActionLoading(true); setActionError(''); setActionSuccess('');
    try {
      await API.patch(`/applications/${applicationId}/assign-inspector`, {
        inspectorId: selectedInspector
      });
      setActionSuccess('Inspector assigned successfully! ✅');
      setShowInspectorModal(false);
      fetchApp();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to assign inspector.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignSupervisor = async () => {
    if (!selectedSupervisor) return;
    setActionLoading(true); setActionError(''); setActionSuccess('');
    try {
      await API.patch(`/applications/${applicationId}/assign-supervisor`, {
        supervisorId: selectedSupervisor
      });
      setActionSuccess('Supervisor assigned successfully! ✅');
      setShowSupervisorModal(false);
      fetchApp();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to assign supervisor.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Approve this application?')) return;
    setActionLoading(true); setActionError(''); setActionSuccess('');
    try {
      await API.patch(`/applications/${applicationId}/status`, { status: 'APPROVED', hoNotes });
      setActionSuccess('Application approved! ✅');
      fetchApp();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to approve.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) { setActionError('Please enter rejection reason.'); return; }
    setActionLoading(true); setActionError('');
    try {
      await API.patch(`/applications/${applicationId}/status`, {
        status: 'REJECTED', rejectionReason, hoNotes
      });
      setActionSuccess('Application rejected.');
      setShowRejectModal(false);
      fetchApp();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to reject.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setActionLoading(true);
    try {
      await API.patch(`/ho/${applicationId}/notes`, { hoNotes });
      setActionSuccess('Notes saved! ✅');
    } catch (err) {
      setActionError('Failed to save notes.');
    } finally {
      setActionLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      SUBMITTED: 'ho-badge--blue',  ASSIGNED:  'ho-badge--yellow',
      INSPECTED: 'ho-badge--yellow', APPROVED:  'ho-badge--green',
      REJECTED:  'ho-badge--red',   DISBURSED: 'ho-badge--green',
    };
    return `ho-badge ${map[status] || 'ho-badge--gray'}`;
  };

  if (loading) return (
    <HOLayout title="Application Detail">
      <p style={{ color: '#64748b' }}>Loading application...</p>
    </HOLayout>
  );

  if (!app) return (
    <HOLayout title="Application Detail">
      <p style={{ color: '#ef4444' }}>Application not found.</p>
    </HOLayout>
  );

  return (
    <HOLayout title="Application Detail">

      {/* Back + Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className="ho-btn ho-btn--ghost ho-btn--sm"
          onClick={() => navigate('/headoffice/applications')}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '18px' }}>
              {app.applicationDisplayId || app.candidateId}
            </h2>
            <span className={statusBadge(app.status)}>{app.status}</span>
            {app.isFlagged && <span className="ho-badge ho-badge--red">🚩 Flagged</span>}
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
            Submitted: {new Date(app.createdAt).toLocaleDateString()}
          </p>
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

      {/* Action Buttons */}
      <div className="ho-card" style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '14px', fontWeight: 600 }}>
          Actions
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="ho-btn ho-btn--primary"
            onClick={() => { setShowInspectorModal(true); setActionError(''); }}>
            Assign Inspector
          </button>
          {app.status === 'APPROVED' && (
            <button className="ho-btn ho-btn--ghost"
              onClick={() => { setShowSupervisorModal(true); setActionError(''); }}>
              Assign Supervisor
            </button>
          )}
          {!['APPROVED','REJECTED','DISBURSED'].includes(app.status) && (
            <>
              <button className="ho-btn ho-btn--success" onClick={handleApprove} disabled={actionLoading}>
                ✓ Approve
              </button>
              <button className="ho-btn ho-btn--danger"
                onClick={() => { setShowRejectModal(true); setActionError(''); }}>
                ✗ Reject
              </button>
            </>
          )}
        </div>
      </div>

      {/* Assignment Info */}
      <Section title="Assignment">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Assigned Inspector"
            value={app.assignedInspector?.name || 'Not assigned'} />
          <Field label="Assigned Supervisor"
            value={app.assignedSupervisor?.name || 'Not assigned'} />
        </div>
      </Section>

      {/* Personal Info */}
      <Section title="Personal Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="First Name"    value={app.personal?.firstName} />
          <Field label="Last Name"     value={app.personal?.lastName} />
          <Field label="Address"       value={app.personal?.address} />
          <Field label="City/Village"  value={app.personal?.cityVillage} />
          <Field label="Pincode"       value={app.personal?.pincode} />
          <Field label="Aadhaar"       value={app.personal?.aadhaarNumber} />
        </div>
      </Section>

      {/* Family Info */}
      <Section title="Family Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Father Name"       value={app.family?.fatherName} />
          <Field label="Father Profession" value={app.family?.fatherProfession} />
          <Field label="Mother Name"       value={app.family?.motherName} />
          <Field label="Mother Profession" value={app.family?.motherProfession} />
          <Field label="Guardian Status"   value={app.family?.guardianStatus} />
          <Field label="Earning Members"   value={app.family?.numberOfEarningMembers} />
          <Field label="Is Orphan"         value={app.family?.isOrphan ? 'Yes' : 'No'} />
          <Field label="Single Parent"     value={app.family?.isSingleParent ? 'Yes' : 'No'} />
        </div>
      </Section>

      {/* Academic Info */}
      <Section title="Academic Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Educational Level"   value={app.academic?.educationalLevel} />
          <Field label="Academic Year"       value={app.academic?.academicYear} />
          <Field label="Current Grade"       value={app.academic?.currentGrade} />
          <Field label="Grade Percentage"    value={app.academic?.currentGradePercentage + '%'} />
        </div>
      </Section>

      {/* Background */}
      <Section title="Background">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Student Disability"  value={app.background?.studentDisabilityStatus} />
          <Field label="Parent Disability"   value={app.background?.parentDisabilityStatus} />
          <Field label="First Gen Learner"   value={app.background?.isFirstGenLearner ? 'Yes' : 'No'} />
          <Field label="Minority Community"  value={app.background?.isMinorityCommunity ? 'Yes' : 'No'} />
          <Field label="Medium of Instruction" value={app.background?.mediumOfInstruction} />
        </div>
      </Section>

      {/* Reason */}
      <Section title="Reason for Applying">
        <Field label="Reason"             value={app.reason?.reasonForApplying} />
        <Field label="Next Option"        value={app.reason?.nextOptionIfNotGiven} />
      </Section>

      {/* Documents */}
      {app.documents && Object.values(app.documents).some(v => v) && (
        <Section title="Uploaded Documents">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.entries(app.documents).map(([key, url]) =>
              url ? (
                <a key={key} href={url} target="_blank" rel="noreferrer"
                  className="ho-btn ho-btn--ghost ho-btn--sm">
                  📄 {key}
                </a>
              ) : null
            )}
          </div>
        </Section>
      )}

      {/* HO Notes */}
      <Section title="HO Notes (Internal)">
        <textarea
          className="ho-input"
          rows={4}
          placeholder="Add internal notes about this application..."
          value={hoNotes}
          onChange={(e) => setHoNotes(e.target.value)}
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
        <button className="ho-btn ho-btn--primary"
          style={{ marginTop: '10px' }}
          onClick={handleSaveNotes} disabled={actionLoading}>
          Save Notes
        </button>
      </Section>

      {/* ── ASSIGN INSPECTOR MODAL ── */}
      {showInspectorModal && (
        <div className="ho-modal-overlay">
          <div className="ho-modal">
            <div className="ho-modal-head">
              <h3 className="ho-modal-title">Assign Inspector</h3>
              <button className="ho-modal-close" onClick={() => setShowInspectorModal(false)}>×</button>
            </div>
            <label className="ho-label">Select Inspector</label>
           <select className="ho-input"
  value={selectedInspector}
  onChange={(e) => setSelectedInspector(e.target.value)}>
  <option value="">-- Select Inspector --</option>
 {/* Inspector dropdown — show area */}
{inspectors.map((i) => (
  <option key={i._id} value={i._id}>
    {i.name}{i.assignedArea ? ` — 📍 ${i.assignedArea}` : ''}
  </option>
))}
</select>
            {actionError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{actionError}</p>}
            <button className="ho-btn ho-btn--primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '11px' }}
              onClick={handleAssignInspector} disabled={actionLoading || !selectedInspector}>
              {actionLoading ? 'Assigning...' : 'Assign Inspector'}
            </button>
          </div>
        </div>
      )}

      {/* ── ASSIGN SUPERVISOR MODAL ── */}
      {showSupervisorModal && (
        <div className="ho-modal-overlay">
          <div className="ho-modal">
            <div className="ho-modal-head">
              <h3 className="ho-modal-title">Assign Supervisor</h3>
              <button className="ho-modal-close" onClick={() => setShowSupervisorModal(false)}>×</button>
            </div>
            <label className="ho-label">Select Supervisor</label>
            <select className="ho-input"
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}>
              <option value="">-- Select Supervisor --</option>
              {/* Supervisor dropdown — show sponsorOrg */}
{supervisors.map((s) => (
  <option key={s._id} value={s._id}>
    {s.name}{s.sponsorOrg ? ` — 🏢 ${s.sponsorOrg}` : ''}
  </option>
))}
            </select>
            {actionError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{actionError}</p>}
            <button className="ho-btn ho-btn--primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '11px' }}
              onClick={handleAssignSupervisor} disabled={actionLoading || !selectedSupervisor}>
              {actionLoading ? 'Assigning...' : 'Assign Supervisor'}
            </button>
          </div>
        </div>
      )}

      {/* ── REJECT MODAL ── */}
      {showRejectModal && (
        <div className="ho-modal-overlay">
          <div className="ho-modal">
            <div className="ho-modal-head">
              <h3 className="ho-modal-title">Reject Application</h3>
              <button className="ho-modal-close" onClick={() => setShowRejectModal(false)}>×</button>
            </div>
            <label className="ho-label">Rejection Reason *</label>
            <textarea
              className="ho-input"
              rows={4}
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
            {actionError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>{actionError}</p>}
            <button className="ho-btn ho-btn--danger"
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '11px' }}
              onClick={handleReject} disabled={actionLoading}>
              {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      )}

    </HOLayout>
  );
};

export default HOApplicationDetailPage;