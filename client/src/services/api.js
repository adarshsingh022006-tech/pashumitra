import axios from 'axios';
import { handleMockRequest } from './mockBackend';

const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const hasBackendUrl = Boolean(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('pashurakshak_token') || localStorage.getItem('pashumitra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If in cloud standalone mode without live backend, bypass network to avoid static server 405/404 errors
  if (!isLocal && !hasBackendUrl) {
    config.adapter = async (cfg) => {
      const mockRes = await handleMockRequest(cfg);
      return {
        data: mockRes.data,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config: cfg,
        request: {}
      };
    };
  }

  return config;
});

api.interceptors.response.use(
  async (response) => {
    // If response returned HTML instead of JSON (e.g. static rewrite returning index.html)
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!doctype') || response.data.includes('<html'))
    ) {
      const mockRes = await handleMockRequest(response.config);
      return {
        ...response,
        data: mockRes.data,
      };
    }
    return response;
  },
  async (error) => {
    // If request failed with 405 (Method Not Allowed on static file), 404, 500, or network error
    if (
      error.code === 'ERR_NETWORK' ||
      !error.response ||
      [400, 404, 405, 500, 502, 503, 504].includes(error.response?.status)
    ) {
      try {
        const mockRes = await handleMockRequest(error.config || {});
        return {
          data: mockRes.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config,
        };
      } catch (mockErr) {
        return Promise.reject(mockErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
