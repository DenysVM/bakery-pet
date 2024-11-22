import React, { useEffect, useState } from 'react';
import {
  Box,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  deleteOrder,
  getUserOrders,
  deleteOrderItem,
} from '../../services/orderService';
import { getAllProducts } from '../../services/productService';
import { useAuth } from '../../auth/AuthContext';
import {
  OrderItem,
  EditOrderItem,
  DeleteOrderItem,
  useOrder,
} from '../Order';
import { formatDate } from '../../components/common/formatDate';

const UserOrders = () => {
  const { t } = useTranslation();
  const { token, loadingAuth } = useAuth();
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

  const missingTokenError = t('auth.missingToken');
  const orderErrorFetching = t('order.errorFetching');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError(missingTokenError);
        setLoading(false);
        return;
      }
      try {
        const ordersData = await getUserOrders(token);

        const productIds = ordersData.flatMap((order) =>
          order.items
            .map((item) => item.product?._id || item.productId)
            .filter((id) => id !== undefined && typeof id === 'string')
        );

        const products = await getAllProducts(productIds);

        setOrders(
          ordersData.filter(
            (order) => !['cancelled', 'delivered'].includes(order.status)
          )
        );
        setProducts(products);
        updateOrderItems(ordersData.flatMap((order) => order.items));
      } catch (error) {
        setError(error.message || orderErrorFetching);
      } finally {
        setLoading(false);
      }
    };

    if (!loadingAuth && token) {
      fetchOrders();
    }
  }, [token, loadingAuth, updateOrderItems, missingTokenError, orderErrorFetching]);

  const handleEditItem = (order, item) => {
    if (order.status !== 'pending') return;
    setSelectedOrder(order);
    setSelectedItem(item);
    onEditOpen();
  };

  const handleDeleteItem = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    onDeleteOpen();
  };

  const handleSaveEdit = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id
          ? {
              ...order,
              items: order.items.map((item) =>
                updatedOrder.items.find((updatedItem) => updatedItem._id === item._id) || item
              ),
              total: updatedOrder.items.reduce(
                (sum, updatedItem) => sum + updatedItem.quantity * updatedItem.price,
                0
              ),
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

    const orderToUpdate = updatedOrders.find(
      (order) => order._id === selectedOrder._id
    );

    if (orderToUpdate.items.length === 0) {
      try {
        await deleteOrder(selectedOrder._id, token);
        setOrders(updatedOrders.filter((order) => order._id !== selectedOrder._id));
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
      const updatedTotal = orderToUpdate.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                items: orderToUpdate.items,
                total: updatedTotal,
              }
            : order
        )
      );

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

  if (loadingAuth || loading) {
    return (
      <Box textAlign="center" py="6">
        <Spinner size="xl" />
      </Box>
    );
  }

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

  if (orders.length === 0) {
    return (
      <Box textAlign="center" py="6">
        <Text>{t('order.noOrders')}</Text>
      </Box>
    );
  }

  return (
    <Box>
      {orders.map((order) => (
        <Box key={order._id} borderWidth="1px" borderRadius="lg" p="4" mb="4">
          <Text fontWeight="bold" mb="2">
            {t('order.orderId')}: {order.orderNumber || order._id}
          </Text>

          <Text mb="2">
            {t('order.date')}: {formatDate(order.createdAt)}
          </Text>

          <Text mb="2">
            {t('order.statusLabel')}: {t(`order.status.${order.status}`)}
          </Text>

          {order.items.map((item) => (
            <OrderItem
              key={item._id}
              item={item}
              orderId={order._id}
              isEditable={order.status === 'pending'}
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

export default UserOrders;
