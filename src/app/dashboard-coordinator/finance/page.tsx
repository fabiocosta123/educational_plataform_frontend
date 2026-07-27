"use client";
import { useEffect, useState } from "react";
import DashboardFinance from "../../components/dashboardCoordinator/finance/DashboardFinance";
import api from "../../services/api";
import {
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

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Grid from "@mui/material/Grid";
import { NumericFormat } from "react-number-format";
import { CourseEnrollmentDto, FinanceSummary } from "../../../types/interfaces";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Payment } from "../../../types/interfaces"
import { Snackbar, Alert } from "@mui/material";


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
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        api.get("/finance/pix/history")
            .then((res) => {
                setPayments(res.data.payments ?? []);
                console.log("Pagamentos recebidos:", res.data.payments);
                setSummary(res.data.summary ?? res.data);
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

    const fetchStudentFinance = async (userName: string) => {
        try {
            const res = await api.get(`/finance/pix/student?userName=${encodeURIComponent(userName)}`);

            // Agora o backend retorna { summary, payments }
            setPayments(res.data.payments ?? []);
            setSummary(res.data.summary ?? null);

            const studentRes = await api.get(`/users/byName?userName=${encodeURIComponent(userName)}`);
            setSelectedStudent(studentRes.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                const studentRes = await api.get(`/users/byName?userName=${encodeURIComponent(userName)}`);
                setSelectedStudent(studentRes.data);
                setPayments([]);
                setSummary(null);
            } else {
                console.error("Error loading student finance:", err);
                toast.error("Erro ao buscar dados do aluno");
            }
        }
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
            dueDate: formData.dueDate.split("T")[0],
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
            fetchStudentFinance(formData.userName);
        } catch (err: any) {
            toast.dismiss();
            console.error("Erro detalhado:", err.response?.data);
            const backendMessage = err.response?.data?.message;
            toast.error(backendMessage || "Erro ao gerar cobrança PIX");
        }
    };

    const handleMarkAsPaid = async (paymentId: number, userName: string) => {
        try {
            await api.post(`/finance/pix/pay/${paymentId}`);
            toast.success("Mensalidade baixada com sucesso!");
            fetchStudentFinance(userName);
            setSnackbarOpen(true);
        } catch (err) {
            toast.error("Erro ao dar baixa na mensalidade");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* Barra superior */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
                    Gerar Cobrança
                </Button>

                <Autocomplete
                    options={students}
                    getOptionLabel={(option) => option?.userName ?? ""}
                    value={students.find((s) => s.userName === searchName) || null}
                    onChange={(event, newValue) => {
                        setSearchName(newValue?.userName || "");
                        if (newValue?.userName) {
                            fetchStudentFinance(newValue.userName);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Buscar Aluno" margin="dense" />
                    )}
                    sx={{ width: 300 }}
                />
            </Box>
            {selectedStudent && (
                <Box sx={{ mb: 3 }}>
                    {/* Card com dados básicos do aluno */}
                    <Card sx={{ p: 2, mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Aluno: {selectedStudent.userName}</Typography>
                            <Typography>Email: {selectedStudent.userEmail || "Não informado"}</Typography>
                            <Typography>Telefone: {selectedStudent.phoneNumber || "Não informado"}</Typography>

                            {/* Mostrar cursos e professores matriculados */}
                            {selectedStudent.courseEnrolled && selectedStudent.courseEnrolled.length > 0 ? (
                                selectedStudent.courseEnrolled.map((enrollment: CourseEnrollmentDto) => (
                                    <Box key={enrollment.id} sx={{ mt: 1 }}>
                                        <Typography>Curso: {enrollment.courseTitle}</Typography>
                                        <Typography>Professor: {enrollment.teacherName || "Não informado"}</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography>Curso: Não informado</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Renderizar cobranças */}
                    {payments.length === 0 ? (
                        <Card sx={{ p: 2 }}>
                            <CardContent>
                                <Typography variant="body1" color="text.secondary">
                                    Nenhuma cobrança encontrada para este aluno.
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        payments.map((payment) => {
                            const vencimento = payment.dueDate
                                ? new Date(payment.dueDate).toLocaleDateString("pt-BR", {
                                    month: "long",
                                    year: "numeric",
                                })
                                : "Não informado";

                            return (
                                <Card key={payment.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                            Curso: {payment.course?.title || "Não informado"}
                                        </Typography>
                                        <Typography>
                                            Professor: {payment.course?.teacher || "Não informado"}
                                        </Typography>
                                        <Typography>Valor: R$ {payment.amount}</Typography>
                                        <Typography>Status: {payment.status}</Typography>
                                        <Typography>Mês em aberto: {vencimento}</Typography>
                                        <Typography>
                                            Data de pagamento: {payment.paidAt ?? "Pendente"}
                                        </Typography>

                                        {payment.status?.toUpperCase() === "PENDING" && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                sx={{ mt: 1 }}
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() =>
                                                    handleMarkAsPaid(payment.id, selectedStudent.userName)
                                                }
                                            >
                                                Dar baixa na mensalidade
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </Box>
            )}


            {/* Snackbar de sucesso */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Mensalidade baixada com sucesso!
                </Alert>
            </Snackbar>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Mensalidade baixada com sucesso!
                </Alert>
            </Snackbar>
            <>
                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} {...({} as any)}>
                            <Card sx={{ height: "100%", p: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">👩‍🎓 Alunos Ativos</Typography>
                                    <Typography variant="h4">{summary?.activeStudents ?? 0}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6} {...({} as any)}>
                            <Card sx={{ height: "100%", p: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">📊 Receita Mês</Typography>
                                    <Typography variant="h4">R$ {summary?.monthlyRevenue ?? 0}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                <DashboardFinance
                    totalReceived={summary?.totalReceived ?? 0}
                    totalPending={summary?.totalPending ?? 0}
                    defaultRate={summary?.defaultRate ?? 0}
                    payments={payments}
                />
            </>
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
        </div>
    );
}
