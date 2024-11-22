// src/components/admin/Orders/DeleteConfirmationDialog.jsx

import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  t,
}) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent mx="4">
          <AlertDialogHeader>{t("order.confirmDeleteMessage")}</AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              isLoading={isDeleting}
            >
              {t("order.deleteOrder")}
            </Button>
            <Button ref={cancelRef} onClick={onClose} ml={3}>
              {t("order.cancel")}
            </Button>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
