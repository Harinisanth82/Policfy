import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
    const { currentUser } = useSelector((state) => state.user);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // Simple role check, expand as needed
    // if (role && currentUser.role !== role) {
    //     return <Navigate to="/" />; 
    // }

    return children;
};

export default ProtectedRoute;
