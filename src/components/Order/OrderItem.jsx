import React from 'react';
import { Box, Text, Button, Image, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ProductModal from '../common/Modal/ProductModal';
import BottomSheet from '../common/BottomSheet/BottomSheet';

const OrderItem = ({ item, isEditable, onEditItem, onDeleteItem, products }) => {
  const { t, i18n } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  
  const product = products.find(p => p.productId === item.productId);

  if (!product) {
    console.error('Product not found for item', item);
    return null;
  }

  const imageUrl = `${process.env.PUBLIC_URL}${product.imageUrl}`;
  const itemName = product.name[i18n.language] || 'Product Name';

  return (
    <Box display="flex" alignItems="center" p="2" borderWidth="1px" borderRadius="lg" mb="4">
      <Image src={imageUrl} alt={itemName} boxSize="50px" objectFit="cover" borderRadius="3px" />
      <Text flex="1" textAlign="left" pl="4" fontWeight="bold" onClick={onOpen} cursor="pointer">
        {itemName} - ${item.price.toFixed(2)} x {item.quantity}
      </Text>
      {isLargerThan768 ? (
        <ProductModal isOpen={isOpen} product={product} onClose={onClose} />
      ) : (
        <BottomSheet isOpen={isOpen} product={product} onClose={onClose} />
      )}
      {isEditable && (
        <>
          <Button onClick={() => onEditItem(item)} size="sm" mr="2">{t('order.editItem')}</Button>
          <Button onClick={() => onDeleteItem(item)} size="sm" colorScheme="red">{t('order.cancel')}</Button>
        </>
      )}
    </Box>
  );
};

export default OrderItem;
