import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DashboardRedirect = () => {
    const { currentUser } = useSelector(state => state.user);

    if (currentUser?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    } else {
        return <Navigate to="/user/dashboard" replace />;
    }
};

export default DashboardRedirect;
