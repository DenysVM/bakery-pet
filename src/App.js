import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { store } from './store/store';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import './i18n/i18n';


function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Router basename="/bakery-pet">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
