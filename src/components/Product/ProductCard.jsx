import React from 'react';
import { Box, Image, Text, Button, Flex, useColorModeValue, useDisclosure, useMediaQuery, Icon, Badge } from '@chakra-ui/react';
import { MdAddShoppingCart, MdInfoOutline, MdShoppingCart } from 'react-icons/md';
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
  const { addToCart, cartItems } = useCart();
  const isInCart = cartItems.some(item => item.id === product.id);
  const cartQuantity = cartItems.reduce((total, item) => (item.id === product.id ? total + item.quantity : total), 0);
  const buttonStyles = {
    colorScheme: "blue",
    variant: "outline",
    size: isLargerThan768 ? "md" : "sm",
    mt: "4",
    p: "2",
    alignItems: "center",
  };
  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleModalOpening = () => {
    onOpen();
  };

  return (
    <>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" bg={bg} color={color}>
        <Image src={imageUrl} alt={t('productCard.pictureOf', { name: product.name[i18n.language] })} />
        <Box p="2">
          <Box display="flex" alignItems="baseline">
            <Text fontWeight="semibold" letterSpacing="wide">
              {t('productCard.price')}: ${product.price}
            </Text>
          </Box>
          <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
            {product.name[i18n.language]}
          </Box>
          <Text mt="2">
            {product.description[i18n.language]}
          </Text>
          <Flex justifyContent="space-between">
            <AddToCartButton
              isInCart={isInCart}
              cartQuantity={cartQuantity}
              handleAddToCart={handleAddToCart}
              isLargerThan768={isLargerThan768}
              t={t}
              buttonStyles={buttonStyles} 
            />
            <ProductDetailsButton
              handleModalOpening={handleModalOpening}
              isLargerThan768={isLargerThan768}
              t={t}
              buttonStyles={buttonStyles}
            />
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

const AddToCartButton = ({ isInCart, cartQuantity, handleAddToCart, isLargerThan768, t, buttonStyles }) => (
  <Button
    onClick={handleAddToCart}
    {...buttonStyles} 
    ><Icon as={isInCart ? MdShoppingCart : MdAddShoppingCart} boxSize={6} />
     {isLargerThan768 ? (
      <>
        {isInCart ? t('productCard.inCart') : t('productCard.addToCart')}
        {cartQuantity > 0 && <Badge colorScheme="blue" ml="2">{cartQuantity}</Badge>}
      </>
    ) : (
      <>
        {cartQuantity > 0 && <Badge colorScheme="blue" ml="2">{cartQuantity}</Badge>}
      </>
    )}
  </Button>
);

const ProductDetailsButton = ({ handleModalOpening, isLargerThan768, t, buttonStyles }) => (
  <Button
    onClick={handleModalOpening}
    {...buttonStyles} 
  ><Icon as={MdInfoOutline} boxSize={6} />
    {isLargerThan768 ? t('productCard.details') : ''}
  </Button>
);


export default ProductCard;
