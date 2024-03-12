// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
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

import Homemix from './mixComponet/Homemix';
import ProfileSet from './dashboard/Profile/ProfileSet';
import Settings from './Settings/Setting';
import Searchmix from './mixComponet/Searchmix';
import CreatePost from './Post/CreatePost';
import Chat from './Chat/Chat';

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

          <Route
            path="/:username"
            element={
              isAuthenticated ? (
                <ProfileRoute />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <p>Please log in to view profiles.</p> <Link to="/login">Go to Login</Link>
                  </div>
                </div>
              )
            }
          />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </DarkModeProvider>
    </BrowserRouter>
  );
};

export default App;