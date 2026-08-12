import { promises as fs } from "fs";
import path from "path";
import { siteConfig } from "../../config/site";

interface Quote {
  id: string;
  product: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    quantity: number;
    notes: string;
  };
  file: string | null;
  timestamp: string;
}

async function getQuotes(): Promise<Quote[]> {
  try {
    const filePath = path.join(process.cwd(), "app", "data", "quotes.json");
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Quote[];
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const quotes = await getQuotes();

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10" style={{ backgroundColor: siteConfig.colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
              style={{ backgroundColor: "#FFF3CD", color: "#856404" }}
            >
              ⚠️ DEV ONLY — Not secured
            </div>
            <h1
              className="text-2xl font-bold"
              style={{
                color: siteConfig.colors.dark,
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              Quote Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {quotes.length} quote{quotes.length !== 1 ? "s" : ""} received
            </p>
          </div>
          <a
            href="/"
            className="text-sm font-semibold hover:underline"
            style={{ color: siteConfig.colors.primary }}
          >
            ← Back to site
          </a>
        </div>

        {quotes.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-3 p-16 rounded-2xl text-center"
            style={{ backgroundColor: "#fff", border: "2px dashed #E5E7EB" }}
          >
            <span className="text-4xl">📋</span>
            <p className="text-sm text-gray-500">No quote requests yet.</p>
            <p className="text-xs text-gray-400">
              Submit a quote from a product page to see it here.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: siteConfig.colors.dark }}>
                    {["ID", "Timestamp", "Product", "Customer", "Email", "Phone", "Qty", "Notes", "File"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-white/80 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q, i) => (
                    <tr
                      key={q.id}
                      style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F9FAFB" }}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">
                        #{q.id.slice(-6)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(q.timestamp).toLocaleString("en-EG", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 font-semibold max-w-[180px] truncate" style={{ color: siteConfig.colors.dark }}>
                        {q.product}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: siteConfig.colors.dark }}>
                        {q.customer.name}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${q.customer.email}`}
                          className="hover:underline"
                          style={{ color: siteConfig.colors.primary }}
                        >
                          {q.customer.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {q.customer.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold" style={{ color: siteConfig.colors.dark }}>
                        {q.customer.quantity}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[200px]">
                        <span className="block truncate" title={q.customer.notes || ""}>
                          {q.customer.notes || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        {q.file ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
                          >
                            📎 {q.file.split(" ")[0]}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
