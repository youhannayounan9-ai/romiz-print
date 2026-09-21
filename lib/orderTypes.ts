/* ─── Shared order types & shipping rules (client + server) ─────────── */

export const CAIRO_GIZA_SHIPPING = 65;
export const OTHER_GOVERNORATE_SHIPPING = 100;
export const VODAFONE_FEE_RATE = 0.02;
export const CAIRO_GIZA = ["Cairo", "Giza"];

export const ORDER_NOTIFICATION_EMAIL = "Romiz.Print@gmail.com";

export interface OrderCustomer {
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
}

export interface OrderItem {
  name: string;
  slug: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  options?: Record<string, string>;
  image?: string | null;
}

export interface OrderPayload {
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  paymentFee: number;
  total: number;
  paymentMethod: string;
  receiptUrl?: string | null;
}

/** Validates an incoming order payload from the checkout form. */
export function validateOrderPayload(body: unknown): { ok: true; value: OrderPayload } | { ok: false; error: string } {
  const b = body as Partial<OrderPayload> | null;

  if (!b || typeof b !== "object") return { ok: false, error: "Invalid request body." };
  if (!Array.isArray(b.items) || b.items.length === 0)
    return { ok: false, error: "Order must contain at least one item." };
  if (!b.customer || typeof b.customer !== "object")
    return { ok: false, error: "Customer details are required." };

  const { fullName, phone, governorate, address } = b.customer as Partial<OrderCustomer>;
  if (!fullName || !String(fullName).trim()) return { ok: false, error: "Customer name is required." };
  if (!phone || !String(phone).trim()) return { ok: false, error: "Customer phone is required." };
  if (!governorate || !String(governorate).trim()) return { ok: false, error: "Governorate is required." };
  if (!address || !String(address).trim()) return { ok: false, error: "Delivery address is required." };
  if (!b.paymentMethod) return { ok: false, error: "Payment method is required." };

  const items = (b.items as OrderItem[]).map((item) => ({
    name: String(item?.name ?? "Unknown product"),
    slug: String(item?.slug ?? ""),
    quantity: Math.max(1, Math.floor(Number(item?.quantity) || 1)),
    unitPrice: Math.max(0, Number(item?.unitPrice) || 0),
    lineTotal: Math.max(0, Number(item?.lineTotal) || 0),
    options: item?.options && typeof item.options === "object" ? item.options : {},
    image: item?.image ? String(item.image) : null,
  }));

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return {
    ok: true,
    value: {
      customer: {
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        governorate: String(governorate).trim(),
        address: String(address).trim(),
      },
      items,
      subtotal: round2(Number(b.subtotal) || items.reduce((s, i) => s + i.lineTotal, 0)),
      shippingFee: round2(Number(b.shippingFee) || 0),
      paymentFee: round2(Number(b.paymentFee) || 0),
      total: round2(Number(b.total) || 0),
      paymentMethod: String(b.paymentMethod),
      receiptUrl: b.receiptUrl ? String(b.receiptUrl) : null,
    },
  };
}
