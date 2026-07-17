"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/common/navbar";

import authService from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

import PricingFilters from "@/components/pricing/PricingFilters";
import PricingTable from "@/components/pricing/PricingTable";
import usePricing from "@/hooks/usePricing";
import { PricingRecord } from "@/types/pricing";
import pricingService from "@/services/pricing.service";
import EditPriceDialog from "@/components/pricing/EditPriceDialog";
import useUpload from "@/hooks/useUpload";
import CsvUpload from "@/components/upload/CsvUpload";
import UploadProgress from "@/components/upload/UploadProgress";


export default function DashboardPage() {
  const router = useRouter();

    const {
        pricing,
        loading,
        error,
        page,
        pageSize,
        totalPages,
        totalRecords,
        searchPricing,
        changePage,
        refreshCurrentPage
    } = usePricing();

    const [selectedPricing, setSelectedPricing] = useState<PricingRecord | null>(null);

    const [editOpen, setEditOpen] = useState(false);

    const [user, setUser] = useState<AuthUser | null>(null);

    const {
        uploadStatus,
        uploading,
        uploadFile,
        } = useUpload({
        onCompleted: refreshCurrentPage,
    });

    useEffect(() => {
        if (!authService.isAuthenticated()) {
        router.replace("/login");
        return;
        }

        setUser(authService.getUser());
    }, [router]);

    function handleEdit(record: PricingRecord) {
        setSelectedPricing(record);
        setEditOpen(true);
    }

    async function handleSave(
        pricingId: number,
        price: number
    ) {
        await pricingService.updatePrice(
            pricingId,
            { price }
        );

        await searchPricing({}, page);
    }

    if (!user) {
        return (
        <main className="flex min-h-screen items-center justify-center">
            Loading dashboard...
        </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-100">
            <Navbar user={user} />
            <section className="max-w-7xl mx-auto p-6"> 
                {user.role === "ADMIN" && (
                    <>
                        <CsvUpload
                            uploading={uploading}
                            onUpload={uploadFile}
                        />

                        <UploadProgress
                            status={uploadStatus}
                        />
                    </>
                )}
                <PricingFilters
                    onSearch={(filters) =>
                        searchPricing(filters, 1)
                    }
                />
                <PricingTable
                pricing={pricing}
                loading={loading}
                user={user}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                totalRecords={totalRecords}
                onEdit={handleEdit}
                onPageChange={changePage}
                />
                <EditPriceDialog open={editOpen} pricing={selectedPricing} 
                onClose={() => setEditOpen(false)}
                onSave={handleSave}
                />
            </section>
        </main>
    );
}