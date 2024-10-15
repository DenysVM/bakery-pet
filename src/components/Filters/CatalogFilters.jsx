import React, { useState } from "react";
import {
  Box,
  Flex,
  FormLabel,
  Input,
  Select,
  Button,
  Stack,
} from "@chakra-ui/react";
import CatalogSort from "./CatalogSort";
import { useTranslation } from "react-i18next";

const CatalogFilters = ({ onFiltersChange, onSortChange, sortCriteria }) => {
  const { t } = useTranslation();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [category, setCategory] = useState("");

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinCalories("");
    setMaxCalories("");
    setCategory("");
    onFiltersChange({
      type: "reset",
      values: {
        minPrice: "",
        maxPrice: "",
        minCalories: "",
        maxCalories: "",
        category: "",
      },
    });
    onSortChange("");
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align="center"
      wrap="wrap"
      gap="4"
      mb="4"
      mt="8"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing="4"
        width="full"
        align="flex-end"
      >
        <Box flex={{ base: "1", md: "2" }}>
          <FormLabel htmlFor="minPrice">{t("filters.priceRange")}:</FormLabel>
          <Flex>
            <Input
              id="minPrice"
              type="number"
              placeholder={t("filters.minPrice")}
              borderRightRadius="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                onFiltersChange({ type: "minPrice", value: e.target.value });
              }}
            />
            <Input
              id="maxPrice"
              type="number"
              placeholder={t("filters.maxPrice")}
              borderLeftRadius="0"
              ml="-1px"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                onFiltersChange({ type: "maxPrice", value: e.target.value });
              }}
            />
          </Flex>
        </Box>

        <Box flex={{ base: "1", md: "2" }}>
          <FormLabel htmlFor="minCalories">
            {t("filters.calorieRange")}:
          </FormLabel>
          <Flex>
            <Input
              id="minCalories"
              type="number"
              placeholder={t("filters.minCalories")}
              borderRightRadius="0"
              value={minCalories}
              onChange={(e) => {
                setMinCalories(e.target.value);
                onFiltersChange({ type: "minCalories", value: e.target.value });
              }}
            />
            <Input
              id="maxCalories"
              type="number"
              placeholder={t("filters.maxCalories")}
              borderLeftRadius="0"
              ml="-1px"
              value={maxCalories}
              onChange={(e) => {
                setMaxCalories(e.target.value);
                onFiltersChange({ type: "maxCalories", value: e.target.value });
              }}
            />
          </Flex>
        </Box>

        <Box width={{ base: "100%", md: "30%" }}>
          <Flex>
            <Box flex="1">
              <FormLabel htmlFor="category">{t("filters.category")}:</FormLabel>
              <Select
                id="category"
                value={category}
                borderRightRadius="0"
                onChange={(e) => {
                  setCategory(e.target.value);
                  onFiltersChange({ type: "category", value: e.target.value });
                }}
              >
                <option value="">{t("filters.all")}</option>
                <option value="bread">{t("filters.bread")}</option>
                <option value="pastry">{t("filters.pastry")}</option>
                <option value="cake">{t("filters.cake")}</option>
              </Select>
            </Box>

            <Box flex="1">
              <CatalogSort
                onSortChange={onSortChange}
                sortCriteria={sortCriteria}
              />
            </Box>
          </Flex>
        </Box>

        <Button
          width={{ base: "100%", md: "20%" }}
          colorScheme="blue"
          onClick={resetFilters}
          alignSelf={{ base: "center", md: "flex-end" }}
          mt="auto"
        >
          {t("filters.resetFilters")}
        </Button>
      </Stack>
    </Flex>
  );
};

export default CatalogFilters;
