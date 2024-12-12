import React, { useState } from "react";
import { Input, Box, Spinner, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { debouncedSearch } from "../../utils/novaPoshtaUtils";

const WarehouseByCode = ({ cityRef, onWarehouseSelect }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [warehouse, setWarehouse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value.trim();
    setCode(value);
    setWarehouse(null);
    setError(null);
    onWarehouseSelect(null);

    try {
      debouncedSearch(
        value,
        cityRef,
        t,
        (results) => {
          if (results.length === 1) {
            setWarehouse(results[0]);
            onWarehouseSelect(results[0]);
          } else {
            setError(t("novaPoshta.errorNoWarehouse"));
          }
        },
        setError,
        setLoading,
        "byCode"
      );
    } catch (error) {
      console.error("Error during warehouse search by code:", error);
    }
  };

  const handleKeyPress = (e) => {
    const allowedKeys = /^[\d/]$/;
    if (!allowedKeys.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Box position="relative">
      <Input
        id="warehouseByCode"
        name="warehouseByCode"
        placeholder={t("novaPoshta.placeholderCode")}
        value={code}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        mb={4}
        pr="40px"
        width="100%"
      />
      {loading && <Spinner position="absolute" right="10px" top="10px" />}
      {!loading && error && !warehouse && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )}
    </Box>
  );
};

export default WarehouseByCode;
