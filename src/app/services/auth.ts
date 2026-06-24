import api from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(name: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
        throw new Error("Erro ao registrar usuário");
    }
    return res.json();
}

// login
export async function loginUser(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        throw new Error("Credenciais inválidas");
    }
    const data = await res.json();

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    console.log("Login retornou:", data);
    localStorage.setItem("token", data.token);
    console.log("Token salvo:", data.token);
    
    window.location.reload();

    return data;
}

export async function getMe() {
    const res = await api.get("/Auth/me");
    return res.data;
}


export async function googleLogin() {
    window.location.href = `${API_URL}/auth/google`;
}

export async function forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    });

    if (!res.ok) {
        throw new Error("Erro ao solicitar recuperação de senha");

    }
    return await res.json();
}
