import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const UserDeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  const { t } = useTranslation();

  const isCentered = useBreakpointValue({ base: true, md: false });
  const modalMarginBottom = useBreakpointValue({ base: 4, md: 0 });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={isCentered}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90vw", md: "35vw" }}
        mb={modalMarginBottom}
        borderRadius={{ base: "lg", md: "md" }}
      >
        <ModalHeader>{t("userDelete.confirmDeletion")}</ModalHeader>
        <ModalBody>
          <Text>{t("userDelete.confirmMessage", { userName })}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onConfirm}>
            {t("userDelete.confirmDelete")}
          </Button>
          <Button variant="ghost" onClick={onClose} ml={3}>
            {t("userDelete.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserDeleteConfirmationDialog;
