"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type DragEvent,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  X,
  Upload,
  CheckCircle,
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";
import { siteConfig } from "../config/site";

/* ─── Types ─────────────────────────────────────────── */
interface QuoteModalProps {
  isOpen: boolean;
  productName: string;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  quantity: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  quantity?: string;
  file?: string;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/postscript", // .ai
  "image/vnd.adobe.photoshop", // .psd
];
const ALLOWED_EXT = [".pdf", ".png", ".jpg", ".jpeg", ".ai", ".psd"];
const MAX_SIZE_MB = 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Input Field ─────────────────────────────────── */
function Field({
  label,
  id,
  error,
  required,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-semibold"
        style={{ color: siteConfig.colors.dark }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] placeholder-gray-400";

/* ─── Main Modal ─────────────────────────────────── */
export default function QuoteModal({
  isOpen,
  productName,
  onClose,
}: QuoteModalProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    quantity: "1",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Reset state when modal closes ── */
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm({ name: "", email: "", phone: "", quantity: "1", notes: "" });
        setErrors({});
        setFile(null);
        setSuccess(false);
        setSubmitting(false);
      }, 300);
    }
  }, [isOpen]);

  /* ── Focus trap + Esc key ── */
  useEffect(() => {
    if (!isOpen) return;
    firstFocusRef.current?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  /* ── File validation ── */
  const validateFile = useCallback((f: File): string | null => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    const validType =
      ALLOWED_TYPES.includes(f.type) || ALLOWED_EXT.includes(ext);
    if (!validType)
      return `Unsupported file type. Allowed: ${ALLOWED_EXT.join(", ")}`;
    if (f.size > MAX_SIZE_BYTES)
      return `File too large. Max ${MAX_SIZE_MB}MB (yours: ${formatBytes(f.size)})`;
    return null;
  }, []);

  const handleFileSelect = useCallback(
    (f: File) => {
      const err = validateFile(f);
      if (err) {
        setErrors((prev) => ({ ...prev, file: err }));
        return;
      }
      setErrors((prev) => ({ ...prev, file: undefined }));
      setFile(f);
    },
    [validateFile]
  );

  /* ── Drag & Drop ── */
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect]
  );

  /* ── Form validation ── */
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

    const payload = {
      product: productName,
      name: form.name,
      email: form.email,
      phone: form.phone,
      quantity: Number(form.quantity),
      notes: form.notes,
      file: file ? `${file.name} (${formatBytes(file.size)})` : null,
    };

    try {
      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* best-effort — still show success for demo */
    }

    setSubmitting(false);
    setSuccess(true);

    /* Auto-close after 3 seconds */
    setTimeout(() => onClose(), 3000);
  }

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(30,37,48,0.6)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Request a quote for ${productName}`}
    >
      {/* Modal Panel */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{
          backgroundColor: "#fff",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* ── Header ── */}
        <div
          className="sticky top-0 z-10 flex items-start justify-between p-5 border-b border-gray-100"
          style={{ backgroundColor: "#fff" }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
              Quote Request
            </p>
            <h2
              className="text-lg font-bold leading-tight"
              style={{
                color: siteConfig.colors.dark,
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              {productName}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg transition-colors hover:bg-gray-100 flex-shrink-0 mt-0.5"
            style={{ color: siteConfig.colors.dark }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Success State ── */}
        {success ? (
          <div className="flex flex-col items-center justify-center gap-5 p-10 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E8F5E9" }}
            >
              <CheckCircle size={36} className="text-green-500" />
            </div>
            <div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}
              >
                Quote Sent! 🎉
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Thanks! We&apos;ll contact you within 24 hours with your custom quote.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: siteConfig.colors.primary }}
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-5 flex flex-col gap-4">
              {/* Name */}
              <Field label="Full Name" id="quote-name" error={errors.name} required>
                <input
                  ref={firstFocusRef}
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
              </Field>

              {/* Email */}
              <Field label="Email Address" id="quote-email" error={errors.email} required>
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
              </Field>

              {/* Phone + Quantity row */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone" id="quote-phone">
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
                </Field>
                <Field label="Quantity" id="quote-qty" error={errors.quantity} required>
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
                </Field>
              </div>

              {/* Notes */}
              <Field label="Project Notes" id="quote-notes">
                <textarea
                  id="quote-notes"
                  rows={3}
                  aria-label="Notes about your project"
                  value={form.notes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  placeholder="Tell us about your project — colours, finish, special requirements..."
                  className={`${inputClass} resize-none`}
                  style={{ borderColor: "#E5E7EB" }}
                />
              </Field>

              {/* File Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold" style={{ color: siteConfig.colors.dark }}>
                  Design File
                  <span className="text-xs font-normal text-gray-400 ml-2">
                    (PDF, PNG, JPG, AI, PSD — max 25MB)
                  </span>
                </label>

                {file ? (
                  /* File selected */
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                    style={{ borderColor: siteConfig.colors.primary, backgroundColor: "#F0F5FF" }}
                  >
                    <FileText size={20} style={{ color: siteConfig.colors.primary }} />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: siteConfig.colors.dark }}
                      >
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
                  /* Drop zone */
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: isDragging ? siteConfig.colors.primary : "#D1D5DB",
                      backgroundColor: isDragging ? "#F0F5FF" : "#FAFAFA",
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload design file"
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  >
                    <Upload
                      size={24}
                      style={{ color: isDragging ? siteConfig.colors.primary : "#9CA3AF" }}
                    />
                    <p className="text-sm text-center text-gray-500">
                      <span
                        className="font-semibold"
                        style={{ color: siteConfig.colors.primary }}
                      >
                        Drop your design here
                      </span>{" "}
                      or click to browse
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
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
                {errors.file && (
                  <p className="text-xs text-red-500">{errors.file}</p>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="sticky bottom-0 p-5 border-t border-gray-100 bg-white">
              <button
                type="submit"
                disabled={submitting}
                aria-label="Send quote request"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-0.5"
                style={{ backgroundColor: siteConfig.colors.accent }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Quote Request →
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
