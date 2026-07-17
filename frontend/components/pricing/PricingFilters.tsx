"use client";

import { useState } from "react";

interface PricingFiltersProps {
  onSearch: (filters: {
    store_id?: string;
    sku?: string;
    product_name?: string;
  }) => void;
}

export default function PricingFilters({
  onSearch,
}: PricingFiltersProps) {
  const [storeId, setStoreId] = useState("");
  const [sku, setSku] = useState("");
  const [productName, setProductName] =
    useState("");

  function handleSearch() {
    onSearch({
      store_id: storeId || undefined,
      sku: sku || undefined,
      product_name: productName || undefined,
    });
  }

  function handleReset() {
    setStoreId("");
    setSku("");
    setProductName("");

    onSearch({});
  }

  return (
    <div className="rounded-xl mt-4 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-lg text-slate-500 font-semibold">
        Search Pricing
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div>
          <label className="mb-2 text-slate-400 block text-sm font-medium">
            Store ID
          </label>

          <input
            value={storeId}
            onChange={(e) =>
              setStoreId(e.target.value)
            }
            className="w-full rounded-lg border text-slate-500 px-3 py-2"
            placeholder="Store ID"
          />
        </div>

        <div>
          <label className="mb-2 block text-slate-400 text-sm font-medium">
            SKU
          </label>

          <input
            value={sku}
            onChange={(e) =>
              setSku(e.target.value)
            }
            className="w-full rounded-lg  text-slate-500 border px-3 py-2"
            placeholder="SKU"
          />
        </div>

        <div>
          <label className="mb-2 block text-slate-400 text-sm font-medium">
            Product Name
          </label>

          <input
            value={productName}
            onChange={(e) =>
              setProductName(e.target.value)
            }
            className="w-full rounded-lg text-slate-500 border px-3 py-2"
            placeholder="Product Name"
          />
        </div>

      </div>

      <div className="mt-6 flex gap-3">

        <button
          onClick={handleSearch}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>

        <button
          onClick={handleReset}
          className="rounded-lg border text-slate-500 px-5 py-2 hover:bg-gray-100"
        >
          Reset
        </button>

      </div>

    </div>
  );
}