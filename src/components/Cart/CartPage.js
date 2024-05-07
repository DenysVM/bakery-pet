import React from 'react';
import { Box } from '@chakra-ui/react';
import { CartList, CartSummary } from '../Cart';

const CartPage = () => {

  return (
    <Box p="4">
      <CartList />
      <CartSummary />
    </Box>
  );
};

export default CartPage;
