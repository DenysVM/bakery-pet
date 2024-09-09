import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import AdminDashboard from '../../components/admin/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>
        Admin Dashboard
      </Heading>
      <AdminDashboard />
    </Box>
  );
};

export default AdminDashboardPage;
