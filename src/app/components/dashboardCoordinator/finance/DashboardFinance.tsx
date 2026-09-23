import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Payment, PaymentStatus } from "@/types/interfaces";
import { DashboardFinanceProps } from "@/types/interfaces";


const statusLabels: Record<PaymentStatus, string> = {
  Pending: "Pendente",
  Paid: "Pago",
  Cancelled: "Cancelado",
};

const normalizeStatus = (status: unknown): PaymentStatus => {
  if (typeof status !== "string") return "Cancelled";
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
  setShowAll,
  statusFilter = "Todos",
  studentFilter = "",
}: DashboardFinanceProps) {
  let filtered = payments.filter((p) => {
    if (statusFilter === "Todos") return true;
    const effectiveStatus = getEffectiveStatus(p);
    const translatedStatus = statusLabels[effectiveStatus];
    return translatedStatus === statusFilter;
  });

  if (studentFilter) {
    filtered = filtered.filter((p) =>
      p.student?.userName?.toLowerCase().includes(studentFilter.toLowerCase())
    );
  }

  
  const visiblePayments = showAll ? filtered : filtered.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Cards de resumo financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Mensagem se não houver resultados */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Nenhum pagamento encontrado para este filtro.
        </p>
      ) : (
        <>
          {/* Grid de cards de pagamentos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePayments.map((p) => {
              const effectiveStatus = getEffectiveStatus(p);
              return (
                <Card key={p.id} className="border shadow-sm rounded-lg flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {p.student?.userName || "-"} — {p.course?.title || "-"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Aluno:</strong> {p.student?.userName}</p>
                    <p><strong>Professor:</strong> {p.course?.teacher || "Não informado"}</p>
                    <p><strong>Valor:</strong> R$ {p.amount}</p>
                    <p className={`font-semibold ${effectiveStatus === "Pending" ? "text-yellow-600"
                        : effectiveStatus === "Paid" ? "text-green-600"
                          : "text-red-600"
                      }`}>
                      Status: {statusLabels[effectiveStatus]}
                    </p>
                    <p><strong>Vencimento:</strong> {p.dueDate ?? "Não informado"}</p>
                    <p><strong>Pagamento:</strong> {p.paidAt ?? "Pendente"}</p>

                    {effectiveStatus === "Pending" && (
                      <Button
                        className="mt-2 bg-[#163E72] hover:bg-[#255690] text-white"
                        onClick={() => onMarkAsPaid(p.id, p.student?.userName || "")}
                      >
                        Dar baixa na mensalidade
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Botão Mostrar mais abaixo dos cards */}
          {filtered.length > 6 && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                className="border-gray-300"
                onClick={() => setShowAll(!showAll)} // precisa vir como prop da FinancePage
              >
                {showAll ? "Mostrar menos" : "Mostrar mais"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
