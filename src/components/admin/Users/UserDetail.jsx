import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  Heading,
  Divider,
  Flex,
  Spinner,
  useToast,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { AdminUserOrders } from ".";
import { getUser } from "../../../services/userService";
import { useAuth } from "../../../auth/AuthContext";
import { ArrowBackIcon } from "@chakra-ui/icons";

const UserDetail = ({ userId, onBack }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!userId) {
      console.error("No userId provided");
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await getUser(userId, token);
        setUser(userData);
      } catch (error) {
        toast({
          title: t("userDetail.error.fetchUser"),
          description: error.message || t("userDetail.error.unexpected"),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token, t, toast]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" label={t("userDetail.loading")} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="lg" color="red.500">
          {t("userDetail.noUserFound")}
        </Text>
        <Button colorScheme="blue" mt={4} onClick={onBack}>
          {t("userDetail.backToList")}
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" p={4}>
      <VStack spacing={6} align="start">
        <Flex justify="space-between" width="100%">
          <Heading size="lg">{t("user.profile")}</Heading>
          {isMobile ? (
            <IconButton
              icon={<ArrowBackIcon />}
              colorScheme="teal"
              onClick={onBack}
              aria-label={t("user.backToList")}
            />
          ) : (
            <Button colorScheme="teal" onClick={onBack}>
              {t("user.backToList")}
            </Button>
          )}
        </Flex>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>
            {`${t("user.name")}: ${user.firstName} ${user.lastName}`}
          </Heading>
          <Text>
            <strong>{t("user.email")}</strong>: {user.email}
          </Text>
          <Text>
            <strong>{t("user.phone")}</strong>: {user.phone}
          </Text>
          <Text>
            <strong>{t("user.address")}</strong>: {t("user.city")}{" "}
            {user.address?.city}, {t("user.street")} {user.address?.street},{" "}
            {t("user.houseNumber")} {user.address?.houseNumber},{" "}
            {t("user.apartmentNumber")} {user.address?.apartmentNumber},
          </Text>
          <Text>
            <strong>{t("userList.role")}</strong>: {user.role}
          </Text>
        </Box>

        <Divider />

        <Box width="100%">
          <Heading size="md" mb={4}>
            {t("user.orders")}
          </Heading>
          <AdminUserOrders userId={userId} />
        </Box>
      </VStack>
    </Box>
  );
};

export default UserDetail;
