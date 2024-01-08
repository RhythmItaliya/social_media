import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ condition, children }) => {
    return condition ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
