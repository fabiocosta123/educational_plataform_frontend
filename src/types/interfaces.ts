export interface Course {
    id: number;
    title: string;
    description: string;
}

export interface User {
    id: number;
    name: string;
}

export interface Enrollment {
    id: number;
    courseId: number;
    courseTitle: string;
    userId: number;
    userName: string;
    progressPercentage?: number;
    status?: string;
}