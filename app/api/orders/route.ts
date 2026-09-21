import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "../../../lib/supabaseClient";
import { validateOrderPayload } from "../../../lib/orderTypes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = validateOrderPayload(body);
    if (!validation.ok) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const order = validation.value;

    /*
     * Generate the id server-side so the insert doesn't need `.select()`.
     * (INSERT ... RETURNING requires the row to also pass a SELECT RLS
     * policy, which the anon role intentionally doesn't have.)
     */
    const orderId = randomUUID();
    const createdAt = new Date().toISOString();

    const { error } = await supabase.from("orders").insert([
      {
        id: orderId,
        created_at: createdAt,
        customer_name: order.customer.fullName,
        customer_phone: order.customer.phone,
        governorate: order.customer.governorate,
        address: order.customer.address,
        items: order.items,
        subtotal: order.subtotal,
        shipping_fee: order.shippingFee,
        payment_fee: order.paymentFee,
        total: order.total,
        payment_method: order.paymentMethod,
        receipt_url: order.receiptUrl,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Order insert error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save your order. Please try again." },
        { status: 500 }
      );
    }

    /* Fire-and-forget email notification — never blocks or fails the checkout */
    try {
      await fetch(new URL("/api/order-notification", req.url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          createdAt,
          ...order,
        }),
      });
    } catch (notifyErr) {
      console.error("Order notification dispatch failed (order saved):", notifyErr);
    }

    return NextResponse.json(
      { success: true, orderId, createdAt },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order route error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
