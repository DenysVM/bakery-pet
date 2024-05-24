import React from 'react';
import { FormControl, FormLabel, Input, FormErrorMessage, Grid, GridItem } from '@chakra-ui/react';

const AddressFields = ({ formik, t, bg, color, hoverBg, activeBorderColor }) => (
  <FormControl isInvalid={formik.errors.address && formik.touched.address}>
    <FormLabel htmlFor='street'>{t('auth.address.label')}</FormLabel>
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      <GridItem colSpan={2}>
        <Input
          id='street'
          type='text'
          placeholder={t('auth.addressPlaceholder.street')}
          {...formik.getFieldProps('address.street')}
          bg={bg}
          color={color}
          _hover={{ bg: hoverBg }}
          _focus={{ borderColor: activeBorderColor }}
          autoComplete="street-address"
        />
        <FormErrorMessage>{formik.errors.address?.street}</FormErrorMessage>
      </GridItem>
      <GridItem colSpan={1}>
        <Input
          id='houseNumber'
          type='text'
          placeholder={t('auth.addressPlaceholder.houseNumber')}
          {...formik.getFieldProps('address.houseNumber')}
          bg={bg}
          color={color}
          _hover={{ bg: hoverBg }}
          _focus={{ borderColor: activeBorderColor }}
          autoComplete="address-line1"
        />
        <FormErrorMessage>{formik.errors.address?.houseNumber}</FormErrorMessage>
      </GridItem>
      <GridItem colSpan={1}>
        <Input
          id='apartmentNumber'
          type='text'
          placeholder={t('auth.addressPlaceholder.apartmentNumber')}
          {...formik.getFieldProps('address.apartmentNumber')}
          bg={bg}
          color={color}
          _hover={{ bg: hoverBg }}
          _focus={{ borderColor: activeBorderColor }}
          autoComplete="address-line2"
        />
        <FormErrorMessage>{formik.errors.address?.apartmentNumber}</FormErrorMessage>
      </GridItem>
      <GridItem colSpan={2}>
        <Input
          id='city'
          type='text'
          placeholder={t('auth.addressPlaceholder.city')}
          {...formik.getFieldProps('address.city')}
          bg={bg}
          color={color}
          _hover={{ bg: hoverBg }}
          _focus={{ borderColor: activeBorderColor }}
          autoComplete="address-level2"
        />
        <FormErrorMessage>{formik.errors.address?.city}</FormErrorMessage>
      </GridItem>
    </Grid>
  </FormControl>
);

export default AddressFields;
