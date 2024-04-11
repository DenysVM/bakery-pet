import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import ProductCard from '..//components/Product/ProductCard';
import CatalogHeader from '..//components/Product/CatalogHeader';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/products.json`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <Box padding="4">
      <CatalogHeader />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="40px">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CatalogPage;
