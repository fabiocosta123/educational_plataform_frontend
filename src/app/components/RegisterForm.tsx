"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function RegisterForm(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpf, setCpf] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
           await axios.post("http://localhost:5119/api/Auth/register", {
            username: name,
            email: email,
            password: password,
            cpf: cpf
           });
           toast.success("Registro bem-sucedido! Faça login para continuar.");
        } catch (err: any){
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
                className="w-full bg-[#338B97] text-white p-2 rounded hover:bg-[#255690]"
            >
                Registrar
            </button>
        </form>
    );
}