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
