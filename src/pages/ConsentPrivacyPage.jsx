import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Edit3 } from 'lucide-react';
import { useApplication } from '../context/ApplicationContext';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/common/Button';
import { submitApplication, uploadDocuments } from '../API/ApplicationApi';
import './ConsentPrivacyPage.css';

const TERMS_TEXT = `Welcome to the HDT Scholarship System. By submitting this application, you confirm that all information provided is accurate and truthful. Submission of false information may result in disqualification. We reserve the right to verify all submitted documents and information. Your data will be kept confidential and used only for scholarship evaluation purposes.`;

const ConsentPrivacyPage = () => {
  const navigate = useNavigate();
  const { personal, family, academic, background, reason,documents, bank, setConsent, setApplicationId, reset } = useApplication();

  const [agreed, setAgreed] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const CAPTCHA_ANSWER = 'HDT2025';

  const handleVerifyCaptcha = () => {
    if (captchaInput.toUpperCase() === CAPTCHA_ANSWER.toUpperCase()) {
      setCaptchaVerified(true);
      setCaptchaError('');
    } else {
      setCaptchaError('Incorrect CAPTCHA. Please try again.');
    }
  };

  const canSubmit = agreed && captchaVerified;

 const handleSubmit = async () => {
  if (!canSubmit) return;
  setSubmitting(true);
  setError('');

  try {
    // Step 2 — Submit application
    const payload = { personal, family, academic, background, reason };
    const data = await submitApplication(payload);
     await uploadDocuments(documents);

    setApplicationId(data.applicationDisplayId);
    setConsent({ agreedToTerms: true });
    navigate('/apply/confirmation');

  } catch (err) {
    setError(err?.response?.data?.message || 'Submission failed. Please try again.');
  } finally {
    setSubmitting(false);
  }
};
  return (
    <PageLayout headerProps={{ showBack: true, title: 'Consent & Privacy' }}>
      <div className="consent-page">
        <h1 className="consent-page__title">Consent &amp; Privacy</h1>

        {/* Terms */}
        <div className="consent-section">
          <h2 className="consent-section__title">Terms and Conditions</h2>
          <div className="consent-section__body">
            <div className="consent-terms-scroll">
              <p>{TERMS_TEXT}</p>
            </div>
            <label className="consent-checkbox">
              <input type="checkbox" checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="consent-checkbox__input" />
              <span className="consent-checkbox__box" aria-hidden="true" />
              <span className="consent-checkbox__label">
                I have read and agree to the Terms and Conditions
              </span>
            </label>
          </div>
        </div>

        {/* CAPTCHA */}
        <div className="consent-captcha">
          <div className="consent-captcha__image" aria-label="CAPTCHA">
            <span className="consent-captcha__text">HDT2025</span>
          </div>
          <p className="consent-captcha__instruction">Type the text above</p>
          <input
            type="text" value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className={`consent-captcha__input ${captchaVerified ? 'consent-captcha__input--success' : ''}`}
            placeholder="Enter CAPTCHA" disabled={captchaVerified}
          />
          {captchaError && <p className="consent-captcha__error">{captchaError}</p>}
          {!captchaVerified ? (
            <button className="consent-captcha__verify-btn" onClick={handleVerifyCaptcha}>
              Verify
            </button>
          ) : (
            <p className="consent-captcha__verified">✓ Verified</p>
          )}
        </div>

        {error && (
          <p style={{ color: '#e53e3e', textAlign: 'center', marginBottom: '12px', fontSize: '14px' }}>
            {error}
          </p>
        )}

        <Button
          variant="primary" fullWidth size="lg"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </PageLayout>
  );
};

export default ConsentPrivacyPage;