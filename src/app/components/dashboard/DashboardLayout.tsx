"use client";
import DashboardSidebar from "../dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar fixa */}
      <aside className="fixed md:static top-0 left-0 h-screen w-64 z-50">
        <DashboardSidebar />
      </aside>

      {/* Conteúdo rolável */}
      <main className="flex-1 md:ml-64 overflow-y-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
