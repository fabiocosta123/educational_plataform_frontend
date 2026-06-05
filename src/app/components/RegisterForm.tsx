"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
            />
            <select
                value={profile}
                onChange={(e) => setProfile(Number(e.target.value))}
                className="w-full border p-2 rounded"
            >
                <option value={0}>Aluno</option>
                <option value={1}>Professor</option>
                <option value={2}>Administrador</option>
            </select>

            <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full border p-2 rounded"
            />
            <input
                type="date"
                placeholder="Data de Nascimento"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full border p-2 rounded"
            />

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
                className="w-full border p-2 rounded    "
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#338B97] text-white p-2 rounded hover:bg-[#255690]"
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