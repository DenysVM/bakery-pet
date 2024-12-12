import React, { useState, useRef } from "react";
import {
  Input,
  List,
  ListItem,
  Spinner,
  Box,
  Text,
  useColorModeValue,
  useOutsideClick,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { debouncedSearch } from "../../utils/novaPoshtaUtils";

const WarehouseByAddress = ({ cityRef, onWarehouseSelect }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("black", "white");
  const hoverColor = useColorModeValue("gray.200", "gray.600");

  const ref = useRef();

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setQuery(value);
    setError(null);
    onWarehouseSelect(null);

    if (value.length < 1) {
      setIsOpen(false);
      setWarehouses([]);
      return;
    }

    debouncedSearch(
      value,
      cityRef,
      t,
      (foundWarehouses) => {
        if (Array.isArray(foundWarehouses) && foundWarehouses.length > 0) {
          setWarehouses(foundWarehouses);
          setIsOpen(true);
          setError(null);
        } else {
          setWarehouses([]);
          setError(t("novaPoshta.errorNoWarehouse"));
          setIsOpen(false);
        }
      },
      setError,
      setLoading,
      "byAddress"
    );
  };

  const handleWarehouseSelect = (warehouse) => {
    if (!warehouse || !warehouse.value || !warehouse.label) {
      return;
    }

    const formattedWarehouse = {
      label: warehouse.label,
      value: warehouse.value,
      warehouseIndex: warehouse.warehouseIndex,
      shortAddress: warehouse.shortAddress,
      category: warehouse.category,
    };

    onWarehouseSelect(formattedWarehouse);
    setIsOpen(false);
    setQuery(formattedWarehouse.label);
  };

  return (
    <Box position="relative" ref={ref}>
      <Input
        id="warehouseByAddress"
        name="warehouseByAddress"
        placeholder={t("novaPoshta.placeholderCity")}
        value={query}
        onChange={handleInputChange}
        mb={4}
      />
      {loading && <Spinner position="absolute" right="10px" top="10px" />}
      {isOpen && warehouses.length > 0 && (
        <List
          bg={bgColor}
          color={textColor}
          border="1px solid gray"
          borderRadius="md"
          mt={1}
          position="absolute"
          zIndex="1"
          maxHeight="200px"
          overflowY="auto"
          width="100%"
          boxShadow="lg"
        >
          {warehouses.map((warehouse) => (
            <ListItem
              key={warehouse.value}
              padding="8px"
              cursor="pointer"
              _hover={{ bg: hoverColor }}
              onClick={() => handleWarehouseSelect(warehouse)}
            >
              {t(`novaPoshta.${warehouse.category}`)} №{warehouse.number}: {warehouse.shortAddress}
            </ListItem>
          ))}
        </List>
      )}
      {!loading && error && <Text color="red.500" mt={4}>{error}</Text>}
    </Box>
  );
};

export default WarehouseByAddress;
