import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Quote } from "../../../lib/analytics";

const QUOTES_FILE = path.join(process.cwd(), "app", "data", "quotes.json");

/* ── CORS headers (dev only — restrict in production) ── */
const devHeaders = {
  "Access-Control-Allow-Origin": "*", // TODO: restrict to your domain in prod
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function readQuotes(): Promise<Quote[]> {
  try {
    const raw = await fs.readFile(QUOTES_FILE, "utf-8");
    return JSON.parse(raw) as Quote[];
  } catch {
    return [];
  }
}

async function writeQuotes(quotes: Quote[]): Promise<void> {
  await fs.writeFile(QUOTES_FILE, JSON.stringify(quotes, null, 2), "utf-8");
}

/* ── OPTIONS (preflight) ── */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: devHeaders });
}

/* ── GET: read all quotes ── */
export async function GET() {
  const quotes = await readQuotes();
  return NextResponse.json(quotes, { headers: devHeaders });
}

/* ── POST: add new quote ── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const quote: Quote = {
      id: Date.now().toString(),
      product: body.product ?? "Unknown",
      customer: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? "",
        quantity: Number(body.quantity) || 1,
        notes: body.notes ?? "",
      },
      file: body.file ?? null,
      timestamp: new Date().toISOString(),
      contacted: false,
    };

    const quotes = await readQuotes();
    quotes.push(quote);
    await writeQuotes(quotes);

    return NextResponse.json(
      { success: true, id: quote.id },
      { status: 201, headers: devHeaders }
    );
  } catch (err) {
    console.error("Quote save error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save quote" },
      { status: 500, headers: devHeaders }
    );
  }
}

/* ── DELETE: remove quote by id (?id=...) ── */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id param" },
        { status: 400, headers: devHeaders }
      );
    }

    const quotes = await readQuotes();
    const filtered = quotes.filter((q) => q.id !== id);

    if (filtered.length === quotes.length) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404, headers: devHeaders }
      );
    }

    await writeQuotes(filtered);
    return NextResponse.json({ success: true }, { headers: devHeaders });
  } catch (err) {
    console.error("Quote delete error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete quote" },
      { status: 500, headers: devHeaders }
    );
  }
}

/* ── PATCH: update quote fields (e.g. mark as contacted) ── */
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id param" },
        { status: 400, headers: devHeaders }
      );
    }

    const body = await req.json();
    const quotes = await readQuotes();
    const idx = quotes.findIndex((q) => q.id === id);

    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404, headers: devHeaders }
      );
    }

    quotes[idx] = { ...quotes[idx], ...body };
    await writeQuotes(quotes);
    return NextResponse.json({ success: true, quote: quotes[idx] }, { headers: devHeaders });
  } catch (err) {
    console.error("Quote patch error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update quote" },
      { status: 500, headers: devHeaders }
    );
  }
}
