import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import './PageLayout.css';

const PageLayout = ({
  children,
  headerProps = {},
  showBottomNav = false,
  className = '',
}) => (
  <div className="app-shell">
    <Header {...headerProps} />
    <main className={`page-content ${className}`}>
      {children}
    </main>
    {showBottomNav && <BottomNav />}
  </div>
);

export default PageLayout;
