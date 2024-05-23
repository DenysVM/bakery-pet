import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  useToast,
  Grid,
  GridItem,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/semantic-ui.css';
import '../styles/SignupForm.css';

const SignupForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const { login } = useAuth();
  const { colorMode } = useColorMode();
  const inputBg = useColorModeValue('#ffffff', '#1a202c');
  const inputTextColor = useColorModeValue('#000000', '#ffffff');
  const inputHoverBg = useColorModeValue('#f7fafc', '#2d3748');
  const inputBorderColor = useColorModeValue('#e2e8f0', '#4a5568');
  const activeBorderColor = useColorModeValue('#4299e1', '#63b3ed');
  const dropdownBg = useColorModeValue('#ffffff', '#1a202c');
  const dropdownTextColor = useColorModeValue('#000000', '#ffffff');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: {
        street: '',
        houseNumber: '',
        apartmentNumber: '',
        city: ''
      },
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(t('auth.required')),
      lastName: Yup.string().required(t('auth.required')),
      email: Yup.string().email(t('auth.invalidEmail')).required(t('auth.required')),
      password: Yup.string().min(8, t('auth.passwordMin')).required(t('auth.required')),
      phone: Yup.string().required(t('auth.required')),
      address: Yup.object().shape({
        street: Yup.string().required(t('auth.required')),
        houseNumber: Yup.string().required(t('auth.required')),
        apartmentNumber: Yup.string().required(t('auth.required')),
        city: Yup.string().required(t('auth.required'))
      }),
    }),
    onSubmit: async (values) => {
      try {
        const data = await registerUser(values);
        login(data);
        toast({
          title: t('auth.registrationSuccess'),
          description: t('auth.registrationSuccessMessage'),
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/account');
      } catch (error) {
        toast({
          title: t('auth.registrationError'),
          description: error.response?.data?.message || t('auth.registrationErrorMessage'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('There was an error registering the user:', error);
      }
    }
  });

  return (
    <Box
      p={4}
      mt="4em"
      maxW="md"
      mx="auto"
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      className={colorMode === 'dark' ? 'dark-theme' : ''}
    >
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={formik.errors.firstName && formik.touched.firstName}>
            <FormLabel htmlFor='firstName'>{t('auth.firstName')}</FormLabel>
            <Input
              id='firstName'
              type='text'
              placeholder={t('auth.firstNamePlaceholder')}
              {...formik.getFieldProps('firstName')}
              bg={inputBg}
              color={inputTextColor}
              _hover={{ bg: inputHoverBg }}
              _focus={{ borderColor: activeBorderColor }}
              autoComplete="given-name"
            />
            <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.lastName && formik.touched.lastName}>
            <FormLabel htmlFor='lastName'>{t('auth.lastName')}</FormLabel>
            <Input
              id='lastName'
              type='text'
              placeholder={t('auth.lastNamePlaceholder')}
              {...formik.getFieldProps('lastName')}
              bg={inputBg}
              color={inputTextColor}
              _hover={{ bg: inputHoverBg }}
              _focus={{ borderColor: activeBorderColor }}
              autoComplete="family-name"
            />
            <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.email && formik.touched.email}>
            <FormLabel htmlFor='email'>{t('auth.email')}</FormLabel>
            <Input
              id='email'
              type='email'
              placeholder={t('auth.emailPlaceholder')}
              {...formik.getFieldProps('email')}
              bg={inputBg}
              color={inputTextColor}
              _hover={{ bg: inputHoverBg }}
              _focus={{ borderColor: activeBorderColor }}
              autoComplete="email"
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.password && formik.touched.password}>
            <FormLabel htmlFor='password'>{t('auth.password')}</FormLabel>
            <Input
              id='password'
              type='password'
              placeholder={t('auth.passwordPlaceholder')}
              {...formik.getFieldProps('password')}
              bg={inputBg}
              color={inputTextColor}
              _hover={{ bg: inputHoverBg }}
              _focus={{ borderColor: activeBorderColor }}
              autoComplete="new-password"
            />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.phone && formik.touched.phone}>
            <FormLabel htmlFor='phone'>{t('auth.phone')}</FormLabel>
            <Box
              width="100%"
              className="input-phone-number"
              style={{
                borderColor: inputBorderColor,
                borderRadius: '5px',
              }}
            >
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
                  backgroundColor: inputBg,
                  color: inputTextColor,
                  height: '40px',
                }}
                buttonStyle={{ 
                  backgroundColor: inputBg, 
                }}
                dropdownStyle={{ backgroundColor: dropdownBg, color: dropdownTextColor }}
                dropdownContainerStyle={{ zIndex: 9999 }}
              />
            </Box>
            <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.address && formik.touched.address}>
            <FormLabel htmlFor='street'>{t('auth.address.label')}</FormLabel>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={2}>
                <Input
                  id='street'
                  type='text'
                  placeholder={t('auth.addressPlaceholder.street')}
                  {...formik.getFieldProps('address.street')}
                  bg={inputBg}
                  color={inputTextColor}
                  _hover={{ bg: inputHoverBg }}
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
                  bg={inputBg}
                  color={inputTextColor}
                  _hover={{ bg: inputHoverBg }}
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
                  bg={inputBg}
                  color={inputTextColor}
                  _hover={{ bg: inputHoverBg }}
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
                  bg={inputBg}
                  color={inputTextColor}
                  _hover={{ bg: inputHoverBg }}
                  _focus={{ borderColor: activeBorderColor }}
                  autoComplete="address-level2"
                />
                <FormErrorMessage>{formik.errors.address?.city}</FormErrorMessage>
              </GridItem>
            </Grid>
          </FormControl>
          <Button mt={4} colorScheme='teal' type='submit' width="full">{t('auth.register')}</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SignupForm;
