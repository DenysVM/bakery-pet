import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  useToast,
  useColorModeValue,
  useColorMode,
  Checkbox,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../Cart';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../auth/AuthContext';
import { useTranslation } from 'react-i18next';
import PhoneInputField from '../../auth/SignupFields/PhoneInputField';
import AddressFields from '../../auth/SignupFields/AddressFields';
import '../../styles/SignupForm.css';

const CheckoutForm = ({ onSuccess = () => {}, onClose }) => {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const { t } = useTranslation();
  const toast = useToast();
  const [useHomeAddress, setUseHomeAddress] = useState(false);

  const initialValues = {
    phone: '',
    address: {
      street: '',
      houseNumber: '',
      apartmentNumber: '',
      city: ''
    },
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      phone: Yup.string().required(t('auth.required')),
      address: Yup.object().shape({
        street: Yup.string().required(t('auth.required')),
        houseNumber: Yup.string().required(t('auth.required')),
        apartmentNumber: Yup.string().required(t('auth.required')),
        city: Yup.string().required(t('auth.required'))
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      const orderData = {
        user: user._id,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        address: values.address,
        phone: values.phone,
        total: cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
      };

      try {
        await createOrder(orderData, token);
        toast({
          title: t('checkout.success'),
          description: t('checkout.created'),
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        clearCart();
        resetForm();
        onSuccess();
        if (onClose) onClose();
      } catch (error) {
        toast({
          title: t('checkout.error'),
          description: t('checkout.errorCreating'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error creating order:', error.response ? error.response.data : error.message);
      }
    }
  });

  const handleCheckboxChange = () => {
    setUseHomeAddress(!useHomeAddress);
    if (!useHomeAddress && user) {
      formik.setFieldValue('phone', user.phone || '');
      formik.setFieldValue('address', {
        street: user.address.street || '',
        houseNumber: user.address.houseNumber || '',
        apartmentNumber: user.address.apartmentNumber || '',
        city: user.address.city || ''
      });
    } else {
      formik.resetForm();
    }
  };

  const { colorMode } = useColorMode();
  const inputBg = useColorModeValue('#ffffff', '#1a202c');
  const inputTextColor = useColorModeValue('#000000', '#ffffff');
  const inputHoverBg = useColorModeValue('#f7fafc', '#2d3748');
  const activeBorderColor = useColorModeValue('#4299e1', '#63b3ed');

  const commonProps = {
    formik,
    t,
    bg: inputBg,
    color: inputTextColor,
    hoverBg: inputHoverBg,
    focusBorderColor: activeBorderColor,
  };

  return (
    <Box className={`signup-form-container ${colorMode === 'dark' ? 'dark-theme' : ''}`}>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          <Checkbox id="useHomeAddress" isChecked={useHomeAddress} onChange={handleCheckboxChange}>
            {t('checkout.useHomeAddress')}
          </Checkbox>
          <PhoneInputField {...commonProps} />
          <AddressFields {...commonProps} />
          <Button mt={4} colorScheme='teal' type='submit' width="full">
            {t('checkout.placeOrder')}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CheckoutForm;
