import React, { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink, X } from 'lucide-react';
import { api } from '../../services/api';
import { getSocket } from '../../services/socket';

export default function NotificationDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.notifications.getAll();
      if (res && res.notifications) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      // not logged in or local fallback
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications via socket
    const socket = getSocket();
    if (socket) {
      const handleNewNotification = (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      };

      socket.on('notification:new', handleNewNotification);

      return () => {
        socket.off('notification:new', handleNewNotification);
      };
    }
  }, []);

  const handleMarkAsRead = async (id, link) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(Math.max(0, unreadCount - 1));
      if (link && onNavigate) {
        setOpen(false);
        if (link.includes('tracking')) onNavigate('donor-tracking');
        else if (link.includes('impact')) onNavigate('donor-impact');
        else if (link.includes('shelter')) onNavigate('shelter-dashboard');
      }
    } catch (err) {
      console.warn('Read notification error:', err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Mark all read error:', err.message);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <div 
        onClick={() => setOpen(!open)}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          border: 'var(--border-dark)',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-neo-sm)',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#e63946',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '2px 6px',
            fontSize: '0.7rem',
            fontWeight: 800,
            border: '1.5px solid var(--color-dark)',
            boxShadow: '1px 1px 0px #0d1321'
          }}>
            {unreadCount}
          </span>
        )}
      </div>

      {/* Popover Card */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '52px',
          right: '0',
          width: '340px',
          background: '#ffffff',
          border: 'var(--border-dark)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-neo)',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2dcc8', paddingBottom: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              Notifications ({unreadCount} new)
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', textAlign: 'center', padding: '16px 0' }}>
                No notifications right now.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id, n.link)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2dcc8',
                    background: n.read ? 'transparent' : 'var(--color-bg)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: n.read ? 600 : 800, color: 'var(--color-dark)' }}>
                      {n.title}
                    </h5>
                    {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e63946' }} />}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: '2px', lineHeight: 1.35 }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', display: 'block', marginTop: '4px' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
