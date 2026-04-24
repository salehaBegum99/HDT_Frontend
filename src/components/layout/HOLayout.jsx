import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './HOLayout.css';

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
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

const NAV_ITEMS = [
  { label: 'Dashboard',    path: '/headoffice/dashboard',    icon: IconDashboard },
  { label: 'Applications', path: '/headoffice/applications', icon: IconApps },
  { label: 'Search',       path: '/headoffice/search',       icon: IconSearch },
];

const ACCENT = '#3b82f6';
const ACCENT_GLOW = 'rgba(59,130,246,0.12)';

const HOLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/staff/login');
  };

  return (
    <div className="ho-shell">
      <aside className={`ho-sidebar ${sidebarOpen ? 'ho-sidebar--open' : ''}`}>

        <div className="ho-brand">
          <span className="ho-brand-icon">🏢</span>
          <div>
            <p className="ho-brand-name">HDT Scholar</p>
            <p className="ho-brand-sub" style={{ color: ACCENT }}>Head Office</p>
          </div>
        </div>

        <nav className="ho-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`ho-nav-link ${active ? 'ho-nav-link--active' : ''}`}
                style={active ? { background: ACCENT_GLOW, color: ACCENT } : {}}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                <span>{item.label}</span>
                {active && <span className="ho-nav-dot" style={{ background: ACCENT }} />}
              </Link>
            );
          })}
        </nav>

        <div className="ho-sidebar-foot">
          <div className="ho-user">
            <div className="ho-user-avatar" style={{ background: ACCENT_GLOW, color: ACCENT }}>
              {user?.name?.slice(0, 2).toUpperCase() || 'HO'}
            </div>
            <div>
              <p className="ho-user-name">{user?.name || 'HO Staff'}</p>
              <p className="ho-user-role">Head Office</p>
            </div>
          </div>
          <button className="ho-logout-btn" style={{ borderColor: 'rgba(59,130,246,0.3)', color: ACCENT, background: ACCENT_GLOW }} onClick={handleLogout}>
            <IconLogout /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="ho-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="ho-main">
        <header className="ho-topbar">
          <button className="ho-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <IconMenu />
          </button>
          <h1 className="ho-topbar-title">{title}</h1>
          <span className="ho-topbar-badge" style={{ background: ACCENT_GLOW, color: ACCENT }}>
            Head Office
          </span>
        </header>
        <main className="ho-content">{children}</main>
      </div>
    </div>
  );
};

export default HOLayout;