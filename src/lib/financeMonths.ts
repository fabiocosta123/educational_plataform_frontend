export function paymentMonthKey(item: { dueDate?: string; paidAt?: string }) {
  const raw = item.dueDate || item.paidAt;
  if (!raw) return "sem-data";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "sem-data";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string) {
  if (key === "sem-data") return "Sem data de vencimento";
  const [year, month] = key.split("-");
  const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function compareMonthKeysDesc(a: string, b: string) {
  if (a === "sem-data") return 1;
  if (b === "sem-data") return -1;
  return b.localeCompare(a);
}

export function moneyBr(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function normalizePaymentStatus(status: unknown): "Pending" | "Paid" | "Cancelled" {
  if (status === "Cancelled" || status === 2 || status === "2") return "Cancelled";
  if (status === "Paid" || status === 1 || status === "1") return "Paid";
  return "Pending";
}

export function getEffectivePaymentStatus(payment: {
  status?: unknown;
  paidAt?: string | null;
  dueDate?: string | null;
}): "Pending" | "Paid" | "Cancelled" {
  const status = normalizePaymentStatus(payment.status);
  if (status === "Cancelled") return "Cancelled";
  if (status === "Paid") return "Paid";
  if (payment.dueDate) {
    const due = new Date(payment.dueDate);
    const diffDays = Math.floor((Date.now() - due.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 90) return "Cancelled";
  }
  return "Pending";
}
