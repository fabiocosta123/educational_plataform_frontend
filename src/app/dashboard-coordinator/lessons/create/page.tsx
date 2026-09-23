import { Suspense } from "react";
import CreateLessonPage from "../../../components/dashboardCoordinator/lessons/CreateLessonPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-3xl p-4">
          <p className="text-center mt-10">
            Carregando informações da aula...
          </p>
        </div>
      }
    >
      <CreateLessonPage />
    </Suspense>
  );
}