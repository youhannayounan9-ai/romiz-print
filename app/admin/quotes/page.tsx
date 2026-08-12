import { Suspense } from "react";
import { supabase } from "../../../lib/supabaseClient";
import QuotesTableClient from "./QuotesTableClient";
import type { Quote } from "../../../lib/analytics";

async function getQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch quotes from Supabase:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    product: row.product || "Unknown",
    customer: {
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      quantity: row.quantity || 1,
      notes: row.notes || "",
    },
    file: row.file_name || null,
    timestamp: row.created_at,
    contacted: row.contacted || false,
  }));
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
