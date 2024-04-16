import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing="40px">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </SimpleGrid>
  );
};

export default ProductsGrid;
