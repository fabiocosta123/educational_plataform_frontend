import CourseCard from "./CourseCard";
import QuickActions from "./QuickActions";

export default function DashboardPage() {
  const user = { userName: "Alice" };
  const courses = [
    { id: 1, title: "React Basics", description: "Learn fundamentals", progress: 40 },
    { id: 2, title: "ASP.NET Core", description: "Build APIs", progress: 75 }
  ];

  return (
    <div className="dashboard">
      <h2>Welcome, {user.userName}!</h2>
      <section>
        <h3>Your Courses</h3>
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>
      <QuickActions />
    </div>
  );
}
