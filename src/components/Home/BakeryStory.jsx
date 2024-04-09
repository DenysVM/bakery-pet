import React from 'react';
import { Box, Text, Heading, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const BakeryStory = () => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('pink.50', 'pink.900');
  const textColor = useColorModeValue('gray.700', 'gray.100');

  return (
    <Box bg={bgColor} p={5} borderRadius="lg" boxShadow="lg">
      <Heading mb={4} color={textColor}>{t('story.title')}</Heading>
      <Text color={textColor}>{t('story.description')}</Text>
    </Box>
  );
};

export default BakeryStory;
