import React from 'react';
import { Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavLinks = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={4}
    >
      <Text as={RouterLink} to="/" onClick={onNavigate}>{t('home')}</Text>
      <Text as={RouterLink} to="/catalog" onClick={onNavigate}>{t('products')}</Text>
    </Stack>
  );
};

export default NavLinks;
