"use client";

import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Enviar email para recuperação de senha:", email);
        // chamada para API de recuperação de senha
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
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#338B97] text-white p-2 rounded hover:bg-[#255690]"
                    >
                        Enviar Link de Redefinição
                    </button>

                </form>
            </div>            
        </main>
    );
}