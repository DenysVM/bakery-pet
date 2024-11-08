// src/components/admin/Products/ProductDelete.jsx

import React from "react";
import { IconButton, Button, useDisclosure } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import ProductDeleteConfirmationDialog from "./ProductDeleteConfirmationDialog";
import { useTranslation } from "react-i18next";

const ProductDelete = ({ productId, onDelete, isDeleting, isMobile }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const confirmDelete = () => {
    onDelete(productId);
    onClose();
  };

  return (
    <>
      {isMobile ? (
        <IconButton
          icon={<FaTrash />}
          colorScheme="red"
          aria-label={t("product.delete")}
          onClick={onOpen}
          isLoading={isDeleting}
        />
      ) : (
        <Button
          colorScheme="red"
          onClick={onOpen}
          isLoading={isDeleting}
        >
          {t("product.delete")}
        </Button>
      )}

      <ProductDeleteConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ProductDelete;
