import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to attach the secret profile UUID and transparently route versioned api endpoints
apiClient.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/api/') && !config.url.startsWith('/api/v1/')) {
    config.url = config.url.replace('/api/', '/api/v1/');
  }

  const profileId = localStorage.getItem('ej_profile_id');
  if (profileId) {
    config.headers['X-Profile-ID'] = profileId;
  }
  return config;
});
