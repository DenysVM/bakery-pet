import React from 'react';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const ColorSchemeSelector = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      isRound={true}
      onClick={toggleColorMode}
      aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      variant="ghost"
    />
  );
};

export default ColorSchemeSelector;
