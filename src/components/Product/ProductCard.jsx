import React from 'react';
import { Box, Image, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('gray.800', 'white');
  const imageUrl = `${process.env.PUBLIC_URL}${product.imageUrl}`; // Измененная строка

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" bg={bg} color={color}>
      <Image src={imageUrl} alt={`Picture of ${product.name[i18n.language]}`} />

      <Box p="6">
        <Box d="flex" alignItems="baseline">
          <Text fontWeight="semibold" letterSpacing="wide" fontSize="xs" textTransform="uppercase">
            {t('price')}: ${product.price}
          </Text>
        </Box>
        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
          {product.name[i18n.language]}
        </Box>
        <Text mt="2">{product.description[i18n.language]}</Text>
        <Button mt="4" colorScheme="teal">{t('addToCart')}</Button>
      </Box>
    </Box>
  );
};

export default ProductCard;
