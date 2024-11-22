import React, { useState, useEffect } from "react";
import { Input, FormLabel, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const UserSearch = ({ onSearch }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <Flex direction="column" w="100%" maxW="none">
      <FormLabel htmlFor="user-search" mb={2}>
        {t("userSearch.label")}
      </FormLabel>
      <Input
        id="user-search"
        placeholder={t("userSearch.placeholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        width="100%"
      />
    </Flex>
  );
};

export default UserSearch;
