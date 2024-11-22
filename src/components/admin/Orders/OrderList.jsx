// src/components/admin/Orders/OrderList.jsx

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  Spinner,
  useToast,
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
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  getAllOrders,
  getOrderById,
  deleteOrder,
} from "../../../services/orderService";
import { getUser } from "../../../services/userService";
import { getAllProducts } from "../../../services/productService";
import { useAuth } from "../../../auth/AuthContext";
import { OrderStatus, OrderDetail } from "./";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../common/formatDate";
import DeleteConfirmationDialog from "./OrderComponents/DeleteConfirmationDialog";
import ResponsiveActionButtons from "../../common/ResponsiveActionButtons";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [error, setError] = useState(null);
  const { token, loadingAuth } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

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
    setLoadingOrderId(order._id);
    setError(null);
  
    try {
      // Получаем детали заказа
      const orderDetails = await getOrderById(order._id, token);
  
      // Получаем данные пользователя, связанного с заказом
      const userProfile = await getUser(orderDetails.user, token);
  
      // Получаем данные о товарах в заказе
      const productIds = orderDetails.items
        .map((item) => item.productId?._id || item.productId)
        .filter((id) => id !== undefined && typeof id === "string");
  
      const products = await getAllProducts(productIds);
  
      // Собираем полные данные о заказе
      const detailedOrder = {
        ...orderDetails,
        user: userProfile, // Указываем данные о владельце заказа
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
      setLoadingOrderId(null);
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

  const confirmDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsDeleteAlertOpen(true);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id
          ? {
              ...order,
              ...updatedOrder,
              total: updatedOrder.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
            }
          : order
      )
    );
  };

  if (loadingAuth) {
    return (
      <Box display="flex" justifyContent="center" height="100vh">
        <Spinner size="xl" label={t("auth.checkingAuthorization")} />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" height="100vh">
        <Spinner size="xl" label={t("order.loadingOrders")} />
      </Box>
    );
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box>
      {orders.map((order) => (
        <Box
          key={order._id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          mb={4}
          borderColor={
            order.status === "cancelled"
              ? "red.500"
              : order.status === "delivered"
              ? "green.500"
              : undefined
          }
        >
          <Text fontWeight="bold">
            {t("order.orderId")}: {order.orderNumber || order._id} -{" "}
            {formatDate(order.createdAt)}
          </Text>
          <Text>
            {t("order.total")}: ${order.total.toFixed(2)}
          </Text>

          <Box mt={2} display="flex" justifyContent="space-between">
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
            />{" "}
          </Box>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <ResponsiveActionButtons
              buttons={[
                {
                  icon: <EditIcon />,
                  label: t("order.viewDetails"),
                  onClick: () => handleViewDetails(order),
                  colorScheme: "blue",
                  isLoading: loadingOrderId === order._id,
                },
                {
                  icon: <DeleteIcon />,
                  label: t("order.deleteOrder"),
                  onClick: () => confirmDeleteOrder(order._id),
                  colorScheme: "red",
                  isLoading: deletingOrderId === order._id,
                },
              ]}
              size={{ base: "sm", md: "md" }}
              variant="outline"
              spacing={{ base: 2, md: 4 }}
              flexDirection={{ base: "column", md: "row" }}
              isAttached={true}
            />
          </Box>
        </Box>
      ))}

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
