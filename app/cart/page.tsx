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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen pt-20 text-center">Loading Cart...</div>;

  const handleCheckout = () => {
    // Generate a WhatsApp message with cart details
    let message = "Hello, I would like to order the following items:\n\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (x${item.quantity})\n`;
      if (item.options) {
        Object.entries(item.options).forEach(([k, v]) => {
          message += `   - ${k}: ${v}\n`;
        });
      }
      message += `   - Price: ${item.price * item.quantity} EGP\n\n`;
    });
    message += `Total: ${subtotal} EGP\n\n`;
    message += "Please let me know how to proceed.";

    const waUrl = `https://wa.me/201041998484?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}>
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
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
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="relative w-24 h-24 rounded-xl bg-gray-50 flex-shrink-0 border border-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1" style={{ color: siteConfig.colors.dark }}>{item.name}</h3>
                    {item.options && (
                      <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1 mb-3">
                        {Object.entries(item.options).map(([k, v]) => (
                          <span key={k} className="capitalize"><span className="font-medium text-gray-700">{k}:</span> {v}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-200 transition-colors rounded-l-lg"
                        >-</button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-200 transition-colors rounded-r-lg"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
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
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
                <h2 className="text-xl font-bold mb-6" style={{ color: siteConfig.colors.dark }}>Order Summary</h2>
                
                <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({totalItems})</span>
                    <span>{subtotal} EGP</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-sm italic">Calculated on WhatsApp</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-bold" style={{ color: siteConfig.colors.dark }}>Subtotal</span>
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
