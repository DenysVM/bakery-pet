import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './auth/AuthContext';
import { CartProvider } from './components/Cart'; 
import { store } from './store/store';

const AppProviders = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider>
        <CartProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </CartProvider>
      </ChakraProvider>
    </ReduxProvider>
  );
};

export default AppProviders;
