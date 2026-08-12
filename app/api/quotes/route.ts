import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import type { Quote } from "../../../lib/analytics";

/* ── CORS headers (dev only — restrict in production) ── */
const devHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: devHeaders });
}

export async function GET() {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: devHeaders });
  }

  const quotes: Quote[] = (data || []).map((row: any) => ({
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

  return NextResponse.json(quotes, { headers: devHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("quotes")
      .insert([
        {
          product: body.product ?? "Unknown",
          name: body.name,
          email: body.email,
          phone: body.phone ?? "",
          quantity: Number(body.quantity) || 1,
          notes: body.notes ?? "",
          file_name: body.file ?? null,
          contacted: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, id: data.id },
      { status: 201, headers: devHeaders }
    );
  } catch (err: any) {
    console.error("Quote save error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save quote" },
      { status: 500, headers: devHeaders }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id param" }, { status: 400, headers: devHeaders });
    }

    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true }, { headers: devHeaders });
  } catch (err: any) {
    console.error("Quote delete error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete quote" },
      { status: 500, headers: devHeaders }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id param" }, { status: 400, headers: devHeaders });
    }

    const body = await req.json();
    
    const updates: any = {};
    if (body.contacted !== undefined) updates.contacted = body.contacted;
    
    const { data, error } = await supabase
      .from("quotes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const quote: Quote = {
      id: data.id,
      product: data.product || "Unknown",
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        quantity: data.quantity || 1,
        notes: data.notes || "",
      },
      file: data.file_name || null,
      timestamp: data.created_at,
      contacted: data.contacted,
    };

    return NextResponse.json({ success: true, quote }, { headers: devHeaders });
  } catch (err: any) {
    console.error("Quote patch error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update quote" },
      { status: 500, headers: devHeaders }
    );
  }
}
