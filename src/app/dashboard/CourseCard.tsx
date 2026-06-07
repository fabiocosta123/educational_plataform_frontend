import ProgressBar from "./ProgressBar";

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="course-card">
      <h4>{course.title}</h4>
      <p>{course.description}</p>
      <ProgressBar progress={course.progress} />
      <p>{course.progress}% completed</p>
      <button>Continue Course</button>
    </div>
  );
}
