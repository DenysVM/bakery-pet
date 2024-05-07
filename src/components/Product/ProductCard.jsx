import React from 'react';
import { Box, Image, Text, Button, useColorModeValue, useDisclosure, Flex, useMediaQuery } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ProductModal from '../common/Modal/ProductModal';
import BottomSheet from '../common/BottomSheet/BottomSheet';
import { useCart } from '../Cart';

const ProductCard = ({ product }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { t, i18n } = useTranslation();
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('gray.800', 'white');
  const imageUrl = `${process.env.PUBLIC_URL}${product.imageUrl}`;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleModalOpening = () => {
    onOpen();
  };

  return (
    <>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" bg={bg} color={color}>
        <Image src={imageUrl} alt={t(`Picture of ${product.name[i18n.language]}`)} />
        <Box p="2">
          <Box display="flex" alignItems="baseline">
            <Text fontWeight="semibold" letterSpacing="wide">
              {t('price')}: ${product.price}
            </Text>
          </Box>
          <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
            {product.name[i18n.language]}
          </Box>
          <Text mt="2">{product.description[i18n.language]}</Text>
          <Flex justifyContent="space-between">
            <Button mt="4" p="2" colorScheme="teal" onClick={handleAddToCart}>{t('addToCart')}</Button>
            <Button mt="4" p="2" colorScheme="teal" onClick={handleModalOpening}>{t('details')}</Button>
          </Flex>
        </Box>
      </Box>
      {isLargerThan768 ? (
        <ProductModal isOpen={isOpen} product={product} onClose={onClose} />
      ) : (
        <BottomSheet isOpen={isOpen} product={product} onClose={onClose} />
      )}
    </>
  );
};

export default ProductCard;
