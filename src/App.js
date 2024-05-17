import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppProviders from './AppProviders';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
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
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;
