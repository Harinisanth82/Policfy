import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import MainLayout from './components/MainLayout';

// Auth Pages
import Authentication from './pages/auth/Authentication';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import ViewPolicies from './pages/user/ViewPolicies';
import PolicyDetails from './pages/user/PolicyDetails';
import MyApplications from './pages/user/MyApplications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import Policies from './pages/admin/Policies';
import Applications from './pages/admin/Applications';
import AddPolicy from './pages/admin/AddPolicy';
import EditPolicy from './pages/admin/EditPolicy';
import AddAdmin from './pages/admin/AddAdmin';
import NotFound from './pages/NotFound';
import DashboardRedirect from './components/DashboardRedirect';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <ThemeContextProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Routes - No Layout */}
                        <Route path="/auth" element={<Authentication />} />
                        <Route path="/login" element={<Authentication />} />
                        <Route path="/signup" element={<Authentication />} />

                        {/* Protected Routes - With Layout */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }>

                            {/* Admin Routes */}
                            <Route index element={<DashboardRedirect />} />
                            <Route path="admin/dashboard" element={<AdminDashboard />} />
                            <Route path="admin/users" element={<Users />} />
                            <Route path="admin/policies" element={<Policies />} />
                            <Route path="admin/add-policy" element={<AddPolicy />} />
                            <Route path="admin/edit-policy/:id" element={<EditPolicy />} />
                            <Route path="admin/applications" element={<Applications />} />
                            <Route path="admin/add-admin" element={<AddAdmin />} />

                            {/* User Routes */}
                            <Route path="user/dashboard" element={<UserDashboard />} />
                            <Route path="user/policies" element={<ViewPolicies />} />
                            <Route path="user/policy/:id" element={<PolicyDetails />} />
                            <Route path="user/my-applications" element={<MyApplications />} />
                        </Route>

                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeContextProvider>
    );
}

export default App;
