import React, { useState, useCallback } from "react";
import { Input, Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const OrderSearch = ({ onSearch }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(value.trim().toLowerCase());
    },
    [onSearch]
  );

  return (
    <Box flex="1" mr={{ base: 0, md: 4 }} mb={{ base: 4, md: 0 }}>
      <Input
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={t("order.searchPlaceholder")}
      />
    </Box>
  );
};

export default OrderSearch;
