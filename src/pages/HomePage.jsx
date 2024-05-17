import React from 'react';
import { Box } from '@chakra-ui/react';
import BakeryStory from '../components/Home/BakeryStory'; 
import Contacts from '../components/Home/Contacts';

const HomePage = () => {
  return (
    <Box mt="3.7em" p="1">
      <BakeryStory/>
      <Contacts />
    </Box>
  );
};

export default HomePage;
