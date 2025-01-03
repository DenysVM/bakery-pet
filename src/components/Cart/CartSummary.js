import React, { useState } from 'react';
import { Box, Button, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { useCart } from '../Cart';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ onCheckout }) => {
  const { cartItems } = useCart();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const bg = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('black', 'white');

  const [isCheckoutVisible, setCheckoutVisible] = useState(true);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleCheckout = () => {
    if (user) {
      setCheckoutVisible(false);
      onCheckout();
    } else {
      toast({
        title: t('cart.authRequired'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      navigate('/auth');
    }
  };

  return (
    <>
      {totalItems > 0 && (
        <Box p="4" bg={bg} color={color} mb="4" rounded="md" boxShadow="base">
          <Text fontSize="lg" mb="4">{t('cart.cartSummary')}</Text>
          <Text fontSize="md">{t('cart.totalItems')}: <strong>{totalItems}</strong></Text>
          <Text fontSize="md" mb="4">{t('cart.totalPrice')}: <strong>${totalPrice.toFixed(2)}</strong></Text>
          {isCheckoutVisible && (
            <Button colorScheme="blue" onClick={handleCheckout} mx="auto" display="block">
              {t('cart.proceedToCheckout')}
            </Button>
          )}
          {!isCheckoutVisible && (
            <Text fontSize="sm" mt="4" textAlign="center" fontWeight="semibold">
              {t('cart.selectDeliveryOption')}
            </Text>
          )}
        </Box>
      )}
    </>
  );
  
};

export default CartSummary;
