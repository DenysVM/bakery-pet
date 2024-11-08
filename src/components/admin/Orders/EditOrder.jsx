// EditOrder.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  ModalCloseButton,
  useMediaQuery,
  IconButton,
  useDisclosure, 
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../auth/AuthContext";
import { FiSave } from "react-icons/fi";
import OrderItem from "./OrderComponents/OrderItem";
import AddProductForm from "./OrderComponents/AddProductForm";
import {
  updateOrderItem,
  addItemToOrder,
  deleteOrderItem,
} from "../../../services/orderService";

const EditOrder = ({ isOpen, onClose, order, allProducts, onSave }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [orderDetails, setOrderDetails] = useState(order);
  const toast = useToast();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const {
    isOpen: isAddProductOpen,
    onOpen: onAddProductOpen,
    onClose: onAddProductClose,
  } = useDisclosure();

  useEffect(() => {
    if (order) {
      setOrderDetails(order);
    }
  }, [order]);

  const handleAddProduct = (productData) => {
    setOrderDetails((prevOrderDetails) => {
      const existingItemIndex = prevOrderDetails.items.findIndex(
        (item) => item.product._id === productData._id
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevOrderDetails.items];
        updatedItems[existingItemIndex].quantity += productData.quantity;

        return {
          ...prevOrderDetails,
          items: updatedItems,
        };
      } else {
        return {
          ...prevOrderDetails,
          items: [
            ...prevOrderDetails.items,
            {
              product: { ...productData },
              quantity: productData.quantity,
              _id: productData._id,
              price: productData.price,
            },
          ],
        };
      }
    });
    onAddProductClose(); 
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setOrderDetails((prevOrderDetails) => ({
      ...prevOrderDetails,
      items: prevOrderDetails.items.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  const handleDeleteItem = (itemId) => {
    setOrderDetails((prevOrderDetails) => ({
      ...prevOrderDetails,
      items: prevOrderDetails.items.filter((item) => item._id !== itemId),
    }));
  };

  const handleSave = async () => {
    try {
      // Add new items
      for (const item of orderDetails.items) {
        if (!order.items.some((existingItem) => existingItem._id === item._id)) {
          const itemData = {
            productId: item.product._id,
            quantity: item.quantity,
            price: item.price,
          };
  
          await addItemToOrder(orderDetails._id, itemData, token);
        }
      }
      // Update existing items
      for (const item of orderDetails.items) {
        const originalItem = order.items.find((existingItem) => existingItem._id === item._id);
        if (originalItem && originalItem.quantity !== item.quantity) {
          await updateOrderItem(orderDetails._id, item._id, { quantity: item.quantity }, token);
        }
      }
      // Delete removed items
      for (const originalItem of order.items) {
        if (!orderDetails.items.some((item) => item._id === originalItem._id)) {
          await deleteOrderItem(orderDetails._id, originalItem._id, token);
        }
      }
      toast({
        title: t("order.itemUpdated"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      if (onSave) {
        onSave(orderDetails);
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

  const existingProducts = orderDetails.items.reduce(
    (acc, item) => ({ ...acc, [item.product._id]: true }),
    {}
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx="4">
          <ModalHeader>
            {t("order.editOrder")}
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            {orderDetails.items.map((item) => (
              <OrderItem
                key={item._id}
                item={item}
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDeleteItem}
              />
            ))}
            {/* Add 'Add Product' button */}
            <Button mt={4} onClick={onAddProductOpen}>
              {t("order.addProduct")}
            </Button>
          </ModalBody>
          <ModalFooter>
            {isLargerThan768 ? (
              <Button colorScheme="blue" onClick={handleSave}>
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

      {/* AddProductForm Modal */}
      <AddProductForm
        isOpen={isAddProductOpen}
        onClose={onAddProductClose}
        onAddProduct={handleAddProduct}
        existingProducts={existingProducts}
      />
    </>
  );
};

export default EditOrder;
