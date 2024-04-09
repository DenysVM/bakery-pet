import React from 'react';
import { VStack } from '@chakra-ui/react';
import BakeryStory from '../components/Home/BakeryStory'; // Убедитесь, что путь к компоненту верный

const HomePage = () => {
  return (
    <VStack spacing={8}>
      <BakeryStory />
      {/* Здесь могут быть другие компоненты главной страницы */}
    </VStack>
  );
};

export default HomePage;
