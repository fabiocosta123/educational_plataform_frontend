import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-br from-[#163E72] via-[#255690] to-[#66BCA1]">
      <div className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Entrar</h1>
        <LoginForm />
      </div>
    </main>
  );
}
