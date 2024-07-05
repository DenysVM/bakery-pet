// src/components/Cart/CartList.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import { CartItem, useCart } from '../Cart';
import { useTranslation } from 'react-i18next';

const CartList = () => {
  const { cartItems } = useCart();
  const { t } = useTranslation();

  return (
    <Box>
      {cartItems.length > 0 ? (
        cartItems.map(item => (
          <CartItem key={item.id} item={item} />
        ))
      ) : (
        <Box textAlign="center" py="6">
          {t('cart.emptyCart')}
        </Box>
      )}
    </Box>
  );
};

export default CartList;
