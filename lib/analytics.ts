/* ─── Types ──────────────────────────────────────────── */
export interface QuoteCustomer {
  name: string;
  email: string;
  phone: string;
  quantity: number;
  notes: string;
}

export interface Quote {
  id: string;
  product: string;
  customer: QuoteCustomer;
  file: string | null;
  timestamp: string;
  contacted?: boolean;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface TimePoint {
  date: string;       // "Aug 01"
  count: number;      // quotes on that day
  cumulative: number; // running total
}

/* ─── Category extraction ────────────────────────────── */

/** Naively derive a category label from product name */
export function getCategoryFromProduct(product: string): string {
  const p = product.toLowerCase();
  if (p.includes("sticker") || p.includes("label")) return "Stickers";
  if (p.includes("business card")) return "Business Cards";
  if (p.includes("t-shirt") || p.includes("hoodie") || p.includes("apparel")) return "Apparel";
  if (p.includes("mug") || p.includes("bottle")) return "Drinkware";
  if (p.includes("banner") || p.includes("vinyl") || p.includes("sign")) return "Banners";
  if (p.includes("sock")) return "Socks";
  if (p.includes("mask")) return "Face Masks";
  if (p.includes("tote") || p.includes("bag")) return "Tote Bags";
  if (p.includes("mouse")) return "Mouse Pads";
  if (p.includes("mug")) return "Mugs";
  return "Other";
}

/** Returns sorted array of {category, count} descending by count */
export function getQuotesByCategory(quotes: Quote[]): CategoryCount[] {
  const map: Record<string, number> = {};
  for (const q of quotes) {
    const cat = getCategoryFromProduct(q.product);
    map[cat] = (map[cat] ?? 0) + 1;
  }
  return Object.entries(map)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/** Returns time-series data: one entry per unique date, with daily + cumulative counts */
export function getQuotesOverTime(quotes: Quote[]): TimePoint[] {
  const sorted = [...quotes].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const dayMap: Record<string, number> = {};
  for (const q of sorted) {
    const d = new Date(q.timestamp);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    dayMap[label] = (dayMap[label] ?? 0) + 1;
  }

  let cumulative = 0;
  return Object.entries(dayMap).map(([date, count]) => {
    cumulative += count;
    return { date, count, cumulative };
  });
}

/** Mean quantity across all quotes */
export function calculateAvgQuantity(quotes: Quote[]): number {
  if (quotes.length === 0) return 0;
  const total = quotes.reduce((sum, q) => sum + (q.customer.quantity ?? 0), 0);
  return Math.round(total / quotes.length);
}

/** Count quotes submitted in the last N days */
export function getQuotesThisPeriod(quotes: Quote[], days: number = 7): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return quotes.filter((q) => new Date(q.timestamp).getTime() >= cutoff).length;
}

/** Most-quoted category */
export function getTopCategory(quotes: Quote[]): string {
  const cats = getQuotesByCategory(quotes);
  return cats[0]?.category ?? "—";
}

/** Filter quotes by date range, category, and search term */
export function filterQuotes(
  quotes: Quote[],
  opts: {
    from?: Date | null;
    to?: Date | null;
    category?: string;
    search?: string;
  }
): Quote[] {
  return quotes.filter((q) => {
    const ts = new Date(q.timestamp);
    if (opts.from && ts < opts.from) return false;
    if (opts.to) {
      const toEnd = new Date(opts.to);
      toEnd.setHours(23, 59, 59, 999);
      if (ts > toEnd) return false;
    }
    if (opts.category && opts.category !== "all") {
      if (getCategoryFromProduct(q.product) !== opts.category) return false;
    }
    if (opts.search) {
      const s = opts.search.toLowerCase();
      const match =
        q.customer.name.toLowerCase().includes(s) ||
        q.customer.email.toLowerCase().includes(s) ||
        q.product.toLowerCase().includes(s);
      if (!match) return false;
    }
    return true;
  });
}

/** Convert quotes array to CSV string */
export function exportToCSV(quotes: Quote[]): string {
  const headers = [
    "ID",
    "Timestamp",
    "Product",
    "Customer Name",
    "Email",
    "Phone",
    "Quantity",
    "Notes",
    "File",
    "Contacted",
  ];

  const escape = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return "";
    const str = String(val).replace(/"/g, '""');
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str}"`
      : str;
  };

  const rows = quotes.map((q) =>
    [
      escape(q.id),
      escape(new Date(q.timestamp).toISOString()),
      escape(q.product),
      escape(q.customer.name),
      escape(q.customer.email),
      escape(q.customer.phone),
      escape(q.customer.quantity),
      escape(q.customer.notes),
      escape(q.file),
      escape(q.contacted ?? false),
    ].join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

/** Trigger a CSV file download in the browser */
export function downloadCSV(csv: string, filename: string = "quotes-export.csv") {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
