"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle, FileText, Home, Loader2, Trash2, Upload } from "lucide-react";
import { siteConfig } from "../config/site";

/* ─── Shared styling with QuoteModal ─────────────────── */
const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] placeholder-gray-400";

const ALLOWED_EXT = [".pdf", ".png", ".jpg", ".jpeg", ".ai", ".psd"];
const MAX_SIZE_MB = 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface FormData {
  name: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  quantity?: string;
  file?: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* Popular products for the dropdown (matches productData slugs) */
const PRODUCT_OPTIONS = [
  "Custom T-Shirt",
  "Custom Lab Coat",
  "Custom Framed Poster",
  "Custom Mug",
  "Custom Business Cards",
  "Custom Stickers",
  "Custom Vinyl Banner",
  "Roll Up Banner",
  "Custom Flyers",
  "Custom Tote Bag",
  "Custom Cap",
  "Custom Stamp",
  "Custom Pens",
  "Custom Hoodie",
  "Custom Football Kit",
  "Other / Not Listed",
];

export default function QuotePage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    product: "",
    quantity: "1",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ── File validation ── */
  const validateFile = (f: File): string | null => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXT.includes(ext))
      return `Unsupported file type. Allowed: ${ALLOWED_EXT.join(", ")}`;
    if (f.size > MAX_SIZE_BYTES)
      return `File too large. Max ${MAX_SIZE_MB}MB (yours: ${formatBytes(f.size)})`;
    return null;
  };

  const handleFileSelect = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setErrors((prev) => ({ ...prev, file: err }));
      return;
    }
    setErrors((prev) => ({ ...prev, file: undefined }));
    setFile(f);
  };

  /* ── Validation ── */
  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (!form.quantity || Number(form.quantity) < 1)
      errs.quantity = "Quantity must be at least 1";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      product: form.product.trim() || "General Quote Request",
      name: form.name,
      email: form.email,
      phone: form.phone,
      quantity: Number(form.quantity),
      notes: form.notes,
      file: file ? `${file.name} (${formatBytes(file.size)})` : null,
    };

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit your request. Please try again.");
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div
        className="min-h-[70vh] flex items-center justify-center px-4 py-20"
        style={{ backgroundColor: siteConfig.colors.background }}
      >
        <div className="flex flex-col items-center justify-center gap-5 text-center max-w-md">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#E8F5E9" }}
          >
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{
                color: siteConfig.colors.dark,
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              Quote Sent! 🎉
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Thanks! We&apos;ll contact you within 24 hours with your custom quote.
            </p>
          </div>
          <Link
            href="/"
            className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: siteConfig.colors.primary }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div style={{ backgroundColor: siteConfig.colors.background }}>
      {/* ── Hero ── */}
      <section
        className="w-full py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #E8EEF7 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-gray-400 mb-8 flex-wrap"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-gray-600 transition-colors"
            >
              <Home size={13} />
              Home
            </Link>
            <span className="text-gray-300">›</span>
            <span style={{ color: siteConfig.colors.primary }} className="font-semibold">
              Get a Quote
            </span>
          </nav>

          <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 w-full justify-center">
              <span className="flex-1 max-w-20 h-px" style={{ backgroundColor: "#C4D4ED" }} />
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                style={{
                  color: siteConfig.colors.dark,
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                Get a Quote
              </h1>
              <span className="flex-1 max-w-20 h-px" style={{ backgroundColor: "#C4D4ED" }} />
            </div>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg">
              Tell us about your project and we&apos;ll get back to you within 24 hours
              with a custom quote — no minimums, free design help included.
            </p>
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-2xl mx-auto flex flex-col gap-5 rounded-3xl bg-white shadow-xl border border-gray-100 p-6 sm:p-10"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="quote-name" className="text-sm font-semibold" style={{ color: siteConfig.colors.dark }}>
              Full Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="quote-name"
              type="text"
              autoComplete="name"
              aria-label="Your full name"
              aria-required="true"
              aria-invalid={!!errors.name}
              value={form.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Ahmed Hassan"
              className={inputClass}
              style={{ borderColor: errors.name ? "#EF4444" : "#E5E7EB" }}
            />
            {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="quote-email" className="text-sm font-semibold" style={{ color: siteConfig.colors.dark }}>
              Email Address<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="quote-email"
              type="email"
              autoComplete="email"
              aria-label="Your email address"
              aria-required="true"
              aria-invalid={!!errors.email}
              value={form.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="ahmed@company.com"
              className={inputClass}
              style={{ borderColor: errors.email ? "#EF4444" : "#E5E7EB" }}
            />
            {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
          </div>

          {/* Phone + Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quote-phone" className="text-sm font-semibold" style={{ color: siteConfig.colors.dark }}>
                Phone
              </label>
              <input
                id="quote-phone"
                type="tel"
                autoComplete="tel"
                aria-label="Your phone number (optional)"
                value={form.phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+20 10 1234 5678"
                className={inputClass}
                style={{ borderColor: "#E5E7EB" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="quote-qty" className="text-sm font-semibold" style={{ color: siteConfig.colors.dark }}>
                Quantity<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="quote-qty"
                type="number"
                min={1}
                aria-label="Number of items"
                aria-required="true"
                aria-invalid={!!errors.quantity}
                value={form.quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setForm((p) => ({ ...p, quantity: e.target.value }))
                }
                className={inputClass}
                style={{ borderColor: errors.quantity ? "#EF4444" : "#E5E7EB" }}
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-0.5">{errors.quantity}</p>}
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="quote-product" className="text-sm font-semibold" style={{ color: siteConfig.colors.dark }}>
              Product / Service
            </label>
            <select
              id="quote-product"
              aria-label="Product or service you need a quote for"
              value={form.product}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setForm((p) => ({ ...p, product: e.target.value }))
              }
              className={inputClass}
              style={{ borderColor: "#E5E7EB" }}
            >
              <option value="">Select a product (optional)</option>
              {PRODUCT_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="quote-notes" className="text-sm font-semibold" style={{ color: siteConfig.colors.dark }}>
              Project Notes
            </label>
            <textarea
              id="quote-notes"
              rows={4}
              aria-label="Notes about your project"
              value={form.notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Tell us about your project — colours, sizes, finish, special requirements..."
              className={`${inputClass} resize-none`}
              style={{ borderColor: "#E5E7EB" }}
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: siteConfig.colors.dark }}>
              Design File
              <span className="text-xs font-normal text-gray-400 ml-2">
                (PDF, PNG, JPG, AI, PSD — max {MAX_SIZE_MB}MB)
              </span>
            </label>

            {file ? (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{ borderColor: siteConfig.colors.primary, backgroundColor: "#F0F5FF" }}
              >
                <FileText size={20} style={{ color: siteConfig.colors.primary }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: siteConfig.colors.dark }}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label="Remove file"
                  className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const dropped = e.dataTransfer.files[0];
                  if (dropped) handleFileSelect(dropped);
                }}
                onClick={() => document.getElementById("quote-page-file")?.click()}
                className="flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200"
                style={{
                  borderColor: isDragging ? siteConfig.colors.primary : "#D1D5DB",
                  backgroundColor: isDragging ? "#F0F5FF" : "#FAFAFA",
                }}
                role="button"
                tabIndex={0}
                aria-label="Upload design file"
                onKeyDown={(e) => e.key === "Enter" && document.getElementById("quote-page-file")?.click()}
              >
                <Upload size={24} style={{ color: isDragging ? siteConfig.colors.primary : "#9CA3AF" }} />
                <p className="text-sm text-center text-gray-500">
                  <span className="font-semibold" style={{ color: siteConfig.colors.primary }}>
                    Drop your design here
                  </span>{" "}
                  or click to browse
                </p>
              </div>
            )}

            <input
              id="quote-page-file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.ai,.psd"
              className="hidden"
              aria-hidden="true"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
                e.target.value = "";
              }}
            />
            {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div
              className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}
              role="alert"
            >
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            aria-label="Send quote request"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-0.5 shadow-md"
            style={{ backgroundColor: siteConfig.colors.accent }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>Send Quote Request →</>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Prefer to chat? WhatsApp us at{" "}
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="font-semibold hover:underline"
              style={{ color: siteConfig.colors.primary }}
            >
              {siteConfig.contact.phone}
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}
