import axios from 'axios';
import store from '../redux/store';
import { logout } from '../redux/userSlice';

const getBaseURL = () => {
    let url = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    if (url.includes('onrender.com') && !url.endsWith('/api')) {
        url = url.endsWith('/') ? url + 'api' : url + '/api';
    }
    return url;
};

const instance = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000, // 30s timeout to handle Render free tier spin-up
});

// Request interceptor
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
        } catch (err) {}
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            store.dispatch(logout());
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
