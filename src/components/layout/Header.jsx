import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';
import { getMyNotifications } from '../../API/ApplicationApi';
import { useEffect, useState } from 'react';

const Header = ({
  title,
  showBack = false,
  showAuth = false,
  showBell = false,
  showAvatar = false,
  onBack,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'A';


    useEffect(() => {
  if (showBell) {
    getMyNotifications()
      .then((data) => setUnreadCount(data.unreadCount))
      .catch(() => {});
  }
}, [showBell]);

  return (
    <header className="app-header">
      <div className="app-header__left">
        {showBack ? (
          <button className="app-header__back" onClick={handleBack} aria-label="Go back">
            <ChevronLeft size={22} />
          </button>
        ) : (
          <Link to="/ApplicantLandingPage" className="app-header__brand">
            <span className="app-header__brand-icon">
              <GraduationCap size={20} />
            </span>
            <span className="app-header__brand-name">HDT Scholar</span>
          </Link>
        )}
        {showBack && title && <h1 className="app-header__title">{title}</h1>}
      </div>

      <div className="app-header__right">
        {showBell && (
  <Link to="/notifications" className="app-header__icon-btn">
    <Bell size={20} />
    {unreadCount > 0 && (
      <span className="app-header__dot">{unreadCount > 9 ? '9+' : unreadCount}</span>
    )}
  </Link>
)}
        {showAvatar && (
          <div className="app-header__avatar-wrap">
            <button className="app-header__avatar" aria-label="Profile"
              onClick={() => navigate('/profile')}>
              {initials}
            </button>
            <button className="app-header__logout" onClick={handleLogout} aria-label="Logout">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;