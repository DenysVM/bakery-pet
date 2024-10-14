import React from 'react';
import { Box, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CatalogSort = ({ onSortChange, sortCriteria }) => {
  const { t } = useTranslation();

  return (
    <Box flex="1">
    <Select
      value={sortCriteria}
      onChange={(e) => onSortChange(e.target.value)}
      placeholder={t('sort.sortBy')}
    >
      <option value="price_asc">{t('sort.priceAsc')}</option>
      <option value="price_desc">{t('sort.priceDesc')}</option>
      <option value="calories_asc">{t('sort.caloriesAsc')}</option>
      <option value="calories_desc">{t('sort.caloriesDesc')}</option>
    </Select>
    </Box>
  );
};

export default CatalogSort;
