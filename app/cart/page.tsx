"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { siteConfig } from "../config/site";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [quantityInput, setQuantityInput] = useState("");

  const handleQuantitySubmit = (id: string) => {
    const parsed = parseInt(quantityInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateQuantity(id, parsed);
    }
    setEditingItemId(null);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen pt-20 text-center">Loading Cart...</div>;

  const handleCheckout = () => {
    // Generate a WhatsApp message with cart details using text and links
    const baseUrl = window.location.origin;
    let message = "Hello, I would like to order the following items:\n\n";
    
    items.forEach((item, index) => {
      const productLink = item.productSlug ? `${baseUrl}/products/${item.productSlug}` : `${baseUrl}`;
      message += `${index + 1}. *${item.name}* (x${item.quantity})\n`;
      message += `   Link: ${productLink}\n`;
      
      if (item.options) {
        Object.entries(item.options).forEach(([k, v]) => {
          message += `   - ${k}: ${v}\n`;
        });
      }
      if (item.uploadedImage) {
        message += `   - Custom Design: ${item.uploadedImage}\n`;
      }
      message += `   - Price: ${item.price * item.quantity} EGP\n\n`;
    });
    
    message += `*Total: ${subtotal} EGP*\n\n`;
    message += "Please let me know how to proceed.";

    const waUrl = `https://wa.me/201041998484?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA] dark:bg-[#0f1219]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <ShoppingBag size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              href="/categories"
              className="px-6 py-3 rounded-xl font-bold text-white transition-transform hover:-translate-y-0.5 shadow-md"
              style={{ backgroundColor: siteConfig.colors.accent }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item) => {
                const cid = item.cartItemId;
                const hasUpload = Boolean(item.uploadedImage);
                const previewImage = item.uploadedImage || item.image;
                
                return (
                <div key={cid} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  {/* Thumbnail — shows uploaded design if present, else product image */}
                  <div className="relative w-24 h-24 rounded-xl bg-gray-50 dark:bg-gray-900 flex-shrink-0 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <Image src={previewImage} alt={item.name} fill className="object-contain p-2" unoptimized={hasUpload} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    {item.options && Object.keys(item.options).length > 0 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1 mb-2">
                        {Object.entries(item.options).map(([k, v]) => (
                          <span key={k} className="capitalize">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{k}:</span> {v}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Uploaded design badge */}
                    {hasUpload && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium border border-green-200 dark:border-green-800 mb-3">
                        ✓ Custom design uploaded
                      </span>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-l-lg"
                        >-</button>
                        {editingItemId === item.cartItemId ? (
                          <input 
                            type="number"
                            min="1"
                            autoFocus
                            value={quantityInput}
                            onChange={(e) => setQuantityInput(e.target.value)}
                            onBlur={() => handleQuantitySubmit(item.cartItemId)}
                            onKeyDown={(e) => e.key === "Enter" && handleQuantitySubmit(item.cartItemId)}
                            className="w-12 text-center text-sm font-semibold bg-white dark:bg-gray-800 border border-[#0B4DA2] rounded outline-none"
                          />
                        ) : (
                          <span 
                            onDoubleClick={() => {
                              setQuantityInput(item.quantity.toString());
                              setEditingItemId(item.cartItemId);
                            }}
                            className="w-10 text-center text-sm font-semibold cursor-text select-none"
                            title="Double-click to edit"
                          >
                            {item.quantity}
                          </span>
                        )}
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-r-lg"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.cartItemId)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right sm:text-right w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-0 pt-4 sm:pt-0">
                    <div className="font-bold text-lg" style={{ color: siteConfig.colors.primary }}>
                      {item.price * item.quantity} EGP
                    </div>
                    <div className="text-xs text-gray-500">{item.price} EGP each</div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Items ({totalItems})</span>
                    <span>{subtotal} EGP</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-sm italic">Calculated on WhatsApp</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-bold">Subtotal</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold" style={{ color: siteConfig.colors.primary }}>{subtotal} EGP</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: siteConfig.colors.accent }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
                <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                  Clicking checkout will redirect you to WhatsApp to finalize your order details and shipping.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
