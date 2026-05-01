import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StaffLoginPage.css';
import { loginUser } from '../../API/authApi';
import { useAuth } from '../../context/AuthContext';

const ROLE_ROUTES = {
  INSPECTOR:  '/inspector/dashboard',
  SUPERVISOR: '/supervisor/dashboard',
  HO:         '/headoffice/dashboard',
  SUPERADMIN: '/admin/dashboard',
};

const ROLE_LABELS = {
  INSPECTOR:  'Inspector',
  SUPERVISOR: 'Supervisor',
  HO:         'Head Office',
  // SUPERADMIN: 'Super Admin',
};

/* ── SVG Icons ── */
const IconBadge = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="18" height="13" rx="2"/>
    <path d="M8 8V5a4 4 0 0 1 8 0v3"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const StaffLoginPage = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email, password });

      // ✅ Block applicants from staff login
      if (data.role === 'APPLICANT') {
        setError('Please use the Applicant Login page.');
        return;
      }

      // ✅ Get route based on role automatically
      const route = ROLE_ROUTES[data.role];
      if (!route) {
        setError('Invalid account role. Contact admin.');
        return;
      }

      // ✅ Save to context
      login(
        { name: data.name, role: data.role },
        data.accessToken,
        data.refreshToken
      );

      setSuccess(`Welcome ${data.name}! Redirecting…`);
      setTimeout(() => navigate(route), 800);

    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic accent color based on nothing — use a neutral blue
  const accent = '#3b82f6';
  const glow   = 'rgba(59,130,246,0.18)';

  const focusStyle = (e) => {
    e.target.style.borderColor = accent;
    e.target.style.boxShadow   = `0 0 0 3px ${glow}`;
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = '';
    e.target.style.boxShadow   = '';
  };

  return (
    <div className="sl-root">
      <div className="sl-bg-layer">
        <div className="sl-blob sl-blob-1"/>
        <div className="sl-blob sl-blob-2"/>
      </div>
      <div className="sl-bg-grid"/>

      <div className="sl-page">

        {/* ── LEFT ── */}
        <div className="sl-left">
          <div className="sl-brand sl-fu sl-d1">
            <div className="sl-brand-box" style={{ background: accent }}>
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <span className="sl-brand-text">HDT Staff Portal</span>
          </div>

          <div className="sl-left-center">
            <div className="sl-live-tag sl-fu sl-d2">
              <span className="sl-live-dot" style={{ background: accent }}/>
              Secure Staff Access
            </div>

            <h1 className="sl-headline sl-fu sl-d3">
              One login.<br />
              Your role.<br />
              <em style={{ color: accent }}>Automatic.</em>
            </h1>

            <p className="sl-role-desc sl-fu sl-d4">
              Sign in with your staff credentials. The system will automatically
              detect your role and redirect you to your dashboard.
            </p>

            {/* Role info cards — just informational, not clickable */}
            <div className="sl-role-grid sl-fu sl-d5">
              {Object.entries(ROLE_LABELS).map(([role, label]) => {
                const colors = {
                  INSPECTOR:  '#f59e0b',
                  SUPERVISOR: '#10b981',
                  HO:         '#3b82f6',
                  SUPERADMIN: '#ef4444',
                };
                return (
                  <div key={role} className="sl-role-card">
                    <div className="sl-role-card-top">
                      <span
                        className="sl-role-pip"
                        style={{ background: colors[role] }}
                      />
                      <span className="sl-role-card-name">{label}</span>
                    </div>
                    <p className="sl-role-card-desc">
                      {role === 'INSPECTOR'  && 'Field verification'}
                      {role === 'SUPERVISOR' && 'Disbursement management'}
                      {role === 'HO'         && 'Application management'}
                      {/* {role === 'SUPERADMIN' && 'System administration'} */}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sl-left-foot sl-fu sl-d6">
            © 2025 HDT Financial Assistance Program. All rights reserved.
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="sl-right">
          {/* Header */}
          <div className="sl-form-head sl-fu sl-d1">
            <span className="sl-eyebrow" style={{ color: accent }}>
              Staff Access
            </span>
            <h2 className="sl-form-title">Welcome back</h2>
            <p className="sl-form-sub">
              Sign in with your staff credentials to continue.
            </p>
            <div className="sl-accent-line" style={{ background: accent }}/>
          </div>

          {/* Info badge */}
          <div className="sl-fu sl-d2" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '10px',
            border: `1px solid ${glow}`,
            background: 'rgba(59,130,246,0.06)',
            fontSize: '13px',
            color: '#94a3b8',
          }}>
            <span style={{ fontSize: '18px' }}>🔐</span>
            Your role will be detected automatically after login
          </div>

          {/* Form */}
          <form
            className="sl-form-fields sl-fu sl-d3"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email */}
            <div className="sl-field">
              <label htmlFor="staffEmail">Email Address</label>
              <div className="sl-iw">
                <input
                  id="staffEmail"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
                <span className="sl-iw-icon"><IconBadge/></span>
              </div>
            </div>

            {/* Password */}
            <div className="sl-field">
              <label htmlFor="staffPwd">Password</label>
              <div className="sl-iw">
                <input
                  id="staffPwd"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
                <span className="sl-iw-icon"><IconLock/></span>
                <button
                  type="button"
                  className="sl-iw-suffix"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label="Toggle password"
                >
                  {showPwd ? <IconEyeOff/> : <IconEye/>}
                </button>
              </div>
              <div className="sl-field-foot">
                <a href="#" style={{ color: accent }}>Forgot password?</a>
              </div>
            </div>

            {/* Error / Success */}
            {error   && <div className="sl-err-box show">{error}</div>}
            {success && <div className="sl-err-box show success">{success}</div>}

            {/* Submit */}
            <button
              type="submit"
              className="sl-btn-go sl-fu sl-d5"
              style={{
                background: accent,
                boxShadow: `0 8px 28px ${glow}`
              }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="sl-divider sl-fu sl-d6">or</div>

          <p className="sl-applicant-cta sl-fu sl-d6">
            Are you an applicant?{' '}
            <Link to="/" style={{ color: accent }}>
              Login here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffLoginPage;