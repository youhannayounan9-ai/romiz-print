"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  Loader2,
  MapPin,
  Smartphone,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useCart } from "../context/CartContext";
import { siteConfig } from "../config/site";

/* ─── Governorates & shipping rules ─────────────────────────── */
const CAIRO_GIZA_SHIPPING = 65;
const OTHER_GOVERNORATE_SHIPPING = 100;
const VODAFONE_FEE_RATE = 0.02;

const CAIRO_GIZA = ["Cairo", "Giza"];

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Port Said",
  "Suez",
  "Damietta",
  "Dakahlia",
  "Sharqia",
  "Monufia",
  "Gharbia",
  "Beheira",
  "Kafr El Sheikh",
  "Fayoum",
  "Beni Suef",
  "Minya",
  "Asyut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Red Sea",
  "New Valley",
  "Matrouh",
  "North Sinai",
  "South Sinai",
  "Ismailia",
];

/* ─── Payment method config ─────────────────────────────────── */
type PaymentMethod = "bank" | "instapay" | "vodafone" | "";

const PAYMENT_METHODS: {
  id: Exclude<PaymentMethod, "">;
  label: string;
  description: string;
  icon: typeof Building2;
  accountLabel: string;
  accountNumber: string;
  requiresScreenshot: boolean;
  feeRate: number;
}[] = [
  {
    id: "bank",
    label: "Bank Transfer",
    description: "Transfer to our bank account — no extra fees.",
    icon: Building2,
    accountLabel: "Account Number",
    accountNumber: "8190383000000063",
    requiresScreenshot: false,
    feeRate: 0,
  },
  {
    id: "instapay",
    label: "InstaPay",
    description: "Instant transfer via InstaPay — upload your receipt below.",
    icon: Smartphone,
    accountLabel: "InstaPay Number",
    accountNumber: "01200956004",
    requiresScreenshot: true,
    feeRate: 0,
  },
  {
    id: "vodafone",
    label: "Vodafone Cash",
    description: "Pay via Vodafone Cash wallet — a 2% payment fee applies.",
    icon: CreditCard,
    accountLabel: "Vodafone Cash Number",
    accountNumber: "01041998484",
    requiresScreenshot: true,
    feeRate: VODAFONE_FEE_RATE,
  },
];

/* ─── Form state & errors ───────────────────────────────────── */
interface CheckoutForm {
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  governorate?: string;
  address?: string;
  paymentMethod?: string;
  receipt?: string;
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white";

function formatEGP(value: number) {
  return `${value.toLocaleString()} EGP`;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    phone: "",
    governorate: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptUploading, setReceiptUploading] = useState(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── Derived totals ── */
  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod) || null;

  const shippingFee = useMemo(() => {
    if (!form.governorate) return 0;
    return CAIRO_GIZA.includes(form.governorate)
      ? CAIRO_GIZA_SHIPPING
      : OTHER_GOVERNORATE_SHIPPING;
  }, [form.governorate]);

  const paymentFee = useMemo(() => {
    if (!selectedMethod) return 0;
    return Math.round((subtotal + shippingFee) * selectedMethod.feeRate * 100) / 100;
  }, [selectedMethod, subtotal, shippingFee]);

  const total = subtotal + shippingFee + paymentFee;

