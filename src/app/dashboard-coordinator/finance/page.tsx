"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import DashboardFinance from "@/app/components/dashboardCoordinator/finance/DashboardFinance";
import { StudentDto, Course, FinanceSummary, Payment, PaymentStatus } from "@/types/interfaces";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function FinancePage() {
    const [searchName, setSearchName] = useState<string>("");
    const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);
    const [openForm, setOpenForm] = useState(false);
    const [formData, setFormData] = useState({
        dueDate: "",
        userName: "",
        courseTitle: "",
        amount: 0,
    });

    const [students, setStudents] = useState<StudentDto[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [summary, setSummary] = useState<FinanceSummary | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);

    const [showAll, setShowAll] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("Todos");
    const [noResultsMessage, setNoResultsMessage] = useState<string>("");
    const [noStudentMessage, setNoStudentMessage] = useState<string>("");
    const [settleOpen, setSettleOpen] = useState(false);
    const [settleTarget, setSettleTarget] = useState<{ id: number; name: string } | null>(null);
    const [paidDate, setPaidDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [myCreditStatus, setMyCreditStatus] = useState<{
        configured?: boolean;
        tokenOk?: boolean;
        baseUrl?: string;
        cnpjHint?: string;
        cnpjDigits?: number;
        cnpjSource?: string;
        tokenSource?: string;
        message?: string;
    } | null>(null);

    // 🔹 Mapeamento de status string para texto amigável
    const statusLabels: Record<PaymentStatus, string> = {
        Pending: "Pendente",
        Paid: "Pago",
        Cancelled: "Cancelado",
    };

    // 🔹 Carregar dados iniciais
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resHistory = await api.get("/finance/pix/history");
                setSummary(resHistory.data.summary);
                setPayments(resHistory.data.payments);

                const resStudents = await api.get("/users/students");
                setStudents(resStudents.data);

                const resCourses = await api.get("/courses");
                setCourses(resCourses.data);

                const resMyCredit = await api.get("/finance/mycredit/status");
                setMyCreditStatus(resMyCredit.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };

        fetchData();
    }, []);

    const fetchStudentFinance = async (name: string) => {
        try {
            const res = await api.get(`/users/byName?userName=${name}`);
            if (!res.data) {
                setSelectedStudent(null);
                setNoStudentMessage("Nenhum aluno encontrado com esse nome.");
                return;
            }
            setSelectedStudent(res.data);
            setNoStudentMessage("");
        } catch (error: any) {
            setSelectedStudent(null);
            setNoStudentMessage("Nenhum aluno encontrado com esse nome.");
            console.error("Erro ao buscar aluno:", error);
        }
    };

    const filteredPayments = payments.filter((p) => {
        if (statusFilter === "Todos") return true;
        return statusLabels[p.status] === statusFilter;
    });

    useEffect(() => {
        if (filteredPayments.length === 0) {
            setNoResultsMessage("Nenhum registro encontrado para o filtro selecionado.");
        } else {
            setNoResultsMessage("");
        }
    }, [filteredPayments, statusFilter]);

    const openSettle = (id: number, userName: string) => {
        setSettleTarget({ id, name: userName });
        setPaidDate(new Date().toISOString().slice(0, 10));
        setSettleOpen(true);
    };

    const handleMarkAsPaid = async () => {
        if (!settleTarget) return;
        if (!paidDate) {
            toast.error("Informe a data em que o pagamento foi feito.");
            return;
        }
        try {
            await api.post(`/finance/pix/confirm/${settleTarget.id}`, { paidAt: paidDate });
            const resHistory = await api.get("/finance/pix/history");
            setSummary(resHistory.data.summary);
            setPayments(resHistory.data.payments);
            setSettleOpen(false);
            toast.success(`Mensalidade de ${settleTarget.name || "aluno"} dada como paga.`);
        } catch (error: unknown) {
            const message =
                typeof error === "object" && error && "response" in error
                    ? (error as { response?: { data?: string | { message?: string } } }).response?.data
                    : undefined;
            const text = typeof message === "string" ? message : message?.message;
            toast.error(text || "Não foi possível dar baixa na mensalidade.");
            console.error("Erro ao marcar pagamento:", error);
        }
    };

    const handleUpdateAmount = async (id: number, amount: number) => {
        if (!amount || amount <= 0) {
            toast.error("Informe um valor maior que zero.");
            return;
        }
        try {
            await api.put(`/finance/pix/${id}/amount`, { amount });
            const resHistory = await api.get("/finance/pix/history");
            setSummary(resHistory.data.summary);
            setPayments(resHistory.data.payments);
            toast.success("Valor da mensalidade atualizado.");
        } catch (error: unknown) {
            const message =
                typeof error === "object" && error && "response" in error
                    ? (error as { response?: { data?: string | { message?: string } } }).response?.data
                    : undefined;
            const text = typeof message === "string" ? message : message?.message;
            toast.error(text || "Não foi possível atualizar o valor.");
        }
    };

    const handleGeneratePix = async () => {
        try {
            await api.post("/finance/pix", formData);
            setOpenForm(false);
            const resHistory = await api.get("/finance/pix/history");
            setSummary(resHistory.data.summary);
            setPayments(resHistory.data.payments);
            toast.success("Cobrança gerada.");
        } catch (error: unknown) {
            const payload =
                typeof error === "object" && error && "response" in error
                    ? (error as { response?: { data?: string | { message?: string; details?: string } } }).response?.data
                    : undefined;
            const text =
                typeof payload === "string"
                    ? payload
                    : payload?.message || payload?.details;
            toast.error(text || "Não foi possível gerar a cobrança.");
        }
    };

    // 🔹 Mostrar apenas 6 se não expandido
    const visiblePayments = showAll ? filteredPayments : filteredPayments.slice(0, 6);

    return (
        <div className="p-6 space-y-6">
            {myCreditStatus && (
                <div
                    className={`rounded-lg border p-4 text-sm ${
                        myCreditStatus.tokenOk
                            ? "border-green-200 bg-green-50 text-green-800"
                            : "border-red-200 bg-red-50 text-red-800"
                    }`}
                >
                    <p className="font-semibold">MyCredit: {myCreditStatus.tokenOk ? "token OK" : "falha no token"}</p>
                    <p>{myCreditStatus.message}</p>
                    <p className="mt-1 text-xs opacity-80">
                        {myCreditStatus.baseUrl} · CNPJ {myCreditStatus.cnpjHint} ({myCreditStatus.cnpjDigits} dígitos via {myCreditStatus.cnpjSource}) · chave via {myCreditStatus.tokenSource}
                    </p>
                </div>
            )}
            {/* Header com barra de pesquisa e filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <Button onClick={() => setOpenForm(true)} className="bg-[#163E72] text-white">
                    Gerar Cobrança
                </Button>

                <div className="flex gap-2 items-center">
                    <Input
                        placeholder="Buscar aluno..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-72 border-gray-300"
                    />
                    <Button
                        variant="secondary"
                        onClick={() => searchName && fetchStudentFinance(searchName)}
                    >
                        Buscar
                    </Button>
                </div>

                <div>
                    <Label>Status</Label>
                    <Select
                        onValueChange={(value: string | null) => setStatusFilter(value ?? "Todos")}
                        value={statusFilter}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Pago">Pago</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {noResultsMessage && (
                <p className="text-center text-gray-500 mt-4">{noResultsMessage}</p>
            )}
            {noStudentMessage && (
                <p className="text-center text-gray-500 mt-4">{noStudentMessage}</p>
            )}

            {/* Grid de cards lado a lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedStudent && (
                    <Card className="shadow-sm rounded-lg flex flex-col justify-between">
                        <div>
                            <CardHeader>
                                <CardTitle className="text-[#163E72]">
                                    Aluno: {selectedStudent.userName}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Email:</strong> {selectedStudent.userEmail || "Não informado"}</p>
                                <p><strong>Telefone:</strong> {selectedStudent.phoneNumber || "Não informado"}</p>

                                {visiblePayments
                                    .filter((p) => p.student?.userName === selectedStudent.userName)
                                    .map((payment) => (
                                        <div key={payment.id} className="mt-2">
                                            <p>Curso: {payment.course?.title}</p>
                                            <p>Professor: {payment.course?.teacher || "Não informado"}</p>
                                            <p>Valor: R$ {payment.amount ?? 0}</p>
                                            {payment.lateFeeApplied ? (
                                                <p className="text-amber-700">Multa de atraso (R$ 10,00) incluída.</p>
                                            ) : null}
                                            <p
                                                className={`font-semibold ${payment.status === "Pending"
                                                        ? "text-yellow-600"
                                                        : payment.status === "Paid"
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                            >
                                                Status: {statusLabels[payment.status] ?? "Indefinido"}
                                            </p>
                                            <p>
                                                Vencimento:{" "}
                                                {payment.dueDate
                                                    ? new Date(payment.dueDate).toLocaleDateString("pt-BR")
                                                    : "Não informado"}
                                            </p>
                                            <p>
                                                Data do pagamento:{" "}
                                                {payment.paidAt
                                                    ? new Date(payment.paidAt).toLocaleDateString("pt-BR")
                                                    : "Pendente"}
                                            </p>
                                            {payment.settledAt && (
                                                <p>
                                                    Data da baixa:{" "}
                                                    {new Date(payment.settledAt).toLocaleDateString("pt-BR")}
                                                </p>
                                            )}

                                            {payment.status === "Pending" && (
                                                <Button
                                                    className="mt-2"
                                                    onClick={() =>
                                                        openSettle(payment.id, selectedStudent.userName)
                                                    }
                                                >
                                                    Dar baixa na mensalidade
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                            </CardContent>
                        </div>

                        {/* Footer fixo com ações */}
                        <CardFooter className="flex gap-3 justify-start border-t pt-3">
                            <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                                Detalhes
                            </Button>
                            <Button variant="ghost" className="text-green-600 hover:text-green-800">
                                Editar
                            </Button>
                            <Button variant="ghost" className="text-red-600 hover:text-red-800">
                                Excluir
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>

            

            {/* Dashboard Finance */}
            <DashboardFinance
                totalReceived={summary?.totalReceived ?? 0}
                totalPending={summary?.totalPending ?? 0}
                defaultRate={summary?.defaultRate ?? 0}
                payments={payments}
                onMarkAsPaid={openSettle}
                onUpdateAmount={handleUpdateAmount}
                showAll={showAll}
                setShowAll={setShowAll}
                statusFilter={statusFilter}
                studentFilter={searchName}
            />

            {/* Dialog de cobrança */}
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gerar Cobrança PIX</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Data de Vencimento</Label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, dueDate: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label>Aluno</Label>
                            <Select
                                onValueChange={(value: string | null) =>
                                    setFormData({ ...formData, userName: value ?? "" })
                                }
                                value={formData.userName || ""}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um aluno" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem key={s.id} value={s.userName}>
                                            {s.userName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Curso</Label>
                            <Select
                                onValueChange={(value: string | null) =>
                                    setFormData({ ...formData, courseTitle: value ?? "" })
                                }
                                value={formData.courseTitle || ""}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem key={c.id} value={c.title}>
                                            {c.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Valor da Cobrança (R$)</Label>
                            <Input
                                type="number"
                                value={formData.amount || 0}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        amount:
                                            e.target.value === "" ? 0 : parseFloat(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <Button
                            onClick={handleGeneratePix}
                            className="bg-[#163E72] hover:bg-[#255690] text-white"
                        >
                            Confirmar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={settleOpen} onOpenChange={setSettleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dar baixa na mensalidade</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Informe o dia em que o aluno pagou. A data da baixa será registrada automaticamente agora.
                    </p>
                    <div className="space-y-2">
                        <Label htmlFor="paidDate">Data do pagamento</Label>
                        <Input
                            id="paidDate"
                            type="date"
                            max={new Date().toISOString().slice(0, 10)}
                            value={paidDate}
                            onChange={(e) => setPaidDate(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleMarkAsPaid}
                        className="bg-[#163E72] hover:bg-[#255690] text-white"
                    >
                        Confirmar baixa
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
