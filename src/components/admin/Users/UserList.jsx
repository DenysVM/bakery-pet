import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Text,
  useToast,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { getUsers } from "../../../services/userService";
import { useAuth } from "../../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { ViewIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { UserDelete } from ".";
import UserSearch from "./UserComponents/UserSearch";
import UserDetail from "./UserDetail";
import UserEdit from "./UserEdit"; 
import ResponsiveActionButtons from "../../common/ResponsiveActionButtons";

const UserList = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false); 
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const usersData = await getUsers(token);
        setUsers(usersData);
        setFilteredUsers(usersData);
        setLoading(false);
      } catch (error) {
        toast({
          title: t("userList.error.fetchUsers"),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, toast, t]);

  const handleDeleteSuccess = (deletedUserId) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== deletedUserId)
    );
    setFilteredUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== deletedUserId)
    );
    setUserToDeleteId(null);
  };

  const handleSearch = useCallback(
    (term) => {
      const lowerCaseTerm = term.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(lowerCaseTerm) ||
            user.lastName.toLowerCase().includes(lowerCaseTerm) ||
            user.phone.toLowerCase().includes(lowerCaseTerm) ||
            user.email.toLowerCase().includes(lowerCaseTerm)
        )
      );
    },
    [users]
  );

  const handleEditOpen = (userId) => {
    setSelectedUserId(userId);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setSelectedUserId(null);
  };

  const handleEditSuccess = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    setFilteredUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    handleEditClose();
  };

  const handleBackToList = () => setSelectedUserId(null);

  if (selectedUserId && !isEditOpen) {
    return <UserDetail userId={selectedUserId} onBack={handleBackToList} />;
  }

  return (
    <Box padding="1" maxW="100vw">
      {loading ? (
        <p>{t("userList.loading")}</p>
      ) : (
        <>
          <VStack spacing={4} width="100%" maxW="1200px" mx="auto" p={0}>
            <UserSearch onSearch={handleSearch} />
            {filteredUsers.map((user) => (
              <Box
                key={user._id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                width="100%"
                maxW={{ base: "100%", md: "80%", lg: "100%" }}
                boxShadow="sm"
                bg="white"
                _dark={{ bg: "gray.700" }}
                display="flex"
                flexDirection={{ base: "column", lg: "row" }}
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box flex="1" minWidth="fit-content">
                  <Heading
                    size="sm"
                    mb={2}
                  >{`${user.firstName} ${user.lastName}`}</Heading>
                  <Text>
                    {t("userList.email")}: {user.email}
                  </Text>
                  <Text>
                    {t("user.phone")}: {user.phone}
                  </Text>
                  <Text>
                    {t("userList.role")}: {user.role}
                  </Text>
                </Box>

                <Box
                  display="flex"
                  flexDirection={{ base: "row", lg: "column" }}
                  mt={{ base: 4, lg: 0 }}
                  ml={{ lg: 4 }}
                  gap={2}
                  width="100%"
                  justifyContent={{ base: "flex-end", lg: "center" }}
                  alignItems={{ base: "flex-end", lg: "flex-end" }}
                >
                  <ResponsiveActionButtons
                    isAttached={true}
                    buttons={[
                      {
                        icon: <ViewIcon />,
                        label: t("userList.viewProfile"),
                        onClick: () => setSelectedUserId(user._id),
                        colorScheme: "teal",
                      },
                      {
                        icon: <EditIcon />,
                        label: t("userList.edit"),
                        onClick: () => handleEditOpen(user._id),
                        colorScheme: "blue",
                      },
                      {
                        icon: <DeleteIcon />,
                        label: t("userList.delete"),
                        onClick: () => setUserToDeleteId(user._id),
                        colorScheme: "red",
                      },
                    ]}
                  />
                </Box>
              </Box>
            ))}
          </VStack>
        </>
      )}

      {userToDeleteId && (
        <UserDelete
          userId={userToDeleteId}
          userName={`${users.find((u) => u._id === userToDeleteId)?.firstName || ""} ${
            users.find((u) => u._id === userToDeleteId)?.lastName || ""
          }`}
          onDeleteSuccess={handleDeleteSuccess}
          onClose={() => setUserToDeleteId(null)}
        />
      )}

      {isEditOpen && selectedUserId && (
        <UserEdit
          userId={selectedUserId}
          token={token}
          isOpen={isEditOpen}
          onClose={handleEditClose}
          onSaveSuccess={handleEditSuccess}
          isAdmin={true}
        />
      )}
    </Box>
  );
};

export default UserList;
