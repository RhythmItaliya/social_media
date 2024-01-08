// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/Forgotpassword';
import GlobalLoading from './others/GlobalLoading';
import ProtectedRoute from './auth/ProtectedRoute';
import VerifyLogin from './pages/Verifylogin';
import ResetPassword from './pages/Resetpassword';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['auth']);

  const isAuthenticated = !!cookies.auth;
  return (
    <BrowserRouter>
      <GlobalLoading />
      <Routes>

        {isAuthenticated ? (<Route path="/login" element={<Navigate to="/dashboard" replace />} />) : (<Route path="/login" element={<Login />} />)}

        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />

        <Route path="/verify/login/:token" element={<VerifyLogin />} />
        <Route path="/reset/password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute condition={isAuthenticated}> <Dashboard /> </ProtectedRoute>} />

        <Route path="*" element={isAuthenticated ? (<Navigate to="/dashboard" replace />) : (<Navigate to="/login" replace />)} />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;