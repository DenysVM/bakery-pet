import React, { useState, useEffect } from 'react';
import CatalogFilters from '../Filters/CatalogFilters';
import ProductsGrid from './ProductsGrid';
import { Box } from '@chakra-ui/react';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('');
  const [filterParams, setFilterParams] = useState({
    minPrice: null,
    maxPrice: null,
    minCalories: null,
    maxCalories: null,
  });

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/products.json`)
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleFiltersChange = ({ type, value }) => {
    if (type === 'reset') {
      setFilteredProducts(products);
      setSortCriteria('');
      setFilterParams({
        minPrice: null,
        maxPrice: null,
        minCalories: null,
        maxCalories: null,
      });
      return;
    }

    const newFilterParams = { ...filterParams, [type]: Number(value) || null };
    setFilterParams(newFilterParams);

    let updatedFilteredProducts = products.filter(product => {
      return (
        (!newFilterParams.minPrice || product.price >= newFilterParams.minPrice) &&
        (!newFilterParams.maxPrice || product.price <= newFilterParams.maxPrice) &&
        (!newFilterParams.minCalories || product.calories >= newFilterParams.minCalories) &&
        (!newFilterParams.maxCalories || product.calories <= newFilterParams.maxCalories) &&
        (type !== 'category' || value === '' || product.category === value)
      );
    });

    if (sortCriteria) {
      updatedFilteredProducts = sortProducts(updatedFilteredProducts, sortCriteria);
    }
    setFilteredProducts(updatedFilteredProducts);
  };

  const handleSortChange = (e) => {
    const newSortCriteria = e.target.value;
    setSortCriteria(newSortCriteria);
    if (newSortCriteria) {
      const sortedProducts = sortProducts(filteredProducts, newSortCriteria);
      setFilteredProducts(sortedProducts);
    }
  };

  const sortProducts = (products, criteria) => {
    return [...products].sort((a, b) => {
      if (criteria === 'price') {
        return a.price - b.price;
      } else if (criteria === 'calories') {
        return a.calories - b.calories;
      }
      return 0;
    });
  };

  return (
    <Box padding="4" maxW="1200px" margin="auto" mt="5">
      <CatalogFilters
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        sortCriteria={sortCriteria}
        onResetFilters={() => handleFiltersChange({ type: 'reset' })}
      />
      <Box mt="6">
        <ProductsGrid products={filteredProducts} />
      </Box>
    </Box>
  );
};

export default Catalog;
