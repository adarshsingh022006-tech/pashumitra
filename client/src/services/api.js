import axios from 'axios';
import { fallbackData } from './fallbackData';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pashurakshak_token') || localStorage.getItem('pashumitra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If running in standalone cloud deployment without live backend, gracefully mock
    const { url, method } = error.config || {};

    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      if (url?.includes('/auth/login')) {
        const data = JSON.parse(error.config.data || '{}');
        const user = fallbackData.users[data.email] || fallbackData.users['farmer@demo.com'];
        return Promise.resolve({ data: { user, token: 'demo_token_' + user.role } });
      }

      if (url?.includes('/auth/me')) {
        const saved = localStorage.getItem('pashurakshak_user') || localStorage.getItem('pashumitra_user');
        const user = saved ? JSON.parse(saved) : fallbackData.users['farmer@demo.com'];
        return Promise.resolve({ data: { user } });
      }

      if (url?.includes('/hotspots')) {
        return Promise.resolve({ data: { hotspots: fallbackData.hotspots } });
      }

      if (url?.includes('/weather')) {
        return Promise.resolve({
          data: {
            weather: {
              temp: 33,
              humidity: 62,
              wind_speed: 12,
              description: 'clear sky',
              environmental_notice: 'Weather is shown as environmental context, not a disease diagnosis.'
            }
          }
        });
      }

      if (url?.includes('/analytics/summary')) {
        return Promise.resolve({
          data: {
            summary: {
              totalReports: 39,
              highRiskCount: 10,
              activeHotspots: 1,
              visitsScheduled: 5,
              resolvedCases: 12,
              totalMortality: 3
            }
          }
        });
      }

      if (url?.includes('/analytics/districts')) {
        return Promise.resolve({ data: { districts: fallbackData.districts } });
      }

      if (url?.includes('/analytics/mortality-stats')) {
        return Promise.resolve({ data: { officialMortalityData: fallbackData.officialMortalityData } });
      }

      if (url?.includes('/analytics/trends')) {
        return Promise.resolve({
          data: {
            trends: [
              { date: '2026-10-02', day: 'Wed', highRisk: 2, mediumRisk: 5, lowRisk: 3 },
              { date: '2026-10-03', day: 'Thu', highRisk: 3, mediumRisk: 6, lowRisk: 4 },
              { date: '2026-10-04', day: 'Fri', highRisk: 4, mediumRisk: 7, lowRisk: 4 },
              { date: '2026-10-05', day: 'Sat', highRisk: 2, mediumRisk: 6, lowRisk: 5 },
              { date: '2026-10-06', day: 'Sun', highRisk: 5, mediumRisk: 8, lowRisk: 4 },
              { date: '2026-10-07', day: 'Mon', highRisk: 3, mediumRisk: 6, lowRisk: 5 },
              { date: '2026-10-08', day: 'Tue', highRisk: 4, mediumRisk: 7, lowRisk: 4 }
            ]
          }
        });
      }

      if (url?.includes('/reports') && method === 'get') {
        if (url?.includes('/reports/1') || url?.includes('Case') || url?.includes('/reports/')) {
          return Promise.resolve({
            data: {
              report: fallbackData.case36,
              visits: [{ id: 1, scheduled_date: 'Tomorrow', scheduled_time: '10:30 AM', status: 'scheduled', notes: 'Urgent mobile clinic dispatched.' }],
              treatments: []
            }
          });
        }
        return Promise.resolve({ data: { reports: [fallbackData.case36] } });
      }

      if (url?.includes('/animals')) {
        return Promise.resolve({ data: { animals: fallbackData.animals, animal: fallbackData.animals[0], reports: [fallbackData.case36] } });
      }

      if (url?.includes('/notifications')) {
        return Promise.resolve({
          data: {
            notifications: [
              { id: 1, title: '🚨 High-Risk Case Alert: COW (Case #0036)', message: 'High-risk case reported at Samrala requiring priority veterinary action.', is_read: false, created_at: new Date() },
              { id: 2, title: '⚡ Possible Outbreak Hotspot Warning', message: 'Surveillance alert: 28 reports (7 high-risk) in 5 km radius.', is_read: false, created_at: new Date() }
            ],
            unreadCount: 2
          }
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
