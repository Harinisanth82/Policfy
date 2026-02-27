import axios from 'axios';

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

export default instance;
