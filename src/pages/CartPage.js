import React from 'react';
import { Box } from '@chakra-ui/react';
import { CartList, CartSummary } from '../components/Cart';

const CartPage = () => {

  return (
    <Box mt="4em" p="2">
      <CartList />
      <CartSummary />
    </Box>
  );
};

export default CartPage;
