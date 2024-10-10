import React from "react";
import {
  Box,
  Text,
  Button,
  Input,
  HStack,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { DeleteIcon, MinusIcon, AddIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/i18n";

const OrderItem = ({ item, orderDetails, setOrderDetails }) => {
  const { t } = useTranslation();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const product = item.product;
  const productName = product && product.name
    ? product.name[i18n.language] || product.name["en"] || t("order.noProduct")
    : t("order.noProduct");

  const handleQuantityChange = (newQuantity) => {
    const updatedItems = orderDetails.items.map((i) =>
      i._id === item._id ? { ...i, quantity: newQuantity } : i
    );
    setOrderDetails({ ...orderDetails, items: updatedItems });
  };

  const handleDelete = () => {
    setOrderDetails((prevOrderDetails) => ({
      ...prevOrderDetails,
      items: prevOrderDetails.items.filter((i) => i._id !== item._id),
    }));
  };

  return (
    <Box mb="4">
      <HStack spacing={4} alignItems="center" w="100%" justifyContent="space-between">
        <Text>{productName}</Text>
        <HStack spacing={2}>
          {isLargerThan768 ? (
            <Button
              onClick={() => handleQuantityChange(Math.max(1, item.quantity - 1))}
              h="40px"
              id="decrease-quantity"
              aria-label={t("decrease")}
            >
              -
            </Button>
          ) : (
            <IconButton
              aria-label={t("decrease")}
              icon={<MinusIcon />}
              onClick={() => handleQuantityChange(Math.max(1, item.quantity - 1))}
              id="decrease-quantity"
            />
          )}
          <Input
            type="number"
            value={item.quantity || 1}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            textAlign="center"
            w="60px"
            minW="50px"
            id={`quantity-input-${item._id}`}
            name="quantity"
            aria-label={t("quantity")}
            sx={{ boxSizing: "border-box" }}
          />
          {isLargerThan768 ? (
            <Button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              h="40px"
              id="increase-quantity"
              aria-label={t("increase")}
            >
              +
            </Button>
          ) : (
            <IconButton
              aria-label={t("increase")}
              icon={<AddIcon />}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              id="increase-quantity"
            />
          )}
          {isLargerThan768 ? (
            <Button
              onClick={handleDelete}
              colorScheme="red"
              id="delete-item"
              aria-label={t("order.delete")}
            >
              {t("order.delete")}
            </Button>
          ) : (
            <IconButton
              aria-label={t("order.delete")}
              icon={<DeleteIcon />}
              onClick={handleDelete}
              colorScheme="red"
              id="delete-item"
            />
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default OrderItem;
