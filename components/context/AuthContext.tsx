import { getCurrentUser, login, logout, register } from '@/lib/appwrite';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>(null);

type AuthContextProviderProps = {
    children: React.ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const bootstrap = async () => {
        setLoading(true);
        const u = await getCurrentUser();
        setUser(u);
        setLoading(false);
    };

    useEffect(() => {
        bootstrap();
    }, []);

    const loginFunc = async (email: string, password: string) => {
        const u = await login(email, password);
        setUser(u as any);
        return u;
    };

    const registerFunc = async (email: string, password: string, name: string) => {
        const u = await register(email, password, name);
        // opcional: auto-login após registro (chamar login)
        return u;
    };

    const logoutFunc = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, login: loginFunc, register: registerFunc, logout: logoutFunc }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);