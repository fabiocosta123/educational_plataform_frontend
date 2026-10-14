"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Suspense } from "react";
import api from "../services/api";
import { BackLink } from "../components/AppLinks";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (!token) {
      toast.error("Link inválido. Solicite uma nova redefinição.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/Auth/reset-confirm", {
        token,
        newPassword: password,
      });
      toast.success("Senha redefinida. Faça login.");
      router.push("/login");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(
        axiosErr.response?.data?.message || "Não foi possível redefinir a senha."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-br from-[#163e72] via-[#255690] to-[#66bca1]">
      <div className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#255690]">
          Nova senha
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            minLength={6}
            required
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border p-2 rounded"
            minLength={6}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#338B97] text-white p-2 rounded hover:bg-[#255690] disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar senha"}
          </button>
        </form>
        <BackLink href="/login">Voltar ao login</BackLink>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Carregando...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
