// src/components/admin/Products/ProductDeleteConfirmationDialog.jsx

import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const ProductDeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const cancelRef = React.useRef();
  const { t } = useTranslation();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent mx="4">
          <AlertDialogHeader>
            {t("product.confirmDeleteMessage")}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              isLoading={isDeleting}
            >
              {t("product.delete")}
            </Button>
            <Button ref={cancelRef} onClick={onClose} ml={3}>
              {t("product.cancel")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ProductDeleteConfirmationDialog;
