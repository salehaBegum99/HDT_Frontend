import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Timer, UserSearch, CalendarCheck, Clock, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { getMyApplication } from '../API/ApplicationApi';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const getTimelineSteps = (status, application) => [
  {
    id: 1,
    icon: CheckCircle2,
    label: 'Application Submitted',
    description: 'Your application has been successfully submitted.',
    date: application?.createdAt
      ? new Date(application.createdAt).toLocaleDateString('en-IN')
      : '—',
    status: 'done',
  },
  {
    id: 2,
    icon: Timer,
    label: 'Under Review',
    description: 'Your application is being reviewed by our team.',
    date: '—',
    status: ['ASSIGNED','INSPECTED','APPROVED','REJECTED','DISBURSED'].includes(status)
      ? 'done' : 'active',
  },
  {
    id: 3,
    icon: UserSearch,
    label: 'Inspector Assigned',
    description: 'An inspector has been assigned to verify your details.',
    date: '—',
    status: ['INSPECTED','APPROVED','REJECTED','DISBURSED'].includes(status) ? 'done'
      : status === 'ASSIGNED' ? 'active' : 'pending',
  },
  {
    id: 4,
    icon: CalendarCheck,
    label: 'Verification Complete',
    description: 'Your field verification visit is complete.',
    date: '—',
    status: ['APPROVED','REJECTED','DISBURSED'].includes(status) ? 'done'
      : status === 'INSPECTED' ? 'active' : 'pending',
  },
  {
    id: 5,
    icon: Clock,
    label: 'Final Decision',
    description:
      status === 'APPROVED'  ? '🎉 Your scholarship has been approved!' :
      status === 'REJECTED'  ? 'Your application was not approved.' :
      status === 'DISBURSED' ? '✅ Scholarship amount has been disbursed!' :
      'Awaiting the final decision on your application.',
    date: '—',
    status: ['APPROVED','DISBURSED'].includes(status) ? 'done'
      : status === 'REJECTED' ? 'rejected' : 'pending',
  },
];

const TimelineItem = ({ step, isLast }) => {
  const Icon = step.icon;
  return (
    <div className="tl-item">
      <div className="tl-item__left">
        <div className={`tl-icon tl-icon--${step.status}`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
        {!isLast && <div className={`tl-line ${step.status === 'done' ? 'tl-line--done' : ''}`} />}
      </div>
      <div className="tl-item__body">
        <p className="tl-item__label">{step.label}</p>
        <p className="tl-item__desc">{step.description}</p>
        {step.date !== '—' && (
          <p className="tl-item__date">{step.date}</p>
        )}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
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
          setError('Failed to load application data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const status = application?.status || 'SUBMITTED';
  const timelineSteps = getTimelineSteps(status, application);
  const inspector = application?.assignedInspector;

  if (loading) return (
    <PageLayout headerProps={{ showBell: true, showAvatar: true }} showBottomNav>
      <div className="dash-loading">Loading your application...</div>
    </PageLayout>
  );

  return (
    <PageLayout headerProps={{ showBell: true, showAvatar: true }} showBottomNav>
      <div className="dash">

        {/* Welcome */}
        <div className="dash__welcome">
          <div>
            <h2 className="dash__welcome-name">
              Hello, {user?.name?.split(' ')[0] || 'Student'} 👋
            </h2>
            <p className="dash__welcome-sub">Track your scholarship application</p>
          </div>
          {application && (
            <div className="dash__app-id">
              <p className="dash__app-id-label">Application ID</p>
              <p className="dash__app-id-value">
                {application.applicationDisplayId || application.candidateId}
              </p>
            </div>
          )}
        </div>

        {/* Status Badge */}
        {application && (
          <div className={`dash__status-banner dash__status-banner--${status.toLowerCase()}`}>
            <span className="dash__status-dot" />
            <span className="dash__status-text">Status: <strong>{status}</strong></span>
          </div>
        )}

        {/* No Application */}
        {!application && (
          <div className="dash__empty">
            <div className="dash__empty-icon">📋</div>
            <p className="dash__empty-title">No Application Yet</p>
            <p className="dash__empty-sub">Start your scholarship application today</p>
            <button
              className="dash__empty-btn"
              onClick={() => navigate('/apply/personal')}
            >
              Apply Now →
            </button>
          </div>
        )}

        {/* Timeline */}
        {application && (
          <div className="dash__card">
            <h3 className="dash__card-title">Application Progress</h3>
            <div className="tl">
              {timelineSteps.map((step, i) => (
                <TimelineItem
                  key={step.id}
                  step={step}
                  isLast={i === timelineSteps.length - 1}
                />
              ))}
            </div>
          </div>
        )}

       {/* Inspector Card */}
{inspector && (
  <div className="dash__card">
    <h3 className="dash__card-title">Assigned Inspector</h3>
    <div className="dash__inspector">
      <div className="dash__inspector-avatar">
        {inspector.name?.slice(0, 2).toUpperCase() || 'IN'}
      </div>
      <div>
        <p className="dash__inspector-name">{inspector.name}</p>
        <p className="dash__inspector-email">{inspector.email}</p>
        {/* ← Show area */}
        {inspector.assignedArea && (
          <p style={{
            fontSize: '12px', color: '#f59e0b',
            fontWeight: 600, marginTop: '4px'
          }}>
            📍 {inspector.assignedArea}
          </p>
        )}
      </div>
    </div>
  </div>
)}
{/* Supervisor Card — show if assigned */}
{application?.assignedSupervisor && (
  <div className="dash__card">
    <h3 className="dash__card-title">Assigned Supervisor</h3>
    <div className="dash__inspector">
      <div className="dash__inspector-avatar" style={{
        background: 'linear-gradient(135deg, #10b981, #059669)'
      }}>
        {application.assignedSupervisor.name?.slice(0, 2).toUpperCase() || 'SV'}
      </div>
      <div>
        <p className="dash__inspector-name">
          {application.assignedSupervisor.name}
        </p>
        <p className="dash__inspector-email">
          {application.assignedSupervisor.email}
        </p>
        {/* ← Show sponsor/org */}
        {application.assignedSupervisor.sponsorOrg && (
          <p style={{
            fontSize: '12px', color: '#10b981',
            fontWeight: 600, marginTop: '4px'
          }}>
            🏢 {application.assignedSupervisor.sponsorOrg}
          </p>
        )}
      </div>
    </div>
  </div>
)}

        {/* Rejection Reason */}
        {status === 'REJECTED' && application?.rejectionReason && (
          <div className="dash__rejection">
            <AlertCircle size={18} />
            <div>
              <p className="dash__rejection-title">Rejection Reason</p>
              <p className="dash__rejection-reason">{application.rejectionReason}</p>
            </div>
          </div>
        )}

        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
      </div>
    </PageLayout>
  );
};

export default DashboardPage;