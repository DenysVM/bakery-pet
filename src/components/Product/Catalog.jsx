import React, { useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import ProductFilterManager from '../Filters/ProductFilterManager';
import ProductsGrid from './ProductsGrid';
import useProducts from '../../hooks/useProducts';
import LoadingError from '../common/LoadingError';

const ITEMS_PER_PAGE = 6;

const Catalog = () => {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleFilterChange = (updatedProducts) => {
    setFilteredProducts(updatedProducts);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
  };

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  if (loading || error) {
    return (
      <LoadingError
        loading={loading}
        error={error}
        errorMessage="Failed to load products. Please try again later."
        loadingMessage="Loading products..."
      />
    );
  }

  return (
    <Box padding="4" maxW="1200px" m="auto" mt="6">
      {/* Используем ProductFilterManager */}
      <ProductFilterManager products={products} onFilterChange={handleFilterChange} />
      
      <Box>
        <ProductsGrid products={visibleProducts} />
      </Box>
      {visibleCount < filteredProducts.length && (
        <Box display="flex" justifyContent="center" mt="6">
          <Button onClick={handleLoadMore} colorScheme="teal">
            Load More
          </Button>
        </Box>
      )}
      {filteredProducts.length === 0 && (
        <Box textAlign="center" mt="10">
          <Text fontSize="xl">No products found matching your criteria.</Text>
        </Box>
      )}
    </Box>
  );
};

export default Catalog;
