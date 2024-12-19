import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
  Box,
  Text,
  Heading,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { updateOrderStatus } from "../../../services/orderService";
import { useTranslation } from "react-i18next";

const OrderStatus = ({ order, token, onStatusUpdated, isMobile }) => {
  const [status, setStatus] = useState(order.status);
  const [deliveryStatus, setDeliveryStatus] = useState("Unknown"); // Заглушка
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const trackingNumber = order.novaPoshtaDelivery?.trackingNumber || null;

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const statusColor =
    status === "cancelled"
      ? "red.500"
      : status === "delivered"
      ? "green.500"
      : "inherit";

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    try {
      const orderId = order.orderNumber || order._id;
      await updateOrderStatus(orderId, newStatus, token);
      setStatus(newStatus);
      toast({
        title: t("order.statusUpdated"),
        description: t("order.statusUpdatedDescription", {
          orderId: orderId,
          status: t(`order.status.${newStatus}`),
        }),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (onStatusUpdated) {
        onStatusUpdated(orderId, newStatus);
      }
    } catch (error) {
      toast({
        title: t("order.errorUpdatingStatus"),
        description: error.message || t("order.errorUpdatingStatusDescription"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Stack spacing={4}>
      {order.deliveryType === "Nova Poshta" && (
        <Box>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="flex-start"
            align={{ base: "flex-start", md: "center" }}
            gap={{ md: 4 }}
          >
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Heading size="sm" mr={2}>
                {t("novaPoshta.trackingNumber")}:
              </Heading>
              <Text fontWeight="bold" wordBreak="break-word" maxW="100%">
                {trackingNumber
                  ? trackingNumber
                  : t("novaPoshta.noTrackingNumber")}
              </Text>
            </Box>

            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Heading size="sm" mr={2}>
                {t("novaPoshta.deliveryStatus")}:
              </Heading>
              <Text fontWeight="bold" wordBreak="break-word" maxW="100%">
                {t(`novaPoshta.deliveryStatus.${deliveryStatus}`)}
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
      <Box>
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            variant="outline"
            isLoading={isUpdating}
            rightIcon={<FaChevronDown />}
            color={statusColor}
          >
            {t(`order.status.${status}`)}
          </MenuButton>
          <MenuList>
            {statusOptions.map((option) => (
              <MenuItem key={option} onClick={() => handleStatusChange(option)}>
                {t(`order.status.${option}`)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
    </Stack>
  );
};

export default OrderStatus;
