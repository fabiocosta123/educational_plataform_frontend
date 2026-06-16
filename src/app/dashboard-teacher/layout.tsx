import SidebarTeacher from "../components/dashboardTeacher/SidebarTeacher";

export default function DashboardTeacherLayout({ children } : { children: React.ReactNode}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SidebarTeacher />
            <main className="flex-1 p-8">{children}</main>
        </div>
    )
}