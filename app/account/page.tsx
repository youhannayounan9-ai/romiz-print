"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { siteConfig } from "../config/site";
import { User, LogOut, ShoppingBag, MapPin } from "lucide-react";

export default function CustomerAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return <div className="min-h-screen pt-20 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0f1219]">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: siteConfig.colors.primary }}>
              {user?.email?.[0].toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.email}</h1>
              <p className="text-xs text-gray-400 mt-0.5">Verified Customer Account</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold text-lg">
              <ShoppingBag size={20} style={{ color: siteConfig.colors.primary }} />
              <h2>Order History</h2>
            </div>
            <p className="text-sm text-gray-500">You haven't placed any online orders yet.</p>
          </div>

          {/* Shipping Addresses */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold text-lg">
              <MapPin size={20} style={{ color: siteConfig.colors.primary }} />
              <h2>Saved Address</h2>
            </div>
            <p className="text-sm text-gray-500">No address saved. It will auto-save during your next checkout.</p>
          </div>

        </div>
      </div>
    </div>
  );
}