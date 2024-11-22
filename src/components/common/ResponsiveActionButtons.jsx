import React from 'react';
import { Button, IconButton, ButtonGroup, useBreakpointValue } from '@chakra-ui/react';

const ResponsiveActionButtons = ({
  buttons,
  size = 'md',
  variant = 'outline',
  spacing = 4,
  isAttached = false,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return isMobile ? (
    <ButtonGroup size={size} isAttached={isAttached} variant={variant}>
      {buttons.map((button, index) => (
        <IconButton
          key={index}
          icon={button.icon}
          aria-label={button.label}
          onClick={button.onClick}
          colorScheme={button.colorScheme}
          isLoading={button.isLoading}
        />
      ))}
    </ButtonGroup>
  ) : (
    <ButtonGroup size={size} spacing={spacing} variant={variant}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          leftIcon={button.icon}
          onClick={button.onClick}
          colorScheme={button.colorScheme}
          isLoading={button.isLoading}
        >
          {button.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ResponsiveActionButtons;
