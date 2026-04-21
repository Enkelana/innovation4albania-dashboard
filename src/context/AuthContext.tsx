import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { USERS } from "@/data/mock";
import type { User } from "@/types";

interface AuthCtx {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("i4al_user");
    if (raw) {
      const id = JSON.parse(raw);
      const found = USERS.find(u => u.id === id);
      if (found) setUser(found);
    }
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem("i4al_user", JSON.stringify(u.id));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("i4al_user");
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);

export const ROLE_LABEL: Record<string, string> = {
  kryeminister: "Kryeministër",
  minister: "Ministër",
  drejtor_agjencie: "Drejtor Agjencie",
  staf_agjencie: "Staf Agjencie",
  staf_ministrie: "Staf Ministrie",
};
