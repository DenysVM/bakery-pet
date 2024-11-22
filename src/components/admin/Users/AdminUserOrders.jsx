import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  VStack,
  useToast,
  useDisclosure,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../common/formatDate";
import { useAuth } from "../../../auth/AuthContext";
import { getUserOrders, deleteOrder } from "../../../services/orderService";
import DeleteConfirmationDialog from "../Orders/OrderComponents/DeleteConfirmationDialog";
import { OrderDetail, OrderStatus } from "../Orders";
import i18n from "../../../i18n/i18n";
import { getAllProducts } from "../../../services/productService";
import ResponsiveActionButtons from "../../common/ResponsiveActionButtons";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const AdminUserOrders = ({ userId }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError(t("auth.missingToken"));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const ordersData = await getUserOrders(token, userId);

        const productIds = ordersData.flatMap((order) =>
          order.items
            .map((item) => item.product?._id || item.productId)
            .filter((id) => id !== undefined && typeof id === "string")
        );

        const loadedProducts = await getAllProducts(productIds);
        const formattedOrders = ordersData.map((order) => ({
          ...order,
          items: order.items.map((item) => ({
            ...item,
            product: {
              ...loadedProducts.find(
                (p) => p._id === (item.product?._id || item.productId)
              ),
              name: {
                ...loadedProducts.find(
                  (p) => p._id === (item.product?._id || item.productId)
                )?.name,
                [i18n.language]:
                  loadedProducts.find(
                    (p) => p._id === (item.product?._id || item.productId)
                  )?.name?.[i18n.language] || t("order.noProduct"),
              },
            },
          })),
        }));
        setOrders(formattedOrders);
      } catch (err) {
        console.error("Error fetching user orders:", err);
        setError(t("order.errorFetching"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, userId, t, toast]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleDeleteOrder = async (orderId) => {
    try {
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
      toast({
        title: t("order.errorDeleting"),
        description: error.message || t("order.errorDeletingDescription"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsDeleteAlertOpen(true);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleSaveOrder = (updatedOrder) => {
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

  if (loading) {
    return (
      <Box textAlign="center" py="6">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py="6">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box textAlign="center" py="6">
        <Text>{t("order.noOrders")}</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {orders.map((order) => (
        <Box
          key={order._id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          _dark={{ bg: "gray.700" }}
          boxShadow="md"
          mb={4}
          borderColor={
            order.status === "cancelled"
              ? "red.500"
              : order.status === "delivered"
              ? "green.500"
              : undefined
          }
        >
          <Text
            fontWeight="bold"
            color={
              order.status === "cancelled"
                ? "red.500"
                : order.status === "delivered"
                ? "green.500"
                : undefined
            }
          >
            {t("order.orderId")}: {order.orderNumber}
          </Text>
          <Text>
            {t("order.date")}: {formatDate(order.createdAt)}
          </Text>
          <Text mt="2" fontWeight="bold">
            {t("order.total")}: ${order.total.toFixed(2)}
          </Text>

          <Box
            mt={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <OrderStatus
              order={order}
              token={token}
              onStatusUpdated={(newStatus) =>
                updateOrderStatus(order._id, newStatus)
              }
            />
            <Box>
              <ResponsiveActionButtons
                isAttached={true}
                buttons={[
                  {
                    icon: <EditIcon />,
                    label: t("order.viewDetails"),
                    onClick: () => handleViewDetails(order),
                    colorScheme: "blue",
                  },
                  {
                    icon: <DeleteIcon />,
                    label: t("order.deleteOrder"),
                    onClick: () => confirmDeleteOrder(order._id),
                    colorScheme: "red",
                  },
                ]}
              />
            </Box>
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
                  onSave={handleSaveOrder}
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
                  onSave={handleSaveOrder}
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
        t={t}
      />
    </VStack>
  );
};

export default AdminUserOrders;
