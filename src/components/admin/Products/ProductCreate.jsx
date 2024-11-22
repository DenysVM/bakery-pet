import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../../auth/AuthContext";
import { createProduct } from "../../../services/productService";
import { useTranslation } from "react-i18next";
import CategorySelect from "../../common/CategorySelect";
import ResponsiveActionButtons from "../../common/ResponsiveActionButtons";
import { AddIcon } from "@chakra-ui/icons";

const ProductCreate = ({ onClose, onProductCreated }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    category: "bread",
    name: { en: "", ru: "", uk: "", pl: "" },
    description: { en: "", ru: "", uk: "", pl: "" },
    composition: { en: "", ru: "", uk: "", pl: "" },
    calories: "",
    price: "",
  });
  const { token } = useAuth();
  const toast = useToast();

  const handleChange = (e, field, lang) => {
    if (lang) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [lang]: e.target.value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handleSubmit = async () => {
    const imageUrl = `/images/products/${formData.name.en
      .toLowerCase()
      .replace(/\s+/g, "_")}.png`;
    const productData = {
      ...formData,
      imageUrl,
      calories: +formData.calories,
      price: +formData.price,
    };

    try {
      await createProduct(productData, token);
      toast({
        title: t("productCreate.createSuccess"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onProductCreated();
      onClose();
    } catch (error) {
      toast({
        title: t("productCreate.createError"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading size="md" mb={4}></Heading>

      <CategorySelect
        value={formData.category}
        onChange={(e) => handleChange(e, "category")}
        label="product.category"
      />

      {["en", "ru", "uk", "pl"].map((lang) => (
        <FormControl mb={4} key={`name-${lang}`}>
          <FormLabel>{t(`product.name.${lang}`)}</FormLabel>
          <Input
            value={formData.name[lang]}
            onChange={(e) => handleChange(e, "name", lang)}
          />
        </FormControl>
      ))}

      {["en", "ru", "uk", "pl"].map((lang) => (
        <FormControl mb={4} key={`description-${lang}`}>
          <FormLabel>{t(`product.description.${lang}`)}</FormLabel>
          <Textarea
            value={formData.description[lang]}
            onChange={(e) => handleChange(e, "description", lang)}
          />
        </FormControl>
      ))}

      {["en", "ru", "uk", "pl"].map((lang) => (
        <FormControl mb={4} key={`composition-${lang}`}>
          <FormLabel>{t(`product.composition.${lang}`)}</FormLabel>
          <Textarea
            value={formData.composition[lang]}
            onChange={(e) => handleChange(e, "composition", lang)}
          />
        </FormControl>
      ))}

      <FormControl mb={4}>
        <FormLabel>{t("product.calories")}</FormLabel>
        <NumberInput
          min={0}
          value={formData.calories}
          onChange={(value) => handleChange({ target: { value } }, "calories")}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>{t("product.price")}</FormLabel>
        <NumberInput
          min={0}
          precision={2}
          value={formData.price}
          onChange={(value) => handleChange({ target: { value } }, "price")}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <Box display="flex" justifyContent="flex-end">
        <ResponsiveActionButtons
          buttons={[
            {
              icon: <AddIcon />,
              label: t("productCreate.createButton"),
              onClick: handleSubmit,
              colorScheme: "teal",
            },
          ]}
          size={{ base: "sm", md: "md" }}
          variant="solid"
          spacing={{ base: 0, md: 3 }}
          flexDirection={{ base: "column", md: "row" }}
        />
      </Box>
    </Box>
  );
};

export default ProductCreate;
