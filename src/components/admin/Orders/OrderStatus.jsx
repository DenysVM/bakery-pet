// src/components/Admin/Order/OrderStatus.jsx

import React, { useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import { updateOrderStatus } from '../../../services/orderService';
import { useTranslation } from 'react-i18next';

const OrderStatus = ({ order, token, onStatusUpdated, isMobile }) => {
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const statusOptions = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus, token);
      setStatus(newStatus);
      toast({
        title: t('order.statusUpdated'),
        description: t('order.statusUpdatedDescription', {
          orderId: order._id,
          status: t(`order.status.${newStatus}`),
        }),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      if (onStatusUpdated) {
        onStatusUpdated(order._id, newStatus);
      }
    } catch (error) {
      toast({
        title: t('order.errorUpdatingStatus'),
        description:
          error.message || t('order.errorUpdatingStatusDescription'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        variant="outline"
        isLoading={isUpdating}
        rightIcon={<FaChevronDown />}
      >
        {t(`order.status.${status}`)}
      </MenuButton>
      <MenuList>
        {statusOptions.map((option) => (
          <MenuItem key={option} onClick={() => handleStatusChange(option)}>
            {t(`order.status.${option}`)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default OrderStatus;
