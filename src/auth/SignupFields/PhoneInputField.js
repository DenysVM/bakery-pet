import React from 'react';
import { FormControl, FormLabel, Box, FormErrorMessage } from '@chakra-ui/react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/semantic-ui.css';
import '../../styles/SignupForm.css';

const PhoneInputField = ({ formik, t, bg, color }) => (
  <FormControl isInvalid={formik.errors.phone && formik.touched.phone}>
    <FormLabel htmlFor='phone'>{t('auth.phone')}</FormLabel>
    <Box width="100%" className="input-phone-number">
      <PhoneInput
        country={'ua'}
        preferredCountries={['ua', 'pl']}
        regions={'europe'}
        value={formik.values.phone}
        onChange={(phone) => formik.setFieldValue('phone', phone)}
        inputProps={{
          name: 'phone',
          id: 'phone',
          placeholder: t('auth.phonePlaceholder'),
          required: true,
          autoComplete: 'tel'
        }}
        inputStyle={{
          width: '100%',
          backgroundColor: bg,
          color: color,
          height: '40px',
        }}
        buttonStyle={{ 
          backgroundColor: bg,
          borderColor: 'inherit',
          color: 'inherit'
        }}
        dropdownStyle={{ backgroundColor: bg, color: color }}
      />
    </Box>
    <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
  </FormControl>
);

export default PhoneInputField;
