import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  List,
  ListItem,
  Spinner,
  Box,
  Text,
  useColorModeValue,
  useOutsideClick,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import { getFormattedCities } from "../../services/novaPoshtaService";

const CitySelector = ({ onCitySelect, selectedCity }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(selectedCity?.label || "");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("black", "white");
  const hoverColor = useColorModeValue("gray.200", "gray.600");

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  const fetchCities = debounce(async (searchQuery) => {
    if (searchQuery.length < 3) {
      setCities([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const cityList = await getFormattedCities(searchQuery);
      setCities(cityList);
      setIsOpen(true);
    } catch (err) {
      setError(t("novaPoshta.errorFetchingCities"));
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchCities(value);
  };

  const handleCitySelect = (city) => {
    setQuery(city.label);
    setIsOpen(false);
    onCitySelect(city);
  };

  useEffect(() => {
    if (selectedCity) {
      setQuery(selectedCity.label);
    }
  }, [selectedCity]);

  return (
    <Box position="relative" ref={ref}>
      <Input
        placeholder={t("novaPoshta.searchCity")}
        value={query}
        onChange={handleInputChange}
        mb={4}
        id="citySelector"
        name="citySelector"
      />
      {loading && <Spinner position="absolute" right="10px" top="10px" />}
      {isOpen && cities.length > 0 && (
        <List
          bg={bgColor}
          color={textColor}
          border="1px solid gray"
          borderRadius="md"
          mt={1}
          position="absolute"
          zIndex="1"
          maxHeight="200px"
          overflowY="auto"
          width="100%"
          boxShadow="lg"
        >
          {cities.map((city) => (
            <ListItem
              key={city.value}
              padding="8px"
              cursor="pointer"
              _hover={{ bg: hoverColor }}
              onClick={() => handleCitySelect(city)}
            >
              {city.label}
            </ListItem>
          ))}
        </List>
      )}

      {error && <Text color="red.500">{error}</Text>}
    </Box>
  );
};

export default CitySelector;
