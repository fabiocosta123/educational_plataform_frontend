"use client";
import LessonForm from "./LessonForm";
import LessonList from "./LessonList";

export default function ModuleCard({ module, courseId, setCourses }: any) {
  const handleAddLesson = (lesson: any) => {
    setCourses((prev: any) =>
      prev.map((c: any) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m: any) =>
                m.id === module.id
                  ? { ...m, lessons: [...m.lessons, { id: Date.now(), ...lesson }] }
                  : m
              ),
            }
          : c
      )
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#163E72]">{module.title}</h3>
      <p className="text-gray-600">{module.description}</p>

      {module.videoUrl && (
        <p className="text-sm text-[#66BCA1] mt-2">
          Vídeo: <a href={module.videoUrl}>{module.videoUrl}</a>
        </p>
      )}
      {module.pdfMaterial && (
        <p className="text-sm text-gray-500 mt-2">Material: {module.pdfMaterial}</p>
      )}

      <LessonForm onSave={handleAddLesson} />
      <LessonList lessons={module.lessons} />
    </div>
  );
}
