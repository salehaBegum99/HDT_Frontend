import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StaffLoginPage.css";
import { loginUser } from '../../API/authApi';
import { useAuth } from '../../context/AuthContext';

/* ── Role configuration ─────────────────────────────────────────────────── */
const ROLES = {
  Inspector: {
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.18)",
    verb: "Verify.",
    label: "Inspector Access",
    name: "Inspector",
    desc: "Field verification & visit scheduling",
    route: "/inspector/dashboard",
  },
  Supervisor: {
    accent: "#10b981",
    glow: "rgba(16,185,129,0.18)",
    verb: "Approve.",
    label: "Supervisor Access",
    name: "Supervisor",
    desc: "Team oversight & approvals queue",
    route: "/supervisor/dashboard",
  },
  Headoffice: {
    accent: "#3b82f6",
    glow: "rgba(59,130,246,0.18)",
    verb: "Decide.",
    label: "Head Office Access",
    name: "Head Office",
    desc: "Monitoring, payments & analytics",
    route: "/headoffice/dashboard",
  },
  Superadmin: {
    accent: "#ef4444",
    glow: "rgba(239,68,68,0.18)",
    verb: "Control.",
    label: "Super Admin Access",
    name: "Super Admin",
    desc: "User management & system config",
    route: "/admin/dashboard",
  },
};

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
const IconLayers = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const IconBadge = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M8 8V5a4 4 0 0 1 8 0v3" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── Main Component ──────────────────────────────────────────────────────── */
const StaffLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeRole, setActiveRole] = useState("Headoffice");
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Current role config shorthand
  const role = ROLES[activeRole];

  // ── Inline style helpers (dynamic accent colour per role) ──
  const s = {
    accent: { color: role.accent },
    bg: { background: role.accent },
    badge: { borderColor: role.accent, background: role.glow },
    btn: { background: role.accent, boxShadow: `0 8px 28px ${role.glow}` },
    accentLine: { background: role.accent },
    cardActive: (key) =>
      activeRole === key
        ? { borderColor: ROLES[key].accent, background: ROLES[key].glow }
        : {},
  };

  // ── Focus handlers for dynamic ring colour ──
  const focusStyle = (e) => {
    e.target.style.borderColor = role.accent;
    e.target.style.boxShadow = `0 0 0 3px ${role.glow}`;
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "";
    e.target.style.boxShadow = "";
  };

  // ── Submit ──
 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!empId || !password) {
    setError("Please enter both Employee ID and password.");
    return;
  }

  setLoading(true);
  try {
    console.log('Trying login with:', empId, 'Role selected:', activeRole);

    const data = await loginUser({ email: empId, password });

    console.log('Login response:', data); // ← Check this in browser console

    // Map frontend role to backend role
    const roleMap = {
      Inspector: 'INSPECTOR',
      Supervisor: 'SUPERVISOR',
      Headoffice: 'HO',
      Superadmin: 'SUPERADMIN'
    };

    const expectedRole = roleMap[activeRole];
    console.log('Expected role:', expectedRole, 'Got role:', data.role);

    if (data.role !== expectedRole) {
      setError(`This account is not a ${role.name} account. Please select correct role.`);
      return;
    }

    login(
      { name: data.name, role: data.role },
      data.accessToken,
      data.refreshToken
    );

    setSuccess(`Welcome ${data.name}! Redirecting…`);
    setTimeout(() => navigate(role.route), 800);

  } catch (err) {
    console.log('Login error:', err?.response?.data);
    setError(err?.response?.data?.message || "Invalid Employee ID or password.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="sl-root">
      {/* Background */}
      <div className="sl-bg-layer">
        <div className="sl-blob sl-blob-1" />
        <div className="sl-blob sl-blob-2" />
      </div>
      <div className="sl-bg-grid" />

      <div className="sl-page">
        {/* ── LEFT ── */}
        <div className="sl-left">
          {/* Brand */}
          <div className="sl-brand sl-fu sl-d1">
            <div className="sl-brand-box" style={s.bg}>
              <IconLayers />
            </div>
            <span className="sl-brand-text">HDT Staff Portal</span>
          </div>

          <div className="sl-left-center">
            {/* Live tag */}
            <div className="sl-live-tag sl-fu sl-d2">
              <span className="sl-live-dot" style={s.bg} />
              Secure Staff Access
            </div>

            {/* Headline */}
            <h1 className="sl-headline sl-fu sl-d3">
              Built for
              <br />
              the people
              <br />
              who <em style={s.accent}>{role.verb}</em>
            </h1>

            <p className="sl-role-desc sl-fu sl-d4">
              Select your staff role and sign in to your dedicated workspace.
              All sessions are encrypted and logged.
            </p>

            {/* Role cards */}
            <div className="sl-role-grid sl-fu sl-d5">
              {Object.entries(ROLES).map(([key, cfg]) => (
                <div
                  key={key}
                  className="sl-role-card"
                  data-role={key}
                  style={s.cardActive(key)}
                  onClick={() => setActiveRole(key)}
                >
                  <div className="sl-role-card-top">
                    <span className="sl-role-pip" />
                    <span className="sl-role-card-name">{cfg.name}</span>
                  </div>
                  <p className="sl-role-card-desc">{cfg.desc}</p>
                </div>
              ))}
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
            <span className="sl-eyebrow" style={s.accent}>
              {role.label}
            </span>
            <h2 className="sl-form-title">Welcome back</h2>
            <p className="sl-form-sub">
              Sign in with your staff credentials to continue.
            </p>
            <div className="sl-accent-line" style={s.accentLine} />
          </div>

          {/* Role badge */}
          <div className="sl-role-badge sl-fu sl-d2" style={s.badge}>
            <div className="sl-role-badge-dot" style={s.bg} />
            <span className="sl-role-badge-name">{role.name}</span>
            <span className="sl-role-badge-tag">Role selected</span>
          </div>

          {/* Form */}
          <form
            className="sl-form-fields sl-fu sl-d3"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Employee ID */}
            <div className="sl-field">
              <label htmlFor="empId">Employee ID</label>
              <div className="sl-iw">
                <input
                  id="empId"
                  type="text"
                  placeholder="e.g. HDT-EMP-00142"
                  autoComplete="username"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
                <span className="sl-iw-icon">
                  <IconBadge />
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="sl-field">
              <label htmlFor="staffPwd">Password</label>
              <div className="sl-iw">
                <input
                  id="staffPwd"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
                <span className="sl-iw-icon">
                  <IconLock />
                </span>
                <button
                  type="button"
                  className="sl-iw-suffix"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              <div className="sl-field-foot">
                <a href="#" style={s.accent}>
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Error / success */}
            {error && <div className="sl-err-box show">{error}</div>}
            {success && (
              <div className="sl-err-box show success">{success}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="sl-btn-go sl-fu sl-d5"
              style={s.btn}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In to Portal"}
            </button>
          </form>

          <div className="sl-divider sl-fu sl-d6">or</div>

          <p className="sl-applicant-cta sl-fu sl-d6">
            Are you an applicant?{" "}
            <Link to="/login" style={s.accent}>
              Login here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffLoginPage;
