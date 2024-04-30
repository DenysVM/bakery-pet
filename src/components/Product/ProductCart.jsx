import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { MdShoppingCart } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProductCart = () => {
  const { t } = useTranslation();
  return (
    <IconButton
      as={RouterLink}
      to="/cart"
      isRound='true'
      icon={<MdShoppingCart />}
      aria-label={t('cart')}
      mr={4}
    />
  );
};

export default ProductCart;
