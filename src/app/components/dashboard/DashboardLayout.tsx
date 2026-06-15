"use client";
import DashboardSidebar from "../dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixa */}
      <DashboardSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
