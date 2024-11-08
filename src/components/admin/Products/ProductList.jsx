// src/components/admin/Products/ProductList.jsx

import React, { useState } from "react";
import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import ProductFilterManager from "../../Filters/ProductFilterManager";
import ProductCreate from "./ProductCreate";
import ProductEdit from "./ProductEdit";
import ProductModal from "../../common/Modal/ProductModal";
import BottomSheet from "../../common/BottomSheet/BottomSheet";
import ProductCard from "./ProductCard";
import ProductDeleteConfirmationDialog from "./ProductDeleteConfirmationDialog";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@chakra-ui/react";
import useProducts from "../../../hooks/useProducts";
import LoadingError from "../../common/LoadingError";
import { deleteProduct } from "../../../services/productService";
import { useAuth } from "../../../auth/AuthContext";

const ProductList = () => {
  const { products, loading, error } = useProducts();
  const { token } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { t } = useTranslation();

  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFilterChange = (updatedProducts) => {
    setFilteredProducts(updatedProducts);
  };

  const handleProductCreated = () => {
    setFilteredProducts([...filteredProducts, products[products.length - 1]]);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    onOpen();
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsEditMode(false);
    onOpen();
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete, token);
      setFilteredProducts(
        filteredProducts.filter((product) => product._id !== productToDelete)
      );
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  if (loading || error) {
    return (
      <LoadingError
        loading={loading}
        error={error}
        errorMessage={t("error.loadProducts")}
      />
    );
  }

  return (
    <Box padding="1" maxW="1400px" m="auto">
      <ProductFilterManager
        products={products}
        onFilterChange={handleFilterChange}
      />

      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button colorScheme="teal" onClick={onCreateOpen}>
          {t("productList.addProduct")}
        </Button>
      </Box>

      <Box>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id || Math.random()}
            product={product}
            onEdit={handleEditProduct}
            onDelete={() => handleDeleteClick(product._id)}
            onViewDetails={handleViewDetails}
          />
        ))}
      </Box>

      <ProductDeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteProduct}
        isDeleting={isDeleting}
      />

      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("productList.createProduct")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductCreate
              onClose={onCreateClose}
              onProductCreated={handleProductCreated}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {selectedProduct && isEditMode ? (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("productEdit.editProduct")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ProductEdit
                product={selectedProduct}
                onClose={onClose}
                token={token}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        selectedProduct &&
        (isLargerThan768 ? (
          <ProductModal
            isOpen={isOpen}
            product={selectedProduct}
            onClose={onClose}
          />
        ) : (
          <BottomSheet
            isOpen={isOpen}
            product={selectedProduct}
            onClose={onClose}
          />
        ))
      )}
    </Box>
  );
};

export default ProductList;
