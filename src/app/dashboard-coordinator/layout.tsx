import SidebarCoordinator from "../components/dashboardCoordinator/SidebarCoordinator";

export default function DashboardCoordinatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar fixa */}
      <aside className="fixed md:static top-0 left-0 h-screen w-64 z-50">
        <SidebarCoordinator />
      </aside>

      {/* Conteúdo rolável */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
