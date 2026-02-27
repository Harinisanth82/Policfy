import axios from './axiosConfig';

// Auth Services
export const googleLogin = async (code) => {
    const response = await axios.post('/auth/google', { code });
    return response.data;
};

export const login = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
};

export const getMe = async () => {
    const response = await axios.get('/auth/me');
    return response.data;
};

// User Services
export const getAllUsers = async () => {
    const response = await axios.get('/users');
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await axios.put(`/users/edit/${id}`, userData);
    return response.data;
};

export const getUserProfile = async () => {
    const response = await axios.get('/users/profile');
    return response.data;
};

export const createAdmin = async (adminData) => {
    const response = await axios.post('/users/admin', adminData);
    return response.data;
};

// Policy Services
export const getAllPolicies = async () => {
    const response = await axios.get('/policies');
    return response.data;
};

export const getPolicyById = async (id) => {
    const response = await axios.get(`/policies/${id}`);
    return response.data;
};

export const createPolicy = async (policyData) => {
    const response = await axios.post('/policies', policyData);
    return response.data;
};

export const updatePolicy = async (id, policyData) => {
    const response = await axios.put(`/policies/${id}`, policyData);
    return response.data;
};

export const deletePolicy = async (id) => {
    const response = await axios.delete(`/policies/${id}`);
    return response.data;
};

// Application Services
export const applyForPolicy = async (applicationData) => {
    const response = await axios.post('/applications/apply', applicationData);
    return response.data;
};

export const getUserApplications = async (userId) => {
    const response = await axios.get(`/applications/user/${userId}`);
    return response.data;
};

export const getAllApplications = async () => {
    const response = await axios.get('/applications');
    return response.data;
};

export const updateApplicationStatus = async (id, status) => {
    const response = await axios.put(`/applications/${id}/status`, { status });
    return response.data;
};

export const deleteApplication = async (id) => {
    const response = await axios.delete(`/applications/${id}`);
    return response.data;
};

// Dashboard Services
export const getUserStats = async () => {
    const response = await axios.get('/dashboard/user-stats');
    return response.data;
};

export const getAdminStats = async () => {
    const response = await axios.get('/dashboard/admin-stats');
    return response.data;
};
