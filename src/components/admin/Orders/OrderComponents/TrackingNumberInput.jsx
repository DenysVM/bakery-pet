import React, { useState } from "react";
import { Box, Input, Text, useToast, Flex } from "@chakra-ui/react";
import ResponsiveActionButtons from "../../../common/ResponsiveActionButtons";
import { EditIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

const TrackingNumberInput = ({
  orderId,
  itemId,
  existingTrackingNumber,
  onSave,
  token,
}) => {
  const { t } = useTranslation();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [currentTrackingNumber, setCurrentTrackingNumber] = useState(
    existingTrackingNumber || ""
  );
  const [isEditing, setIsEditing] = useState(!existingTrackingNumber);
  const toast = useToast();

  const handleTrackingNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setTrackingNumber(value);
  };

  const handleSaveTrackingNumber = async () => {
    if (trackingNumber.length !== 14) {
      toast({
        title: t("novaPoshta.invalidTrackingNumber"),
        description: t("novaPoshta.trackingNumberInvalidFormat"),
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await onSave(orderId, itemId, { trackingNumber }, token);
      setCurrentTrackingNumber(trackingNumber);
      setTrackingNumber("");
      setIsEditing(false);
      toast({
        title: t("novaPoshta.trackingNumberUpdated"),
        description: t("novaPoshta.trackingNumberSuccess"),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("novaPoshta.trackingNumberError"),
        description:
          error.response?.data?.message ||
          t("novaPoshta.trackingNumberSaveFailed"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mt={4}>
      {isEditing ? (
        <Flex align="center" gap={4} mt={2} direction="row">
          <Input
            value={trackingNumber}
            onChange={handleTrackingNumberChange}
            placeholder={t("novaPoshta.trackingNumberPlaceholder")}
            maxLength={14}
            pattern="\d{14}"
          />
          <ResponsiveActionButtons
            buttons={[
              {
                icon: <EditIcon />,
                label: t("order.save"),
                onClick: handleSaveTrackingNumber,
                colorScheme: "teal",
              },
            ]}
            size={{ base: "sm", md: "md" }}
          />
        </Flex>
      ) : (
        <Flex
          direction="row"
          align="center"
          justify="space-between"
          gap={4}
          wrap="wrap"
        >
          <Text fontWeight="bold">
            {t("novaPoshta.trackingNumber")}: {currentTrackingNumber}
          </Text>
          <ResponsiveActionButtons
            buttons={[
              {
                icon: <EditIcon />,
                label: t("novaPoshta.editTrackingNumber"),
                onClick: () => setIsEditing(true),
                colorScheme: "blue",
              },
            ]}
            size={{ base: "sm", md: "md" }}
          />
        </Flex>
      )}
    </Box>
  );
};

export default TrackingNumberInput;
