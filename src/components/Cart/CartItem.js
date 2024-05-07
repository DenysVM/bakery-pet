import React from 'react';
import { Box, Text, Image, Button, Input } from '@chakra-ui/react';
import { useCart } from '../Cart';
import { useTranslation } from 'react-i18next';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const { i18n } = useTranslation();

  const handleChangeQuantity = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    }
  };
  const imageUrl = `${process.env.PUBLIC_URL}${item.imageUrl}`;
  return (
    <Box display="flex" alignItems="center" p="2" borderWidth="1px" borderRadius="lg" margin="2">
      <Image src={imageUrl} alt={item.name[i18n.language]} boxSize="50px" objectFit="cover" />
      <Text flex="1" textAlign="left" pl="4" fontWeight="bold">
        {item.name[i18n.language]} - ${item.price.toFixed(2)}
      </Text>
      <Input 
        type="number"
        value={item.quantity}
        onChange={handleChangeQuantity}
        width="50px"
        mr="2"
      />
      <Button colorScheme="red" onClick={() => removeFromCart(item.id)}>
        Remove
      </Button>
    </Box>
  );
};

export default CartItem;
