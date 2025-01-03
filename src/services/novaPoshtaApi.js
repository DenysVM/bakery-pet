import { axiosNovaPoshtaInstance } from './api';

export const fetchFilteredCities = async (query) => {
  try {
    const methodProperties = {
      FindByString: query,
    };

    const response = await axiosNovaPoshtaInstance.post('/', {
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

    const response = await axiosNovaPoshtaInstance.post('/', {
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
    const response = await axiosNovaPoshtaInstance.post('/', {
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

export const fetchDeliveryStatus = async (trackingNumber) => {
  try {
    const response = await axiosNovaPoshtaInstance.post('/', {
      modelName: "TrackingDocument",
      calledMethod: "getStatusDocuments",
      methodProperties: {
        Documents: [{ DocumentNumber: trackingNumber }],
      },
    });

    return response.data.data?.[0]?.Status || "Unknown";
  } catch (error) {
    console.error("[NovaPoshtaAPI] Error fetching delivery status:", error);
    throw error;
  }
};
