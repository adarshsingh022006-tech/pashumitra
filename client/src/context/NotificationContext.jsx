import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestAlert, setLatestAlert] = useState(null);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      console.warn('Failed to fetch notifications:', e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();

      // Setup Server-Sent Events for live push
      const eventSource = new EventSource('/api/notifications/stream');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'new_high_risk_alert') {
            setLatestAlert({
              type: 'high_risk',
              message: `🚨 Emergency: High-risk ${data.species?.toUpperCase()} reported in ${data.village || 'vicinity'} (${data.reportNumber})`,
              timestamp: data.timestamp
            });
            fetchNotifications();
          } else if (data.event === 'hotspot_detected') {
            setLatestAlert({
              type: 'hotspot',
              message: `⚡ Surveillance Alert: ${data.hotspotName} detected (${data.totalReports} cases, ${data.highRiskCount} high-risk)`,
              timestamp: data.timestamp
            });
            fetchNotifications();
          }
        } catch (err) {
          // Heartbeat or ping
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const dismissLatestAlert = () => {
    setLatestAlert(null);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      latestAlert,
      dismissLatestAlert,
      markAsRead,
      markAllAsRead,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
