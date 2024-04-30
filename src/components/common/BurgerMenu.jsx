import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const BurgerMenu = ({ isOpen, toggleMenu }) => {
  return (
    <IconButton
      size={'md'}
      icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      display={{ base: 'block', md: 'none' }}
      onClick={toggleMenu}
      isRound='true'
    />
  );
};

export default BurgerMenu;
