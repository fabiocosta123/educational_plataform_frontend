"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface User {
    id: string;
    email: string;
    name?: string;
}

export function useAuth(){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            try{
                const decoded: any = jwtDecode(token);
                setUser({
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.name
                })
            } catch (error) {
                console.error("Token inválido", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }

        setLoading(false);
    }, []);

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
    }

    return { user, loading };
}