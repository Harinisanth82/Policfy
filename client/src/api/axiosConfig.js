import axios from 'axios';
import store from '../redux/store';
import { logout } from '../redux/userSlice';

const instance = axios.create({
    baseURL: 'https://policfy-api.onrender.com/api',
    timeout: 10000,
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        try {
            let token = null;

            // 1. Check 'user' key directly
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                token = user?.token || user?.accessToken || user?.data?.token;
            }

            // 2. Check Redux Persist root if no token found
            if (!token) {
                const persistRoot = localStorage.getItem('persist:root');
                if (persistRoot) {
                    const root = JSON.parse(persistRoot);
                    if (root.user) {
                        const userSlice = JSON.parse(root.user);
                        token = userSlice?.currentUser?.token || userSlice?.token;
                    }
                }
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            console.error("Error retrieving token:", err);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            store.dispatch(logout());
            localStorage.removeItem('user');
            // Check if we are already on login page to avoid redirect loops
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
