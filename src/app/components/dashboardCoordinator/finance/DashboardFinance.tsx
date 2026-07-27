import { Grid, Card, CardContent, Typography, GridProps } from "@mui/material";

interface FinanceProps {
  totalReceived: number;
  totalPending: number;
  defaultRate?: number;
}

export default function DashboardFinance({
  totalReceived,
  totalPending,
  defaultRate,
}: FinanceProps) {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {/* Total Recebidos */}
      <Grid {...({ item: true, xs: 12, md: 4 } as GridProps)}>
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
      <Grid {...({ item: true, xs: 12, md: 4 } as GridProps)}>
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
      <Grid {...({ item: true, xs: 12, md: 4 } as GridProps)}>
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
  );
}
