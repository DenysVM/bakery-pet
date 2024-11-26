import React from "react";
import { Box, Input } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const OrderFilter = ({ onFilter }) => {
  const { t } = useTranslation();

  const handleDateChange = (e) => {
    const selectedDate = e.target.value ? new Date(e.target.value) : null;
    onFilter(selectedDate);
  };

  return (
    <Box flex="1">
      <Input
        type="date"
        onChange={handleDateChange}
        placeholder={t("order.filterByDate")}
      />
    </Box>
  );
};

export default OrderFilter;
