// src/components/common/CategorySelect.jsx
import React from "react";
import { Select, FormLabel } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const CategorySelect = ({ value, onChange, includeAllOption, label, ...rest }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormLabel color="gray.800" _dark={{ color: "gray.100" }} htmlFor="category">
        {t(label || "product.category")}
      </FormLabel>
      <Select
        id="category"
        value={value}
        onChange={onChange}
        {...rest}
      >
        {includeAllOption && <option value="">{t("filters.all")}</option>}
        <option value="bread">{t("categories.bread")}</option>
        <option value="pastry">{t("categories.pastry")}</option>
        <option value="cake">{t("categories.cake")}</option>
      </Select>
    </>
  );
};

export default CategorySelect;
