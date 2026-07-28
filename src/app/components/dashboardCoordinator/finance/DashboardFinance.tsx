import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Payment, PaymentStatus } from "@/types/interfaces";

interface DashboardFinanceProps {
  totalReceived: number;
  totalPending: number;
  defaultRate: number;
  payments: Payment[];
  onMarkAsPaid: (id: number, userName: string) => void;
  showAll?: boolean;
  statusFilter?: string;
  studentFilter?: string;
}

// 🔹 Mapeamento de status string para texto amigável
const statusLabels: Record<PaymentStatus, string> = {
  Pending: "Pendente",
  Paid: "Pago",
  Cancelled: "Cancelado",
};

// 🔹 Função para normalizar status (corrige minúsculas)
const normalizeStatus = (status: unknown): PaymentStatus => {
  if (typeof status !== "string") return "Cancelled"; // fallback seguro
  const normalized =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return normalized as PaymentStatus;
};

const getEffectiveStatus = (payment: Payment): PaymentStatus => {
  if (payment.paidAt) return "Paid";

  if (payment.dueDate) {
    const due = new Date(payment.dueDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 90) return "Cancelled";
  }

  return "Pending";
};




export default function DashboardFinance({
  totalReceived,
  totalPending,
  defaultRate,
  payments,
  onMarkAsPaid,
  showAll = false,
  statusFilter = "Todos",
  studentFilter = "",
}: DashboardFinanceProps) {
  // 🔹 Filtro por status
  let filtered = payments.filter((p) => {
  if (statusFilter === "Todos") return true;
  const effectiveStatus = getEffectiveStatus(p);
  const translatedStatus = statusLabels[effectiveStatus];
  return translatedStatus === statusFilter;
});


  // 🔹 Filtro por aluno
  if (studentFilter) {
    filtered = filtered.filter((p) =>
      p.student?.userName?.toLowerCase().includes(studentFilter.toLowerCase())
    );
  }

  // 🔹 Mostrar apenas os dois últimos
  const visiblePayments = showAll ? filtered : filtered.slice(-2);

  return (
    <div className="space-y-6">
      {/* Resumo financeiro (mantido como está) */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-green-100 border-green-400">
          <CardHeader>
            <CardTitle className="text-green-700">Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 font-bold">R$ {totalReceived}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-100 border-red-400">
          <CardHeader>
            <CardTitle className="text-red-700">Total Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800 font-bold">R$ {totalPending}</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-100 border-yellow-400">
          <CardHeader>
            <CardTitle className="text-yellow-700">Taxa de Inadimplência</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800 font-bold">{defaultRate.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Mensagem amigável se não houver resultados */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Nenhum pagamento encontrado para este filtro.
        </p>
      ) : (
        visiblePayments.map((p) => {
          const effectiveStatus = getEffectiveStatus(p);

          return (
            <Card key={p.id} className="border shadow-sm hover:shadow-md transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {p.student?.userName || "-"} — {p.course?.title || "-"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><span className="font-medium">Aluno:</span> {p.student?.userName}</p>
                <p><span className="font-medium">Professor:</span> {p.course?.teacher || "Não informado"}</p>
                <p><span className="font-medium">Valor:</span> R$ {p.amount}</p>
                <p
                  className={`font-semibold ${effectiveStatus === "Pending"
                      ? "text-yellow-600"
                      : effectiveStatus === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                >
                  Status: {statusLabels[effectiveStatus]}
                </p>
                <p><span className="font-medium">Vencimento:</span> {p.dueDate ?? "Não informado"}</p>
                <p><span className="font-medium">Pagamento:</span> {p.paidAt ?? "Pendente"}</p>

                {effectiveStatus === "Pending" && (
                  <Button
                    className="mt-2"
                    onClick={() => onMarkAsPaid(p.id, p.student?.userName || "")}
                  >
                    Dar baixa na mensalidade
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })

      )}
    </div>
  );
}
