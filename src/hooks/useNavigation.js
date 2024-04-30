import { useDisclosure } from '@chakra-ui/react';

export const useNavigation = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const toggleMenu = () => onToggle();
  const closeMenu = () => onClose();

  return {
    isOpen,
    toggleMenu,
    closeMenu,
  };
};
