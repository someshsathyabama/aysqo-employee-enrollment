import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    if (response.data && response.data.data) {
      const { token, user } = response.data.data;
      if (token) {
        localStorage.setItem('aysqo_session_token', token);
      }
      if (user) {
        localStorage.setItem('aysqo_user_cache', JSON.stringify(user));
      }
      return response.data.data;
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Continue cleanup regardless
    } finally {
      localStorage.removeItem('aysqo_session_token');
      localStorage.removeItem('aysqo_user_cache');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};
