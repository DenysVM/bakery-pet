import React, { useState } from "react";
import {
  Box,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../common/formatDate";
import { generateInvoicePDF } from "../../../utils/invoiceGenerator";
import ProductModal from "../../common/Modal/ProductModal";
import BottomSheet from "../../common/BottomSheet/BottomSheet";
import EditOrder from "./EditOrder";
import { DownloadIcon, EditIcon } from "@chakra-ui/icons";
import ResponsiveActionButtons from "../../common/ResponsiveActionButtons";

const OrderDetail = ({ order, onClose, onSave }) => {
  const { t, i18n } = useTranslation();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { isOpen, onOpen, onClose: onModalClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderDetails, setOrderDetails] = useState(order);
  const [totalPrice, setTotalPrice] = useState(order.total);
  const toast = useToast();

  const calculateTotalPrice = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrderDetails(updatedOrder);
    const newTotalPrice = calculateTotalPrice(updatedOrder.items);
    setTotalPrice(newTotalPrice);

    if (onSave) {
      onSave(updatedOrder);
    }
  };

  const handleProductClick = (productId) => {
    const product = orderDetails.items.find(
      (item) => item.product._id === productId
    ).product;
    if (product) {
      setSelectedProduct(product);
      onOpen();
    } else {
      toast({
        title: t("product.notFound"),
        description: t("product.notFoundDescription"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const address = orderDetails.address || {};
  
  const deliveryAddress = `${t("user.city")} ${address.city || ""}, ${t(
    "user.street"
  )} ${address.street || ""}, ${t("user.houseNumber")} ${
    address.houseNumber || ""
  }, ${t("user.apartmentNumber")} ${address.apartmentNumber || ""}`;

  const customerPhone = orderDetails.phone || t("user.noData");

  const customerName = orderDetails.user
    ? `${orderDetails.user.firstName} ${orderDetails.user.lastName}`
    : t("user.noData");

  const handleDownloadInvoice = () => {
    generateInvoicePDF(
      orderDetails,
      orderDetails.items.map((item) => item.product)
    );
  };

  return (
    <Box>
      <Stack spacing={4}>
        <Heading size="md">
          {t("order.orderId")}: {orderDetails.orderNumber}
        </Heading>
        <Text>
          {t("order.date")}: {formatDate(orderDetails.createdAt)}
        </Text>

        <Heading size="sm">{t("user.profile")}</Heading>
        <Text>
          {t("user.name")}: {customerName}
        </Text>
        <Text>
          {t("user.phone")}: {customerPhone}
        </Text>

        <Heading size="sm">{t("user.address")}</Heading>
        <Text>{deliveryAddress}</Text>

        <Heading size="sm">{t("order.items")}</Heading>

        {isLargerThan768 ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>{t("products")}</Th>
                <Th>{t("order.quantity")}</Th>
                <Th>{t("productCard.price")}</Th>
                <Th>{t("cart.totalPrice")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderDetails.items.map((item) => {
                const product = item.product;
                const productName = product
                  ? product.name[i18n.language]
                  : t("order.noProduct");

                return (
                  <Tr key={item._id}>
                    <Td>
                      <Text
                        fontWeight="bold"
                        cursor="pointer"
                        onClick={() => handleProductClick(product._id)}
                      >
                        {productName}
                      </Text>
                    </Td>
                    <Td>{item.quantity}</Td>
                    <Td>${item.price.toFixed(2)}</Td>
                    <Td>${(item.price * item.quantity).toFixed(2)}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        ) : (
          <Stack spacing={4}>
            {orderDetails.items.map((item) => {
              const product = item.product;
              const productName = product
                ? product.name[i18n.language]
                : t("order.noProduct");

              return (
                <Box key={item._id} p={4} borderWidth="1px" borderRadius="lg">
                  <Text
                    fontWeight="bold"
                    cursor="pointer"
                    onClick={() => handleProductClick(product._id)}
                  >
                    {productName}
                  </Text>
                  <Text>
                    ${item.price.toFixed(2)} x {item.quantity}
                  </Text>
                  <Text fontWeight="bold">
                    {t("cart.totalPrice")}: $
                    {(item.price * item.quantity).toFixed(2)}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        )}

        {selectedProduct &&
          (isLargerThan768 ? (
            <ProductModal
              isOpen={isOpen}
              product={selectedProduct}
              onClose={onModalClose}
            />
          ) : (
            <BottomSheet
              isOpen={isOpen}
              product={selectedProduct}
              onClose={onModalClose}
            />
          ))}

        <Text fontWeight="bold">
          {t("order.total")}: ${totalPrice.toFixed(2) || "0.00"}
        </Text>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <ResponsiveActionButtons
            buttons={[
              {
                icon: <DownloadIcon />,
                label: t("order.invoice"),
                onClick: handleDownloadInvoice,
                colorScheme: "blue",
              },
              {
                icon: <EditIcon />,
                label: t("order.editOrder"),
                onClick: onEditOpen,
                colorScheme: "teal",
              },
            ]}
            size={{ base: "sm", md: "md" }}
            variant="outline"
            spacing={{ base: 2, md: 4 }}
            flexDirection={{ base: "column", md: "row" }}
          />
        </Box>
      </Stack>

      <EditOrder
        isOpen={isEditOpen}
        onClose={onEditClose}
        order={orderDetails}
        onSave={handleOrderUpdate}
        allProducts={orderDetails.items.map((item) => item.product)}
      />
    </Box>
  );
};

export default OrderDetail;
