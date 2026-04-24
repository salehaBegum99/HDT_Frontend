import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/layout/PageLayout';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <PageLayout headerProps={{ showBell: true, showAvatar: true }} showBottomNav>
      <div className="landing">

        {/* Hero Card */}
        <div className="landing__hero">
          <div className="landing__hero-emoji">🎓</div>
          <h1 className="landing__hero-title">
            Welcome back,<br />
            <span>{user?.name?.split(' ')[0] || 'Student'}!</span>
          </h1>
          <p className="landing__hero-sub">
            Your scholarship journey is one step away.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="landing__actions">
          <button
            className="landing__action-card landing__action-card--primary"
            onClick={() => navigate('/apply/personal')}
          >
            <span className="landing__action-icon">📝</span>
            <div>
              <p className="landing__action-title">Start Application</p>
              <p className="landing__action-sub">Apply for scholarship now</p>
            </div>
            <span className="landing__action-arrow">→</span>
          </button>

          <button
            className="landing__action-card"
            onClick={() => navigate('/dashboard')}
          >
            <span className="landing__action-icon">📊</span>
            <div>
              <p className="landing__action-title">Track Status</p>
              <p className="landing__action-sub">View your application progress</p>
            </div>
            <span className="landing__action-arrow">→</span>
          </button>

          <button
            className="landing__action-card"
            onClick={() => navigate('/payment-status')}
          >
            <span className="landing__action-icon">💰</span>
            <div>
              <p className="landing__action-title">Payment Status</p>
              <p className="landing__action-sub">Check disbursement details</p>
            </div>
            <span className="landing__action-arrow">→</span>
          </button>

          <button
            className="landing__action-card"
            onClick={() => navigate('/notifications')}
          >
            <span className="landing__action-icon">🔔</span>
            <div>
              <p className="landing__action-title">Notifications</p>
              <p className="landing__action-sub">View updates & alerts</p>
            </div>
            <span className="landing__action-arrow">→</span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="landing__banner">
          <span>📌</span>
          <p>Application deadline: <strong>31st March 2026</strong>. Apply before it's too late!</p>
        </div>

      </div>
    </PageLayout>
  );
};

export default LandingPage;