  /* ── Helpers ── */
  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  /* ── Validation ── */
  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\+?[0-9\s-]{8,16}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid phone number";
    if (!form.governorate) errs.governorate = "Please select your governorate";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    if (!paymentMethod) errs.paymentMethod = "Please choose a payment method";
    if (selectedMethod?.requiresScreenshot && !receiptUrl)
      errs.receipt = "A transfer screenshot is required for this payment method";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (items.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            governorate: form.governorate,
            address: form.address.trim(),
          },
          items: items.map((item) => ({
            name: item.name,
            slug: item.productSlug,
            quantity: item.quantity,
            unitPrice: item.price,
            lineTotal: Math.round(item.price * item.quantity * 100) / 100,
            options: item.options || {},
            image: item.uploadedImage || item.image || null,
          })),
          subtotal,
          shippingFee,
          paymentFee,
          total,
          paymentMethod: selectedMethod?.label || paymentMethod,
          receiptUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place your order. Please try again.");
      }

      // Empty the cart, then celebrate 🎉
      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(data.orderId)}`);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
      setSubmitting(false);
    }
  }

  /* ── Guards ── */
  if (!mounted) {
    return <div className="min-h-screen pt-20 text-center text-gray-500">Loading Checkout...</div>;
  }

  if (items.length === 0) {
    return (
      <div
        className="min-h-[70vh] flex items-center justify-center px-4 py-20"
        style={{ backgroundColor: siteConfig.colors.background }}
      >
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm max-w-md">
          <AlertCircle size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Nothing to check out</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your cart is empty. Add some products first, then come back to complete your order.
          </p>
          <Link
            href="/categories"
            className="px-6 py-3 rounded-xl font-bold text-white transition-transform hover:-translate-y-0.5 shadow-md"
            style={{ backgroundColor: siteConfig.colors.accent }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  /* ── Page ── */
  return (
    <div style={{ backgroundColor: siteConfig.colors.background }}>
      {/* ── Header ── */}
      <section
        className="w-full py-10 px-4 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #E8EEF7 100%)" }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1
            className="text-3xl sm:text-4xl font-bold"
            style={{
              color: siteConfig.colors.dark,
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Checkout
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-lg mx-auto">
            Review your order, enter your delivery details, and choose how you&apos;d like to pay.
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          {/* ── LEFT: Details, shipping, payment ── */}
          <div className="flex-1 w-full flex flex-col gap-8">
            {/* Step 1 — Order review */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-bold mb-5 text-gray-900 dark:text-white">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: siteConfig.colors.primary }}
                >
                  1
                </span>
                Your Order ({items.length} {items.length === 1 ? "item" : "items"})
              </h2>

              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="relative w-14 h-14 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.uploadedImage || item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {item.name}
                        <span className="text-gray-400 font-normal"> × {item.quantity}</span>
                      </p>
                      {item.options && Object.keys(item.options).length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {Object.entries(item.options)
                            .filter(([, v]) => v)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" • ")}
                        </p>
                      )}
                    </div>
                    <div className="text-sm font-bold whitespace-nowrap" style={{ color: siteConfig.colors.primary }}>
                      {formatEGP(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Step 2 — Customer details */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-bold mb-5 text-gray-900 dark:text-white">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: siteConfig.colors.primary }}
                >
                  2
                </span>
                Delivery Details
              </h2>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="co-name" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Full Name<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="co-name"
                    type="text"
                    autoComplete="name"
                    aria-label="Your full name"
                    aria-required="true"
                    aria-invalid={!!errors.fullName}
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    placeholder="Ahmed Hassan"
                    className={inputClass}
                    style={{ borderColor: errors.fullName ? "#EF4444" : "#E5E7EB" }}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-0.5">{errors.fullName}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="co-phone" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Phone Number<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="co-phone"
                    type="tel"
                    autoComplete="tel"
                    aria-label="Your phone number"
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+20 10 1234 5678"
                    className={inputClass}
                    style={{ borderColor: errors.phone ? "#EF4444" : "#E5E7EB" }}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="co-gov" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Governorate<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="co-gov"
                    aria-label="Your governorate"
                    aria-required="true"
                    aria-invalid={!!errors.governorate}
                    value={form.governorate}
                    onChange={(e) => setForm((p) => ({ ...p, governorate: e.target.value }))}
                    className={inputClass}
                    style={{ borderColor: errors.governorate ? "#EF4444" : "#E5E7EB" }}
                  >
                    <option value="">Select your governorate</option>
                    {GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {form.governorate && (
                    <p
                      className="text-xs mt-1 flex items-center gap-1.5 font-medium"
                      style={{ color: siteConfig.colors.primary }}
                    >
                      <MapPin size={13} />
                      Shipping to {form.governorate}:{" "}
                      {formatEGP(
                        CAIRO_GIZA.includes(form.governorate)
                          ? CAIRO_GIZA_SHIPPING
                          : OTHER_GOVERNORATE_SHIPPING
                      )}
                    </p>
                  )}
                  {errors.governorate && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.governorate}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="co-address" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Delivery Address<span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="co-address"
                    rows={3}
                    autoComplete="street-address"
                    aria-label="Your full delivery address"
                    aria-required="true"
                    aria-invalid={!!errors.address}
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Street, building, apartment, floor, landmark..."
                    className={`${inputClass} resize-none`}
                    style={{ borderColor: errors.address ? "#EF4444" : "#E5E7EB" }}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>}
                </div>
              </div>
            </section>

            {/* Step 3 — Payment */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-bold mb-5 text-gray-900 dark:text-white">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: siteConfig.colors.primary }}
                >
                  3
                </span>
                Payment Method
              </h2>

              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <div key={method.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod(method.id);
                          setErrors((prev) => ({ ...prev, paymentMethod: undefined }));
                        }}
                        aria-pressed={isSelected}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-[#0B4DA2] bg-[#F0F5FF] dark:bg-[#0B4DA2]/10"
                            : "border-gray-200 dark:border-gray-700 hover:border-[#0B4DA2]/40"
                        }`}
                      >
                        <span
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: isSelected ? siteConfig.colors.primary : "#E8EEF7",
                            color: isSelected ? "#fff" : siteConfig.colors.primary,
                          }}
                        >
                          <Icon size={20} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                            {method.label}
                            {method.feeRate > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                +2% FEE
                              </span>
                            )}
                          </span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {method.description}
                          </span>
                        </span>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                            isSelected ? "border-[#0B4DA2]" : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0B4DA2]" />
                          )}
                        </span>
                      </button>

                      {/* Payment details revealed on selection */}
                      {isSelected && (
                        <div className="mt-2 mx-1 mb-1 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                          {/* Account number + copy */}
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {method.accountLabel}
                              </p>
                              <p
                                className="text-lg font-bold tracking-wide text-gray-900 dark:text-white"
                                style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                              >
                                {method.accountNumber}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(method.id, method.accountNumber)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                            >
                              {copiedKey === method.id ? (
                                <>
                                  <CheckCircle2 size={14} className="text-green-600" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>

                          {method.feeRate > 0 && (
                            <p className="text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-lg px-3 py-2">
                              A 2% payment fee ({formatEGP(paymentFee)}) is added to your total for
                              Vodafone Cash payments.
                            </p>
                          )}

                          {/* Screenshot upload for InstaPay / Vodafone Cash */}
                          {method.requiresScreenshot && (
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                Transfer Screenshot
                                <span className="text-red-500 ml-1">*</span>
                                <span className="text-xs font-normal text-gray-400 ml-2">
                                  (required — upload proof of payment)
                                </span>
                              </p>
                              {receiptUrl ? (
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-300 bg-green-50 dark:bg-green-900/20">
                                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                                  <p className="flex-1 text-sm font-semibold text-green-700 dark:text-green-400">
                                    Screenshot uploaded successfully
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setReceiptUrl(null)}
                                    aria-label="Remove uploaded screenshot"
                                    className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 size={16} className="text-red-400" />
                                  </button>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-1">
                                  <UploadDropzone<OurFileRouter, "designUploader">
                                    endpoint="designUploader"
                                    onUploadBegin={() => setReceiptUploading(true)}
                                    onClientUploadComplete={(res) => {
                                      setReceiptUploading(false);
                                      if (res && res[0]) {
                                        setReceiptUrl(res[0].url);
                                        setErrors((prev) => ({ ...prev, receipt: undefined }));
                                      }
                                    }}
                                    onUploadError={(error: Error) => {
                                      setReceiptUploading(false);
                                      console.error("Receipt upload error:", error);
                                      setErrors((prev) => ({
                                        ...prev,
                                        receipt: "Upload failed. Please try again.",
                                      }));
                                    }}
                                    appearance={{
                                      container: "border-0 p-4",
                                      uploadIcon: "text-[#0B4DA2]",
                                      label: "text-[#0B4DA2]",
                                      allowedContent: "text-gray-500 text-xs",
                                      button: "ut-ready:bg-[#0B4DA2] ut-uploading:bg-[#0B4DA2]/60",
                                    }}
                                  />
                                  {receiptUploading && (
                                    <p className="flex items-center justify-center gap-2 text-xs text-gray-500 pb-3">
                                      <Loader2 size={13} className="animate-spin" />
                                      Uploading screenshot...
                                    </p>
                                  )}
                                </div>
                              )}
                              {errors.receipt && (
                                <p className="text-xs text-red-500">{errors.receipt}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.paymentMethod && (
                <p className="text-xs text-red-500 mt-3">{errors.paymentMethod}</p>
              )}
            </section>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="w-full lg:w-[380px] flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatEGP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {form.governorate
                      ? formatEGP(shippingFee)
                      : <span className="text-sm italic">Select governorate</span>}
                  </span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Vodafone Cash fee (2%)</span>
                    <span>{formatEGP(paymentFee)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-bold">Total</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: siteConfig.colors.primary }}
                >
                  {formatEGP(total)}
                </span>
              </div>

              {errorMsg && (
                <div
                  className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}
                  role="alert"
                >
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{ backgroundColor: siteConfig.colors.accent }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                By placing your order you agree to our{" "}
                <Link href="/terms-of-service" className="underline hover:text-gray-700">
                  Terms of Service
                </Link>
                . Our team will contact you to confirm delivery.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
