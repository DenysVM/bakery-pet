import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  Box,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { getUserProfile } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "@chakra-ui/icons";
import ResponsiveActionButtons from "../common/ResponsiveActionButtons";
import UserEdit from "../admin/Users/UserEdit";

const UserProfile = () => {
  const { user, token, logout } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(user);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(token);
        setProfile(response);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        logout();
        navigate("/auth");
      }
    };

    if (token && !profile) {
      fetchUserProfile();
    }
  }, [token, profile, navigate, logout]);

  const handleSaveSuccess = (updatedProfile) => {
    setProfile(updatedProfile);
    onClose();
  };

  if (!profile) {
    return <Text>{t("user.noData")}</Text>;
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl">
          {t("user.name")}: {profile.firstName} {profile.lastName}
        </Text>
        <Text fontSize="xl">{t("user.email")}: {profile.email}</Text>
        <Text fontSize="xl">{t("user.phone")}: {profile.phone}</Text>
        <Text fontSize="xl">
          {t("user.address")}: {t("user.city")} {profile.address.city}, {t("user.street")} {profile.address.street}, {t("user.houseNumber")} {profile.address.houseNumber}, {t("user.apartmentNumber")} {profile.address.apartmentNumber}
        </Text>

        <Box alignSelf="flex-end">
          <ResponsiveActionButtons
            buttons={[
              {
                icon: <EditIcon />,
                label: t("userProfile.edit"),
                onClick: onOpen,
                colorScheme: "blue",
              },
            ]}
          />
        </Box>
      </VStack>

      {isOpen && (
        <UserEdit
          userId={profile._id}
          token={token}
          isOpen={isOpen}
          onClose={onClose}
          onSaveSuccess={handleSaveSuccess}
          isAdmin={false} 
        />
      )}
    </Box>
  );
};

export default UserProfile;
