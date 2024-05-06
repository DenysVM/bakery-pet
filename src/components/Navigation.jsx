import React, { useRef } from 'react';
import {
  Box,
  Flex,
  useColorMode,
  Stack,
  useDisclosure,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

import useOutsideClick from '../hooks/useOutsideClick';
import LanguageSelector from './LanguageSelector';
import UserSection from './UserSection';
import ProductCart from './Product/ProductCart'; 
import Logo from './common/Logo';
import NavLinks from './common/NavLinks';
import BurgerMenu from './common/BurgerMenu';

const Navigation = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const menuRef = useRef();
  useOutsideClick(menuRef, () => isOpen && onToggle());
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation(); 
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box ref={menuRef} px={4} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'gray.600' : 'white'}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
      {!isMobile && (
          <Flex flexShrink={0}>
            <NavLinks onNavigate={onClose} />
          </Flex>
        )}
        <BurgerMenu isOpen={isOpen} toggleMenu={onToggle} label={t('openMenu')} />
        <Logo />
        <Flex alignItems={'center'}>
          <IconButton icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} isRound='true' onClick={toggleColorMode} mr={4} />
          <LanguageSelector />
          <ProductCart />
          <UserSection />
          </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ baseм: 'block', md: 'none' }}>
          <Stack spacing={4} as="nav">
            <NavLinks onNavigate={onClose} />
          </Stack>
        </Box>
              )}
    </Box>
  );
};

export default Navigation;