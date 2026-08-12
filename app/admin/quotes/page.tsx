"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Download,
  CheckCheck,
  Trash2,
  Eye,
  Filter,
  X,
  FileText,
} from "lucide-react";
import { siteConfig } from "../../config/site";
import {
  type Quote,
  getCategoryFromProduct,
  filterQuotes,
  exportToCSV,
  downloadCSV,
  getQuotesByCategory,
} from "../../../lib/analytics";

/* ─── Shared input style ─────────────────────────────── */
const inputCls =
  "px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0B4DA2]/20 focus:border-[#0B4DA2] transition-all bg-white";

/* ─── Detail modal ───────────────────────────────────── */
function QuoteDetailModal({
  quote,
  onClose,
  onMarkContacted,
}: {
  quote: Quote | null;
  onClose: () => void;
  onMarkContacted: (id: string) => void;
}) {
  if (!quote) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(30,37,48,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Quote #{quote.id.slice(-6)}</p>
            <h2 className="text-lg font-bold" style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}>
              {quote.product}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: quote.contacted ? "#E8F5E9" : "#FFF3E0",
              color: quote.contacted ? "#2E7D32" : "#E65100",
            }}
          >
            {quote.contacted ? "✓ Contacted" : "⏳ Pending"}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(quote.timestamp).toLocaleString("en-GB")}
          </span>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ["Customer", quote.customer.name],
            ["Email", quote.customer.email],
            ["Phone", quote.customer.phone || "—"],
            ["Quantity", String(quote.customer.quantity)],
            ["Category", getCategoryFromProduct(quote.product)],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="font-medium" style={{ color: siteConfig.colors.dark }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        {quote.customer.notes && (
          <div>
            <p className="text-xs text-gray-400 mb-1">Project Notes</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl leading-relaxed">
              {quote.customer.notes}
            </p>
          </div>
        )}

        {/* File */}
        {quote.file && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50">
            <FileText size={18} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium" style={{ color: siteConfig.colors.dark }}>
                {quote.file.split("(")[0].trim()}
              </p>
              <p className="text-xs text-gray-400">{quote.file.match(/\(([^)]+)\)/)?.[1] ?? ""}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          {!quote.contacted && (
            <button
              onClick={() => { onMarkContacted(quote.id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#10B981" }}
            >
              <CheckCheck size={16} /> Mark Contacted
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-gray-50"
            style={{ borderColor: "#E5E7EB", color: siteConfig.colors.dark }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewQuote, setViewQuote] = useState<Quote | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  /* Filters */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* Fetch */
  useEffect(() => {
    fetch("/api/quotes")
      .then((r) => r.json())
      .then((data) => { setQuotes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  /* Derived */
  const categories = useMemo(() => {
    const cats = getQuotesByCategory(quotes).map((c) => c.category);
    return ["all", ...cats];
  }, [quotes]);

  const filtered = useMemo(() =>
    filterQuotes(quotes, {
      from: fromDate ? new Date(fromDate) : null,
      to: toDate ? new Date(toDate) : null,
      category,
      search,
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [quotes, search, category, fromDate, toDate]
  );

  /* Actions */
  async function handleDelete(id: string) {
    if (!confirm("Delete this quote permanently?")) return;
    setDeleting(id);
    await fetch(`/api/quotes?id=${id}`, { method: "DELETE" });
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    setSelected((prev) => { const s = new Set(prev); s.delete(id); return s; });
    setDeleting(null);
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selected.size} selected quotes?`)) return;
    for (const id of selected) {
      await fetch(`/api/quotes?id=${id}`, { method: "DELETE" });
    }
    setQuotes((prev) => prev.filter((q) => !selected.has(q.id)));
    setSelected(new Set());
  }

  async function handleMarkContacted(id: string) {
    await fetch(`/api/quotes?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacted: true }),
    });
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, contacted: true } : q))
    );
  }

  async function handleBulkContacted() {
    for (const id of selected) {
      await handleMarkContacted(id);
    }
    setSelected(new Set());
  }

  function handleExportCSV() {
    const toExport = selected.size > 0
      ? filtered.filter((q) => selected.has(q.id))
      : filtered;
    const csv = exportToCSV(toExport);
    downloadCSV(csv, `quotes-export-${Date.now()}.csv`);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((q) => q.id)));
    }
  }

  function clearFilters() {
    setSearch(""); setCategory("all"); setFromDate(""); setToDate("");
  }

  const hasFilters = search || category !== "all" || fromDate || toDate;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}>
            Quote Requests
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {filtered.length} of {quotes.length} total
          </p>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2 py-1 rounded-lg text-white" style={{ backgroundColor: siteConfig.colors.primary }}>
              {selected.size} selected
            </span>
            <button onClick={handleBulkContacted} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
              <CheckCheck size={13} /> Mark Contacted
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 transition-colors" style={{ color: siteConfig.colors.primary }}>
              <Download size={13} /> Export CSV
            </button>
            <button onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}

        {selected.size === 0 && (
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-gray-50" style={{ borderColor: siteConfig.colors.primary, color: siteConfig.colors.primary }}>
            <Download size={15} /> Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} style={{ color: siteConfig.colors.primary }} />
          <span className="text-xs font-semibold" style={{ color: siteConfig.colors.dark }}>Filters</span>
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Name, email, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputCls} pl-8 w-full`}
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputCls} w-full`}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
            ))}
          </select>

          {/* From date */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={`${inputCls} w-full`}
            placeholder="From date"
          />

          {/* To date */}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={`${inputCls} w-full`}
            placeholder="To date"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#0B4DA2] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <FileText size={32} />
            <p className="text-sm">{hasFilters ? "No quotes match your filters." : "No quotes yet."}</p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs underline" style={{ color: siteConfig.colors.primary }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="rounded"
                    />
                  </th>
                  {["Date", "Product", "Customer", "Email", "Qty", "Category", "Status", "File", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors"
                    style={{ opacity: deleting === q.id ? 0.5 : 1 }}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(q.id)}
                        onChange={() => toggleSelect(q.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(q.timestamp).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 max-w-[160px] truncate font-medium" style={{ color: siteConfig.colors.dark }}>
                      {q.product}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: siteConfig.colors.dark }}>
                      {q.customer.name}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <a href={`mailto:${q.customer.email}`} className="hover:underline" style={{ color: siteConfig.colors.primary }}>
                        {q.customer.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: siteConfig.colors.dark }}>
                      {q.customer.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: siteConfig.colors.lightBar, color: siteConfig.colors.primary }}>
                        {getCategoryFromProduct(q.product)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: q.contacted ? "#E8F5E9" : "#FFF3E0",
                          color: q.contacted ? "#2E7D32" : "#E65100",
                        }}
                      >
                        {q.contacted ? "Contacted" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {q.file ? "📎 Yes" : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewQuote(q)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          style={{ color: siteConfig.colors.primary }}
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        {!q.contacted && (
                          <button
                            onClick={() => handleMarkContacted(q.id)}
                            className="p-1.5 rounded-lg hover:bg-green-50 transition-colors text-green-600"
                            title="Mark contacted"
                          >
                            <CheckCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <QuoteDetailModal
        quote={viewQuote}
        onClose={() => setViewQuote(null)}
        onMarkContacted={handleMarkContacted}
      />
    </div>
  );
}
