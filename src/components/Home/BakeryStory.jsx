import React from 'react';
import { Box, Text, Heading, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const BakeryStory = () => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('pink.50', 'pink.900');
  const textColor = useColorModeValue('gray.700', 'gray.100');

  return (
    <Box bg={bgColor} p={5} borderRadius="lg" boxShadow="lg" mt={1}>
      <Heading mb={4} color={textColor} textAlign="center"> {t('story.title')}</Heading>
      <Text color={textColor} textAlign="justify">{t('story.description')}</Text>
    </Box>
  );
};

export default BakeryStory;
