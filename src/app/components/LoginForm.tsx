"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const isPasswordValid = password.length >= 6;
  const [login, setLogin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      const response = await axios.post("http://localhost:5119/api/Auth/login", {
        userName: login,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem("authToken", token);

      toast.success("Login bem-sucedido!");
      setLogin("");
      setPassword("");

      router.push("/dashboard");

    } catch (err: any){
      toast.error(err.message || "Erro ao fazer login");
    } finally{
      setLoading(false);
    }

  };

  const handleGoogleLogin = () => {
    //chamada para API de login com Google
    console.log("Login com Google");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-80">
      {/*Email */}
      <input
        type="email"
        placeholder="Email"
        value={login}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
        className={`w-full border p-2 rounded ${
          login.length === 0 ? "" : login.length >= 3 ? "border-green-500" : "border-red-500"
        }`}
      />

      {/*Senha */}
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        className={`w-full border p-2 rounded ${
          password.length === 0 ? "" : isPasswordValid ? "border-green-500" : "border-red-500"
        }`}
      />

      {/* botçao login */}
      <button
        type="submit"
        disabled={!isPasswordValid || loading}
        className={`w-full p-2 rounded ${
          !isPasswordValid ? "bg-gray-400 cursor-not-allowed" : "bg-[#338B97] hover:bg-[#255690]"
        } text-white`}
      >
        {loading ? "Entrando" : "Login"}
      </button>

      {/* Botão para login com Google */}
      <button type = "button" onClick={handleGoogleLogin} className="w-full bg-[#DB4437] text-white p-2 rounded hover:bg-[#A33224]">
        Entrar com Google
      </button>

      {/*Esqueci minha senha */}
      <div className="text-sm text-center text-gray-600 cursor-pointer hover:text-gray-800">
        Esqueci minha senha
      </div>

      {/* Link para cadastro */}
      <div className="text-sm text-center text-gray-600 cursor-pointer hover:text-gray-800">
        <Link href="/register">
          Não tem uma conta? Cadastre-se
        </Link>
      </div>
    </form>
  );
}
