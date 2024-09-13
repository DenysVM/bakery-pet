import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, Spinner, Button, useToast } from '@chakra-ui/react';
import { getAllOrders } from '../../../services/orderService'; 
import { useAuth } from '../../../auth/AuthContext'; 
import EditOrderStatus from './EditOrderStatus'; 

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, loadingAuth } = useAuth();  
  const toast = useToast();

  // Функция для загрузки заказов с обработкой токена
  const fetchOrders = useCallback(async () => {
    if (!token) {
      setError('Unauthorized');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);  // Сбрасываем ошибки перед новым запросом

    try {
      const data = await getAllOrders(token);
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch orders');
      toast({
        title: 'Error fetching orders',
        description: err.message || 'Failed to fetch orders',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  // Выполняем загрузку заказов, когда токен готов и авторизация завершена
  useEffect(() => {
    if (!loadingAuth && token) {
      fetchOrders();
    }
  }, [token, loadingAuth, fetchOrders]);

  // Обработчик обновления заказов
  const handleUpdate = () => {
    fetchOrders();
  };

  // Отображение загрузки авторизации
  if (loadingAuth) {
    return <Spinner size="xl" label="Checking authorization..." />;
  }

  // Отображение загрузки заказов
  if (loading) {
    return <Spinner size="xl" label="Loading orders..." />;
  }

  // Отображение ошибок
  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  // Основной рендер заказов
  return (
    <Box>
      {orders.map((order) => (
        <Box key={order._id} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
          <Text fontWeight="bold">Order ID: {order._id}</Text>
          <Text>Total: ${order.total.toFixed(2)}</Text>
          <Text>Status: {order.status}</Text>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button size="sm" mr={2} colorScheme="blue" onClick={() => console.log('View Details')}>
              View Details
            </Button>
            <Button size="sm" mr={2} colorScheme="yellow" onClick={() => console.log('Edit Order')}>
              Edit Order
            </Button>
            <Button size="sm" colorScheme="red" onClick={() => console.log('Delete Order')}>
              Delete Order
            </Button>
          </Box>

          <EditOrderStatus order={order} onUpdate={handleUpdate} />
        </Box>
      ))}
    </Box>
  );
};

export default OrderList;
