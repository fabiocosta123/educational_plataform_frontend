import AuthGuard from "../components/AuthGuard";
import SidebarTeacher from "../components/dashboardCoordinator/teachers/SidebarTeacher";

export default function DashboardTeacherLayout({ children } : { children: React.ReactNode}) {
    return (
        <AuthGuard profile={2}>
            <div className="flex min-h-screen bg-gray-50">
                <SidebarTeacher />
                <main className="flex-1 overflow-y-auto p-4 pt-16 sm:p-8 md:ml-64 md:pt-8">{children}</main>
            </div>
        </AuthGuard>
    )
}
