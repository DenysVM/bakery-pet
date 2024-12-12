import { useFormik } from "formik";
import * as Yup from "yup";

const FormikProvider = ({ children, useNovaPoshta, useHomeAddress, onSubmit, t }) => {
  const manualValidationSchema = Yup.object({
    address: Yup.object({
      street: Yup.string().required(t("auth.required")),
      houseNumber: Yup.string().required(t("auth.required")),
      apartmentNumber: Yup.string().required(t("auth.required")),
      city: Yup.string().required(t("auth.required")),
    }),
  });

  const novaPoshtaValidationSchema = Yup.object({
    novaPoshtaBranch: Yup.object({
      label: Yup.string().required(t("novaPoshta.branchRequired")),
      value: Yup.string().required(t("novaPoshta.branchRequired")),
      warehouseIndex: Yup.string().required(t("novaPoshta.branchRequired")),
    }),
  });

  const homeValidationSchema = Yup.object({});

  const getValidationSchema = () => {
    if (useNovaPoshta) {

      return novaPoshtaValidationSchema;
    }
    if (useHomeAddress) {

      return homeValidationSchema;
    }

    return manualValidationSchema;
  };

  const formik = useFormik({
    initialValues: {
      address: {
        street: "",
        houseNumber: "",
        apartmentNumber: "",
        city: "",
      },
      novaPoshtaBranch: {
        label: "",
        value: "",
        warehouseIndex: "",
      },
    },
    validationSchema: getValidationSchema(),
    enableReinitialize: true,
    onSubmit,
  });

  return children({ formik });
};

export default FormikProvider;
