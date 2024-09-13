import React, { useState, useEffect } from 'react';
import { Box, Button, Select, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { updateOrderStatus } from '../../../services/orderService';

const EditOrderStatus = ({ order, onUpdate }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(order.status);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Обновляем статус, когда получаем новый заказ или он изменяется
    setStatus(order.status);
  }, [order]);

  const handleStatusChange = async () => {
    setIsLoading(true);
    try {
      await updateOrderStatus(order._id, status);
      toast({
        title: t('order.statusUpdated'),
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onUpdate();  // Вызов функции для обновления списка или интерфейса
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: t('order.errorUpdatingStatus'),
        description: error.message || t('order.errorUpdatingStatus'),
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}  // Здесь обновляем состояние при изменении статуса
        mb={4}
        isDisabled={isLoading} // Блокируем выбор во время обновления
      >
        <option value="pending">{t('order.status.pending')}</option>
        <option value="processing">{t('order.status.processing')}</option>
        <option value="shipped">{t('order.status.shipped')}</option>
        <option value="delivered">{t('order.status.delivered')}</option>
        <option value="cancelled">{t('order.status.cancelled')}</option>
      </Select>
      <Button 
        onClick={handleStatusChange} 
        isLoading={isLoading} 
        colorScheme="blue"
        isDisabled={status === order.status} // Блокируем кнопку, если статус не изменился
      >
        {t('order.save')}
      </Button>
    </Box>
  );
};

export default EditOrderStatus;
