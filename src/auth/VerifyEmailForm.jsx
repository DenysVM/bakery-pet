import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Spinner, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ResponsiveActionButtons from "../components/common/ResponsiveActionButtons";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const baseUrl = process.env.REACT_APP_API_URL;

const VerifyEmailForm = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const res = await axios.get(
          `${baseUrl}/api/auth/verify-email?token=${token}`
        );
        if (res.data.message === "Email подтверждён успешно!") {
          setStatus("success");
        } else if (res.data.message === "Email уже подтверждён ранее.") {
          setStatus("already");
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verify();
  }, [searchParams, navigate]);

  const goToAccountButton = [
    {
      icon: <ArrowForwardIcon />,
      label: t("auth.verifyEmail.goToAccount"),
      onClick: () => navigate("/account"),
      colorScheme: "green",
    },
  ];

  return (
    <Box textAlign="center" mt={20}>
      {status === "loading" && <Spinner size="xl" />}
      {(status === "success" || status === "already") && (
        <>
          <Heading mb={4}>
            {status === "success"
              ? t("auth.verifyEmail.emailVerified")
              : t("auth.verifyEmail.emailAlreadyVerified")}
          </Heading>
          <Text mb={6}>{t("auth.verifyEmail.emailVerifiedMessage")}</Text>
          <ResponsiveActionButtons buttons={goToAccountButton} />
        </>
      )}
      {status === "error" && (
        <>
          <Heading mb={4}>{t("auth.verifyEmail.verificationError")}</Heading>
          <Text mb={6}>{t("auth.verifyEmail.verificationErrorMessage")}</Text>
        </>
      )}
    </Box>
  );
};

export default VerifyEmailForm;
