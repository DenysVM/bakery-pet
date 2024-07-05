import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const DeleteOrderItem = ({ isOpen, onClose, item, orderId, onDelete }) => {
  const { t } = useTranslation();

  const handleDelete = async () => {
    await onDelete(item._id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('order.confirmDelete')}</ModalHeader>
        <ModalBody>
          {t('order.deleteItem')}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>{t('order.cancel')}</Button>
          <Button colorScheme="red" ml={3} onClick={handleDelete}>
            {t('order.delete')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteOrderItem;
