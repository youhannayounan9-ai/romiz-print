"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";
import { productData } from "../../data/products";

// Flatten productData object into a single array of products
const allProducts = Object.values(productData).flat();

export default function AdminProductsPage() {
  const [productList, setProductList] = useState(allProducts);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage catalog items, pricing, and ready-made designs.</p>
        </div>

        <button className="flex items-center gap-2 bg-[#0B4DA2] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Base Price</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {productList.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-contain p-1" unoptimized />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{product.name}</div>
                      <div className="text-xs text-gray-400">{product.slug}</div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{product.basePrice} EGP</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Edit Product">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-500 transition-colors" title="Delete Product">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}