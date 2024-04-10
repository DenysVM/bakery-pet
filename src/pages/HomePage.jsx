import React from 'react';
import { VStack } from '@chakra-ui/react';
import BakeryStory from '../components/Home/BakeryStory'; 
import Contacts from '../components/Home/Contacts';
const HomePage = () => {
  return (
    <VStack spacing={8}>
      <BakeryStory />
      <Contacts />

    </VStack>
  );
};

export default HomePage;
