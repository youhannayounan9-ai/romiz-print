import { Suspense } from "react";
import { promises as fs } from "fs";
import path from "path";
import QuotesTableClient from "./QuotesTableClient";
import type { Quote } from "../../../lib/analytics";

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
  const initialQuotes = await getQuotes();

  return (
    <Suspense
      fallback={
        <div className="p-4 sm:p-6 lg:p-8 space-y-5">
          <div className="w-full h-16 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="w-full h-24 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="w-full h-96 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      }
    >
      <QuotesTableClient initialQuotes={initialQuotes} />
    </Suspense>
  );
}
