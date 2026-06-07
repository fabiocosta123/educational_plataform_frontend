"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import Cleave from "cleave.js/react";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const isPasswordValid = password.length >= 6;
    const [cpf, setCpf] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<number>(0);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5119/api/Auth/register", {
                userName: name,
                userEmail: email,
                password: password,
                cpf: cpf,
                birthDate: birthDate,
                profile: profile
            });
            toast.success("Registro bem-sucedido! Faça login para continuar.");
            setName("");
            setEmail("");
            setPassword("");
            setCpf("");
            setBirthDate("");
        } catch (err: any) {
            toast.error(err.message || "Erro ao registrar usuário");
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-80">
            {/* Nome */}
            <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
            />
            {/* Perfil */}
            <select
                value={profile}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfile(Number(e.target.value))}
                className={`w-full border p-2 rounded ${profile === 0 ? "" : "border-green-500"}`}
            >
                <option value={0}>Aluno</option>
                <option value={1}>Professor</option>
                <option value={2}>Administrador</option>
            </select>

            {/*CPF */}
            <Cleave
                options={{ delimiters: [".", ".", "-"], blocks: [3, 3, 3, 2], numericOnly: true }}
                value={cpf}
                placeholder="CPF"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)}
                className={`w-full border p-2 rounded ${cpf.length === 14 ? "border-green-500" : cpf.length === 0 ? "" : "border-red-500"
                    }`}
            />         



            {/*Data de nascimento */}
            <input
                type="date"
                placeholder="Data de Nascimento"
                value={birthDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)}
                className={`w-full border p-2 rounded ${birthDate.length === 0 ? "" : "border-green-500"}`}
            />

            {/*Email */}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className={`w-full border p-2 rounded ${email.length === 0 ? "" : /\S+@\S+\.\S+/.test(email) ? "border-green-500" : "border-red-500"
                    }`}
            />

            {/*Senha */}
            <input
                type="password"
                placeholder="Senha (mínimo 6 digitos)"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className={`w-full border p-2 rounded ${password.length === 0 ? "" : isPasswordValid ? "border-green-500" : "border-red-500"
                    }`} />

            {/*Botão */}
            <button
                type="submit"
                disabled={!isPasswordValid || loading}
                className={`w-full p-2 rounded ${!isPasswordValid ? "bg-gray-400 cursor-not-allowed" : "bg-[#338B97] hover:bg-[#255690]"
                    } text-white`}
            >
                {loading ? "Registrando..." : "Registrar"}
            </button>

            <div className="flex justify-end">
                <Link href="/login" className="text-blue-600 hover:underline">
                    Faça login
                </Link>
            </div>
        </form>
    );
}