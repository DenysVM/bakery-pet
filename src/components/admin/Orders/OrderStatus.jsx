import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { updateOrderStatus } from "../../../services/orderService";
import { useTranslation } from "react-i18next";

const OrderStatus = ({ order, token, onStatusUpdated, isMobile }) => {
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  // Устанавливаем цвет статуса
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
  );
};

export default OrderStatus;
