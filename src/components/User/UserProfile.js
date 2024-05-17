// src/components/User/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { getUserProfile } from '../../services/authService';

const UserProfile = () => {
  const { user, token } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(token);
        setProfile(response);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  if (!profile) {
    return <Text>{t('user.noData')}</Text>;
  }

  return (
    <Box>
      <Text fontSize="xl">{t('user.name')}: {profile.firstName} {profile.lastName}</Text>
      <Text fontSize="xl">{t('user.email')}: {profile.email}</Text>
      <Text fontSize="xl">{t('user.phone')}: {profile.phone}</Text>
      <Text fontSize="xl">{t('user.address')}: {profile.address.street}, {profile.address.city}, {profile.address.state}, {profile.address.zip}</Text>
    </Box>
  );
};

export default UserProfile;
