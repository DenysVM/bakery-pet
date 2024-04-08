import React from 'react';
import { Box, Text, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CatalogHeader = () => {
  const { t } = useTranslation();

  return (
    <Box textAlign="center" my={6}>
      <Heading as="h1" size="xl" mb={4}>{t('catalog.title')}</Heading>
      <Text fontSize="lg">{t('catalog.description')}</Text>
    </Box>
  );
};

export default CatalogHeader;
