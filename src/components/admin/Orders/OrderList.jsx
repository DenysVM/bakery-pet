// src/components/admin/Orders/OrderList.jsx

import React, { useEffect, useState, useCallback } from "react";
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
  DrawerCloseButton,
} from "@chakra-ui/react";
import { getAllOrders, getOrderById, deleteOrder } from "../../../services/orderService";
import { getUserProfile } from "../../../services/authService";
import { getAllProducts } from "../../../services/productService";
import { useAuth } from "../../../auth/AuthContext";
import { FaTrash, FaEye } from "react-icons/fa";
import { OrderStatus, OrderDetail } from "./";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../common/formatDate";
import DeleteConfirmationDialog from "./OrderComponents/DeleteConfirmationDialog"; // Импортируем подкомпонент

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null); // Состояние для удаления
  const [error, setError] = useState(null);
  const { token, loadingAuth } = useAuth();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  // Состояния для диалога подтверждения удаления
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setError(t("auth.missingToken"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAllOrders(token);
      setOrders(data);
    } catch (err) {
      setError(t("order.errorFetching"));
      toast({
        title: t("order.errorFetching"),
        description: err.message || t("order.errorFetchingDescription"),
        status: "error",
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

  const handleViewDetails = async (order) => {
    setLoadingDetails(true);
    setError(null);

    try {
      const orderDetails = await getOrderById(order._id, token);
      const userProfile = await getUserProfile(token);

      const productIds = orderDetails.items
        .map((item) => item.productId?._id || item.productId)
        .filter((id) => id !== undefined && typeof id === "string");

      const products = await getAllProducts(productIds);

      const detailedOrder = {
        ...orderDetails,
        user: userProfile,
        items: orderDetails.items.map((item) => {
          const productId = item.productId?._id || item.productId;
          const product = products.find((p) => p._id === productId);

          return {
            ...item,
            product: product || item.productId,
            productId: undefined,
          };
        }),
      };

      setSelectedOrder(detailedOrder);
      onOpen();
    } catch (err) {
      setError(t("order.errorFetchingDetails"));
      toast({
        title: t("order.errorFetchingDetails"),
        description: err.message || t("order.errorFetchingDescription"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      setDeletingOrderId(orderId);
      await deleteOrder(orderId, token);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      toast({
        title: t("order.deleted"),
        description: t("order.deletedSuccessfully"),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: t("order.errorDeleting"),
        description:
          error.response?.data?.message ||
          error.message ||
          t("order.errorDeletingDescription"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Функция подтверждения удаления заказа
  const confirmDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsDeleteAlertOpen(true);
  };

  // Функция для обновления заказа (исправляем ошибку 'handleOrderUpdate' is not defined)
  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  if (loadingAuth) {
    return <Spinner size="xl" label={t("auth.checkingAuthorization")} />;
  }

  if (loading) {
    return <Spinner size="xl" label={t("order.loadingOrders")} />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box>
      {orders.map((order) => (
        <Box key={order._id} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
          <Text fontWeight="bold">
            {t("order.orderId")}: {order._id} - {formatDate(order.createdAt)}
          </Text>
          <Text>
            {t("order.total")}: ${order.total.toFixed(2)}
          </Text>

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
                    aria-label={t("order.viewDetails")}
                    onClick={() => handleViewDetails(order)}
                    isLoading={
                      loadingDetails && selectedOrder?._id === order._id
                    }
                  />
                  <IconButton
                    icon={<FaTrash />}
                    aria-label={t("order.deleteOrder")}
                    onClick={() => confirmDeleteOrder(order._id)}
                    isLoading={deletingOrderId === order._id}
                  />
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleViewDetails(order)}
                    isLoading={
                      loadingDetails && selectedOrder?._id === order._id
                    }
                  >
                    {t("order.viewDetails")}
                  </Button>
                  <Button
                    onClick={() => confirmDeleteOrder(order._id)}
                    isLoading={deletingOrderId === order._id}
                  >
                    {t("order.deleteOrder")}
                  </Button>
                </>
              )}
            </ButtonGroup>
          </Box>
        </Box>
      ))}

      {/* Компонент OrderDetail */}
      {selectedOrder &&
        (isMobile ? (
          <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent
              maxWidth="98vw"
              maxHeight="90vh"
              borderRadius="md"
              mx="auto"
              mt="auto"
            >
              <DrawerCloseButton />
              <DrawerHeader>{t("order.orderDetails")}</DrawerHeader>
              <DrawerBody overflowY="auto">
                <OrderDetail
                  order={selectedOrder}
                  onClose={onClose}
                  onSave={handleOrderUpdate}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        ) : (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxWidth="none" width="auto">
              <ModalHeader>{t("order.orderDetails")}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <OrderDetail
                  order={selectedOrder}
                  onClose={onClose}
                  onSave={handleOrderUpdate}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        ))}

      <DeleteConfirmationDialog
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={() => {
          handleDeleteOrder(orderToDelete);
          setIsDeleteAlertOpen(false);
        }}
        isDeleting={deletingOrderId === orderToDelete}
        t={t} 
      />
    </Box>
  );
};

export default OrderList;
