import React from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import ProductCard from '..//components/Product/ProductCard'; // Убедитесь, что путь к компоненту верный
import CatalogHeader from '..//components/Product/CatalogHeader';

const CatalogPage = () => {
  // Заглушка продуктов
  const products = [
    {
      id: 1,
      name: { en: "Sourdough Bread", ru: "Хлеб на закваске", uk: "Хліб на заквасці", pl: "Chleb na zakwasie" },
      description: { en: "Artisan sourdough bread.", ru: "Артизанский хлеб на закваске.", uk: "Артизанський хліб на заквасці.", pl: "Rzemieślniczy chleb na zakwasie." },
      price: 5.99,
      imageUrl: "/images/bread.png"
    },
    // Добавьте ещё продукты для демонстрации
  ];

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
