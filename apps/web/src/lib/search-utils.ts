/**
 * Search Utilities
 *
 * Common search functionality for list pages
 */

import { useCallback, useEffect, useMemo, useState } from "react";

export interface SearchConfig<T> {
  data: T[];
  searchFields: (keyof T)[];
  searchQuery?: string;
  filters?: Record<string, unknown>;
}

/**
 * Generic search hook
 */
export function useSearch<T>(config: SearchConfig<T>) {
  const [searchQuery, setSearchQuery] = useState(config.searchQuery || "");
  const [filters, setFilters] = useState(config.filters || {});

  const filteredData = useMemo(() => {
    let result: T[] = [...config.data];

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        config.searchFields.some((field) => {
          const value = (item as Record<string, unknown>)[field as string];
          return value ? String(value).toLowerCase().includes(query) : false;
        }),
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        result = result.filter((item) => {
          const itemValue = (item as Record<string, unknown>)[key];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    return result;
  }, [config.data, searchQuery, filters, config.searchFields]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setFilters({});
  }, []);

  const updateFilter = useCallback((key: string, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    updateFilter,
    removeFilter,
    filteredData,
    clearSearch,
    hasActiveFilters: Object.keys(filters).length > 0 || searchQuery.length > 0,
  };
}

/**
 * Debounce hook for search input
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
