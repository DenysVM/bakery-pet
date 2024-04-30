import React from 'react';
import { Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavLinks = ({ onNavigate }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <Text as={RouterLink} to="/" onClick={onNavigate}>{t('home')}</Text>
      <Text as={RouterLink} to="/catalog" onClick={onNavigate}>{t('products')}</Text>
    </>
  );
};

export default NavLinks;
