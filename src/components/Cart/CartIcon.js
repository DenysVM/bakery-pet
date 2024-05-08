import React from 'react';
import { IconButton, Badge } from '@chakra-ui/react';
import { MdShoppingCart } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from './CartContext'; 
import { useTranslation } from 'react-i18next';

const CartIcon = () => {
  const { cartItems } = useCart();
  const { t } = useTranslation();

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <IconButton
      as={RouterLink}
      to="/cart"
      isRound='true'
      icon={
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <MdShoppingCart />
          {itemCount > 0 && (
            <Badge colorScheme="green" variant="solid" borderRadius="full" ml="-1" mb="-3" fontSize="0.8em">
              {itemCount}
            </Badge>
          )}
        </span>
      }
      aria-label={t('cart.cart')}
      mr={4}
    />
  );
};

export default CartIcon;
