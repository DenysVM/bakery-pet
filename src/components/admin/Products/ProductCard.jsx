import React from 'react';
import { Box, Text, IconButton, Flex, ButtonGroup } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product, onEdit, onDelete, onViewDetails }) => {
  const { t, i18n } = useTranslation();

  return (
    <Flex
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      mb={4}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box onClick={() => onViewDetails(product)} cursor="pointer">
        <Text fontWeight="bold">{product.name[i18n.language]}</Text>
        <Text>{t('productCard.category')}: {t(`categories.${product.category}`)}</Text>
        <Text>{t('productCard.price')}: ${product.price}</Text>
        <Text>{t('productCard.calories')}: {product.calories}</Text>
        <Text>{t('productCard.description')}: {product.description[i18n.language]}</Text>
      </Box>
      <ButtonGroup size="sm" isAttached variant="outline">
        <IconButton
          icon={<EditIcon />}
          aria-label={t('edit')}
          onClick={() => onEdit(product)}
          colorScheme="blue"
        />
        <IconButton
          icon={<DeleteIcon />}
          aria-label={t('delete')}
          onClick={() => onDelete(product._id)}
          colorScheme="red"
        />
      </ButtonGroup>
    </Flex>
  );
};

export default ProductCard;
