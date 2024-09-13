import React, { useEffect, useState } from 'react';
import { Box, Spinner, Alert, AlertIcon, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { deleteOrder, getUserOrders, deleteOrderItem } from '../../services/orderService';
import { loadProducts } from '../../services/productService';
import { useAuth } from '../../auth/AuthContext';
import OrderItem from '../Order/OrderItem';
import EditOrderItem from '../Order/EditOrderItem';
import DeleteOrderItem from '../Order/DeleteOrderItem';
import { OrderProvider, useOrder } from '../Order/OrderContext';

const UserOrdersContent = () => {
  const { t } = useTranslation();
  const { token, loadingAuth } = useAuth();  // Добавляем loadingAuth
  const { updateOrderItems } = useOrder();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    // Функция для загрузки заказов и продуктов
    const fetchOrders = async () => {
      if (!token) {
        setError(t('auth.missingToken'));
        setLoading(false);
        return;
      }
      try {
        const ordersData = await getUserOrders(token);
        const productsData = await loadProducts();
        setOrders(ordersData);
        setProducts(productsData);
        updateOrderItems(ordersData.flatMap(order => order.items));
      } catch (error) {
        setError(error.message || t('order.errorFetching'));
      } finally {
        setLoading(false);
      }
    };

    // Проверяем завершение авторизации и наличие токена
    if (!loadingAuth && token) {
      fetchOrders();  // Загружаем заказы, если авторизация завершена и токен доступен
    }
  }, [token, t, updateOrderItems, loadingAuth]);

  const handleEditItem = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    onEditOpen();
  };

  const handleDeleteItem = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    onDeleteOpen();
  };

  const handleSaveEdit = (updatedItem) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === selectedOrder._id
          ? {
              ...order,
              items: order.items.map((item) =>
                item._id === updatedItem._id ? updatedItem : item
              ),
              total: order.items.reduce((sum, item) => sum + item.quantity * item.price, 0), 
            }
          : order
      )
    );
    onEditClose();
  };

  const handleConfirmDelete = async (productId) => {
    const updatedOrders = orders.map((order) =>
      order._id === selectedOrder._id
        ? {
            ...order,
            items: order.items.filter((item) => item._id !== productId),
          }
        : order
    );

    const orderToUpdate = updatedOrders.find(order => order._id === selectedOrder._id);

    if (orderToUpdate.items.length === 0) {
      try {
        await deleteOrder(selectedOrder._id, token);
        setOrders(updatedOrders.filter(order => order._id !== selectedOrder._id));
        toast({
          title: t('order.orderDeleted'),
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting order:', error);
        toast({
          title: t('order.errorDeletingOrder'),
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      setOrders(updatedOrders);
      try {
        await deleteOrderItem(selectedOrder._id, productId, token);
        toast({
          title: t('order.itemDeleted'),
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting order item:', error);
        toast({
          title: t('order.errorDeletingItem'),
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }

    onDeleteClose();
  };

  // Отображаем спиннер, пока идет проверка авторизации или загрузка заказов
  if (loadingAuth || loading) {
    return (
      <Box textAlign="center" py="6">
        <Spinner size="xl" />
      </Box>
    );
  }

  // Отображаем ошибку, если что-то пошло не так
  if (error) {
    return (
      <Box textAlign="center" py="6">
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  // Если заказов нет, показываем соответствующее сообщение
  if (orders.length === 0) {
    return (
      <Box textAlign="center" py="6">
        <Text>{t('order.noOrders')}</Text>
      </Box>
    );
  }

  // Основной рендер списка заказов
  return (
    <Box>
      {orders.map((order) => (
        <Box key={order._id} borderWidth="1px" borderRadius="lg" p="4" mb="4">
          <Text fontWeight="bold" mb="2">
            {t('order.orderId')}: {order._id}
          </Text>
          {order.items.map((item) => (
            <OrderItem
              key={item._id}
              item={item}
              orderId={order._id}
              isEditable
              onEditItem={() => handleEditItem(order, item)}
              onDeleteItem={() => handleDeleteItem(order, item)}
              products={products}
            />
          ))}
          <Text fontWeight="bold" mt="2">
            {t('order.total')}: ${order.total.toFixed(2)}
          </Text>
        </Box>
      ))}
      {selectedItem && (
        <>
          <EditOrderItem
            isOpen={isEditOpen}
            onClose={onEditClose}
            item={selectedItem}
            orderId={selectedOrder._id}
            onSave={handleSaveEdit}
          />
          <DeleteOrderItem
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            item={selectedItem}
            orderId={selectedOrder._id}
            onDelete={handleConfirmDelete}
          />
        </>
      )}
    </Box>
  );
};

const UserOrders = () => (
  <OrderProvider>
    <UserOrdersContent />
  </OrderProvider>
);

export default UserOrders;
