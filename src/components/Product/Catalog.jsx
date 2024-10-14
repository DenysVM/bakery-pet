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

  useEffect(() => {
    let updatedFilteredProducts = products.filter(product => {
      const categoryMatch = filterParams.category === '' || product.category === filterParams.category;

      const priceMatch =
        (!filterParams.minPrice || product.price >= Number(filterParams.minPrice)) &&
        (!filterParams.maxPrice || product.price <= Number(filterParams.maxPrice));

      const calorieMatch =
        (!filterParams.minCalories || product.calories >= Number(filterParams.minCalories)) &&
        (!filterParams.maxCalories || product.calories <= Number(filterParams.maxCalories));

      return categoryMatch && priceMatch && calorieMatch;
    });

    if (sortCriteria) {
      updatedFilteredProducts = sortProducts(updatedFilteredProducts, sortCriteria);
    }

    setFilteredProducts(updatedFilteredProducts);
    setVisibleCount(ITEMS_PER_PAGE);
  }, [products, filterParams, sortCriteria]);

  const sortProducts = (products, criteria) => {
    return [...products].sort((a, b) => {
      if (criteria === 'price_asc') {
        return a.price - b.price;
      } else if (criteria === 'price_desc') {
        return b.price - a.price;
      } else if (criteria === 'calories_asc') {
        return a.calories - b.calories;
      } else if (criteria === 'calories_desc') {
        return b.calories - a.calories;
      }
      return 0;
    });
  };

  const handleFiltersChange = ({ type, value }) => {
    if (type === 'reset') {
      setFilterParams({
        minPrice: null,
        maxPrice: null,
        minCalories: null,
        maxCalories: null,
        category: '',
      });
      setSortCriteria('');
      return;
    }

    const newFilterParams = {
      ...filterParams,
      [type]: type === 'category' ? value : value ? Number(value) : null,
    };

    setFilterParams(newFilterParams);
  };

  const handleSortChange = (sortOption) => {
    setSortCriteria(sortOption); 
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
