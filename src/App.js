import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { store } from './store/store';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AccountPage from './pages/AccountPage';
import { CartProvider } from './components/Cart';

import './i18n/i18n';
import CartPage from './pages/CartPage';

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <CartProvider> 
          <Router>
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </Router>
        </CartProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
