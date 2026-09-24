import AuthGuard from "../components/AuthGuard";
import DashboardLayout from "../components/dashboardStudent/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard profile={1}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
