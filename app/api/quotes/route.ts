import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const QUOTES_FILE = path.join(process.cwd(), "app", "data", "quotes.json");

export async function GET() {
  try {
    const raw = await fs.readFile(QUOTES_FILE, "utf-8");
    const quotes = JSON.parse(raw);
    return NextResponse.json(quotes);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const quote = {
      id: Date.now().toString(),
      product: body.product ?? "Unknown",
      customer: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? "",
        quantity: body.quantity,
        notes: body.notes ?? "",
      },
      file: body.file ?? null,
      timestamp: new Date().toISOString(),
    };

    // Read existing quotes
    let quotes: typeof quote[] = [];
    try {
      const raw = await fs.readFile(QUOTES_FILE, "utf-8");
      quotes = JSON.parse(raw);
    } catch {
      quotes = [];
    }

    quotes.push(quote);
    await fs.writeFile(QUOTES_FILE, JSON.stringify(quotes, null, 2), "utf-8");

    return NextResponse.json({ success: true, id: quote.id }, { status: 201 });
  } catch (err) {
    console.error("Quote save error:", err);
    return NextResponse.json({ success: false, error: "Failed to save quote" }, { status: 500 });
  }
}
