import React from 'react';
import { Select, Box, FormLabel } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CatalogSort = ({ onSortChange, sortCriteria }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <FormLabel htmlFor="sort" textAlign={{ base: "center", md: "left" }}>{t('sort.sortBy')}:</FormLabel>
      <Select id="sort" value={sortCriteria} placeholder={t('sort.selectOption')} onChange={onSortChange}>
        <option value="price">{t('sort.price')}</option>
        <option value="calories">{t('sort.calories')}</option>
      </Select>
    </Box>
  );
};

export default CatalogSort;
