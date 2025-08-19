import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/Login';
import SignupPage from './components/auth/Signup';
import VerifyEmail from './components/auth/VerifyEmail';
import Dashboard from './components/admin/Dashboard';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
const App = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute>  <Dashboard />   </ProtectedRoute>} />

      </Routes>
  );
};

export default App;
