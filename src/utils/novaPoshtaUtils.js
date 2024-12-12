import debounce from "lodash.debounce";
import { getWarehouseByCode, getFormattedWarehouses } from "../services/novaPoshtaService";

export const debouncedSearch = debounce(
  async (
    searchQuery,
    cityRef,
    t,
    setResults,
    setError,
    setLoading,
    searchType = "byCode"
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (searchType === "byCode") {

        if (!searchQuery || !/^\d+\/\d+$/.test(searchQuery)) {
          setError(t("novaPoshta.invalidCodeFormat"));
          setLoading(false);
          return;
        }

        if (!cityRef) {
          setError(t("novaPoshta.cityNotSelected"));
          setLoading(false);
          return;
        }

        const warehouse = await getWarehouseByCode(cityRef, searchQuery);
        if (warehouse) {
          setResults([warehouse]); 
        } else {
          setError(t("novaPoshta.errorNoWarehouse"));
        }
      } else if (searchType === "byAddress") {

        if (!cityRef || searchQuery.length < 1) {
          setResults([]);
          setError(t("novaPoshta.errorNoWarehouse"));
          setLoading(false);
          return;
        }

        const warehouses = await getFormattedWarehouses(cityRef, searchQuery);
        if (warehouses.length > 0) {
          setResults(warehouses);
        } else {
          setError(t("novaPoshta.errorNoWarehouse"));
        }
      }
    } catch (error) {
      setError(t("novaPoshta.errorFetchingWarehouses"));
    } finally {
      setLoading(false);
    }
  },
  500 
);
