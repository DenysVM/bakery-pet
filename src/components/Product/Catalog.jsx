import React, { useState, useEffect } from 'react';
import CatalogFilters from '../Filters/CatalogFilters';
import ProductsGrid from './ProductsGrid';
import { Box, Button, Text, Spinner } from '@chakra-ui/react';
import { getAllProducts } from '../../services/productService';

const ITEMS_PER_PAGE = 6;

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [sortCriteria, setSortCriteria] = useState('');
  const [filterParams, setFilterParams] = useState({
    minPrice: null,
    maxPrice: null,
    minCalories: null,
    maxCalories: null,
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchProducts();
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
        category: '',
      });
      setVisibleCount(ITEMS_PER_PAGE);
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
        (newFilterParams.category === '' || product.category === newFilterParams.category)
      );
    });

    if (sortCriteria) {
      updatedFilteredProducts = sortProducts(updatedFilteredProducts, sortCriteria);
    }

    setFilteredProducts(updatedFilteredProducts);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSortChange = (e) => {
    const newSortCriteria = e.target.value;
    setSortCriteria(newSortCriteria);

    const sortedProducts = sortProducts(filteredProducts, newSortCriteria);
    setFilteredProducts(sortedProducts);
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

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
  };

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
        <Text ml="4">Loading products...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl" color="red.500">
          Failed to load products. Please try again later.
        </Text>
      </Box>
    );
  }

  return (
    <Box padding="4" maxW="1200px" m="auto" mt="6">
      <CatalogFilters
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        sortCriteria={sortCriteria}
        onResetFilters={() => handleFiltersChange({ type: 'reset' })}
      />
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
