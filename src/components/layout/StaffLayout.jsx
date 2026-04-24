import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StaffLayout.css';

const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const IconApps = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconReport = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconPayment = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

// Nav items per role
const NAV_ITEMS = {
  INSPECTOR: [
    { label: 'Dashboard',    path: '/inspector/dashboard',    icon: IconDashboard },
    { label: 'Applications', path: '/inspector/applications', icon: IconApps },
  ],
  SUPERVISOR: [
    { label: 'Dashboard',    path: '/supervisor/dashboard',    icon: IconDashboard },
    { label: 'Applications', path: '/supervisor/applications', icon: IconApps },
  ],
};

// Theme per role
const THEMES = {
  INSPECTOR: {
    accent:    '#f59e0b',
    glow:      'rgba(245,158,11,0.12)',
    label:     'Inspector',
    emoji:     '🔍',
  },
  SUPERVISOR: {
    accent:    '#10b981',
    glow:      'rgba(16,185,129,0.12)',
    label:     'Supervisor',
    emoji:     '✅',
  },
};

const StaffLayout = ({ children, title, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = THEMES[role] || THEMES.INSPECTOR;
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.INSPECTOR;

  const handleLogout = async () => {
    await logout();
    navigate('/staff/login');
  };

  return (
    <div className="sl-shell">
      <aside className={`sl-sidebar ${sidebarOpen ? 'sl-sidebar--open' : ''}`}>

        <div className="sl-brand">
          <span className="sl-brand-icon">{theme.emoji}</span>
          <div>
            <p className="sl-brand-name">HDT Scholar</p>
            <p className="sl-brand-sub" style={{ color: theme.accent }}>
              {theme.label}
            </p>
          </div>
        </div>

        <nav className="sl-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sl-nav-link ${active ? 'sl-nav-link--active' : ''}`}
                style={active ? {
                  background: theme.glow,
                  color: theme.accent
                } : {}}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                <span>{item.label}</span>
                {active && (
                  <span className="sl-nav-dot" style={{ background: theme.accent }} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sl-sidebar-foot">
          <div className="sl-user">
            <div
              className="sl-user-avatar"
              style={{ background: theme.glow, color: theme.accent }}
            >
              {user?.name?.slice(0, 2).toUpperCase() || 'ST'}
            </div>
            <div>
              <p className="sl-user-name">{user?.name || theme.label}</p>
              <p className="sl-user-role">{theme.label}</p>
            </div>
          </div>
          <button
            className="sl-logout-btn"
            style={{
              borderColor: `${theme.accent}44`,
              color: theme.accent,
              background: theme.glow,
            }}
            onClick={handleLogout}
          >
            <IconLogout /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sl-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="sl-main">
        <header className="sl-topbar">
          <button className="sl-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <IconMenu />
          </button>
          <h1 className="sl-topbar-title">{title}</h1>
          <span
            className="sl-topbar-badge"
            style={{ background: theme.glow, color: theme.accent }}
          >
            {theme.label}
          </span>
        </header>
        <main className="sl-content">{children}</main>
      </div>
    </div>
  );
};

export default StaffLayout;