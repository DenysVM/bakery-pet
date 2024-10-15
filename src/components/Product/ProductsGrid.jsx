import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import ProductCard from './ProductCard';

const ProductsGrid = ({ products }) => {
  return (
    <SimpleGrid templateColumns={{ base: "1fr", sm: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} justifyItems="center">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </SimpleGrid>
  );
};

export default ProductsGrid;