// src/components/Admin/Order/OrderList.jsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Text,
  Spinner,
  Button,
  IconButton,
  ButtonGroup,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react';
import { getAllOrders } from '../../../services/orderService';
import { useAuth } from '../../../auth/AuthContext';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { OrderStatus } from './'
import { useTranslation } from 'react-i18next';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, loadingAuth } = useAuth();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setError(t('auth.missingToken'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAllOrders(token);
      setOrders(data);
    } catch (err) {
      setError(t('order.errorFetching'));
      toast({
        title: t('order.errorFetching'),
        description: err.message || t('order.errorFetchingDescription'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast, t]);

  useEffect(() => {
    if (!loadingAuth && token) {
      fetchOrders();
    }
  }, [token, loadingAuth, fetchOrders]);

  if (loadingAuth) {
    return <Spinner size="xl" label={t('auth.checkingAuthorization')} />;
  }

  if (loading) {
    return <Spinner size="xl" label={t('order.loadingOrders')} />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box>
      {orders.map((order) => (
        <Box key={order._id} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
          <Text fontWeight="bold">{t('order.orderId')}: {order._id} - {new Date(order.createdAt).toLocaleDateString()}</Text>
          <Text>{t('order.total')}: ${order.total.toFixed(2)}</Text>
  

          {/* Кнопки действий */}
          <Box mt={2} display="flex" justifyContent="flex-start">
          <OrderStatus
              order={order}
              token={token}
              onStatusUpdated={(orderId, newStatus) => {
                setOrders((prevOrders) =>
                  prevOrders.map((o) =>
                    o._id === orderId ? { ...o, status: newStatus } : o
                  )
                );
              }}
            />
            <ButtonGroup size="sm" isAttached variant="outline">
              {isMobile ? (
                <>
                  <IconButton
                    icon={<FaEye />}
                    aria-label={t('order.viewDetails')}
                    onClick={() => console.log('View Details')}
                  />
                  <IconButton
                    icon={<FaEdit />}
                    aria-label={t('order.editOrder')}
                    onClick={() => console.log('Edit Order')}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    aria-label={t('order.deleteOrder')}
                    onClick={() => console.log('Delete Order')}
                  />
                </>
              ) : (
                <>
                  <Button onClick={() => console.log('View Details')}>{t('order.viewDetails')}</Button>
                  <Button onClick={() => console.log('Edit Order')}>{t('order.editOrder')}</Button>
                  <Button onClick={() => console.log('Delete Order')}>{t('order.deleteOrder')}</Button>
                </>
              )}
            </ButtonGroup>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default OrderList;
