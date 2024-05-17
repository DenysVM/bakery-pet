// src/pages/AuthPage.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import LoginForm from '../auth/LoginForm';

const AuthPage = () => {
  return (
    <Box p={4}>
      <LoginForm />
    </Box>
  );
};

export default AuthPage;
