import React, { useEffect, useState } from "react";
import { Text, Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { getDeliveryStatus } from "../../../../services/novaPoshtaService";

const DeliveryStatus = ({ trackingNumber }) => {
  const { t } = useTranslation();
  const [deliveryStatus, setDeliveryStatus] = useState("Unknown");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!trackingNumber) {
      setDeliveryStatus("Unknown");
      return;
    }

    const fetchDeliveryStatus = async () => {
      setIsLoading(true);
      try {
        const status = await getDeliveryStatus(trackingNumber);
        setDeliveryStatus(status.toLowerCase() || "Unknown"
        );
      } catch (error) {
        setDeliveryStatus("Unknown");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryStatus();
  }, [trackingNumber]);

  const renderDeliveryStatus = () => {
    if (isLoading) {
      return <Spinner size="sm" />;
    }

    if (deliveryStatus === "Unknown") {
      return <Text fontWeight="semi-bold">{t("novaPoshta.deliveryStatus.Unknown")}</Text>;
    }

    const localizationKey = `novaPoshta.deliveryStatus.${deliveryStatus}`;
    const localizedText = t(localizationKey);

    return (
      <Text fontWeight="semi-bold">
        {localizedText !== localizationKey ? localizedText : deliveryStatus}
      </Text>
    );
  };

  return <>{renderDeliveryStatus()}</>;
};

export default DeliveryStatus;
