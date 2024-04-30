import React from 'react';
import { Image } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';

const Logo = () => {
  const { colorMode } = useColorMode();
  const logoImage = colorMode === 'light' ? '/images/logo/logo-light.png' : '/images/logo/logo-dark.png';

  return (
    <RouterLink to="/">
      <Image src={`${process.env.PUBLIC_URL}${logoImage}`} alt="Logo" boxSize={{ base: "200px", md: "275px" }} objectFit="contain" />
    </RouterLink>
  );
};

export default Logo;
