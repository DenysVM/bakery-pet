import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { CartList, CartSummary, CheckoutForm } from '../components/Cart';

const CartPage = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <Box mt="4em" p="2">
      <CartList />
      <CartSummary onCheckout={() => setIsCheckoutOpen(true)} />
      {isCheckoutOpen && <CheckoutForm onClose={() => setIsCheckoutOpen(false)} />}
    </Box>
  );
};

export default CartPage;
