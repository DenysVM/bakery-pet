import { fetchFilteredCities, fetchWarehouses, fetchWarehouseByCode } from "./novaPoshtaApi";

export const getFormattedCities = async (query) => {
  try {
    const cities = await fetchFilteredCities(query);
    return cities.map((city) => ({
      label: city.Description,
      value: city.Ref,
    }));
  } catch (error) {
    console.error("Error formatting cities:", error);
    throw error;
  }
};

export const getFormattedWarehouses = async (cityRef, searchQuery) => {
  try {
    const warehouses = await fetchWarehouses(cityRef, searchQuery);

    const filteredWarehouses = searchQuery
      ? warehouses.filter(
        (warehouse) =>
          warehouse.Number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          warehouse.Description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : warehouses;

    return filteredWarehouses.map((warehouse) => ({
      label: warehouse.Description,
      value: warehouse.Ref,
      number: warehouse.Number,
      warehouseIndex: warehouse.WarehouseIndex,
      shortAddress: warehouse.ShortAddress,
      category: warehouse.CategoryOfWarehouse === "Postomat" ? "postomat" : "branch",
    }));
  } catch (error) {
    console.error("[NovaPoshtaService] Error formatting warehouses:", error);
    throw error;
  }
};

export const getWarehouseByCode = async (cityRef, warehouseCode) => {
  try {
    const warehouse = await fetchWarehouseByCode(cityRef, warehouseCode);
    if (!warehouse) {
      console.error("[NovaPoshtaService] No warehouse found for code:", warehouseCode);
      return null;
    }
    return {
      label: warehouse.Description,
      value: warehouse.Ref,
      warehouseIndex: warehouse.WarehouseIndex,
      shortAddress: warehouse.ShortAddress,
      category: warehouse.CategoryOfWarehouse === "Postomat" ? "postomat" : "branch",
    };
  } catch (error) {
    console.error("[NovaPoshtaService] Error fetching warehouse by code:", error);
    throw error;
  }
};