"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  compareMonthKeysDesc,
  moneyBr,
  monthLabel,
  paymentMonthKey,
} from "../../../lib/financeMonths";

interface PaymentItem {
  id: number;
  amount: number;
  status: string;
  dueDate?: string;
  paidAt?: string;
  settledAt?: string;
  courseTitle: string;
  installmentNumber?: number;
  bucket: string;
}

interface FinancePayload {
  overdue: PaymentItem[];
  open: PaymentItem[];
  upcoming: PaymentItem[];
  paid: PaymentItem[];
}

interface PixPayload {
  paymentId: number;
  amount: number;
  courseTitle: string;
  qrCodeBase64: string;
  copiaCola: string;
  provider: string;
  message: string;
  expiresAt?: string;
}

const money = moneyBr;

export default function StudentFinancePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const payFirst = searchParams.get("payFirst") === "1";
  const autoPayStarted = useRef(false);
  const [data, setData] = useState<FinancePayload | null>(null);
  const [pix, setPix] = useState<PixPayload | null>(null);
  const [pixOpen, setPixOpen] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [checkingPix, setCheckingPix] = useState(false);

  const loadFinance = () =>
    api
      .get<FinancePayload>("/me/finance")
      .then((res) => setData(res.data))
      .catch(() => toast.error("Não foi possível carregar o financeiro."));

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    loadFinance();
  }, [user, loading, router]);

  const handlePay = async (id: number) => {
    try {
      setPayingId(id);
      const res = await api.post<PixPayload>(`/me/finance/${id}/pix`);
      setPix(res.data);
      setPixOpen(true);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "response" in error
          ? (error as { response?: { data?: string | { message?: string } } }).response?.data
          : undefined;
      const text = typeof message === "string" ? message : message?.message;
      toast.error(text || "Não foi possível gerar o PIX.");
    } finally {
      setPayingId(null);
    }
  };

  useEffect(() => {
    if (!payFirst || !data || autoPayStarted.current) return;
    const first = [...data.overdue, ...data.open, ...data.upcoming].find(
      (item) => item.installmentNumber === 1 && item.status !== "Paid"
    );
    if (!first) return;
    autoPayStarted.current = true;
    void handlePay(first.id);
    router.replace("/dashboard-student/finance");
  }, [payFirst, data, router]);

  const copyPix = async () => {
    if (!pix?.copiaCola) return;
    try {
      await navigator.clipboard.writeText(pix.copiaCola);
      toast.success("PIX copia e cola copiado.");
    } catch {
      toast.error("Não foi possível copiar. Selecione o código manualmente.");
    }
  };

  const checkPixPaid = async (showWaiting: boolean) => {
    if (!pix?.paymentId) return;
    try {
      setCheckingPix(true);
      const res = await api.post<{ paid: boolean; message?: string }>(
        `/me/finance/${pix.paymentId}/pix/status`
      );
      if (res.data.paid) {
        toast.success(res.data.message || "Pagamento confirmado.");
        setPixOpen(false);
        setPix(null);
        await loadFinance();
        return;
      }
      if (showWaiting) {
        toast.info(res.data.message || "Ainda não identificamos o pagamento.");
      }
    } catch {
      if (showWaiting) {
        toast.error("Não foi possível consultar o PIX.");
      }
    } finally {
      setCheckingPix(false);
    }
  };

  useEffect(() => {
    if (!pixOpen || !pix?.paymentId) return;
    const timer = window.setInterval(() => {
      void checkPixPaid(false);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [pixOpen, pix?.paymentId]);

  if (loading || !user) return <p>Carregando...</p>;

  const renderItems = (items: PaymentItem[], empty: string, canPay: boolean) => (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-gray-600 text-sm">{empty}</p>}
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
          <p className="font-semibold text-[#163E72]">{item.courseTitle}</p>
          {item.installmentNumber ? (
            <p className="text-sm text-gray-500">Parcela {item.installmentNumber}</p>
          ) : null}
          <p className="text-sm text-gray-600">{money(item.amount)}</p>
          {item.dueDate && (
            <p className="text-sm text-gray-500">
              Vencimento: {new Date(item.dueDate).toLocaleDateString("pt-BR")}
            </p>
          )}
          {item.paidAt && (
            <p className="text-sm text-gray-500">
              Pago em: {new Date(item.paidAt).toLocaleDateString("pt-BR")}
            </p>
          )}
          {item.settledAt && (
            <p className="text-sm text-gray-500">
              Baixa em: {new Date(item.settledAt).toLocaleDateString("pt-BR")}
            </p>
          )}
          {canPay && (
            <Button
              className="mt-3 bg-[#163E72] hover:bg-[#255690] text-white"
              disabled={payingId === item.id}
              onClick={() => handlePay(item.id)}
            >
              {payingId === item.id ? "Gerando PIX..." : "Pagar mensalidade"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#163E72] mb-2">Meu financeiro</h1>
      <p className="text-gray-600 mb-6">
        A 1ª parcela (R$ 69,90) é paga agora e libera o curso. As outras 11 vencem a cada 30 dias.
        Depois de pagar, clique em Já paguei ou aguarde a confirmação automática.
      </p>
      {data && (
        <>
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#163E72] mb-3">Em aberto / atrasados</h2>
            {renderItems(
              [...data.overdue].sort(
                (a, b) =>
                  new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime()
              ),
              "Nenhum boleto atrasado.",
              true
            )}
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#163E72] mb-3">Sem vencimento definido</h2>
            {renderItems(data.open, "Nenhum boleto pendente sem data.", true)}
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#163E72] mb-3">A vencer</h2>
            {renderItems(
              [...data.upcoming].sort(
                (a, b) =>
                  new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime()
              ),
              "Nenhum boleto a vencer.",
              true
            )}
          </section>
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#163E72] mb-3">Histórico de pagos</h2>
            {data.paid.length === 0 ? (
              <p className="text-gray-600 text-sm">Nenhum pagamento confirmado ainda.</p>
            ) : (
              Object.entries(
                data.paid.reduce<Record<string, PaymentItem[]>>((groups, item) => {
                  const key = paymentMonthKey(item);
                  groups[key] = [...(groups[key] ?? []), item];
                  return groups;
                }, {})
              )
                .sort(([a], [b]) => compareMonthKeysDesc(a, b))
                .map(([key, items]) => (
                  <div key={key} className="mb-5">
                    <h3 className="text-sm font-semibold text-[#255690] mb-2">{monthLabel(key)}</h3>
                    {renderItems(items, "", false)}
                  </div>
                ))
            )}
          </section>
        </>
      )}

      <Dialog open={pixOpen} onOpenChange={setPixOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pagar mensalidade via PIX</DialogTitle>
          </DialogHeader>
          {pix && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                {pix.courseTitle} — {money(pix.amount)}
              </p>
              {pix.qrCodeBase64 && (
                <img
                  src={`data:image/png;base64,${pix.qrCodeBase64}`}
                  alt="QR Code PIX"
                  className="mx-auto h-52 w-52"
                />
              )}
              <p className="text-xs break-all bg-gray-50 border rounded p-2">{pix.copiaCola}</p>
              <Button
                onClick={copyPix}
                className="w-full bg-[#163E72] hover:bg-[#255690] text-white"
              >
                Copiar PIX
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={checkingPix}
                onClick={() => void checkPixPaid(true)}
                className="w-full"
              >
                {checkingPix ? "Consultando..." : "Já paguei"}
              </Button>
              <p className="text-xs text-muted-foreground">{pix.message}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
