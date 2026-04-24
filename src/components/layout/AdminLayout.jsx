import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
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
  { label: 'Dashboard',       path: '/admin/dashboard',   icon: IconDashboard },
  { label: 'User Management', path: '/admin/users',        icon: IconUsers },
  { label: 'Applications',    path: '/admin/applications', icon: IconApps },
  { label: 'System Settings', path: '/admin/settings',     icon: IconSettings },
];

const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/staff/login');
  };

  return (
    <div className="adm-shell">

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'adm-sidebar--open' : ''}`}>

        <div className="adm-brand">
          <span className="adm-brand-icon">🎓</span>
          <div>
            <p className="adm-brand-name">HDT Scholar</p>
            <p className="adm-brand-sub">Super Admin</p>
          </div>
        </div>

        <nav className="adm-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`adm-nav-link ${active ? 'adm-nav-link--active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                <span>{item.label}</span>
                {active && <span className="adm-nav-dot" />}
              </Link>
            );
          })}
        </nav>

        <div className="adm-sidebar-foot">
          <div className="adm-user">
            <div className="adm-user-avatar">
              {user?.name?.slice(0, 2).toUpperCase() || 'SA'}
            </div>
            <div>
              <p className="adm-user-name">{user?.name || 'Super Admin'}</p>
              <p className="adm-user-role">Super Admin</p>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={handleLogout}>
            <IconLogout /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN ── */}
      <div className="adm-main">
        <header className="adm-topbar">
          <button className="adm-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <IconMenu />
          </button>
          <h1 className="adm-topbar-title">{title}</h1>
          <span className="adm-topbar-badge">SuperAdmin</span>
        </header>

        <main className="adm-content">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;