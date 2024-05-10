import React, { useRef } from 'react';
import {
  Box,
  Flex,
  useColorMode,
  Stack,
  useDisclosure,
  useBreakpointValue,
  Divider
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import useOutsideClick from '../hooks/useOutsideClick';
import LanguageSelector from './common/LanguageSelector';
import UserIcon from './User/UserIcon';
import CartIcon from './Cart/CartIcon'; 
import Logo from './common/Logo';
import NavLinks from './common/NavLinks';
import BurgerMenu from './common/BurgerMenu';
import ColorSchemeSelector from '../components/common/ColorSchemaSelector';

const Navigation = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const menuRef = useRef();
  useOutsideClick(menuRef, () => isOpen && onToggle());
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.100', dark: 'gray.700' };
  const color = { light: 'gray.600', dark: 'white' };
  const { t } = useTranslation(); 
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
    ref={menuRef}
    px={4}
    bg={bgColor[colorMode]}
    color={color[colorMode]}
    position="fixed"
    top={0}
    left={0}
    right={0}
    zIndex={10}
    boxShadow="0px 2px 5px rgba(0,0,0,0.1)"
    width="full"
    mb="1"
  >  
    <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        {!isMobile && (
          <Flex flexShrink={0}>
            <NavLinks onNavigate={onClose} />
          </Flex>
        )}
        <BurgerMenu isOpen={isOpen} toggleMenu={onToggle} label={t('openMenu')} />
        <Logo />
        <Flex alignItems={'center'}>
          {!isMobile && (
            <>
              <ColorSchemeSelector />
              <LanguageSelector />
            </>
          )}
          <CartIcon />
          <UserIcon />
        </Flex>
      </Flex>

      {isOpen && (
         <Box pb={4} display={{ base: 'block', md: 'none' }}>
         <Stack spacing={4} as="nav">
           <NavLinks onNavigate={onClose} />
           <Divider my={2} />
           <Flex alignItems="center" justifyContent="left" width="100%">
             <LanguageSelector />
             <ColorSchemeSelector />
           </Flex>
         </Stack>
       </Box>
      )}
    </Box>
  );
};

export default Navigation;
