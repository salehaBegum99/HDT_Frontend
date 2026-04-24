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

const SupervisorApplicationDetailPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [app, setApp]             = useState(null);
  const [tranches, setTranches]   = useState([]);
  const [visitReport, setVisitReport] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [showFlagModal, setShowFlagModal]         = useState(false);
  const [showCommentModal, setShowCommentModal]   = useState(false);
  const [actionLoading, setActionLoading]         = useState(false);
  const [actionError, setActionError]             = useState('');
  const [actionSuccess, setActionSuccess]         = useState('');

  const [disburseForm, setDisburseForm] = useState({
    amount: '',
    disbursedDate: '',
    transactionReference: '',
    comments: '',
  });
  const [flagReason, setFlagReason]     = useState('');
  const [comment, setComment]           = useState('');

  const fetchData = async () => {
    try {
      const [appRes, trancheRes, visitRes] = await Promise.all([
        API.get(`/applications/${applicationId}`),
        API.get(`/supervisor/${applicationId}/tranches`),
        API.get(`/supervisor/${applicationId}/visit-report`),
      ]);
      setApp(appRes.data.application);
      setTranches(trancheRes.data.tranches || []);
      setVisitReport(visitRes.data.visitReport || null);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [applicationId]);

  const handleDisburse = async () => {
    if (!disburseForm.amount || !disburseForm.disbursedDate) {
      setActionError('Amount and date are required.');
      return;
    }
    setActionLoading(true); setActionError(''); setActionSuccess('');
    try {
      await API.post(`/supervisor/${applicationId}/disburse`, {
        ...disburseForm,
        amount: Number(disburseForm.amount),
      });
      setActionSuccess('Tranche disbursed successfully! ✅');
      setShowDisburseModal(false);
      setDisburseForm({ amount: '', disbursedDate: '', transactionReference: '', comments: '' });
      fetchData();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to disburse.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlag = async (trancheId) => {
    if (!flagReason) { setActionError('Please enter flag reason.'); return; }
    setActionLoading(true); setActionError('');
    try {
      await API.patch(`/supervisor/tranche/${trancheId}/flag`, { flagReason });
      setActionSuccess('Tranche flagged! ✅');
      setShowFlagModal(false);
      setFlagReason('');
      fetchData();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to flag.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveComment = async () => {
    setActionLoading(true); setActionError('');
    try {
      await API.patch(`/supervisor/${applicationId}/comments`, { supervisorComments: comment });
      setActionSuccess('Comments saved! ✅');
      setShowCommentModal(false);
      fetchData();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to save.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <StaffLayout title="Application Detail" role="SUPERVISOR">
      <p style={{ color: '#64748b' }}>Loading...</p>
    </StaffLayout>
  );

  if (!app) return (
    <StaffLayout title="Application Detail" role="SUPERVISOR">
      <p style={{ color: '#ef4444' }}>Application not found.</p>
    </StaffLayout>
  );

  return (
    <StaffLayout title="Application Detail" role="SUPERVISOR">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className="sl-btn sl-btn--ghost sl-btn--sm"
          onClick={() => navigate('/supervisor/applications')}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '18px', marginBottom: '4px' }}>
            {app.applicationDisplayId || app.candidateId}
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className={`sl-badge ${app.status === 'DISBURSED' ? 'sl-badge--green' : 'sl-badge--blue'}`}>
              {app.status}
            </span>
            {app.isFlagged && <span className="sl-badge sl-badge--red">🚩 Flagged</span>}
          </div>
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
        <p style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>Actions</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="sl-btn sl-btn--green"
            onClick={() => { setShowDisburseModal(true); setActionError(''); }}>
            💰 Disburse Tranche
          </button>
          <button className="sl-btn sl-btn--ghost"
            onClick={() => { setComment(app.supervisorComments || ''); setShowCommentModal(true); }}>
            💬 Add Comment
          </button>
        </div>
      </div>

      {/* Disbursement Info */}
      <div className="sl-card" style={{ marginBottom: '16px' }}>
        <p className="sl-section-title" style={{ color: '#10b981' }}>
          Disbursement Summary
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', flexWrap: 'wrap' }}>
          <Field label="Approved Amount"
            value={app.approvedAmount ? `₹${app.approvedAmount.toLocaleString('en-IN')}` : 'Not set'} />
          <Field label="Total Tranches"   value={app.totalTranches || '—'} />
          <Field label="Current Tranche"  value={`${app.currentTranche || 0} of ${app.totalTranches || '—'}`} />
        </div>

        {/* Tranches Table */}
        {tranches.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600,
              textTransform: 'uppercase', marginBottom: '10px' }}>
              Tranche History
            </p>
            <div className="sl-table-wrap">
              <table className="sl-table">
                <thead>
                  <tr>
                    <th>Tranche</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {tranches.map((t, i) => (
                    <tr key={t._id}>
                      <td style={{ color: '#f1f5f9' }}>#{t.trancheNumber || i + 1}</td>
                      <td style={{ color: '#10b981', fontWeight: 600 }}>
                        {t.amount ? `₹${t.amount.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {t.disbursedDate
                          ? new Date(t.disbursedDate).toLocaleDateString('en-IN')
                          : '—'}
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {t.transactionReference || '—'}
                      </td>
                      <td>
                        <span className={`sl-badge ${
                          t.status === 'DISBURSED' ? 'sl-badge--green' :
                          t.status === 'ON_HOLD'   ? 'sl-badge--red'   : 'sl-badge--gray'
                        }`}>{t.status}</span>
                      </td>
                      <td>
                        {!t.isFlagged ? (
                          <button className="sl-btn sl-btn--danger sl-btn--sm"
                            onClick={() => { setShowFlagModal(t._id); setActionError(''); }}>
                            🚩 Flag
                          </button>
                        ) : (
                          <span className="sl-badge sl-badge--red">Flagged</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Visit Report */}
      {visitReport && (
        <div className="sl-card" style={{ marginBottom: '16px' }}>
          <p className="sl-section-title" style={{ color: '#10b981' }}>Visit Report</p>
          <Field label="Visit Date"
            value={new Date(visitReport.visitDate).toLocaleDateString('en-IN')} />
          <Field label="Comments"     value={visitReport.comments} />
          <Field label="Verified"     value={visitReport.isVerified ? 'Yes ✅' : 'No ❌'} />
        </div>
      )}

      {/* Applicant Details */}
      <div className="sl-card" style={{ marginBottom: '16px' }}>
        <p className="sl-section-title" style={{ color: '#10b981' }}>Applicant Details</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Field label="First Name"   value={app.personal?.firstName} />
          <Field label="Last Name"    value={app.personal?.lastName} />
          <Field label="City/Village" value={app.personal?.cityVillage} />
          <Field label="Pincode"      value={app.personal?.pincode} />
        </div>
      </div>

      {/* Supervisor Comments */}
      {app.supervisorComments && (
        <div className="sl-card" style={{ marginBottom: '16px' }}>
          <p className="sl-section-title" style={{ color: '#10b981' }}>My Comments</p>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6 }}>
            {app.supervisorComments}
          </p>
        </div>
      )}

      {/* ── DISBURSE MODAL ── */}
      {showDisburseModal && (
        <div className="sl-modal-overlay">
          <div className="sl-modal">
            <div className="sl-modal-head">
              <h3 className="sl-modal-title">Disburse Tranche</h3>
              <button className="sl-modal-close" onClick={() => setShowDisburseModal(false)}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="sl-label">Amount (₹) *</label>
                <input className="sl-input" type="number"
                  placeholder="e.g. 25000"
                  value={disburseForm.amount}
                  onChange={(e) => setDisburseForm({ ...disburseForm, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="sl-label">Disbursed Date *</label>
                <input className="sl-input" type="date"
                  value={disburseForm.disbursedDate}
                  onChange={(e) => setDisburseForm({ ...disburseForm, disbursedDate: e.target.value })}
                />
              </div>
              <div>
                <label className="sl-label">Transaction Reference</label>
                <input className="sl-input" type="text"
                  placeholder="e.g. UTR123456789"
                  value={disburseForm.transactionReference}
                  onChange={(e) => setDisburseForm({ ...disburseForm, transactionReference: e.target.value })}
                />
              </div>
              <div>
                <label className="sl-label">Comments</label>
                <textarea className="sl-input" rows={3}
                  placeholder="Optional comments..."
                  value={disburseForm.comments}
                  onChange={(e) => setDisburseForm({ ...disburseForm, comments: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>
              {actionError && <p style={{ color: '#ef4444', fontSize: '13px' }}>{actionError}</p>}
              <button className="sl-btn sl-btn--green"
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                onClick={handleDisburse} disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Confirm Disbursement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLAG MODAL ── */}
      {showFlagModal && (
        <div className="sl-modal-overlay">
          <div className="sl-modal">
            <div className="sl-modal-head">
              <h3 className="sl-modal-title">Flag Tranche</h3>
              <button className="sl-modal-close" onClick={() => setShowFlagModal(false)}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="sl-label">Flag Reason *</label>
                <textarea className="sl-input" rows={3}
                  placeholder="Describe the payment issue..."
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
              {actionError && <p style={{ color: '#ef4444', fontSize: '13px' }}>{actionError}</p>}
              <button className="sl-btn sl-btn--danger"
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                onClick={() => handleFlag(showFlagModal)} disabled={actionLoading}>
                {actionLoading ? 'Flagging...' : 'Confirm Flag'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMMENT MODAL ── */}
      {showCommentModal && (
        <div className="sl-modal-overlay">
          <div className="sl-modal">
            <div className="sl-modal-head">
              <h3 className="sl-modal-title">Add Comment</h3>
              <button className="sl-modal-close" onClick={() => setShowCommentModal(false)}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="sl-label">Comment</label>
                <textarea className="sl-input" rows={4}
                  placeholder="Add your observations or notes..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
              {actionError && <p style={{ color: '#ef4444', fontSize: '13px' }}>{actionError}</p>}
              <button className="sl-btn sl-btn--green"
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                onClick={handleSaveComment} disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Save Comment'}
              </button>
            </div>
          </div>
        </div>
      )}

    </StaffLayout>
  );
};

export default SupervisorApplicationDetailPage;