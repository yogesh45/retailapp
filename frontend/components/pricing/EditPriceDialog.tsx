"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { PricingRecord } from "@/types/pricing";

interface EditPriceDialogProps {
  open: boolean;
  pricing: PricingRecord | null;
  onClose: () => void;
  onSave: (
    pricingId: number,
    price: number
  ) => Promise<void>;
}

export default function EditPriceDialog({
  open,
  pricing,
  onClose,
  onSave,
}: EditPriceDialogProps) {
  const [price, setPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (pricing) {
      setPrice(String(pricing.price));
      setError("");
    }
  }, [pricing]);

  if (!open || !pricing) {
    return null;
  }

  async function handleSubmit() {
    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setError(
        "Price must be greater than zero."
      );
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await onSave(
        pricing!.id,
        numericPrice
      );
      toast.success("Price updated successfully");
      onClose();
    } catch {
      setError(
        "Unable to update the price."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-slate-900 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Edit Price
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Store
            </label>

            <input
              disabled
              value={pricing.store_id}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              SKU
            </label>

            <input
              disabled
              value={pricing.sku}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Product
            </label>

            <input
              disabled
              value={pricing.product_name}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-100"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-slate-700"
            >
              Price
            </label>

            <input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}