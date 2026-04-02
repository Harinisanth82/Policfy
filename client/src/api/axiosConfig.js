import axios from 'axios';
import store from '../redux/store';
import { logout } from '../redux/userSlice';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
    timeout: 15000, // Increased timeout for better stability
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            let token = user?.token || user?.accessToken || user?.data?.token;

            if (!token) {
                const persistRoot = JSON.parse(localStorage.getItem('persist:root'));
                if (persistRoot?.user) {
                    const userSlice = JSON.parse(persistRoot.user);
                    token = userSlice?.currentUser?.token || userSlice?.token;
                }
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            // Silently fail if JSON parsing or localStorage access fails
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
