import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppProviders from './AppProviders';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AccountPage from './pages/AccountPage';
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';
import CartPage from './pages/CartPage';
import './i18n/i18n';

function App() {
  return (
    <AppProviders> 
      <Router>
        <Navigation />
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
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
