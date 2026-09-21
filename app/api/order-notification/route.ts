import { NextRequest, NextResponse } from "next/server";
import {
  CAIRO_GIZA,
  CAIRO_GIZA_SHIPPING,
  OTHER_GOVERNORATE_SHIPPING,
  ORDER_NOTIFICATION_EMAIL,
  type OrderPayload,
} from "../../../lib/orderTypes";

export const runtime = "nodejs";

/* ─── Config from environment (with dev-safe fallbacks) ─────────────── */
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER || "orders@romizprint.com";

interface NotificationPayload extends OrderPayload {
  orderId: string;
  createdAt?: string;
}

/* ─── HTML email builder ────────────────────────────────────────────── */
function buildOrderEmailHtml(order: NotificationPayload): string {
  const rows = order.items
    .map(
      (item, i) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;vertical-align:top;">
          <strong>${i + 1}. ${escapeHtml(item.name)}</strong>
          ${
            item.options && Object.keys(item.options).length
              ? `<br/><small style="color:#666;">${escapeHtml(
                  Object.entries(item.options)
                    .filter(([, v]) => v)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" • ")
                )}</small>`
              : ""
          }
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;">${item.unitPrice.toLocaleString()} EGP</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${item.lineTotal.toLocaleString()} EGP</td>
      </tr>`
    )
    .join("");

  const expectedShipping = CAIRO_GIZA.includes(order.customer.governorate)
    ? CAIRO_GIZA_SHIPPING
    : OTHER_GOVERNORATE_SHIPPING;

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;color:#1E2530;">
    <div style="background:#0B4DA2;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;">
      <h2 style="margin:0;">🛒 New Order Received — ROMIZ PRINT</h2>
      <p style="margin:6px 0 0;opacity:.85;font-size:13px;">Order ID: <strong>${escapeHtml(order.orderId)}</strong></p>
    </div>

    <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
      <p style="margin:0 0 16px;font-size:13px;color:#666;">
        Received: ${order.createdAt ? new Date(order.createdAt).toLocaleString("en-GB") : new Date().toLocaleString("en-GB")}
      </p>

      <h3 style="margin:0 0 8px;">👤 Customer</h3>
      <table style="width:100%;font-size:14px;margin-bottom:20px;">
        <tr><td style="padding:4px 8px;color:#666;width:130px;">Name</td><td style="padding:4px 8px;"><strong>${escapeHtml(order.customer.fullName)}</strong></td></tr>
        <tr><td style="padding:4px 8px;color:#666;">Phone</td><td style="padding:4px 8px;"><a href="tel:${escapeHtml(order.customer.phone)}">${escapeHtml(order.customer.phone)}</a></td></tr>
        <tr><td style="padding:4px 8px;color:#666;">Governorate</td><td style="padding:4px 8px;">${escapeHtml(order.customer.governorate)}</td></tr>
        <tr><td style="padding:4px 8px;color:#666;vertical-align:top;">Address</td><td style="padding:4px 8px;">${escapeHtml(order.customer.address)}</td></tr>
      </table>

      <h3 style="margin:0 0 8px;">📦 Items</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <thead>
          <tr style="background:#F5F7FA;">
            <th style="padding:8px;text-align:left;">Product</th>
            <th style="padding:8px;text-align:center;">Qty</th>
            <th style="padding:8px;text-align:right;">Unit</th>
            <th style="padding:8px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <h3 style="margin:0 0 8px;">💰 Totals</h3>
      <table style="width:100%;font-size:14px;margin-bottom:20px;">
        <tr><td style="padding:4px 8px;color:#666;">Subtotal</td><td style="padding:4px 8px;text-align:right;">${order.subtotal.toLocaleString()} EGP</td></tr>
        <tr><td style="padding:4px 8px;color:#666;">Shipping (${escapeHtml(order.customer.governorate)})</td><td style="padding:4px 8px;text-align:right;">${order.shippingFee.toLocaleString()} EGP${
          order.shippingFee !== expectedShipping ? ` <span style="color:#E65100;font-size:12px;">(expected ${expectedShipping})</span>` : ""
        }</td></tr>
        ${
          order.paymentFee > 0
            ? `<tr><td style="padding:4px 8px;color:#666;">Payment fee</td><td style="padding:4px 8px;text-align:right;">${order.paymentFee.toLocaleString()} EGP</td></tr>`
            : ""
        }
        <tr style="background:#F0F5FF;">
          <td style="padding:8px;font-weight:bold;">Total</td>
          <td style="padding:8px;text-align:right;font-weight:bold;font-size:16px;color:#0B4DA2;">${order.total.toLocaleString()} EGP</td>
        </tr>
      </table>

      <h3 style="margin:0 0 8px;">💳 Payment</h3>
      <p style="margin:0 0 12px;font-size:14px;">
        Method: <strong>${escapeHtml(order.paymentMethod)}</strong><br/>
        ${
          order.receiptUrl
            ? `Transfer screenshot: <a href="${escapeHtml(order.receiptUrl)}">View uploaded receipt</a><br/><small style="color:#666;">(link valid while the file exists in storage)</small>`
            : "No transfer screenshot uploaded for this payment method."
        }
      </p>

      <p style="margin:24px 0 0;font-size:12px;color:#999;border-top:1px solid #eee;padding-top:12px;">
        Automated notification from romizprint.com checkout.
      </p>
    </div>
  </div>`;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ─── Route ─────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as NotificationPayload;

  if (!body || !body.orderId || !body.customer || !Array.isArray(body.items)) {
    return NextResponse.json({ success: false, error: "Invalid notification payload." }, { status: 400 });
  }

  /* Build the plain-text fallback */
  const textLines = [
    `New order ${body.orderId} received at ${body.createdAt ?? new Date().toISOString()}`,
    `Customer: ${body.customer.fullName} — ${body.customer.phone}`,
    `Address: ${body.customer.address}, ${body.customer.governorate}`,
    `Payment: ${body.paymentMethod}${body.receiptUrl ? ` — receipt: ${body.receiptUrl}` : ""}`,
    "",
    ...body.items.map(
      (i) => `- ${i.name} x${i.quantity} @ ${i.unitPrice} EGP = ${i.lineTotal} EGP`
    ),
    "",
    `Subtotal: ${body.subtotal} EGP | Shipping: ${body.shippingFee} EGP${
      body.paymentFee ? ` | Payment fee: ${body.paymentFee} EGP` : ""
    } | Total: ${body.total} EGP`,
  ];

  const html = buildOrderEmailHtml(body);

  /* ── Preferred path: SMTP via nodemailer ── */
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"ROMIZ PRINT Orders" <${MAIL_FROM}>`,
        to: ORDER_NOTIFICATION_EMAIL,
        subject: `🛒 New Order ${body.orderId} — ${body.customer.fullName} (${body.total.toLocaleString()} EGP)`,
        text: textLines.join("\n"),
        html,
      });

      return NextResponse.json({ success: true, channel: "smtp" });
    } catch (err) {
      console.error("SMTP order notification failed:", err);
      /* fall through to Resend attempt, then log-only */
    }
  }

  /* ── Fallback path: Resend HTTP API ── */
  const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
  if (RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: MAIL_FROM,
          to: [ORDER_NOTIFICATION_EMAIL],
          subject: `🛒 New Order ${body.orderId} — ${body.customer.fullName} (${body.total.toLocaleString()} EGP)`,
          text: textLines.join("\n"),
          html,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend error ${res.status}: ${errText}`);
      }

      return NextResponse.json({ success: true, channel: "resend" });
    } catch (err) {
      console.error("Resend order notification failed:", err);
    }
  }

  /* ── Last resort: log the full order so it isn't lost ── */
  console.warn(
    "No mail transport configured (SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY). " +
      "Order notification logged instead:\n" +
      textLines.join("\n")
  );
  return NextResponse.json({
    success: true,
    channel: "logged",
    warning: "No email transport configured; order details were logged server-side.",
  });
}
