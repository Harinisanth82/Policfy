import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, googleLogin as apiGoogleLogin, getMe } from '../api';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from '../redux/userSlice';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check for token in localStorage on init
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
            dispatch(loginSuccess(user));
        }
    }, [dispatch]);

    const login = async (email, password) => {
        dispatch(loginStart());
        try {
            const data = await apiLogin(email, password);
            setCurrentUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            dispatch(loginSuccess(data));
            return data;
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
            throw new Error(err.response?.data?.message || 'Login failed');
        }
    };

    const signup = async (name, email, password) => {
        dispatch(loginStart());
        try {
            const data = await apiRegister({ name, email, password });
            setCurrentUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            dispatch(loginSuccess(data));
            return data;
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || 'Signup failed'));
            throw new Error(err.response?.data?.message || 'Signup failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        dispatch(logoutAction());
    };

    const googleLogin = async (code) => {
        dispatch(loginStart());
        try {
            const data = await apiGoogleLogin(code);
            setCurrentUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            dispatch(loginSuccess(data));
            return data;
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || 'Google Login failed'));
            throw new Error(err.response?.data?.message || 'Google Login failed');
        }
    };

    const loginWithToken = async (token) => {
        dispatch(loginStart());
        try {
            // Store token temporarily to allow axios interceptor to pick it up
            localStorage.setItem('user', JSON.stringify({ token }));

            // Get user details
            const data = await getMe();

            // Combine user data with token
            const userData = { ...data, token };

            setCurrentUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            dispatch(loginSuccess(userData));
            return userData;
        } catch (err) {
            localStorage.removeItem('user');
            dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
            throw err;
        }
    };

    const value = {
        currentUser,
        login,
        signup,
        googleLogin,
        loginWithToken,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
