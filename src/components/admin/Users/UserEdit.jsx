import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
  CloseButton,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { getUser, updateUser } from "../../../services/userService";
import ResponsiveActionButtons from "../../common/ResponsiveActionButtons";

const UserEdit = ({
  userId,
  token,
  isOpen,
  onClose,
  onSaveSuccess,
  isAdmin = false,
}) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !token) return;
      try {
        const data = await getUser(userId, token);
        setProfile(data);
      } catch (error) {
        toast({
          title: t("userProfile.error.fetch"),
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [token, userId, isOpen, t, toast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser(userId, profile, token);
      toast({
        title: t("userProfile.success.update"),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      if (onSaveSuccess) onSaveSuccess(profile);
      onClose();
    } catch (error) {
      toast({
        title: t("userProfile.error.update"),
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const actionButtons = [
    {
      icon: <CheckIcon />,
      label: t("userProfile.save"),
      onClick: handleSave,
      colorScheme: "teal",
      isLoading: isSaving,
    },
    {
      icon: <CloseIcon />,
      label: t("userProfile.cancel"),
      onClick: onClose,
      colorScheme: "gray",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90%", md: "500px" }}
        p={4}
        mt={{ base: "20px", md: "50px" }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <ModalHeader>{t("userProfile.edit")}</ModalHeader>
          <CloseButton onClick={onClose} />
        </Box>
        <ModalBody>
          {loading ? (
            <p>{t("loading")}</p>
          ) : profile ? (
            <VStack spacing={4}>
              <FormControl id="firstName">
                <FormLabel>{t("user.name")}</FormLabel>
                <Input
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder={t("user.firstName")}
                  autoComplete="given-name"
                />
              </FormControl>
              <FormControl id="lastName">
                <FormLabel>{t("user.name")}</FormLabel>
                <Input
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder={t("user.lastName")}
                  autoComplete="family-name"
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>{t("user.email")}</FormLabel>
                <Input
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder={t("user.email")}
                  autoComplete="email"
                  isDisabled={!isAdmin}
                />
              </FormControl>
              <FormControl id="phone">
                <FormLabel>{t("user.phone")}</FormLabel>
                <Input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder={t("user.phone")}
                  autoComplete="tel"
                />
              </FormControl>
              <FormControl id="addressStreet">
                <FormLabel>{t("user.street")}</FormLabel>
                <Input
                  value={profile.address?.street || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                  placeholder={t("user.address.street")}
                  autoComplete="street-address"
                />
              </FormControl>
              <FormControl id="addressHouseNumber">
                <FormLabel>{t("user.houseNumber")}</FormLabel>
                <Input
                  value={profile.address?.houseNumber || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, houseNumber: e.target.value },
                    }))
                  }
                  placeholder={t("user.houseNumber")}
                  autoComplete="address-level2"
                />
              </FormControl>
              <FormControl id="addressApartmentNumber">
                <FormLabel>{t("user.apartmentNumber")}</FormLabel>
                <Input
                  value={profile.address?.apartmentNumber || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        apartmentNumber: e.target.value,
                      },
                    }))
                  }
                  placeholder={t("user.apartmentNumber")}
                  autoComplete="address-level2"
                />
              </FormControl>
              <FormControl id="addressCity">
                <FormLabel>{t("user.city")}</FormLabel>
                <Input
                  value={profile.address?.city || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                />
              </FormControl>
            </VStack>
          ) : (
            <p>{t("userProfile.noData")}</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Box
            width="100%"
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <ResponsiveActionButtons
              buttons={actionButtons}
              isAttached={true}
            />
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserEdit;
