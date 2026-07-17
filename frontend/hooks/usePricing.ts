"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import pricingService, {
  PricingSearchParams,
} from "@/services/pricing.service";
import { PricingRecord } from "@/types/pricing";

export default function usePricing() {
  const [pricing, setPricing] = useState<
    PricingRecord[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] =useState(0);

  const [currentFilters, setCurrentFilters] =useState<PricingSearchParams>({});

  const searchPricing = useCallback(
    async (
      filters: PricingSearchParams = {},
      requestedPage = 1
    ) => {
      setLoading(true);
      setError("");

      try {
        const response =
          await pricingService.search({
            ...filters,
            page: requestedPage,
            page_size: pageSize,
          });

        setPricing(response.items ?? []);
        setPage(response.page);
        setTotalRecords(response.total_records);
        setTotalPages(response.total_pages);
        setCurrentFilters(filters);
      } catch {
        setPricing([]);
        setError(
          "Unable to load pricing records."
        );
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  const changePage = useCallback(
    async (newPage: number) => {
      if (
        newPage < 1 ||
        newPage > totalPages ||
        newPage === page
      ) {
        return;
      }

      await searchPricing(
        currentFilters,
        newPage
      );
    },
    [
      currentFilters,
      page,
      searchPricing,
      totalPages,
    ]
  );

  const refreshCurrentPage =
    useCallback(async () => {
      await searchPricing(
        currentFilters,
        page
      );
    }, [
      currentFilters,
      page,
      searchPricing,
  ]);

  useEffect(() => {
    void searchPricing({}, 1);
  }, [searchPricing]);

  return {
    pricing,
    loading,
    error,
    page,
    pageSize,
    totalRecords,
    totalPages,
    searchPricing,
    changePage,
    refreshCurrentPage
  };
}