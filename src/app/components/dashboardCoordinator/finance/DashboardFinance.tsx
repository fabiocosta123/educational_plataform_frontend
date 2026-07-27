import { Grid, Card, CardContent, Typography, Box, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Payment } from "../../../../types/interfaces";

interface FinanceProps {
  totalReceived: number;
  totalPending: number;
  defaultRate?: number;
  payments: Payment[];
  onMarkAsPaid?: (paymentId: number, userName: string) => void;
}

export default function DashboardFinance({
  totalReceived,
  totalPending,
  defaultRate,
  payments,
  onMarkAsPaid,
}: FinanceProps) {
  
  const pendingByMonth: Record<string, Payment[]> = {};
  payments
    .filter((p) => p.status?.toUpperCase() === "PENDING" && p.dueDate)
    .forEach((p) => {
      const key = new Date(p.dueDate!).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      if (!pendingByMonth[key]) {
        pendingByMonth[key] = [];
      }
      pendingByMonth[key].push(p);
    });

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Total Recebidos */}
        <Grid item xs={12} md={4} {...{} as any}>
          <Card sx={{ height: "100%", p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Total Recebidos
              </Typography>
              <Typography variant="h4" color="success.main">
                R$ {totalReceived.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Pendente */}
        <Grid item xs={12} md={4} {...{} as any}>
          <Card sx={{ height: "100%", p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⏳ Total Pendente
              </Typography>
              <Typography variant="h4" color="warning.main">
                R$ {totalPending.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Inadimplência */}
        <Grid item xs={12} md={4} {...{} as any}>
          <Card sx={{ height: "100%", p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📉 Inadimplência
              </Typography>
              <Typography variant="h4" color="error.main">
                {(defaultRate ?? 0).toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Meses com pendências */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          📅 Meses com mensalidades em aberto
        </Typography>
        {Object.keys(pendingByMonth).length === 0 ? (
          <Typography color="text.secondary">
            Nenhum mês com pendências.
          </Typography>
        ) : (
          Object.entries(pendingByMonth).map(([month, pendings]) => (
            <Card key={month} sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {month}
                </Typography>
                {pendings.map((p) => (
                  <Box key={p.id} sx={{ mt: 1, pl: 1 }}>
                    <Typography>👤 {p.student?.userName || "Aluno não informado"}</Typography>
                    <Typography>📚 Curso: {p.course?.title || "Não informado"}</Typography>
                    <Typography>👨‍🏫 Professor: {p.course?.teacher || "Não informado"}</Typography>
                    <Typography>Valor: R$ {p.amount} — Status: {p.status}</Typography>

                    {p.status?.toUpperCase() === "PENDING" && onMarkAsPaid && (
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 1 }}
                        startIcon={<CheckCircleIcon />}
                        onClick={() => onMarkAsPaid(p.id, p.student?.userName || "")}
                      >
                        Dar baixa na mensalidade
                      </Button>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
}
