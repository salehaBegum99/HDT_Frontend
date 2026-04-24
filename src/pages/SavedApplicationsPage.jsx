import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { getMyApplication } from '../API/ApplicationApi';
import './SavedApplicationsPage.css';

const statusConfig = {
  SUBMITTED:  { color: '#2563eb', bg: '#eff6ff',  label: 'Submitted',  progress: 30 },
  ASSIGNED:   { color: '#d97706', bg: '#fffbeb',  label: 'Assigned',   progress: 45 },
  INSPECTED:  { color: '#7c3aed', bg: '#f5f3ff',  label: 'Inspected',  progress: 60 },
  APPROVED:   { color: '#16a34a', bg: '#f0fdf4',  label: 'Approved',   progress: 90 },
  REJECTED:   { color: '#be123c', bg: '#fff1f2',  label: 'Rejected',   progress: 100 },
  DISBURSED:  { color: '#16a34a', bg: '#f0fdf4',  label: 'Disbursed',  progress: 100 },
};

const SavedApplicationsPage = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyApplication();
        setApplication(data.application);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError('Failed to load application.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const config = statusConfig[application?.status] || statusConfig.SUBMITTED;

  return (
    <PageLayout
      headerProps={{ showBell: true, showAvatar: true }}
      showBottomNav
    >
      <div className="saved-apps">

        <div className="saved-apps__intro">
          <h1 className="saved-apps__title">My Application</h1>
          <p className="saved-apps__desc">
            View and track your scholarship application status.
          </p>
        </div>

        {loading ? (
          <div className="saved-apps__empty">
            <p style={{ color: '#94a3b8' }}>Loading...</p>
          </div>

        ) : error ? (
          <div className="saved-apps__empty">
            <p style={{ color: '#ef4444' }}>{error}</p>
          </div>

        ) : !application ? (
          // No application yet
          <div className="saved-apps__empty">
            <div className="saved-apps__empty-icon">📋</div>
            <p className="saved-apps__empty-title">No Application Found</p>
            <p className="saved-apps__empty-sub">
              You haven't submitted a scholarship application yet.
            </p>
            <button
              className="saved-apps__start-btn"
              onClick={() => navigate('/apply/personal')}
            >
              Start New Application →
            </button>
          </div>

        ) : (
          // Real application card
          <div className="saved-app-card">

            {/* Header */}
            <div className="saved-app-card__header">
              <div>
                <p className="saved-app-card__app-id">
                  {application.applicationDisplayId || application.candidateId}
                </p>
                <p className="saved-app-card__name">
                  {application.personal?.firstName} {application.personal?.lastName}
                </p>
              </div>
              <span
                className="saved-app-card__badge"
                style={{ color: config.color, background: config.bg }}
              >
                {config.label}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="saved-app-card__progress-wrap">
              <div className="saved-app-card__progress-header">
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                  Application Progress
                </span>
                <span style={{ fontSize: '12px', color: config.color, fontWeight: 700 }}>
                  {config.progress}%
                </span>
              </div>
              <div className="saved-app-card__progress-bar">
                <div
                  className="saved-app-card__progress-fill"
                  style={{ width: `${config.progress}%`, background: config.color }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="saved-app-card__details">
              <div className="saved-app-card__detail-row">
                <span className="saved-app-card__detail-label">Submitted</span>
                <span className="saved-app-card__detail-value">
                  {new Date(application.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>
              <div className="saved-app-card__detail-row">
                <span className="saved-app-card__detail-label">Inspector</span>
                <span className="saved-app-card__detail-value">
                  {application.assignedInspector?.name || 'Not assigned yet'}
                </span>
              </div>
              <div className="saved-app-card__detail-row">
                <span className="saved-app-card__detail-label">Educational Level</span>
                <span className="saved-app-card__detail-value">
                  {application.academic?.educationalLevel || '—'}
                </span>
              </div>
              {application.status === 'REJECTED' && application.rejectionReason && (
                <div className="saved-app-card__rejection">
                  <p className="saved-app-card__rejection-label">Rejection Reason</p>
                  <p className="saved-app-card__rejection-reason">
                    {application.rejectionReason}
                  </p>
                </div>
              )}
              {application.approvedAmount && (
                <div className="saved-app-card__detail-row">
                  <span className="saved-app-card__detail-label">Approved Amount</span>
                  <span className="saved-app-card__detail-value" style={{ color: '#16a34a', fontWeight: 700 }}>
                    ₹{application.approvedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="saved-app-card__actions">
              <button
                className="saved-app-card__btn saved-app-card__btn--primary"
                onClick={() => navigate('/dashboard')}
              >
                Track Progress
              </button>
              <button
                className="saved-app-card__btn saved-app-card__btn--ghost"
                onClick={() => navigate('/payment-status')}
              >
                Payment Status
              </button>
            </div>

          </div>
        )}

      </div>
    </PageLayout>
  );
};

export default SavedApplicationsPage;