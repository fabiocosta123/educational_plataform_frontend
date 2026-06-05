"use client";

import Link from "next/link";
import { useState } from "react";
import { loginUser, googleLogin } from "../services/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const result = await loginUser(email, password);
      alert("Login bem-sucedido! Token: " + result.token);
    } catch (err: any){
      alert(err.message || "Erro ao fazer login");
    }
  };

  const handleGoogleLogin = () => {
    //chamada para API de login com Google
    console.log("Login com Google");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-80">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="w-full bg-[#338B97] text-white p-2 rounded hover:bg-[#255690]"
      >
        Entrar
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
