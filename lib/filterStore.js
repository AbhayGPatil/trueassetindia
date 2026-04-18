import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFilterStore = create(
  persist(
    (set) => ({
      // Filter state
      filters: {
        location: {
          city: '',
          locality: '',
          sublocality: '',
          radius: 5,
        },
        price: {
          min: 0,
          max: 100000000, // 10 Crore
        },
        propertyType: [], // apartment, villa, plot, penthouse, etc.
        bhkRange: {
          min: 1,
          max: 6,
        },
        furnishing: [], // furnished, semi-furnished, unfurnished
        amenities: [], // pool, gym, parking, etc.
        propertyAge: {
          min: 0,
          max: 100,
        },
        possessionStatus: [], // ready, underConstruction, etc.
        bankAuction: false,
        rentalTerms: '', // annual, monthly, etc.
        maintenanceFee: {
          min: 0,
          max: 1000000,
        },
      },

      // Sorting and view options
      sorting: 'relevance', // relevance, price-low-high, price-high-low, newest, distance
      viewType: 'grid', // grid, map, list
      resultsPerPage: 20,
      currentPage: 1,

      // Search history & saved searches
      recentSearches: [],
      savedSearches: [],

      // Actions
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1, // Reset to first page when filters change
        })),

      setLocationFilter: (location) =>
        set((state) => ({
          filters: {
            ...state.filters,
            location: { ...state.filters.location, ...location },
          },
          currentPage: 1,
        })),

      setPriceFilter: (min, max) =>
        set((state) => ({
          filters: {
            ...state.filters,
            price: { min, max },
          },
          currentPage: 1,
        })),

      setPropertyType: (types) =>
        set((state) => ({
          filters: {
            ...state.filters,
            propertyType: types,
          },
          currentPage: 1,
        })),

      setBhkRange: (min, max) =>
        set((state) => ({
          filters: {
            ...state.filters,
            bhkRange: { min, max },
          },
          currentPage: 1,
        })),

      setAmenities: (amenities) =>
        set((state) => ({
          filters: {
            ...state.filters,
            amenities,
          },
          currentPage: 1,
        })),

      setFurnishing: (furnishing) =>
        set((state) => ({
          filters: {
            ...state.filters,
            furnishing,
          },
          currentPage: 1,
        })),

      setBankAuction: (value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            bankAuction: value,
          },
          currentPage: 1,
        })),

      setSorting: (sort) =>
        set(() => ({
          sorting: sort,
          currentPage: 1,
        })),

      setViewType: (view) =>
        set(() => ({
          viewType: view,
        })),

      setCurrentPage: (page) =>
        set(() => ({
          currentPage: page,
        })),

      // Clear all filters
      clearFilters: () =>
        set(() => ({
          filters: {
            location: { city: '', locality: '', sublocality: '', radius: 5 },
            price: { min: 0, max: 100000000 },
            propertyType: [],
            bhkRange: { min: 1, max: 6 },
            furnishing: [],
            amenities: [],
            propertyAge: { min: 0, max: 100 },
            possessionStatus: [],
            bankAuction: false,
            rentalTerms: '',
            maintenanceFee: { min: 0, max: 1000000 },
          },
          currentPage: 1,
          sorting: 'relevance',
        })),

      // Save search
      saveSearch: (name) =>
        set((state) => ({
          savedSearches: [
            ...state.savedSearches,
            {
              id: Date.now(),
              name,
              filters: state.filters,
              createdAt: new Date(),
            },
          ],
        })),

      // Load saved search
      loadSavedSearch: (id) =>
        set((state) => {
          const saved = state.savedSearches.find((s) => s.id === id);
          if (saved) {
            return {
              filters: saved.filters,
              currentPage: 1,
            };
          }
          return state;
        }),

      // Add to recent searches
      addRecentSearch: (search) =>
        set((state) => ({
          recentSearches: [
            search,
            ...state.recentSearches.filter((s) => JSON.stringify(s) !== JSON.stringify(search)),
          ].slice(0, 10),
        })),

      // Delete saved search
      deleteSavedSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
        })),

      // Check if filters are active
      hasActiveFilters: () => {
        // Implementation in component
      },
    }),
    {
      name: 'trueassets-filters', // persists to localStorage
      partialize: (state) => ({
        savedSearches: state.savedSearches,
        recentSearches: state.recentSearches,
      }),
    }
  )
);
