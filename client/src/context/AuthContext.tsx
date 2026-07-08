import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";


import type { IUser } from "../types/Auth";

import * as AuthService from "../api/services/auth.service";

interface AuthContextType {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    register: (
        name: string,
        username: string,
        email: string,
        password: string
    ) => Promise<void>;

    logout: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<IUser | null>(null);

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await AuthService.getCurrentUser();

            setUser(response.user);
        }
        catch {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        const response = await AuthService.login(username, password);
        setUser(response.user);

    };

    const register = async (
        name: string,
        username: string,
        email: string,
        password: string
    ) => {
        const response =
            await AuthService.register(
                name,
                username,
                email,
                password
            );

        setUser(response.user);
    };

    const logout = async () => {
        await AuthService.logout();

        setUser(null);
    };
     return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,

        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}