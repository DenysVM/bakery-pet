import React, { useState } from 'react';
import { Select, Checkbox, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const NovaPoshtaSelector = ({
  isSelected,
  onToggle,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const [branches] = useState([
    { id: 1, name: 'Branch 1' },
    { id: 2, name: 'Branch 2' },
    { id: 3, name: 'Branch 3' },
  ]); // Заглушка вместо fetch

  const handleCheckboxChange = () => {
    onToggle();
  };

  if (!isSelected) {
    return (
      <Checkbox
        id="useNovaPoshta"
        isChecked={isSelected}
        onChange={handleCheckboxChange}
      >
        {t('novaPoshta.useNovaPoshta')}
      </Checkbox>
    );
  }

  return (
    <Box>
      <Checkbox
        id="useNovaPoshta"
        isChecked={isSelected}
        onChange={handleCheckboxChange}
      >
        {t('novaPoshta.useNovaPoshta')}
      </Checkbox>
      <Select
        id="novaPoshtaBranch"
        placeholder={t('novaPoshta.selectBranch')}
        value={value}
        onChange={onChange}
      >
        {branches.map(branch => (
          <option key={branch.id} value={branch.name}>
            {branch.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default NovaPoshtaSelector;
