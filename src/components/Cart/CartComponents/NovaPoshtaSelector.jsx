import React, { useState } from "react";
import {
  Checkbox,
  Box,
  Text,
  RadioGroup,
  Radio,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  CitySelector,
  WarehouseByAddress,
  WarehouseByCode,
} from "../../NovaPoshta";

const NovaPoshtaSelector = ({ isSelected, onToggle, value, onChange }) => {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [searchMethod, setSearchMethod] = useState("byCode");

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedWarehouse(null);
  };

  const handleWarehouseSelect = (warehouse) => {
    if (!warehouse) {
      setSelectedWarehouse(null);
      onChange(null);
      return;
    }

    if (
      typeof warehouse !== "object" ||
      !warehouse.warehouseIndex ||
      !warehouse.shortAddress
    ) {
      console.warn("Attempted to set an invalid warehouse object:", warehouse);
      setSelectedWarehouse(null);
      return;
    }

    setSelectedWarehouse(warehouse);
    onChange(warehouse);
  };

  return (
    <VStack align="stretch" rounded="md" width="100%">
      <Checkbox id="useNovaPoshta" isChecked={isSelected} onChange={onToggle}>
        {t("novaPoshta.useNovaPoshta")}
      </Checkbox>

      {isSelected && (
        <Box p={2}>
          <RadioGroup
            onChange={setSearchMethod}
            value={searchMethod}
            mb={4}
            size="sm"
          >
            <VStack align="stretch">
              <Radio value="byCode">{t("novaPoshta.searchByCode")}</Radio>
              <Radio value="byCity">{t("novaPoshta.searchByCity")}</Radio>
            </VStack>
          </RadioGroup>

          {searchMethod === "byCode" && (
            <>
              <CitySelector
                onCitySelect={handleCitySelect}
                selectedCity={selectedCity}
              />
              {selectedCity && (
                <WarehouseByCode
                  cityRef={selectedCity.value}
                  onWarehouseSelect={handleWarehouseSelect}
                />
              )}
            </>
          )}

          {searchMethod === "byCity" && (
            <>
              <CitySelector
                onCitySelect={handleCitySelect}
                selectedCity={selectedCity}
              />
              {selectedCity && (
                <WarehouseByAddress
                  cityRef={selectedCity.value}
                  onWarehouseSelect={handleWarehouseSelect}
                />
              )}
            </>
          )}

          {selectedWarehouse && (
            <Text mt={4} fontSize="sm">
              {t("novaPoshta.selectedWarehouse")}: №
              {selectedWarehouse.warehouseIndex} -{" "}
              {selectedWarehouse.shortAddress}
            </Text>
          )}
        </Box>
      )}
    </VStack>
  );
};

export default NovaPoshtaSelector;
