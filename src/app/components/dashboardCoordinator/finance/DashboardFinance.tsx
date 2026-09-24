"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Payment, PaymentStatus, DashboardFinanceProps } from "@/types/interfaces";
import {
  compareMonthKeysDesc,
  moneyBr,
  monthLabel,
  paymentMonthKey,
} from "@/lib/financeMonths";

const statusLabels: Record<PaymentStatus, string> = {
  Pending: "Pendente",
  Paid: "Pago",
  Cancelled: "Cancelado",
};

const getEffectiveStatus = (payment: Payment): PaymentStatus => {
  if (payment.paidAt || payment.status === "Paid") return "Paid";
  if (payment.status === "Cancelled") return "Cancelled";
  if (payment.dueDate) {
    const due = new Date(payment.dueDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 90) return "Cancelled";
  }
  return "Pending";
};

const dueTime = (payment: Payment) => {
  if (!payment.dueDate) return Number.MAX_SAFE_INTEGER;
  const time = new Date(payment.dueDate).getTime();
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
};

function PaymentCard({
  payment,
  onMarkAsPaid,
}: {
  payment: Payment;
  onMarkAsPaid: (id: number, userName: string) => void;
}) {
  const effectiveStatus = getEffectiveStatus(payment);
  return (
    <Card className="flex flex-col justify-between rounded-lg border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#163E72]">
          {payment.student?.userName || "-"} — {payment.course?.title || "-"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>Professor:</strong> {payment.course?.teacher || "Não informado"}
        </p>
        <p>
          <strong>Valor:</strong> {moneyBr(Number(payment.amount) || 0)}
        </p>
        <p
          className={`font-semibold ${
            effectiveStatus === "Pending"
              ? "text-yellow-600"
              : effectiveStatus === "Paid"
                ? "text-green-600"
                : "text-red-600"
          }`}
        >
          Status: {statusLabels[effectiveStatus]}
        </p>
        <p>
          <strong>Vencimento:</strong>{" "}
          {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString("pt-BR") : "Não informado"}
        </p>
        <p>
          <strong>Data do pagamento:</strong>{" "}
          {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString("pt-BR") : "Pendente"}
        </p>
        {payment.settledAt && (
          <p>
            <strong>Data da baixa:</strong> {new Date(payment.settledAt).toLocaleDateString("pt-BR")}
          </p>
        )}
        {effectiveStatus === "Pending" && (
          <Button
            className="mt-2 bg-[#163E72] text-white hover:bg-[#255690]"
            onClick={() => onMarkAsPaid(payment.id, payment.student?.userName || "")}
          >
            Dar baixa na mensalidade
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardFinance({
  totalReceived,
  totalPending,
  defaultRate,
  payments,
  onMarkAsPaid,
  statusFilter = "Todos",
  studentFilter = "",
}: DashboardFinanceProps) {
  const [monthFilter, setMonthFilter] = useState("todos");

  const filtered = useMemo(() => {
    return payments.filter((payment) => {
      if (studentFilter) {
        const name = payment.student?.userName?.toLowerCase() ?? "";
        if (!name.includes(studentFilter.toLowerCase())) return false;
      }
      if (statusFilter !== "Todos") {
        if (statusLabels[getEffectiveStatus(payment)] !== statusFilter) return false;
      }
      if (monthFilter !== "todos" && paymentMonthKey(payment) !== monthFilter) return false;
      return true;
    });
  }, [payments, studentFilter, statusFilter, monthFilter]);

  const months = useMemo(() => {
    const keys = Array.from(new Set(payments.map(paymentMonthKey)));
    return keys.sort(compareMonthKeysDesc);
  }, [payments]);

  const openPayments = useMemo(
    () =>
      filtered
        .filter((payment) => getEffectiveStatus(payment) === "Pending")
        .sort((a, b) => dueTime(a) - dueTime(b)),
    [filtered]
  );

  const historyByMonth = useMemo(() => {
    const settled = filtered.filter((payment) => getEffectiveStatus(payment) !== "Pending");
    const groups = new Map<string, Payment[]>();
    for (const payment of settled) {
      const key = paymentMonthKey(payment);
      const list = groups.get(key) ?? [];
      list.push(payment);
      groups.set(key, list);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => compareMonthKeysDesc(a, b))
      .map(([key, items]) => ({
        key,
        label: monthLabel(key),
        items: items.sort((a, b) => dueTime(b) - dueTime(a)),
        received: items
          .filter((item) => getEffectiveStatus(item) === "Paid")
          .reduce((sum, item) => sum + Number(item.amount || 0), 0),
      }));
  }, [filtered]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-green-400 bg-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Total recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-green-800">{moneyBr(Number(totalReceived) || 0)}</p>
          </CardContent>
        </Card>
        <Card className="border-red-400 bg-red-100">
          <CardHeader>
            <CardTitle className="text-red-700">Total pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-red-800">{moneyBr(Number(totalPending) || 0)}</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-400 bg-yellow-100">
          <CardHeader>
            <CardTitle className="text-yellow-700">Taxa de inadimplência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-yellow-800">{defaultRate.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-[#163E72]">Mensalidades</h2>
        <label className="text-sm text-gray-600">
          Mês
          <select
            className="ml-2 rounded-lg border bg-white px-3 py-2 text-[#163E72]"
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
          >
            <option value="todos">Todos os meses</option>
            {months.map((key) => (
              <option key={key} value={key}>
                {monthLabel(key)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#163E72]">Em aberto</h3>
        {openPayments.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma mensalidade pendente neste filtro.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {openPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} onMarkAsPaid={onMarkAsPaid} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-[#163E72]">Histórico por mês</h3>
        {historyByMonth.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum pagamento no histórico deste filtro.</p>
        ) : (
          historyByMonth.map((group) => (
            <div key={group.key} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-2">
                <h4 className="text-base font-bold text-[#255690]">{group.label}</h4>
                <p className="text-sm text-gray-600">
                  {group.items.length} lançamento(s) · Recebido {moneyBr(group.received)}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} onMarkAsPaid={onMarkAsPaid} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
