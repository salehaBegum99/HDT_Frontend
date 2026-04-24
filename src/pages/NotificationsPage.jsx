import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Clock, CreditCard } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../API/ApplicationApi';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css';

const iconMap = {
  STATUS_CHANGE:       { icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
  INSPECTOR_ASSIGNED:  { icon: Info,        color: '#2563eb', bg: '#eff6ff' },
  DOCUMENT_REQUESTED:  { icon: AlertCircle, color: '#d97706', bg: '#fffbeb' },
  PAYMENT_DISBURSED:   { icon: CreditCard,  color: '#7c3aed', bg: '#f5f3ff' },
  GENERAL:             { icon: Bell,        color: '#64748b', bg: '#f8fafc' },
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id, link) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => n._id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    if (link) navigate(link);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <PageLayout
      headerProps={{ showBack: true, title: 'Notifications' }}
      showBottomNav
    >
      <div className="notif">

        <div className="notif__header">
          <div>
            <h2 className="notif__title">Notifications</h2>
            {unreadCount > 0 && (
              <p className="notif__sub">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="notif__mark-all" onClick={handleMarkAllRead}>
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="notif__empty">
            <p style={{ color: '#94a3b8' }}>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="notif__empty">
            <p style={{ color: '#ef4444' }}>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notif__empty">
            <Bell size={40} color="#cbd5e1" />
            <p>No notifications yet</p>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              You'll be notified about your application updates here
            </p>
          </div>
        ) : (
          <div className="notif__list">
            {notifications.map((n) => {
              const { icon: Icon, color, bg } = iconMap[n.type] || iconMap.GENERAL;
              return (
                <div
                  key={n._id}
                  className={`notif__item ${!n.isRead ? 'notif__item--unread' : ''}`}
                  onClick={() => handleMarkRead(n._id, n.link)}
                >
                  <div className="notif__item-icon" style={{ background: bg, color }}>
                    <Icon size={18} />
                  </div>
                  <div className="notif__item-body">
                    <p className="notif__item-title">{n.title}</p>
                    <p className="notif__item-msg">{n.message}</p>
                    <p className="notif__item-time">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className="notif__item-dot" />}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </PageLayout>
  );
};

export default NotificationsPage;