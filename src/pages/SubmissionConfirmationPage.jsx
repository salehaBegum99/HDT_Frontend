import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import PageLayout from '../components/layout/PageLayout';
import './SubmissionConfirmationPage.css';

const SubmissionConfirmationPage = () => {
  const navigate = useNavigate();
  const { applicationId, reset } = useApplication();

  return (
    <PageLayout headerProps={{}} showBottomNav={false}>
      <div className="confirm">
        <div className="confirm__icon">🎉</div>
        <h1 className="confirm__title">Application Submitted!</h1>
        <p className="confirm__sub">
          Your scholarship application has been successfully submitted.
          Our team will review it shortly.
        </p>

        {applicationId && (
          <div className="confirm__id-card">
            <p className="confirm__id-label">Your Application ID</p>
            <p className="confirm__id-value">{applicationId}</p>
            <p className="confirm__id-note">
              Save this ID to track your application status
            </p>
          </div>
        )}

        <div className="confirm__steps">
          <p className="confirm__steps-title">What happens next?</p>
          {[
            { icon: '🔍', text: 'Your application will be reviewed by our team' },
            { icon: '👤', text: 'An inspector will be assigned to verify details' },
            { icon: '✅', text: 'You will be notified of the final decision' },
            { icon: '💰', text: 'Approved scholarships are disbursed in tranches' },
          ].map((step, i) => (
            <div key={i} className="confirm__step">
              <span>{step.icon}</span>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        <div className="confirm__actions">
          <button
            className="confirm__btn confirm__btn--primary"
            onClick={() => { reset(); navigate('/dashboard'); }}
          >
            Track My Application
          </button>
          <button
            className="confirm__btn confirm__btn--ghost"
            onClick={() => navigate('/ApplicantLandingPage')}
          >
            Go to Home
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default SubmissionConfirmationPage;