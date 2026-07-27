"use client";
import React, { useEffect, useState } from "react";
import DashboardFinance from "../../components/dashboardCoordinator/finance/DashboardFinance";
import api from "../../services/api";
import {
    CircularProgress,
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { FinanceSummary } from "../../../types/interfaces";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Payment = {
    id: number;
    amount: number;
    status: string;
    paidAt?: string;
    course?: { title: string };
    user?: { userName: string };
    qrCodeBase64?: string;
};

export default function FinancePage() {

    const [searchName, setSearchName] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [openForm, setOpenForm] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        courseTitle: "",
        amount: 0,
        dueDate: new Date().toISOString().split("T")[0],
    });

    const [errors, setErrors] = useState({
        userName: "",
        courseTitle: "",
        amount: "",
        dueDate: "",
    });

    const [students, setStudents] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);

    const [payments, setPayments] = useState<Payment[]>([]);
    const [summary, setSummary] = useState<FinanceSummary | null>(null);


    useEffect(() => {
        api.get("/finance/pix/history")
            .then((res) => {
                setSummary(res.data);
                setPayments([]);
            })
            .catch((err) => console.error("Error loading financial history:", err));
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentsResponse = await api.get("/users/students");
                setStudents(studentsResponse.data);

                const coursesResponse = await api.get("/courses");

                setCourses(coursesResponse.data);

            } catch (error) {
                console.error("Erro ao carregar alunos ou cursos:", error);
            }
        };

        fetchData();
    }, []);


    const fetchStudentFinance = async () => {
        if (!searchName) return;
        try {
            const res = await api.get(`/finance/pix/student?userName=${searchName}`);

            // se esse endpoint retorna apenas resumo
            setSummary(res.data);
            setPayments([]); // ou res.data.payments se existir

            const studentRes = await api.get(`/users/byName?userName=${searchName}`);
            setSelectedStudent(studentRes.data);
        } catch (err) {
            console.error("Error loading student finance:", err);
            toast.error("Erro ao buscar dados do aluno");
        }
    }

    const handleDownloadPdf = async (paymentId: number) => {
        const response = await api.get(`/finance/pix/download/pdf/${paymentId}`, {
            responseType: "blob",
        });

        const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `pix_payment_${paymentId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleGeneratePix = async () => {
        const newErrors = {
            userName: formData.userName ? "" : "Informe o nome do aluno",
            courseTitle: formData.courseTitle ? "" : "Informe o nome do curso",
            amount: formData.amount > 0 ? "" : "Informe um valor maior que zero",
            dueDate: formData.dueDate ? "" : "Informe a data de vencimento",
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((msg) => msg !== "")) {
            toast.error("Preencha todos os campos corretamente.");
            return;
        }

        const payload = {
            userName: formData.userName.trim(),
            courseTitle: formData.courseTitle.trim(),
            amount: formData.amount,
            dueDate: formData.dueDate.split("T")[0], // garante formato yyyy-MM-dd
        };

        if (isNaN(payload.amount) || payload.amount <= 0) {
            toast.error("Informe um valor válido maior que zero.");
            return;
        }

        toast.loading("Gerando cobrança PIX...");
        try {
            await api.post("/finance/pix", payload);
            toast.dismiss();
            toast.success(`Cobrança PIX gerada para ${formData.userName}!`);
            setOpenForm(false);
            fetchStudentFinance();
        } catch (err: any) {
            toast.dismiss();
            console.log("Payload enviado:", payload);
            console.error("Erro detalhado:", err.response?.data);

            const backendMessage = err.response?.data?.message;
            if (backendMessage?.includes("curso")) {
                toast.error("O curso informado não existe. Verifique o nome e tente novamente.");
            } else if (backendMessage?.includes("aluno")) {
                toast.error("O aluno informado não existe. Verifique o nome e tente novamente.");
            } else {
                toast.error(backendMessage || "Erro ao gerar cobrança PIX");
            }
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* Botão à esquerda e barra de pesquisa à direita */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
                    Gerar Cobrança
                </Button>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                        label="Nome Aluno"
                        variant="outlined"
                        size="small"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        sx={{ width: "300px", mr: 1 }}
                    />
                    <Button variant="contained" onClick={fetchStudentFinance}>
                        Buscar
                    </Button>
                </Box>
            </Box>

            {/* Formulário de cobrança PIX */}
            <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
                <DialogTitle>Gerar Cobrança PIX</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <TextField
                        label="Data de Vencimento"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        error={!!errors.dueDate}
                        helperText={errors.dueDate}
                    />


                    <Autocomplete
                        options={students}
                        getOptionLabel={(option) => option?.userName ?? ""}
                        value={students.find((s) => s.userName === formData.userName) || null}
                        onChange={(event, newValue) => {
                            setFormData({ ...formData, userName: newValue?.userName || "" });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Nome do Aluno" margin="dense" />
                        )}
                    />




                    <Autocomplete
                        options={courses}
                        getOptionLabel={(option) => option?.title ?? ""}
                        value={courses.find((c) => c.title === formData.courseTitle) || null}
                        onChange={(event, newValue) => {
                            setFormData({ ...formData, courseTitle: newValue?.title || "" });
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Nome do Curso" margin="dense" />
                        )}
                    />

                    <NumericFormat
                        customInput={TextField}
                        label="Valor da Cobrança (R$)"
                        fullWidth
                        margin="dense"
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        value={formData.amount}
                        onValueChange={(values) => {
                            setFormData({ ...formData, amount: values.floatValue || 0 });
                        }}
                        error={!!errors.amount}
                        helperText={errors.amount}
                    />


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleGeneratePix} variant="contained" color="primary">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            {Array.isArray(payments) && payments.map((payment) => (
                <Card key={payment.id}>
                    <CardContent>
                        <Typography>Curso: {payment.course?.title}</Typography>
                        <Typography>Valor: R$ {payment.amount}</Typography>
                        <Typography>Status: {payment.status}</Typography>
                        <Typography>Data: {payment.paidAt ?? "Pendente"}</Typography>
                    </CardContent>
                </Card>
            ))}


            {summary && (
                <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                        <Card sx={{ flex: 1, mr: 2 }}>
                            <CardContent>
                                <Typography variant="h6">👩‍🎓 Alunos Ativos</Typography>
                                <Typography variant="h4">{summary.activeStudents ?? 0}</Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{ flex: 1 }}>
                            <CardContent>
                                <Typography variant="h6">📊 Receita Mês</Typography>
                                <Typography variant="h4">R$ {summary.monthlyRevenue ?? 0}</Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <DashboardFinance
                        totalReceived={summary.totalReceived}
                        totalPending={summary.totalPending}
                        defaultRate={summary.defaultRate}
                    />
                </>
            )}


        </div>
    );
}


