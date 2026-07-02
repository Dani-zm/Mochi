import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  loginUser,
  registerUser,
  logoutUser,
  currentUser,
} from "../services/auth.service";

import { User } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

interface AuthContextType {
  user: User | null;

  loading: boolean;

  login: (email: string, password: string) => Promise<void>;

  register: (nombre: string, email: string, password: string) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadUser() {
    try {
      const data = await currentUser();
      setUser(data);
    } catch (error) {
      console.error("Error cargando usuario inicial:", error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const result = await loginUser({
      email,
      password,
    });

    setUser(result.user);
  }

  async function register(nombre: string, email: string, password: string) {
    const result = await registerUser({
      nombre,
      email,
      password,
    });

    setUser(result.user);
  }

  async function logout() {
    await logoutUser();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        login,

        register,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("AuthContext debe usarse dentro de AuthProvider");

  return context;
}
