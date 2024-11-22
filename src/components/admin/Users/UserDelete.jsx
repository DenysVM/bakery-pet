import React from 'react';
import { Text, useDisclosure } from '@chakra-ui/react';
import UserDeleteConfirmationDialog from './UserComponents/UserDeleteConfirmationDialog';
import { deleteUser } from '../../../services/userService';
import { useAuth } from '../../../auth/AuthContext';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const UserDelete = ({ userId, onDeleteSuccess, onClose, userName }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const toast = useToast();
  const { isOpen, onClose: closeDialog } = useDisclosure({ defaultIsOpen: true });

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userId, token);
      toast({
        title: t('userList.deleteSuccess'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onDeleteSuccess(userId);
      closeDialog();
    } catch (error) {
      toast({
        title: t('userList.deleteError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <UserDeleteConfirmationDialog
      isOpen={isOpen}
      onClose={() => {
        closeDialog();
        onClose();
      }}
      onConfirm={handleConfirmDelete}
      userName={userName}
    >
       <Text>{t('userDelete.confirmMessage', { userName })}</Text>
    </UserDeleteConfirmationDialog>
  );
};

export default UserDelete;
