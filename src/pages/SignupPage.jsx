// src/pages/SignupPage.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import SignupForm from '../auth/SignupForm';

const SignupPage = () => {
  return (
    <Box p={4}>
      <SignupForm />
    </Box>
  );
};

export default SignupPage;
