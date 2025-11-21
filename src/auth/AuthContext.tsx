import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import toast from "react-hot-toast";
import { STORAGE_KEYS, MESSAGES } from "@/constants";

export type User = { id?: number; fullName?: string; email: string; role?: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ERROR_NO_TOKEN = "Backend did not return token";
const ERROR_AUTH_CONTEXT = "useAuth must be used within an AuthProvider";
const SUCCESS_WELCOME = "Welcome";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const u = localStorage.getItem(STORAGE_KEYS.USER)
    if (token && u) setUser(JSON.parse(u))
    setLoading(false)
  }, [])

  const register = async (payload: { username: string; email: string; password: string }) => {
    await api.post(ENDPOINTS.AUTH.REGISTER, {
      fullName: payload.username,
      email: payload.email,
      password: payload.password,
    });
    toast.success(MESSAGES.AUTH.REGISTER_SUCCESS);
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    if (!data?.token) throw new Error(ERROR_NO_TOKEN);
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user ?? { email }))
    setUser(data.user ?? { email })
    toast.success(SUCCESS_WELCOME);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    setUser(null)
    toast(MESSAGES.AUTH.LOGOUT_SUCCESS)
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error(ERROR_AUTH_CONTEXT);
  return ctx;
};