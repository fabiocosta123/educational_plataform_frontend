"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Cleave from "cleave.js/react";
import { RegisterFormProps } from "@/types/interfaces";
import { isValidCpf } from "@/utils/cpf";
import api from "@/app/services/api";

function getRegisterErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (payload.errors && typeof payload.errors === "object") {
      const messages = Object.values(payload.errors as Record<string, unknown>)
        .flat()
        .filter((item): item is string => typeof item === "string");

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
  }

  return fallback;
}

export default function RegisterForm({ courseId }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const isPasswordValid = password.length >= 6;
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const isEmailValid =
    email.length > 0 && /\S+@\S+\.\S+/.test(email);

  const cpfIsValid = isValidCpf(cpf);

  const isFormValid =
    name.trim().length >= 3 &&
    cpfIsValid &&
    phoneNumber.length > 0 &&
    birthDate.length > 0 &&
    isEmailValid &&
    isPasswordValid &&
    passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!cpfIsValid) {
      toast.error("Informe um CPF válido.");
      return;
    }

    if (!isFormValid) {
      toast.error("Preencha todos os campos corretamente.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userName: name.trim(),
        password,
        userEmail: email.trim(),
        cpf,
        phoneNumber,
        birthDate,
      };

      if (courseId) {
        await api.post(`/Auth/register-course/${courseId}`, payload);
      } else {
        await api.post("/Auth/register", {
          ...payload,
          profile: 1,
        });
      }

      toast.success("Cadastro realizado com sucesso! Faça login.");
      router.push("/login");
      return;
    } catch (err: unknown) {
      console.error("Erro ao registrar aluno:", err);

      toast.error(
        getRegisterErrorMessage(
          err,
          "Não foi possível realizar o cadastro."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 rounded-xl bg-white p-6 shadow-lg"
    >
      {/* Nome */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nome completo
        </label>

        <input
          type="text"
          placeholder="Digite seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border p-3 outline-none focus:border-[#338B97]"
          required
        />
      </div>

      {/* CPF */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          CPF
        </label>

        <Cleave
          options={{
            delimiters: [".", ".", "-"],
            blocks: [3, 3, 3, 2],
            numericOnly: true,
          }}
          value={cpf}
          placeholder="000.000.000-00"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) => setCpf(e.target.value)}
          className={`w-full rounded-lg border p-3 outline-none ${
            cpf.length === 0
              ? ""
              : cpfIsValid
                ? "border-green-500"
                : "border-red-500"
          }`}
          required
        />
        {cpf.length > 0 && !cpfIsValid && (
          <p className="mt-1 text-xs text-red-500">
            Informe um CPF válido.
          </p>
        )}
      </div>

      {/* Data de nascimento */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Data de nascimento
        </label>

        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full rounded-lg border p-3 outline-none focus:border-[#338B97]"
          required
        />
      </div>

      {/* Telefone */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Telefone
        </label>

        <Cleave
          options={{
            delimiters: ["(", ") ", "-"],
            blocks: [0, 2, 5, 4],
            numericOnly: true,
          }}
          value={phoneNumber}
          placeholder="(00) 00000-0000"
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) => setPhoneNumber(e.target.value)}
          className="w-full rounded-lg border p-3 outline-none focus:border-[#338B97]"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          E-mail
        </label>

        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full rounded-lg border p-3 outline-none ${
            email.length === 0
              ? ""
              : isEmailValid
                ? "border-green-500"
                : "border-red-500"
          }`}
          required
        />
      </div>

      {/* Senha */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Senha
        </label>

        <input
          type="password"
          placeholder="Mínimo de 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full rounded-lg border p-3 outline-none ${
            password.length === 0
              ? ""
              : isPasswordValid
                ? "border-green-500"
                : "border-red-500"
          }`}
          required
        />

        {password.length > 0 && !isPasswordValid && (
          <p className="mt-1 text-xs text-red-500">
            A senha deve possuir pelo menos 6 caracteres.
          </p>
        )}
      </div>

      {/* Confirmar senha */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Confirmar senha
        </label>

        <input
          type="password"
          placeholder="Digite a senha novamente"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className={`w-full rounded-lg border p-3 outline-none ${
            confirmPassword.length === 0
              ? ""
              : passwordsMatch
                ? "border-green-500"
                : "border-red-500"
          }`}
          required
        />

        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="mt-1 text-xs text-red-500">
            As senhas não coincidem.
          </p>
        )}
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={!isFormValid || loading}
        className={`w-full rounded-lg p-3 font-semibold text-white transition ${
          !isFormValid || loading
            ? "cursor-not-allowed bg-gray-400"
            : "bg-[#338B97] hover:bg-[#255690]"
        }`}
      >
        {loading
          ? "Criando sua conta..."
          : "Criar conta e inscrever-se"}
      </button>

      {/* Login */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Já possui uma conta?
        </p>

        <Link
          href="/login"
          className="text-sm font-semibold text-[#338B97] hover:underline"
        >
          Faça login
        </Link>
      </div>
    </form>
  );
}
