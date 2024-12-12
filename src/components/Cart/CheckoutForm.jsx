import React, { useState } from "react";
import { Box, Button, VStack, useToast, Checkbox } from "@chakra-ui/react";
import { useCart } from "../Cart";
import { createOrder } from "../../services/orderService";
import { useAuth } from "../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import AddressFields from "../../auth/SignupFields/AddressFields";
import { FormikProvider, NovaPoshtaSelector } from "./CartComponents/";

const CheckoutForm = ({ onSuccess = () => {}, onClose }) => {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const { t } = useTranslation();
  const toast = useToast();
  const [useHomeAddress, setUseHomeAddress] = useState(false);
  const [useNovaPoshta, setUseNovaPoshta] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    const orderData = {
      user: user._id,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      address: useNovaPoshta
        ? { novaPoshtaBranch: values.novaPoshtaBranch }
        : useHomeAddress
        ? user.address
        : values.address,
      phone: user.phone,
      total: cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      ),
      deliveryType: useNovaPoshta
        ? "Nova Poshta"
        : useHomeAddress
        ? "Home"
        : "Manual",
    };

    try {
      await createOrder(orderData, token, user);
      toast({
        title: t("checkout.success"),
        description: t("checkout.created"),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      clearCart();
      resetForm();
      onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response ? error.response.data : error.message
      );
      toast({
        title: t("checkout.error"),
        description: t("checkout.errorCreating"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleHomeAddressChange = (formik) => {
    setUseHomeAddress((prev) => {
      const newValue = !prev;
      if (newValue) {
        setUseNovaPoshta(false);
        formik.setFieldValue("address", {
          street: user.address?.street || "",
          houseNumber: user.address?.houseNumber || "",
          apartmentNumber: user.address?.apartmentNumber || "",
          city: user.address?.city || "",
        });
      } else {
        formik.setFieldValue("address", {
          street: "",
          houseNumber: "",
          apartmentNumber: "",
          city: "",
        });
      }
      return newValue;
    });
  };

  const handleNovaPoshtaChange = (formik) => {
    setUseNovaPoshta((prev) => {
      const newValue = !prev;
      if (newValue) {
        setUseHomeAddress(false);
        formik.setFieldValue("novaPoshtaBranch", "");
        formik.setFieldValue("address", {
          street: "",
          houseNumber: "",
          apartmentNumber: "",
          city: "",
        });
      }
      return newValue;
    });
  };

  return (
    <FormikProvider
      useNovaPoshta={useNovaPoshta}
      useHomeAddress={useHomeAddress}
      onSubmit={handleSubmit}
      t={t}
    >
      {({ formik }) => (
        <Box>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <VStack spacing={4}>
              <NovaPoshtaSelector
                isSelected={useNovaPoshta}
                onToggle={() => handleNovaPoshtaChange(formik)}
                value={formik.values.novaPoshtaBranch}
                onChange={(warehouse) =>
                  formik.setFieldValue("novaPoshtaBranch", warehouse)
                }
              />

              <Checkbox
                id="useHomeAddress"
                isChecked={useHomeAddress}
                onChange={() => handleHomeAddressChange(formik)}
              >
                {t("checkout.useHomeAddress")}
              </Checkbox>

              {!useNovaPoshta && <AddressFields formik={formik} t={t} />}

              <Button mt={4} colorScheme="teal" type="submit">
                {t("checkout.placeOrder")}
              </Button>
            </VStack>
          </form>
        </Box>
      )}
    </FormikProvider>
  );
};

export default CheckoutForm;
