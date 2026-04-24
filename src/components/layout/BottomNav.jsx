import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Bell, CreditCard, User } from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/dashboard',      label: 'Home',    icon: Home },
  { to: '/applications',   label: 'Apply',   icon: FileText },
  { to: '/notifications',  label: 'Alerts',  icon: Bell },
  { to: '/payment-status', label: 'Payment', icon: CreditCard },
  { to: '/profile',        label: 'Profile', icon: User },
];

const BottomNav = () => (
  <nav className="bnav" aria-label="Main navigation">
    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `bnav__item ${isActive ? 'bnav__item--active' : ''}`
        }
      >
        <span className="bnav__icon"><Icon size={21} /></span>
        <span className="bnav__label">{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default BottomNav;