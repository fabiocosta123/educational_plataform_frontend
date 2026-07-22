import SidebarCoordinator from "../components/dashboardCoordinator/SidebarCoordinator";

export default function DashboardCoordinatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarCoordinator />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
