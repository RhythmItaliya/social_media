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
import NotFound from './others/NotFound';
import ProfileRoute from './PublicCard/ProfileRoute';
import { DarkModeProvider } from './theme/Darkmode';
import ProfilePage from './dashboard/LoginProfile/ProfilePage';

import VerticalTabs from './dashboard/Tab/VerticalTabs';
import Terms from './pages/Terms';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

import '../src/loading.css';

// ADMIN
import AdminLoginPage from './Admin/AdminAuthPages/AdminLogin';
import AdminRegister from './Admin/AdminAuthPages/AdminRegister';
import AdminForgotPassword from './Admin/AdminAuthPages/AdminForgotPassword';
import AdminVerifylogin from './Admin/AdminAuthPages/AdminVerifylogin';
import AdminResetPassword from './Admin/AdminAuthPages/AdminResetPassword';
import AdminDash from './Admin/AdminDash';
import HashtagComponent from './Post/HashTag/HashtagComponent';

const App = () => {
  const [cookies] = useCookies(['auth', 'X-Access-Token', 'token']);
  // const isAuthenticated = !!cookies.auth;
  const isAuthenticated = !!cookies.auth || !!cookies['X-Access-Token'] || !!cookies.token;

  return (
    <BrowserRouter>
      <GlobalLoading />
      <DarkModeProvider>
        <Routes>
          {isAuthenticated ? (
            <Route path="/login" element={<Navigate to="/home" replace />} />
          ) : (
            <Route path="/login" element={<Login />} />
          )}

          <Route path="/profile/create" element={<ProfilePage />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/verify/login/:token" element={<VerifyLogin />} />
          <Route path="/reset/password/:token" element={<ResetPassword />} />

          <Route
            path="/home"
            element={<ProtectedRoute condition={isAuthenticated}><Dashboard /></ProtectedRoute>}
          />

          <Route path="/post" element={<ProtectedRoute condition={isAuthenticated}> <VerticalTabs /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute condition={isAuthenticated}><VerticalTabs /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute condition={isAuthenticated}><VerticalTabs /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute condition={isAuthenticated}><VerticalTabs /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute condition={isAuthenticated}><VerticalTabs /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute condition={isAuthenticated}><VerticalTabs /></ProtectedRoute>} />

          <Route path="/:username" element={<ProfileRoute />} />

          <Route path="/hashtags/:hashtag" element={<ProtectedRoute condition={isAuthenticated}><HashtagComponent /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />

          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />


          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/forgotPassword" element={<AdminForgotPassword />} />
          <Route path="/admin/verify/login/:token" element={<AdminVerifylogin />} />
          <Route path="/admin/reset/password/:token" element={<AdminResetPassword />} />
          <Route path="/admin" element={<AdminDash />} />

        </Routes>
      </DarkModeProvider>
    </BrowserRouter>
  );
};

export default App;