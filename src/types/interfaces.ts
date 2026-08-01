export interface Course {
    id: number;
    title: string;
    description: string;
    studentsCount?: number;
}

export interface CourseReadDto {
  id: number;
  title: string;
  description?: string;
  teacherId: number;
  teacherName: string; 
  lessonsCount: number;
  lessons: { id: number; title: string; date: string }[];
  enrolledUsers: { id: number; userName: string }[];
}

export interface CourseCreateDto {
  title: string;
  description?: string;
  creatorId: number;
}

export interface CourseUpdateDto {
  title: string;
  description?: string;
}


export interface User {
    id: number;
    name: string;
    email?: string;
    role: string;
    profile: number;
    courses?: Course[];
}


export interface UserReadDto {
  id: number;
  userName: string;
  email?: string;
  profile?: string; 
}


export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export interface Enrollment {
    id: number;
    courseId: number;
    courseTitle: string;
    userId: number;
    userName?: string;
    progressPercentage?: number;
    completedLessons?: number;
    totalLessons?: number;
    status?: string;
}

export interface CourseSummaryDto {
  id: number;
  title: string;
  studentsCount: number;
  progress?: number;
}

export interface CoordinatorDashboardDto {
  coursesCount: number;
  teachersCount: number;
  studentsCount: number;
  coordinatorCount: number;
  nextLessonsCount: number;
  avgProgress: number;
  courses: CourseSummaryDto[];
}

export interface TeacherReadDto extends UserReadDto {
  courses: CourseReadDto[];
}

export interface CourseEnrollmentDto {
  id: number;
  courseTitle: string;
  status: string;
  teacherName?: string;
  userName?: string;
  progressPercentage?: number;
  completedLessons?: number;
  totalLessons?: number;
  courseId: number;
  teacherId: number;
}

export interface StudentDto {
  id: number;
  userName: string;
  userEmail: string;
  cpf?: string;
  birthDate?: string;
  phoneNumber?: string;
  courseEnrolled: CourseEnrollmentDto[];

}

export interface FinanceSummary {
  totalReceived: number;
  totalPending: number;
  totalPayments: number;
  paid: number;
  pending: number;
  defaultRate: number;
  activeStudents: number;
  monthlyRevenue: number;
  message?: string;
}

export type PaymentStatus = "Pending" | "Paid" | "Cancelled";
export interface Payment {
  id: number;
  amount: number;
  status: PaymentStatus;
  dueDate?: string;
  paidAt?: string;
  course?: { title: string; teacher?: string };
  student?: { userName: string };
}

export interface FinanceProps {
  totalReceived: number;
  totalPending: number;
  defaultRate?: number;
  payments: Payment[];
}

export interface RegisterFormProps {
  courseId?: string;
}

export interface DashboardFinanceProps {
  totalReceived: number;
  totalPending: number;
  defaultRate: number;
  payments: Payment[];
  onMarkAsPaid: (id: number, userName: string) => void;
  showAll?: boolean;
  setShowAll: (value: boolean) => void;
  statusFilter?: string;
  studentFilter?: string;
}