"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { dashboardPath } from "../../lib/dashboardPath";
import api from "../../services/api";

export interface JwtPayload {
  nameid: string;
  unique_name: string;
  role: string;
  profile: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordValid = password.length >= 6;
  const [login, setLogin] = useState("");
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const completeLogin = useCallback(
    (token: string) => {
      localStorage.setItem("token", token);
      const decoded = jwtDecode<JwtPayload>(token);

      setUser({
        id: parseInt(decoded.nameid, 10),
        name: decoded.unique_name,
        role: decoded.role,
        profile: parseInt(decoded.profile, 10),
      });

      toast.success("Login bem-sucedido!");
      setLogin("");
      setPassword("");
      router.push(
        dashboardPath({
          role: decoded.role,
          profile: parseInt(decoded.profile, 10),
        })
      );
    },
    [router, setUser]
  );

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const scriptId = "google-gsi-client";
    const initGoogle = () => {
      const googleId = window.google?.accounts.id;
      const buttonHost = googleButtonRef.current;
      if (!googleId || !buttonHost) {
        return;
      }

      googleId.initialize({
        client_id: googleClientId,
        ux_mode: "popup",
        context: "signin",
        callback: async (response) => {
          if (!response.credential) {
            toast.error("Google não retornou credencial.");
            return;
          }

          try {
            setLoading(true);
            const { data } = await api.post("/Auth/google-login", {
              idToken: response.credential,
            });
            completeLogin(data.token);
          } catch (err: unknown) {
            const axiosErr = err as {
              response?: { data?: string | { message?: string; title?: string } };
            };
            const data = axiosErr.response?.data;
            const message =
              (typeof data === "string" && data) ||
              (typeof data === "object" && (data?.message || data?.title)) ||
              "Erro ao entrar com Google";
            toast.error(message);
          } finally {
            setLoading(false);
          }
        },
      });

      buttonHost.innerHTML = "";
      googleId.renderButton(buttonHost, {
        type: "icon",
        shape: "circle",
        theme: "outline",
        size: "large",
      });
    };

    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (window.google?.accounts?.id) {
      initGoogle();
      return;
    }

    if (existing) {
      existing.addEventListener("load", initGoogle);
      return () => existing.removeEventListener("load", initGoogle);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }, [completeLogin, googleClientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/Auth/login", {
        userName: login,
        password: password,
      });

      completeLogin(response.data.token);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: string | { message?: string; title?: string } };
      };
      const data = axiosErr.response?.data;
      const message =
        (typeof data === "string" && data) ||
        (typeof data === "object" && (data?.message || data?.title)) ||
        "Erro ao fazer login";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-80">
      <input
        type="email"
        placeholder="Email"
        value={login}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
        className={`w-full border p-2 rounded ${login.length === 0 ? "" : login.length >= 3 ? "border-green-500" : "border-red-500"
          }`}
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className={`w-full border p-2 rounded pr-10 ${password.length === 0 ? "" : isPasswordValid ? "border-green-500" : "border-red-500"
            }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button
        type="submit"
        disabled={!isPasswordValid || loading}
        className={`w-full p-2 rounded ${!isPasswordValid ? "bg-gray-400 cursor-not-allowed" : "bg-[#338B97] hover:bg-[#255690]"
          } text-white`}
      >
        {loading ? "Entrando" : "Login"}
      </button>

      <div className="flex flex-col items-center gap-2">
        {googleClientId ? (
          <div ref={googleButtonRef} className="flex min-h-10 min-w-10 justify-center" />
        ) : (
          <p className="text-center text-xs text-gray-500">
            Login Google não configurado.
          </p>
        )}
      </div>

      <Link
        href="/forgot-password"
        className="block text-sm text-center text-gray-600 hover:text-gray-800"
      >
        Esqueci minha senha
      </Link>

      <Link
        href="/"
        className="block text-sm text-center text-gray-600 hover:text-gray-800"
      >
        Voltar
      </Link>
    </form>
  );
}
