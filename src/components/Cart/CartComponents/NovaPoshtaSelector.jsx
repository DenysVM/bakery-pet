import React, { useState } from "react";
import {
  Checkbox,
  Box,
  Text,
  RadioGroup,
  Radio,
  Stack,
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
      // Если warehouse равен null, просто очищаем состояние без предупреждения
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
  

  if (!isSelected) {
    return (
      <Checkbox id="useNovaPoshta" isChecked={isSelected} onChange={onToggle}>
        {t("novaPoshta.useNovaPoshta")}
      </Checkbox>
    );
  }

  return (
    <Box minWidth="500px">
      <Checkbox
        id="useNovaPoshta"
        isChecked={isSelected}
        onChange={onToggle}
        mb={4}
      >
        {t("novaPoshta.useNovaPoshta")}
      </Checkbox>

      <RadioGroup onChange={setSearchMethod} value={searchMethod} mb={4}>
        <Stack direction="row">
          <Radio value="byCode">{t("novaPoshta.searchByCode")}</Radio>
          <Radio value="byCity">{t("novaPoshta.searchByCity")}</Radio>
        </Stack>
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
        <Text mt={4}>
          {t("novaPoshta.selectedWarehouse")}: №
          {selectedWarehouse.warehouseIndex} - {selectedWarehouse.shortAddress}
        </Text>
      )}
    </Box>
  );
};

export default NovaPoshtaSelector;
