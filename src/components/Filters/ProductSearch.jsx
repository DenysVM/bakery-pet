// src/components/Filters/ProductSearch.jsx

import React, { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const ProductSearch = ({ onSearch, searchTerm }) => {
  const { t } = useTranslation();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);

    if (value.length >= 3 || value.length === 0) {
      onSearch(value);
    }
  };

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <Input
      id="product-search"
      name="productSearch"
      placeholder={t("filters.searchPlaceholder")}
      value={localSearchTerm}
      onChange={handleInputChange}
    />
  );
};

export default ProductSearch;
