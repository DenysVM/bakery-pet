import React, { useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  useColorMode,
  useDisclosure,
  HStack,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import useOutsideClick from '../hooks/useOutsideClick';
import LanguageSelector from './LanguageSelector';
import UserSection from './UserSection';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const { isOpen, onToggle } = useDisclosure();
  const menuRef = useRef();
  useOutsideClick(menuRef, () => isOpen && onToggle());
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation(); 

  const logoImage = colorMode === 'light' ? '/images/logo/logo-light.png' : '/images/logo/logo-dark.png';

  return (
    <Box ref={menuRef} px={4} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'gray.600' : 'white'}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={t('openMenu')}
          display={{ md: 'none' }}
          onClick={onToggle}
        />
        <HStack spacing={8} alignItems={'center'}>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Text as={RouterLink} to="/">{t('home')}</Text>
            <Text as={RouterLink} to="/catalog">{t('products')}</Text>
          </HStack>
        </HStack>
        <Image src={`${process.env.PUBLIC_URL}${logoImage}`} alt={t('logo')} boxSize={{ base: "200px", md: "275px" }} objectFit="contain" />

        <Flex alignItems={'center'}>
          <IconButton icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} isRound='true' onClick={toggleColorMode} mr={4} />
          <LanguageSelector />
          {!isMobile && <UserSection />}
        </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            <Text as={RouterLink} to="/">{t('home')}</Text>
            <Text as={RouterLink} to="/catalog">{t('products')}</Text>
            {isMobile && <UserSection />}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Navigation;
