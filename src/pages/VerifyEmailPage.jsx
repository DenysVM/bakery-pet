// src/pages/VerifyEmailPage.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import VerifyEmailForm from '../auth/VerifyEmailForm';

const VerifyEmailPage = () => {
  return (
    <Box p={4}>
      <VerifyEmailForm />
    </Box>
  );
};

export default VerifyEmailPage;
