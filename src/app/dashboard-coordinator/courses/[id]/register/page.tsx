import RegisterForm from "@/app/components/register/RegisterForm";



export default function CourseRegisterPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-br from-[#163E72] via-[#255690] to-[#66BCA1]">
      <div className="p-8 bg-white shadow-lg rounded-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#255690]">
          Registro no Curso {params.id}
        </h1>
       
        <RegisterForm courseId={params.id} />
      </div>
    </main>
  );
}
