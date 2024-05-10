import React from 'react';
import { Image, Box } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';

const Logo = () => {
  const { colorMode } = useColorMode();
  const logoImage = colorMode === 'light' ? '/images/logo/logo-light.png' : '/images/logo/logo-dark.png';

  return (
    <RouterLink to="/">
      <Box height="100%" display="flex" alignItems="center" justifyContent="center" px={2}>
        <Image
          src={`${process.env.PUBLIC_URL}${logoImage}`}
          alt="Logo"
          maxHeight={{ base: "3rem", md: "3.8rem" }} 
          width="auto" 
          objectFit="cover"
        />
      </Box>
    </RouterLink>
  );
};

export default Logo;
