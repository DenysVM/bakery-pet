import React, { useEffect, useState } from 'react';
import {
  Box,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { getUserOrders } from '../../services/orderService';
import { getAllProducts } from '../../services/productService';
import { useAuth } from '../../auth/AuthContext';
import { OrderItem } from '../Order';
import { DeliveryStatus } from '../admin/Orders/OrderComponents';
import { formatDate } from '../../components/common/formatDate';

const OrderHistory = () => {
  const { t } = useTranslation();
  const { token, loadingAuth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError(t('auth.missingToken'));
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
          ordersData.filter((order) =>
            ['cancelled', 'delivered'].includes(order.status)
          )
        );
        setProducts(products);
      } catch (error) {
        setError(error.message || t('order.errorFetching'));
      } finally {
        setLoading(false);
      }
    };

    if (!loadingAuth && token) {
      fetchOrders();
    }
  }, [token, loadingAuth, t]);

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
        <Box
          key={order._id}
          borderWidth="1px"
          borderRadius="lg"
          p="4"
          mb="4"
          borderColor={
            order.status === 'cancelled'
              ? 'red.500'
              : order.status === 'delivered'
                ? 'green.500'
                : undefined
          }
        >
          <Text fontWeight="bold" mb="2">
            {t('order.orderId')}: {order.orderNumber || order._id}
          </Text>

          <Text mb="2">
            {t('order.date')}: {formatDate(order.createdAt)}
          </Text>
          <Text mb="2">
            {t('order.deliveryType')}: {t(`order.delivery.${order.deliveryType}`)}
          </Text>

          {order.deliveryType === 'Nova Poshta' && (
            <>
              {order.novaPoshtaDelivery?.label && (
                <Text mb="2">
                  {t('order.novaPoshtaBranch')}: {order.novaPoshtaDelivery.label}
                </Text>
              )}
              {order.novaPoshtaDelivery?.trackingNumber && (
                <>
                  <Text mb="2">
                    {t('novaPoshta.trackingNumber')}: {order.novaPoshtaDelivery.trackingNumber}
                  </Text>

                  <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
                    <Heading size="sm" mr={2}>
                      {t('novaPoshta.deliveryStatus')}:
                    </Heading>
                    <DeliveryStatus trackingNumber={order.novaPoshtaDelivery.trackingNumber} />
                  </Box>
                </>
              )}
            </>
          )}

          <Text
            mb="2"
            color={
              order.status === 'cancelled'
                ? 'red.500'
                : order.status === 'delivered'
                  ? 'green.500'
                  : undefined
            }
          >
            {t('order.statusLabel')}: {t(`order.status.${order.status}`)}
          </Text>
          {order.comment && (
            <Text mb={2} fontStyle="italic">
              {t("order.comment")}: {order.comment}
            </Text>
          )}
          {order.items.map((item) => (
            <OrderItem
              key={item._id}
              item={item}
              isEditable={false}
              products={products}
            />
          ))}

          <Text fontWeight="bold" mt="2">
            {t('order.total')}: ${order.total.toFixed(2)}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default OrderHistory;
