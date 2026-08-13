"use client";

import { useState } from "react";
import { X, Upload, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "../config/site";

export type FieldConfig = {
  id: string;
  label: string;
  type: "select" | "textarea" | "color" | "text" | "radio";
  options?: string[]; // for select or radio or color
  placeholder?: string;
  required?: boolean;
};

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  fields: FieldConfig[];
  examples: string[];
  pricing?: React.ReactNode;
  fileRequired?: boolean;
}

export default function CustomizationModal({
  isOpen,
  onClose,
  productName,
  fields,
  examples,
  pricing,
  fileRequired = false,
}: CustomizationModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev + 1) % examples.length);
  };

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      // Build notes string from all dynamic fields
      const notesParts = fields.map((f) => {
        const val = formData[f.id];
        return val ? `${f.label}: ${val}` : "";
      }).filter(Boolean);
      
      const combinedNotes = notesParts.join(" | ");

      const payload = {
        product: productName,
        name: formData.name || "Customer",
        email: formData.email,
        phone: formData.phone || "",
        notes: combinedNotes,
        quantity: formData.quantity ? parseInt(formData.quantity) : 1,
        file: file ? file.name : null,
      };

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit request.");
      
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X size={18} className="text-gray-600" />
        </button>

        {/* Left Side - Image Gallery & Pricing */}
        <div className="w-full md:w-5/12 bg-gray-50 flex flex-col relative overflow-y-auto">
          {examples.length > 0 && (
            <div className="relative w-full aspect-square bg-gray-200">
              <Image
                src={examples[currentImageIdx]}
                alt={`${productName} example ${currentImageIdx + 1}`}
                fill
                className="object-cover"
              />
              {examples.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow hover:bg-white transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow hover:bg-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {examples.map((_, idx) => (
                      <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIdx ? "bg-white" : "bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2" style={{ color: siteConfig.colors.dark }}>
              Customize {productName}
            </h2>
            {pricing && (
              <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 text-sm text-gray-700">
                {pricing}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto">
          {status === "success" ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Request Sent!</h3>
              <p className="text-gray-500">We&apos;ll be in touch with your custom quote within 24 hours.</p>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: siteConfig.colors.accent }}
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Standard Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="John Doe"
                    value={formData.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="john@example.com"
                    value={formData.email || ""}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="+20 123 456 7890"
                    value={formData.phone || ""}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {/* Dynamic Fields */}
              {fields.length > 0 && (
                <div className="space-y-5 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Product Options</h3>
                  {fields.map((f) => (
                    <div key={f.id} className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">{f.label} {f.required && "*"}</label>
                      
                      {f.type === "text" && (
                        <input
                          type="text"
                          required={f.required}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          placeholder={f.placeholder}
                          value={formData[f.id] || ""}
                          onChange={(e) => handleFieldChange(f.id, e.target.value)}
                        />
                      )}

                      {f.type === "textarea" && (
                        <textarea
                          required={f.required}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                          placeholder={f.placeholder}
                          value={formData[f.id] || ""}
                          onChange={(e) => handleFieldChange(f.id, e.target.value)}
                        />
                      )}

                      {f.type === "select" && f.options && (
                        <div className="relative">
                          <select
                            required={f.required}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white"
                            value={formData[f.id] || ""}
                            onChange={(e) => handleFieldChange(f.id, e.target.value)}
                          >
                            <option value="" disabled>Select an option</option>
                            {f.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                        </div>
                      )}

                      {f.type === "color" && f.options && (
                        <div className="flex flex-wrap gap-3">
                          {f.options.map((color) => (
                            <label key={color} className="relative cursor-pointer flex flex-col items-center gap-1 group">
                              <input 
                                type="radio" 
                                name={f.id} 
                                value={color}
                                required={f.required}
                                checked={formData[f.id] === color}
                                onChange={(e) => handleFieldChange(f.id, e.target.value)}
                                className="peer sr-only"
                              />
                              <div 
                                className="w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-blue-600 peer-checked:scale-110 shadow-sm transition-all"
                                style={{ backgroundColor: color.toLowerCase() === "white" ? "#f8f9fa" : color.toLowerCase() }}
                                title={color}
                              />
                              <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 whitespace-nowrap">{color}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                    </div>
                  ))}
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-1.5 pt-4 border-t border-gray-100">
                <label className="text-sm font-semibold text-gray-700">Design File {fileRequired && "*"}</label>
                <div className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    required={fileRequired}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className="flex flex-col items-center text-center">
                    <Upload size={24} className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                    {file ? (
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full flex justify-center items-center py-3.5 rounded-xl font-bold text-white transition-all shadow-md shadow-orange-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                style={{ backgroundColor: siteConfig.colors.accent }}
              >
                {status === "submitting" ? "Sending Request..." : "Request Quote"}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
