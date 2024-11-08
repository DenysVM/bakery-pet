// common/LoadingError.js
import React from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';

const LoadingError = ({ loading, error, errorMessage, loadingMessage }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
        {loadingMessage && <Text ml="4">{loadingMessage}</Text>}
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl" color="red.500">
          {errorMessage}
        </Text>
      </Box>
    );
  }

  return null;
};

export default LoadingError;
