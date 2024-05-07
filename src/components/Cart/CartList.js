import React from 'react';
import { Box } from '@chakra-ui/react';
import { CartItem, useCart } from '../Cart';

const CartList = () => {
  const { cartItems } = useCart();

  return (
    <Box>
      {cartItems.length > 0 ? (
        cartItems.map(item => (
          <CartItem key={item.id} item={item} />
        ))
      ) : (
        <Box textAlign="center" py="6">
          Your cart is empty.
        </Box>
      )}
    </Box>
  );
};

export default CartList;
