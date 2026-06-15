export interface Course {
    id: number;
    title: string;
    description: string;
}

export interface User {
    id: number;
    name: string;
    email?: string;
    role: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
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

