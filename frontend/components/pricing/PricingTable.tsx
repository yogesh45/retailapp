"use client";

import { PricingRecord } from "@/types/pricing";
import { AuthUser } from "@/types/auth";
import Pagination from "./Pagination";

interface PricingTableProps {
  pricing: PricingRecord[];
  loading: boolean;
  user: AuthUser;
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  onEdit: (pricing: PricingRecord) => void;
  onPageChange: (page: number) => void;
}

export default function PricingTable({
  pricing,
  loading,
  user,
  page,
  pageSize,
  totalPages,
  totalRecords, 
  onEdit,
  onPageChange
}: PricingTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Loading pricing records...
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl bg-white shadow-sm overflow-hidden">

        <table className="min-w-full">

            <thead className="bg-gray-100">

                <tr>

                <th className="px-4 text-slate-500 py-3 text-left">
                    Store
                </th>

                <th className="px-4 text-slate-500 py-3 text-left">
                    SKU
                </th>

                <th className="px-4 text-slate-500 py-3 text-left">
                    Product
                </th>

                <th className="px-4 text-slate-500 py-3 text-right">
                    Price
                </th>

                <th className="px-4 text-slate-500 py-3 text-left">
                    Pricing Date
                </th>

                {user.role === "ADMIN" && (
                    <th className="px-4 text-slate-500 py-3 text-center">
                    Action
                    </th>
                )}

                </tr>

            </thead>

            <tbody>

            {pricing.length === 0 && (
                <tr>

                    <td
                    colSpan={
                        user.role === "ADMIN"
                        ? 6
                        : 5
                    }
                    className="py-8 text-center text-gray-500"
                    >
                    No pricing records found.
                    </td>

                </tr>
            )}

            {pricing.map((record) => (
            <tr
                key={record.id}
                className="border-t hover:bg-gray-50"
            >

                <td className="px-4 text-slate-500 py-3">
                {record.store_id}
                </td>

                <td className="px-4 text-slate-500 py-3">
                {record.sku}
                </td>

                <td className="px-4 text-slate-500 py-3">
                {record.product_name}
                </td>

                <td className="px-4 text-slate-500 py-3 text-right">
                ₹{Number(record.price).toFixed(2)}
                </td>

                <td className="px-4 text-slate-500 py-3">
                {record.pricing_date}
                </td>

                {user.role === "ADMIN" && (
                <td className="px-4 py-3 text-slate-500 text-center">

                    <button
                    onClick={() =>
                        onEdit(record)
                    }
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                    Edit
                    </button>

                </td>
                )}

            </tr>
            ))}

        </tbody>

        </table>
        <Pagination
            page={page}
            totalPages={totalPages}
            totalRecords={totalRecords}
            loading={loading}
            onPageChange={onPageChange}
        />
    </div>
  );
}