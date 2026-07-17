"use client";

import { useRouter } from "next/navigation";

import authService from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

interface NavbarProps {
  user: AuthUser;
}

export default function Navbar({
  user,
}: NavbarProps) {
  const router = useRouter();

  function handleLogout() {
    authService.logout();
    router.replace("/login");
  }

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <div>
          <h1 className="text-2xl text-slate-800 font-bold">
            Retail Pricing Dashboard
          </h1>

          <p className="text-gray-500 text-sm">
            Manage pricing uploads and updates
          </p>
        </div>

        <div className="flex items-center gap-5">

          <div className="text-right">
            <p className="font-semibold text-slate-600">
              {user.email}
            </p>

            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {user.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}