import React from 'react';
import { Stack, Link, useColorModeValue } from '@chakra-ui/react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavLinks = ({ onNavigate }) => {
  const { t } = useTranslation();

  const linkColor = useColorModeValue('gray.800', 'white');
  const activeLinkColor = useColorModeValue('blue.800', 'blue.200');

  const links = [
    { to: "/", text: t('home') },
    { to: "/catalog", text: t('products') }
  ];

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={4}
      align="left"
    >
      {links.map((link) => (
        <Link
          key={link.to}
          as={RouterNavLink}
          to={link.to}
          onClick={onNavigate}
          fontSize="md"
          fontWeight="medium"
          color={linkColor}
          transition="all 0.3s ease-in-out"
          _hover={{
            transform: 'translateY(-2px)',
            color: 'blue.500'
          }}
          _focus={{
            outline: 'none',
          }}
          _activeLink={{
            color: activeLinkColor,
            fontWeight: 'bold'
          }}
        >
          {link.text}
        </Link>
      ))}
    </Stack>
  );
};

export default NavLinks;
