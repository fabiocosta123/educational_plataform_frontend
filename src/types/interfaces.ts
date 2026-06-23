export interface Course {
    id: number;
    title: string;
    description: string;
    studentsCount?: number;
}

export interface User {
    id: number;
    name: string;
    email?: string;
    role: string;
    profile: number;
    courses?: Course[];
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


