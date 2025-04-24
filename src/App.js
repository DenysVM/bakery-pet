import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppProviders from './AppProviders';
import Navigation from './components/Navigation';
import { AuthPage, AccountPage, CartPage, HomePage, CatalogPage, SignupPage, VerifyEmailPage } from './pages';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import './i18n/i18n';

function App() {
  return (
    <AppProviders>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;
