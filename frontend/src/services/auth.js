import api from './api';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const login = async (username, password) => {
    const response = await api.post('/token/', { username, password });
    localStorage.setItem(TOKEN_KEY, response.data.access);
    localStorage.setItem(REFRESH_KEY, response.data.refresh);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};
