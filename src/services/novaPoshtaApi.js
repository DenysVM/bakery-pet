import axios from "axios";

const NOVA_POSHTA_API_URL = "/api/nova-poshta/";
const novaPoshtaApiKey = process.env.REACT_APP_NOVA_POSHTA_API_KEY;

export const fetchFilteredCities = async (query) => {

  try {
    const methodProperties = {
      FindByString: query,
    };

    const response = await axios.post(NOVA_POSHTA_API_URL, {
      apiKey: novaPoshtaApiKey,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties,
    });

    return response.data.data;
  } catch (error) {
    console.error("[NovaPoshtaAPI] Error fetching filtered cities:", error);
    throw error;
  }
};


export const fetchWarehouses = async (cityRef, searchQuery = "") => {
  try {
    const methodProperties = {
      CityRef: cityRef,
    };

    if (searchQuery && searchQuery.trim() !== "") {
      methodProperties.FindByString = searchQuery.trim();
    }

    const response = await axios.post(NOVA_POSHTA_API_URL, {
      apiKey: novaPoshtaApiKey,
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties,
    });

    return response.data.data || [];
  } catch (error) {
    console.error("[NovaPoshtaAPI] Error fetching warehouses:", error);
    throw error;
  }
};

export const fetchWarehouseByCode = async (cityRef, warehouseCode) => {
  try {
    const response = await axios.post(NOVA_POSHTA_API_URL, {
      apiKey: novaPoshtaApiKey,
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityRef: cityRef,
      },
    });

    const warehouses = response.data.data || [];
    const filteredWarehouse = warehouses.find(
      (warehouse) => warehouse.WarehouseIndex === warehouseCode
    );

    return filteredWarehouse || null;
  } catch (error) {
    console.error("[NovaPoshtaAPI] Error fetching warehouse by code:", error);
    throw error;
  }
};