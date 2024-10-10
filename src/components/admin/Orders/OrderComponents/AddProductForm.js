// AddProductForm.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  HStack,
  VStack,
  Input,
  Button,
  IconButton,
  useMediaQuery,
  useToast,
  Spinner,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MinusIcon, AddIcon, CheckIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/i18n";
import { getAllProducts } from "../../../../services/productService";

const AddProductForm = ({
  isOpen,
  onClose,
  onAddProduct,
  existingProducts = {},
}) => {
  const { t } = useTranslation();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const allProducts = await getAllProducts();
          setProducts(allProducts);
        } catch (error) {
          toast({
            title: t("order.errorFetchingProducts"),
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen, t, toast]);

  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast({
        title: t("order.errorInvalidProduct"),
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const productInfo = products.find((p) => p._id === selectedProduct);

    if (!productInfo) {
      toast({
        title: t("order.errorInvalidProduct"),
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    onAddProduct({ ...productInfo, quantity: newProductQuantity });

    setSelectedProduct("");
    setNewProductQuantity(1);
    onClose(); 
  };

  const availableProducts = products.filter(
    (product) => !existingProducts[product._id]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx="4">
        <ModalHeader>
          {t("order.addProduct")}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : (
            <FormControl mt={4}>
              <FormLabel htmlFor="product-select">
                {t("order.selectProduct")}
              </FormLabel>
              <VStack spacing={4} align="stretch">
                <Select
                  id="product-select"
                  name="product"
                  placeholder={t("order.selectProduct")}
                  value={selectedProduct || ""}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  {availableProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name[i18n.language]}
                    </option>
                  ))}
                </Select>
                <HStack spacing={2}>
                  {isLargerThan768 ? (
                    <Button
                      onClick={() =>
                        setNewProductQuantity((prev) => Math.max(1, prev - 1))
                      }
                      id="decrease-new-product"
                    >
                      -
                    </Button>
                  ) : (
                    <IconButton
                      aria-label={t("decrease")}
                      icon={<MinusIcon />}
                      onClick={() =>
                        setNewProductQuantity((prev) => Math.max(1, prev - 1))
                      }
                      id="decrease-new-product"
                    />
                  )}
                  <Input
                    id="product-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    maxW="60px"
                    textAlign="center"
                    value={newProductQuantity}
                    onChange={(e) =>
                      setNewProductQuantity(Number(e.target.value))
                    }
                  />
                  {isLargerThan768 ? (
                    <Button
                      onClick={() =>
                        setNewProductQuantity((prev) => prev + 1)
                      }
                      id="increase-new-product"
                    >
                      +
                    </Button>
                  ) : (
                    <IconButton
                      aria-label={t("increase")}
                      icon={<AddIcon />}
                      onClick={() =>
                        setNewProductQuantity((prev) => prev + 1)
                      }
                      id="increase-new-product"
                    />
                  )}
                </HStack>
              </VStack>
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          {isLargerThan768 ? (
            <Button onClick={handleAddProduct} colorScheme="green" id="add-product">
              {t("add")}
            </Button>
          ) : (
            <IconButton
              aria-label={t("add")}
              icon={<CheckIcon />}
              onClick={handleAddProduct}
              colorScheme="green"
              id="add-product"
            />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductForm;
