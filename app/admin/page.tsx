"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  FileText,
  TrendingUp,
  Hash,
  Award,
  Clock,
  Trash2,
  Eye,
} from "lucide-react";
import { siteConfig } from "../config/site";
import {
  type Quote,
  getQuotesByCategory,
  getQuotesOverTime,
  calculateAvgQuantity,
  getQuotesThisPeriod,
  getTopCategory,
} from "../../lib/analytics";

/* ─── Stat card ─────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-gray-100">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={20} className={`[color:${color}]`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
        <p
          className="text-2xl font-bold leading-none"
          style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Recent quotes table ────────────────────────────── */
function RecentQuotesTable({
  quotes,
  onDelete,
  onView,
}: {
  quotes: Quote[];
  onDelete: (id: string) => void;
  onView: (q: Quote) => void;
}) {
  const recent = [...quotes]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
        <FileText size={32} />
        <p className="text-sm">No quotes yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Date", "Product", "Customer", "Email", "Qty", "File", "Actions"].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recent.map((q, i) => (
            <tr
              key={q.id}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                {new Date(q.timestamp).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </td>
              <td
                className="px-4 py-3 font-medium max-w-[160px] truncate"
                style={{ color: siteConfig.colors.dark }}
              >
                {q.product}
              </td>
              <td className="px-4 py-3 whitespace-nowrap" style={{ color: siteConfig.colors.dark }}>
                {q.customer.name}
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">
                <a href={`mailto:${q.customer.email}`} className="hover:underline" style={{ color: siteConfig.colors.primary }}>
                  {q.customer.email}
                </a>
              </td>
              <td className="px-4 py-3 text-center font-semibold" style={{ color: siteConfig.colors.dark }}>
                {q.customer.quantity}
              </td>
              <td className="px-4 py-3 text-xs text-gray-400">
                {q.file ? (
                  <span className="text-green-600 font-medium">📎 Yes</span>
                ) : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onView(q)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    style={{ color: siteConfig.colors.primary }}
                    title="View details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(q.id)}
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
  );
}

/* ─── Detail Modal ───────────────────────────────────── */
function QuoteDetailModal({
  quote,
  onClose,
}: {
  quote: Quote | null;
  onClose: () => void;
}) {
  if (!quote) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(30,37,48,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold" style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}>
            Quote #{quote.id.slice(-6)}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["Product", quote.product],
            ["Customer", quote.customer.name],
            ["Email", quote.customer.email],
            ["Phone", quote.customer.phone || "—"],
            ["Quantity", String(quote.customer.quantity)],
            ["Date", new Date(quote.timestamp).toLocaleString("en-GB")],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="font-medium text-sm" style={{ color: siteConfig.colors.dark }}>{value}</p>
            </div>
          ))}
        </div>

        {quote.customer.notes && (
          <div>
            <p className="text-xs text-gray-400 mb-1">Notes</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl leading-relaxed">
              {quote.customer.notes}
            </p>
          </div>
        )}

        {quote.file && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50">
            <span className="text-base">📎</span>
            <span className="text-sm font-medium text-gray-700">{quote.file}</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-1"
          style={{ backgroundColor: siteConfig.colors.primary }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────── */
export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewQuote, setViewQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetch("/api/quotes")
      .then((r) => r.json())
      .then((data) => { setQuotes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this quote? This cannot be undone.")) return;
    await fetch(`/api/quotes?id=${id}`, { method: "DELETE" });
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  }

  const catData = getQuotesByCategory(quotes);
  const timeData = getQuotesOverTime(quotes);
  const avgQty = calculateAvgQuantity(quotes);
  const thisWeek = getQuotesThisPeriod(quotes, 7);
  const topCat = getTopCategory(quotes);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#0B4DA2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Quotes" value={quotes.length} sub="All time" color={siteConfig.colors.primary} />
        <StatCard icon={Clock} label="This Week" value={thisWeek} sub="Last 7 days" color={siteConfig.colors.accent} />
        <StatCard icon={Hash} label="Avg. Quantity" value={avgQty} sub="Items per quote" color="#10B981" />
        <StatCard icon={Award} label="Top Category" value={topCat} sub="Most quoted" color="#8B5CF6" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-sm mb-5" style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}>
            Quotes by Category
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
                cursor={{ fill: "#F3F4F6" }}
              />
              <Bar
                dataKey="count"
                name="Quotes"
                fill={siteConfig.colors.primary}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-sm mb-5" style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}>
            Quotes Over Time
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={timeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
              />
              <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="count"
                name="Daily"
                stroke="#9CA3AF"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="Cumulative"
                stroke={siteConfig.colors.accent}
                strokeWidth={2.5}
                dot={{ fill: siteConfig.colors.accent, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent quotes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-sm" style={{ color: siteConfig.colors.dark, fontFamily: "var(--font-space-grotesk)" }}>
            Recent Quotes
            <span className="ml-2 text-xs font-normal text-gray-400">(last 10)</span>
          </h3>
          <a
            href="/admin/quotes"
            className="text-xs font-semibold hover:underline"
            style={{ color: siteConfig.colors.primary }}
          >
            View all →
          </a>
        </div>
        <RecentQuotesTable
          quotes={quotes}
          onDelete={handleDelete}
          onView={(q) => setViewQuote(q)}
        />
      </div>

      {/* Detail modal */}
      <QuoteDetailModal quote={viewQuote} onClose={() => setViewQuote(null)} />
    </div>
  );
}
