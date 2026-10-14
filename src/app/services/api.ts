import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5119";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});

const USER_FAILURE =
    "Não foi possível concluir esta operação agora. Tente de novo em alguns instantes.";

function isTechnicalApiText(text: string) {
    const value = text.trim();
    if (!value) return false;
    if (value.startsWith("<") || /<\/?[a-z][\s\S]*>/i.test(value)) return true;
    if (value.length > 180) return true;
    return /mycredit|azure|baseurl|railway|sandboxapi|html-error|exception|postgres|npgsql|payload/i.test(
        value
    );
}

function sanitizeErrorData(data: unknown): unknown {
    if (typeof data === "string") {
        return isTechnicalApiText(data) ? USER_FAILURE : data;
    }

    if (!data || typeof data !== "object") {
        return data;
    }

    const payload = data as Record<string, unknown>;
    const source = typeof payload.source === "string" ? payload.source : "";
    const message = typeof payload.message === "string" ? payload.message : "";
    const details = typeof payload.details === "string" ? payload.details : "";

    if (source || isTechnicalApiText(message) || isTechnicalApiText(details)) {
        return { message: USER_FAILURE };
    }

    return data;
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const data = error?.response?.data;
        if (data !== undefined) {
            console.error("API error:", data);
            if (error.response) {
                error.response.data = sanitizeErrorData(data);
            }
        } else {
            console.error("API error:", error);
        }
        return Promise.reject(error);
    }
);



export default api;