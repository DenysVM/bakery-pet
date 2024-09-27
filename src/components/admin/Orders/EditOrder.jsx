import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  HStack,
  Select,
  Box,
  Text,
  Grid,
  VStack,
  IconButton,
  ModalCloseButton
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  updateOrderItem,
  deleteOrderItem,
  addItemToOrder,
} from "../../../services/orderService";
import { useAuth } from "../../../auth/AuthContext";
import { loadProducts } from "../../../services/productService";
import i18n from "../../../i18n/i18n";
import { useMediaQuery } from "@chakra-ui/react";
import { DeleteIcon, MinusIcon, CheckIcon, AddIcon } from "@chakra-ui/icons";
import { FiSave } from 'react-icons/fi';

const EditOrder = ({ isOpen, onClose, order, onSave }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [orderDetails, setOrderDetails] = useState(order);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [newProductQuantity, setNewProductQuantity] = useState(1);
  const toast = useToast();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (order) {
      setOrderDetails(order);

      const initialQuantities = {};
      order.items.forEach((item) => {
        initialQuantities[item._id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }

    const fetchProducts = async () => {
      try {
        const products = await loadProducts();
        setAvailableProducts(products);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    fetchProducts();
  }, [order]);

  const handleSave = async () => {
    try {
      const originalItemIds = order.items.map((item) => item._id);
      const currentItemIds = orderDetails.items.map((item) => item._id);

      const deletedItemIds = originalItemIds.filter(
        (id) => !currentItemIds.includes(id)
      );

      for (let item of orderDetails.items) {
        if (item._id.startsWith("temp-")) {
          await addItemToOrder(
            orderDetails._id,
            {
              productId: item.productId,
              quantity: quantities[item._id],
            },
            token
          )
        } else {
          await updateOrderItem(
            orderDetails._id,
            item._id,
            { quantity: quantities[item._id] },
            token
          );
        }
      }

      for (let itemId of deletedItemIds) {
        await deleteOrderItem(orderDetails._id, itemId, token);
      }

      const updatedItems = orderDetails.items.map((item) => ({
        ...item,
        quantity: quantities[item._id],
      }));

      const total = updatedItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      const updatedOrderDetails = {
        ...orderDetails,
        items: updatedItems,
        total,
      };

      setOrderDetails(updatedOrderDetails);

      toast({
        title: t("order.itemUpdated"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      if (onSave) {
        onSave(updatedOrderDetails);
      }

      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: t("order.errorUpdating"),
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteItem = (itemId) => {
    setOrderDetails((prevOrderDetails) => ({
      ...prevOrderDetails,
      items: prevOrderDetails.items.filter((item) => item._id !== itemId),
    }));
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[itemId];
      return updatedQuantities;
    });
  };

  const handleIncrease = (itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 1) + 1,
    }));
  };

  const handleDecrease = (itemId) => {
    if (quantities[itemId] > 1) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: prevQuantities[itemId] - 1,
      }));
    }
  };

  const handleQuantityChange = (itemId, value) => {
    const newValue = Math.max(1, Number(value));
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Number(newValue),
    }));
  };

  const handleAddProduct = () => {
    if (!selectedProduct || newProductQuantity < 1) {
      toast({
        title: t("order.errorInvalidProduct"),
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const product = availableProducts.find(
      (p) => p.productId === selectedProduct
    );
    if (!product) {
      toast({
        title: t("order.errorInvalidProduct"),
        status: "error",
        duration: 2000,
      });
      return;
    }

    const newItem = {
      _id: `temp-${Date.now()}`,
      productId: selectedProduct,
      quantity: newProductQuantity,
      price: product.price,
    };

    setOrderDetails((prevOrderDetails) => ({
      ...prevOrderDetails,
      items: [...prevOrderDetails.items, newItem],
    }));

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [newItem._id]: newProductQuantity,
    }));

    toast({
      title: t("order.productAdded"),
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx="4">
        <ModalHeader>
          {t("order.editOrder")} <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          {orderDetails.items.map((item, index) => {
            const product =
              availableProducts.find((p) => p.productId === item.productId) ||
              {};

            const productName = product.name
              ? product.name[i18n.language]
              : t("order.noProduct");

            return (
              <Box key={item._id} mb="4">
                <Grid templateColumns="2fr 1fr 1fr" alignItems="center" gap={4}>
                  <Text>{productName}</Text>
                  <HStack>
                    <Button onClick={() => handleDecrease(item._id)} h="40px">
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantities[item._id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(item._id, e.target.value)
                      }
                      textAlign="center"
                      w={`${
                        (quantities[item._id]?.toString().length || 1) + 2
                      }ch`}
                      minW="50px"
                      sx={{ boxSizing: "border-box" }}
                    />
                    <Button onClick={() => handleIncrease(item._id)} h="40px">
                      +
                    </Button>
                  </HStack>
                  {isLargerThan768 ? (
                    <Button
                      onClick={() => handleDeleteItem(item._id)}
                      colorScheme="red"
                    >
                      {t("order.delete")}
                    </Button>
                  ) : (
                    <IconButton
                      aria-label={t("order.delete")}
                      icon={<DeleteIcon />}
                      onClick={() => handleDeleteItem(item._id)}
                      colorScheme="red"
                    />
                  )}
                </Grid>
              </Box>
            );
          })}

          <FormControl mt={4}>
            <FormLabel>{t("order.addProduct")}</FormLabel>
            <VStack align="start" spacing={4}>
              <Select
                placeholder={t("order.selectProduct")}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {availableProducts.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.name[i18n.language]}
                  </option>
                ))}
              </Select>
              <HStack>
                {isLargerThan768 ? (
                  <Button
                    onClick={() =>
                      setNewProductQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  >
                    -
                  </Button>
                ) : (
                  <IconButton
                    aria-label={t("decrease")}
                    icon={<MinusIcon />}
                    onClick={() =>
                      setNewProductQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  />
                )}

                <Input
                  type="number"
                  min="1"
                  value={newProductQuantity}
                  onChange={(e) =>
                    setNewProductQuantity(Number(e.target.value))
                  }
                  maxW="60px"
                  textAlign="center"
                />

                {isLargerThan768 ? (
                  <Button
                    onClick={() => setNewProductQuantity((prev) => prev + 1)}
                  >
                    +
                  </Button>
                ) : (
                  <IconButton
                    aria-label={t("increase")}
                    icon={<AddIcon />}
                    onClick={() => setNewProductQuantity((prev) => prev + 1)}
                  />
                )}

                {isLargerThan768 ? (
                  <Button onClick={handleAddProduct} colorScheme="green">
                    {t("add")}
                  </Button>
                ) : (
                  <IconButton
                    aria-label={t("add")}
                    icon={<CheckIcon />}
                    onClick={handleAddProduct}
                    colorScheme="green"
                  />
                )}
              </HStack>
            </VStack>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          {isLargerThan768 ? (
            <Button colorScheme="blue" ml={3} onClick={handleSave}>
              {t("order.save")}
            </Button>
          ) : (
            <IconButton
              aria-label={t("order.save")}
              icon={<FiSave />}
              onClick={handleSave}
              colorScheme="blue"
            />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditOrder;
