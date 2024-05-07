import React from 'react';
import { Box, Button, Text, useColorModeValue } from '@chakra-ui/react';
import { useCart } from '../Cart'; // Импорт через index.js
import { useTranslation } from 'react-i18next';

const CartSummary = () => {
  const { cartItems } = useCart();
  const { t } = useTranslation();
  const bg = useColorModeValue('gray.100', 'gray.700'); 
  const color = useColorModeValue('black', 'white'); 

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <Box p="4" bg={bg} color={color} mb="4" rounded="md" boxShadow="base">
      <Text fontSize="2xl" mb="4">{t('cart.cartSummary')}</Text>
      <Text fontSize="xl">{t('cart.totalItems')}: <strong>{totalItems}</strong></Text>
      <Text fontSize="xl" mb="4">{t('cart.totalPrice')}: <strong>${totalPrice.toFixed(2)}</strong></Text>
      <Button colorScheme="blue" width="full" onClick={() => alert(t('cart.proceedToCheckout'))}>
        {t('cart.proceedToCheckout')}
      </Button>
    </Box>
  );
};

export default CartSummary;
