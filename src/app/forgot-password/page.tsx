"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResetLink(null);

    try {
      const { data } = await api.post("/Auth/reset-request", { email });
      const link = typeof data?.resetLink === "string" ? data.resetLink : null;
      setResetLink(link);
      toast.success(
        data?.message ||
          "Se o e-mail estiver cadastrado, o link de redefinição foi gerado."
      );
    } catch {
      toast.error("Não foi possível solicitar a redefinição de senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-br from-[#163e72] via-[#255690] to-[#66bca1]">
      <div className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h1 className="text-4xl font-bold mb-6 text-center text-[#255690]">
          Redefinir Senha
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Digite seu email cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#338B97] text-white p-2 rounded hover:bg-[#255690] disabled:opacity-60"
          >
            {loading ? "Gerando..." : "Enviar Link de Redefinição"}
          </button>
        </form>

        {resetLink && (
          <p className="mt-4 break-all text-sm text-[#163E72]">
            Link (válido 1 hora):{" "}
            <a href={resetLink} className="underline">
              {resetLink}
            </a>
          </p>
        )}

        {!resetLink && (
          <p className="mt-4 text-sm text-gray-600">
            Ainda não enviamos esse link por e-mail. Se a conta existir, o
            link aparece nesta página para você abrir e criar a nova senha.
          </p>
        )}

        <Link
          href="/login"
          className="mt-4 block text-center text-sm text-gray-600 hover:text-gray-800"
        >
          Voltar ao login
        </Link>
      </div>
    </main>
  );
}
