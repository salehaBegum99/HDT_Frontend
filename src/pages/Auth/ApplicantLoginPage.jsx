import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ApplicantLoginPage.css";
import { loginUser, sendOTP, verifyOTP, registerApplicant } from '../../API/authApi';
import { useAuth } from '../../context/AuthContext';

/* ── SVG Icons ─────────────────────────────────────────────────────────── */
const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── Login Panel ─────────────────────────────────────────────────────────── */
const LoginPanel = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ← Add this
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!email || !password) {
    setError("Please enter your email and password.");
    return;
  }

  setLoading(true);
  try {
    const data = await loginUser({ email, password });

    if (data.role !== 'APPLICANT') {
      setError("Please use Staff Login for staff accounts.");
      return;
    }

    login(
      { name: data.name, role: data.role },
      data.accessToken,
      data.refreshToken
    );

    setSuccess("Login successful! Redirecting…");
    setTimeout(() => navigate("/ApplicantLandingPage"), 800);

  } catch (err) {
    setError(err?.response?.data?.message || "Invalid email or password.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="al-panel">
      <form onSubmit={handleSubmit} noValidate>
        <div className="al-field">
          <label htmlFor="loginEmail">Email Address</label>
          <div className="al-input-wrap">
            <input
              id="loginEmail"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="al-input-icon">
              <IconEmail />
            </span>
          </div>
        </div>

        <div className="al-field">
          <label htmlFor="loginPwd">Password</label>
          <div className="al-input-wrap">
            <input
              id="loginPwd"
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="al-input-icon">
              <IconLock />
            </span>
            <button
              type="button"
              className="al-pw-toggle"
              onClick={() => setShowPwd(!showPwd)}
              aria-label="Toggle password"
            >
              {showPwd ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <div className="al-row-between">
          <label className="al-check-wrap">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="al-forgot">
            Forgot password?
          </a>
        </div>

        {error && <div className="al-error-box show">{error}</div>}
        {success && <div className="al-error-box show success">{success}</div>}

        <button type="submit" className="al-btn-submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="al-divider">or continue with</div>

      <div className="al-social-row">
        <button className="al-social-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
        <button className="al-social-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>
      </div>

      <p className="al-staff-link">
        Staff member? <Link to="/staff/login">Staff Login →</Link>
      </p>
    </div>
  );
};

/* ── Register Panel ──────────────────────────────────────────────────────── */
const RegisterPanel = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=form 2=otp
  const [otpValue, setOtpValue] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "",
    aadhaar: "", dateOfBirth: "", gender: "" 
  });
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Step 1 → Send OTP
  const handleSubmit = async (e) => {
  e.preventDefault();
   console.log('Form values:', {
    name: form.name,
    email: form.email,
    mobile: form.mobile,
    password: form.password,
    aadhaar: form.aadhaar,
    aadhaarLength: form.aadhaar?.length,
    dateOfBirth: form.dateOfBirth,
    gender: form.gender,
    agreed: agreed
     });
  setError("");
  setSuccess("");


  // Check ALL required fields
  if (!form.name || !form.email || !form.mobile ||
      !form.password || !form.aadhaar || !form.dateOfBirth || !form.gender) {
    setError("Please fill in all fields.");
    return;
  }
  if (!agreed) {
    setError("Please agree to the Terms & Conditions.");
    return;
  }
  if (form.password.length < 8) {
    setError("Password must be at least 8 characters.");
    return;
  }
  if (form.aadhaar.length !== 12) {
    setError("Aadhaar must be 12 digits.");
    return;
  }

  setLoading(true);
  try {
    // Clean phone number
    const cleanPhone = form.mobile
      .replace(/^\+91/, '')
      .replace(/\s/g, '')
      .replace(/-/g, '');

    setForm({ ...form, mobile : cleanPhone });
    await sendOTP(cleanPhone);
    setSuccess("OTP sent to your mobile number!");
    setStep(2);
  } catch (err) {
    setError(err?.response?.data?.message || "Failed to send OTP.");
  } finally {
    setLoading(false);
  }
};

  // Step 2 → Verify OTP + Register
 const handleVerifyAndRegister = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!otpValue) {
    setError("Please enter the OTP.");
    return;
  }

  setLoading(true);
  try {
    await verifyOTP(form.mobile, otpValue); // ✅ form.mobile

    await registerApplicant({
      name: form.name,        // ✅ form.name not form.fullName
      email: form.email,
      mobile: form.mobile,    // ✅ form.mobile not form.phone
      password: form.password,
      aadhaar: form.aadhaar,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender
    });

    setSuccess("Account created! Please login.");
    setTimeout(() => navigate("/"), 800);

  } catch (err) {
    setError(err?.response?.data?.message || "Registration failed.");
  } finally {
    setLoading(false);
  }
};

  // OTP Screen
  if (step === 2) {
    return (
      <div className="al-panel">
        <form onSubmit={handleVerifyAndRegister} noValidate>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '16px' }}>
            OTP sent to <strong>{form.mobile}</strong>
          </p>
          <div className="al-field">
            <label>Enter OTP</label>
            <div className="al-input-wrap">
              <input
                type="text"
                placeholder="Enter 6 digit OTP"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <div className="al-error-box show">{error}</div>}
          {success && <div className="al-error-box show success">{success}</div>}
          <button
            type="submit"
            className="al-btn-submit"
            disabled={loading}
          >
            {loading ? "Verifying…" : "Verify & Register"}
          </button>
          <p
            style={{ textAlign: 'center', marginTop: '12px', cursor: 'pointer', color: '#4f46e5' }}
            onClick={() => setStep(1)}
          >
            ← Go back
          </p>
        </form>
      </div>
    );
  }

  // ── rest of RegisterPanel JSX stays exactly same ✅ ──
  return (
    <div className="al-panel">
      <form onSubmit={handleSubmit} noValidate>
        <div className="al-field">
          <label htmlFor="regName">Full Name</label>
          <div className="al-input-wrap">
            <input
              id="regName"
              type="text"
              name="name"
              placeholder="John Doe"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
            />
            <span className="al-input-icon">
              <IconUser />
            </span>
          </div>
        </div>

        <div className="al-field">
          <label htmlFor="regEmail">Email Address</label>
          <div className="al-input-wrap">
            <input
              id="regEmail"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
            <span className="al-input-icon">
              <IconEmail />
            </span>
          </div>
        </div>

        <div className="al-field">
          <label htmlFor="regPhone">Phone Number</label>
          <div className="al-input-wrap">
            <input
              id="regPhone"
              type="tel"
              name="mobile"
              placeholder="+91 98765 43210"
              value={form.mobile}
              onChange={handleChange}
            />
            <span className="al-input-icon">
              <IconPhone />
            </span>
          </div>
        </div>
{/* Aadhaar */}
<div className="al-field">
  <label>Aadhaar Number</label>
  <div className="al-input-wrap">
    <input
      type="text"
      name="aadhaar"
      placeholder="12 digit Aadhaar number"
      value={form.aadhaar}
      onChange={handleChange}
      maxLength={12}
    />
  </div>
</div>

{/* Date of Birth */}
<div className="al-field">
  <label>Date of Birth</label>
  <div className="al-input-wrap">
    <input
      type="date"
      name="dateOfBirth"
      value={form.dateOfBirth}
      onChange={handleChange}
    />
  </div>
</div>

{/* Gender */}
<div className="al-field">
  <label>Gender</label>
  <div className="al-input-wrap">
    <select
      name="gender"
      value={form.gender}
      onChange={handleChange}
      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
    >
      <option value="">Select Gender</option>
      <option value="MALE" >Male</option>
      <option value="FEMALE">Female</option>
      <option value="OTHER">Other</option>
    </select>
  </div>
</div>
        <div className="al-field">
          <label htmlFor="regPwd">Create Password</label>
          <div className="al-input-wrap">
            <input
              id="regPwd"
              type={showPwd ? "text" : "password"}
              name="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
            />
            <span className="al-input-icon">
              <IconLock />
            </span>
            <button
              type="button"
              className="al-pw-toggle"
              onClick={() => setShowPwd(!showPwd)}
              aria-label="Toggle password"
            >
              {showPwd ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <label className="al-check-wrap">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="al-terms-label">
            I agree to the{" "}
            <a href="#" className="al-terms-link">
              Terms &amp; Conditions
            </a>
          </span>
        </label>

        {error && <div className="al-error-box show">{error}</div>}
        {success && <div className="al-error-box show success">{success}</div>}

        <button type="submit" className="al-btn-submit" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="al-staff-link">
        Staff member? <Link to="/staff/login">Staff Login →</Link>
      </p>
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────────────────────── */
const ApplicantLoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="al-root">
      <div className="al-page">
        {/* ── LEFT ── */}
        <div className="al-left">
          <div className="al-brand al-fade-up al-d1">
            <div className="al-brand-icon">🎓</div>
            <span className="al-brand-name">HDT Scholarship System</span>
          </div>

          <div className="al-left-body">
            <div className="al-left-tag al-fade-up al-d2">Applicant Portal</div>
            <h1 className="al-headline al-fade-up al-d3">
              Your future
              <br />
              starts with
              <br />
              <span>one form.</span>
            </h1>
            <p className="al-desc al-fade-up al-d4">
              Apply for scholarships, track your application status, and receive
              disbursements — all in one place.
            </p>
            <div className="al-stats al-fade-up al-d5">
              <div className="al-stat">
                <span className="al-stat-num">4,200+</span>
                <span className="al-stat-label">Applicants</span>
              </div>
              <div className="al-stat">
                <span className="al-stat-num">₹2.4Cr</span>
                <span className="al-stat-label">Disbursed</span>
              </div>
              <div className="al-stat">
                <span className="al-stat-num">98%</span>
                <span className="al-stat-label">Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="al-left-footer al-fade-up al-d6">
            © 2025 HDT Financial Assistance Program
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="al-right">
          <div className="al-form-wrap">
            <div className="al-form-top al-fade-up al-d1">
              <span className="al-form-kicker">Applicant Access</span>
              <h2 className="al-form-title">
                {activeTab === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="al-form-sub">
                {activeTab === "login"
                  ? "Sign in to manage your scholarship application."
                  : "Register to start your scholarship journey."}
              </p>
            </div>

            {/* ── TABS ── */}
            <div className="al-tabs al-fade-up al-d2">
              <button
                type="button"
                className={`al-tab-btn ${activeTab === "login" ? "active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`al-tab-btn ${activeTab === "register" ? "active" : ""}`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            {/* ── PANELS: conditionally render — this is the fix ── */}
            {activeTab === "login" && <LoginPanel />}
            {activeTab === "register" && <RegisterPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantLoginPage;
