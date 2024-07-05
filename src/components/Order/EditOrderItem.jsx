import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  HStack
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { updateOrderItem } from '../../services/orderService';
import { useAuth } from '../../auth/AuthContext';

const EditOrderItem = ({ isOpen, onClose, item, orderId, onSave }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [quantity, setQuantity] = useState(item.quantity);
  const toast = useToast();

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
    }
  }, [item]);

  const handleSave = async () => {
    try {
      const updatedItem = await updateOrderItem(orderId, item._id, { quantity }, token);
      onSave(updatedItem);
      toast({
        title: t('order.itemUpdated'),
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onClose(); 
    } catch (error) {
      console.error('Error updating order item:', error);
      toast({
        title: t('order.errorUpdating'),
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx="4">
        <ModalHeader>{t('order.editItem')}</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>{t('order.quantity')}</FormLabel>
            <HStack justifyContent="center" spacing={4} alignItems="center">
              <Button onClick={handleDecrease} h="40px">-</Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                textAlign="center"
                maxW="50px"
                h="40px"
              />
              <Button onClick={handleIncrease} h="40px">+</Button>
            </HStack>
          </FormControl>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button onClick={onClose}>{t('order.cancel')}</Button>
          <Button colorScheme="blue" ml={3} onClick={handleSave}>
            {t('order.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditOrderItem;
