import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { IUser } from "../types/Auth";

import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../api/services/auth.service";

interface LoginData {
  username: string;
  passwordHash: string;
}

interface RegisterData {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
}

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRegistering: boolean;
  isLogging: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging , setIsLogging] = useState(false);
  const [isRegistering , setIsRegistering] = useState(false);
  async function refreshUser() {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
    } catch {
      setUser(null);
    }
  }

  async function login(data: LoginData) {
    setIsLogging(true);
    try{

        console.log("1. login() called");
        
        await loginUser(data);
        
        console.log("2. loginUser finished");
        
        await refreshUser();
        
        console.log("3. refreshUser finished");
    }
    finally{
        setIsLogging(false);
    }
  }

  async function register(data: RegisterData) {
    setIsRegistering(true)
    try{
        await registerUser(data);
        await refreshUser();
    }
    finally{
        setIsRegistering(false);
    }
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  useEffect(() => {
    async function initializeAuth() {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    }

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isLogging,
        isRegistering,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}