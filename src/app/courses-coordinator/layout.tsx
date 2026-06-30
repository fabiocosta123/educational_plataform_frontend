import SidebarCoordinator from "../components/dashboardCoordinator/SidebarCoordinator";

export default function CoursesCoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixa */}
      <SidebarCoordinator />

      {/* Conteúdo rolável */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
