import React from "react";
import {
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import ResponsiveActionButtons from "../../common/ResponsiveActionButtons";

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
        <Text>
          {t("productCard.category")}: {t(`categories.${product.category}`)}
        </Text>
        <Text>
          {t("productCard.price")}: ${product.price}
        </Text>
        <Text>
          {t("productCard.calories")}: {product.calories}
        </Text>
        <Text>
          {t("productCard.description")}: {product.description[i18n.language]}
        </Text>
      </Box>
      <ResponsiveActionButtons
        buttons={[
          {
            icon: <EditIcon />,
            label: t("productEdit.editProduct"),
            onClick: () => onEdit(product),
            colorScheme: "blue",
          },
          {
            icon: <DeleteIcon />,
            label: t("product.delete"),
            onClick: () => onDelete(product._id),
            colorScheme: "red",
          },
        ]}
        size={{ base: "sm", md: "md" }} 
        variant="outline" 
        spacing={4} 
        isAttached={true}
      />
    </Flex>
  );
};

export default ProductCard;
