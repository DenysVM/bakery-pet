// src/components/Cart/CartItem.js

import React from 'react';
import { Box, Text, Image, Button, Input, IconButton, useDisclosure, useMediaQuery, FormControl, FormLabel } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { useCart } from '../Cart';
import { useTranslation } from 'react-i18next';
import { useBreakpointValue } from '@chakra-ui/media-query';
import ProductModal from '../common/Modal/ProductModal';
import BottomSheet from '../common/BottomSheet/BottomSheet';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const { i18n } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const isDesktop = useBreakpointValue({ base: false, md: true });

  const handleChange = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      updateQuantity(item.productId, newQuantity);
    } else {
      removeFromCart(item.productId);
    }
  };

  const imageUrl = `${process.env.PUBLIC_URL}${item.imageUrl}`;
  const itemTotal = (item.price * item.quantity).toFixed(2);

  if (!item.name) {
    console.error('Item name is undefined', item);
    return null;
  }

  return (
    <Box display="flex" alignItems="center" p="2" borderWidth="1px" borderRadius="lg" mb="4">
      <Image src={imageUrl} alt={item.name[i18n.language]} boxSize="50px" objectFit="cover" borderRadius="3px" />
      <Text flex="1" textAlign="left" pl="4" fontWeight="bold" onClick={onOpen} cursor="pointer">
        {item.name[i18n.language]} - ${item.price.toFixed(2)} x {item.quantity} = ${itemTotal}
      </Text>
      {isLargerThan768 ? (
        <ProductModal isOpen={isOpen} product={item} onClose={onClose} />
      ) : (
        <BottomSheet isOpen={isOpen} product={item} onClose={onClose} />
      )}
      <Box display="flex" alignItems="center">
        <Button onClick={() => handleChange(-1)} size="sm">-</Button>
        <FormControl>
          <FormLabel htmlFor={`quantity-${item.productId}`}>
          </FormLabel>
          <Input
            id={`quantity-${item.productId}`}
            type="number"
            value={item.quantity}
            onChange={(e) => handleChange(parseInt(e.target.value) - item.quantity)}
            width="40px"
            mx="2"
            padding="0px"
            textAlign="center"
          />
        </FormControl>
        <Button onClick={() => handleChange(1)} size="sm">+</Button>
      </Box>
      <Button
        as={isDesktop ? Button : IconButton}
        icon={isDesktop ? null : <MdDelete />}
        colorScheme="red"
        onClick={() => removeFromCart(item.productId)}
        ml="2"
        {...(isDesktop ? {} : { padding: '0', size: 'sm', boxSize: '40px' })}
        children={isDesktop ? "Remove" : undefined}
      />
    </Box>
  );
};

export default CartItem;
