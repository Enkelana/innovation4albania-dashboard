import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";

interface AuthCtx {
  user: User | null;
  isReady: boolean;
  login: (u: User) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, isReady: false, login: () => {}, logout: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("i4al_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User);
      } catch {
        localStorage.removeItem("i4al_user");
      }
    }

    setIsReady(true);
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem("i4al_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("i4al_user");
  };

  return <Ctx.Provider value={{ user, isReady, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);


