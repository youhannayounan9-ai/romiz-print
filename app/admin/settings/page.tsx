"use client";

import { useState } from "react";
import { Save, Store, Phone, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("Romiz Print");
  const [whatsappNumber, setWhatsappNumber] = useState("+201041998484");
  const [currency, setCurrency] = useState("EGP");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings updated successfully!");
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure global store preferences and checkout phone numbers.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
            <Store size={16} /> Store Name
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:border-[#0B4DA2]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
            <Phone size={16} /> Primary WhatsApp Checkout Number
          </label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:border-[#0B4DA2]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={16} /> Default Currency
          </label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:border-[#0B4DA2]"
          />
        </div>

        <button
          type="submit"
          className="mt-4 flex items-center justify-center gap-2 bg-[#0B4DA2] text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
        >
          <Save size={18} />
          Save Settings
        </button>
      </form>
    </div>
  );
}