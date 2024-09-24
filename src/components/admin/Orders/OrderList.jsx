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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton, // Добавлен импорт DrawerCloseButton
} from '@chakra-ui/react';
import { getAllOrders } from '../../../services/orderService';
import { loadProducts } from '../../../services/productService'; // Импорт функции для загрузки продуктов
import { useAuth } from '../../../auth/AuthContext';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { OrderStatus, OrderDetail } from './'; // Правильный импорт из индекса
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../common/formatDate';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // Состояние для продуктов
  const [selectedOrder, setSelectedOrder] = useState(null); // Для хранения выбранного заказа
  const [loading, setLoading] = useState(true); // Добавлены состояния loading и setLoading
  const [error, setError] = useState(null); // Добавлены состояния error и setError
  const { token, loadingAuth } = useAuth();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure(); // Управление модальным окном или Drawer
  const { t } = useTranslation();

  // Функция для загрузки заказов
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

  // Функция для загрузки продуктов
  const fetchProducts = useCallback(async () => {
    try {
      const productsData = await loadProducts();
      setProducts(productsData);
    } catch (err) {
      toast({
        title: t('product.errorFetching'),
        description: err.message || t('product.errorFetchingDescription'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast, t]);

  // Загрузка заказов и продуктов после аутентификации
  useEffect(() => {
    if (!loadingAuth && token) {
      fetchOrders();
      fetchProducts(); // Загрузка продуктов
    }
  }, [token, loadingAuth, fetchOrders, fetchProducts]);

  if (loadingAuth) {
    return <Spinner size="xl" label={t('auth.checkingAuthorization')} />;
  }

  if (loading) {
    return <Spinner size="xl" label={t('order.loadingOrders')} />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  return (
    <Box>
      {orders.map((order) => (
        <Box key={order._id} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
          <Text fontWeight="bold">
            {t('order.orderId')}: {order._id} - {formatDate(order.createdAt)}
          </Text>
          <Text>
            {t('order.total')}: ${order.total.toFixed(2)}
          </Text>

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
                    onClick={() => handleViewDetails(order)}
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
                  <Button onClick={() => handleViewDetails(order)}>
                    {t('order.viewDetails')}
                  </Button>
                  <Button onClick={() => console.log('Edit Order')}>
                    {t('order.editOrder')}
                  </Button>
                  <Button onClick={() => console.log('Delete Order')}>
                    {t('order.deleteOrder')}
                  </Button>
                </>
              )}
            </ButtonGroup>
          </Box>
        </Box>
      ))}

      {/* Модальное окно для десктопа и Drawer для мобильных устройств */}
      {selectedOrder && (
        isMobile ? (
          <Drawer
            isOpen={isOpen}
            placement="bottom"
            onClose={onClose}
          >
            <DrawerOverlay/>
            <DrawerContent 
              width="98vw"
              mx="auto"        
              borderRadius="md"    
            >
              <DrawerCloseButton />
              <DrawerHeader>{t('order.orderDetails')}</DrawerHeader>
              <DrawerBody> 
                <OrderDetail order={selectedOrder} products={products} onClose={onClose} />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        ) : (
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent 
              maxWidth="none" 
              width="auto"
            >
              <ModalHeader>{t('order.orderDetails')}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {/* Передаем список продуктов в OrderDetail */}
                <OrderDetail order={selectedOrder} products={products} onClose={onClose} />
                
              </ModalBody>
            </ModalContent>
          </Modal>
        )
      )}
    </Box>
  );
};

export default OrderList;
