// src/components/Filters/ProductFilterManager.jsx

import React, { useState, useEffect, useCallback } from "react";
import CatalogFilters from "./CatalogFilters";
import { filterProducts, sortProducts } from "../../utils/productUtils";

const ProductFilterManager = ({ products, onFilterChange }) => {
  const [sortCriteria, setSortCriteria] = useState("");
  const [filterParams, setFilterParams] = useState({
    minPrice: null,
    maxPrice: null,
    minCalories: null,
    maxCalories: null,
    category: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [lastFilteredProducts, setLastFilteredProducts] = useState([]);

  const applyFiltersAndSort = useCallback(() => {
    let updatedFilteredProducts = filterProducts(products, filterParams);

    if (searchTerm) {
      updatedFilteredProducts = updatedFilteredProducts.filter((product) =>
        Object.values(product.name || {}).some((name) =>
          name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (sortCriteria) {
      updatedFilteredProducts = sortProducts(updatedFilteredProducts, sortCriteria);
    }

    if (JSON.stringify(updatedFilteredProducts) !== JSON.stringify(lastFilteredProducts)) {
      setLastFilteredProducts(updatedFilteredProducts);
      onFilterChange(updatedFilteredProducts);
    }
  }, [products, filterParams, searchTerm, sortCriteria, lastFilteredProducts, onFilterChange]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleFiltersChange = ({ type, value }) => {
    if (type === "reset") {
      handleResetFilters();
      return;
    }
    if (type === "searchTerm") {
      handleSearch(value);
      return;
    }
    const newFilterParams = {
      ...filterParams,
      [type]: type === "category" ? value : value ? Number(value) : null,
    };
    setFilterParams(newFilterParams);
  };

  const handleResetFilters = () => {
    setFilterParams({
      minPrice: null,
      maxPrice: null,
      minCalories: null,
      maxCalories: null,
      category: "",
    });
    setSearchTerm("");
    setSortCriteria("");
  };

  const handleSortChange = (sortOption) => {
    setSortCriteria(sortOption);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <CatalogFilters
      onFiltersChange={handleFiltersChange}
      onSortChange={handleSortChange}
      sortCriteria={sortCriteria}
      onReset={handleResetFilters}
      onSearch={handleSearch}
      searchTerm={searchTerm} 
    />
  );
};

export default ProductFilterManager;
