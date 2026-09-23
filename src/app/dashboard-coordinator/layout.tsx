import SidebarCoordinator from "../components/dashboardCoordinator/SidebarCoordinator";

export default function DashboardCoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarCoordinator />

      <main className="flex-1 overflow-y-auto p-4 pt-16 sm:p-6 md:ml-64 md:pt-6">
        {children}
      </main>
    </div>
  );
}
