import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/Login';
import SignupPage from './components/auth/Signup';
import VerifyEmail from './components/auth/VerifyEmail';
import UserLayout from './components/layout/UserLayout';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import Category from './pages/Category';
import Expense from './pages/Expense';
import DashboardOverview from './pages/DashboardOverview';
import Budget from './pages/Budget';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route index element={<DashboardOverview />} />
        <Route path="category" element={<Category />} />
        <Route path="expense" element={<Expense />} />
        <Route path="budget" element={<Budget />} />
      </Route>
    </Routes>
  );
};

export default App;
