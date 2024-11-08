import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react";
import { updateProduct } from "../../../services/productService";
import CategorySelect from "../../common/CategorySelect";

const ProductEdit = ({ product, onClose, token }) => {
  const { t } = useTranslation();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: product,
  });

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const getChangedFields = (data, original) => {
    const changedFields = {};
    Object.keys(data).forEach((key) => {
      if (JSON.stringify(data[key]) !== JSON.stringify(original[key])) {
        changedFields[key] = data[key];
      }
    });
    return changedFields;
  };

  const onSubmit = async (data) => {
    const changedFields = getChangedFields(data, product);
    if (Object.keys(changedFields).length === 0) {
      toast({
        title: t("productEdit.noChanges"),
        description: t("productEdit.noChangesDescription"),
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await updateProduct(product._id, changedFields, token);
      toast({
        title: t("productEdit.success.productUpdated"),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: t("productEdit.error.updateProduct"),
        description: error.message || t("productEdit.error.unexpected"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <CategorySelect
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            label="product.category"
          />
        )}
      />

      <FormControl isInvalid={errors.price} mt={4}>
        <FormLabel>{t("product.price")}</FormLabel>
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <NumberInput {...field} min={0}>
              <NumberInputField />
            </NumberInput>
          )}
        />
      </FormControl>

      <FormControl isInvalid={errors.calories} mt={4}>
        <FormLabel>{t("product.calories")}</FormLabel>
        <Controller
          control={control}
          name="calories"
          render={({ field }) => (
            <NumberInput {...field} min={0}>
              <NumberInputField />
            </NumberInput>
          )}
        />
      </FormControl>

      {["en", "ru", "pl", "uk"].map((lang) => (
        <FormControl
          key={`name-${lang}`}
          isInvalid={errors.name?.[lang]}
          mt={4}
        >
          <FormLabel>{t(`product.name.${lang}`)}</FormLabel>
          <Input {...register(`name.${lang}`)} />
        </FormControl>
      ))}

      {["en", "ru", "pl", "uk"].map((lang) => (
        <FormControl
          key={`description-${lang}`}
          isInvalid={errors.description?.[lang]}
          mt={4}
        >
          <FormLabel>{t(`product.description.${lang}`)}</FormLabel>
          <Input {...register(`description.${lang}`)} />
        </FormControl>
      ))}

      {["en", "ru", "pl", "uk"].map((lang) => (
        <FormControl
          key={`composition-${lang}`}
          isInvalid={errors.composition?.[lang]}
          mt={4}
        >
          <FormLabel>{t(`product.composition.${lang}`)}</FormLabel>
          <Input {...register(`composition.${lang}`)} />
        </FormControl>
      ))}

      <Button colorScheme="teal" type="submit" mt={6} isLoading={isSubmitting}>
        {t("productEdit.save")}
      </Button>
      <Button colorScheme="gray" onClick={onClose} mt={6} ml={3}>
        {t("productEdit.cancel")}
      </Button>
    </Box>
  );
};

export default ProductEdit;
