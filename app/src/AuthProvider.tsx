import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "./api/axios";

interface ApiResponse<T> {
  data: T;
}

interface User {
  userName: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  accessToken: string | null;
  isLoggedIn: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the context with an initial value of null
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken"));
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Login function
  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post("/player/login", { userName: username, password });
      const { accessToken, refreshToken } = response.data.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      console.log(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const userProfile = await axios.get<ApiResponse<User>>("/player/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(userProfile.data.data);
      setIsLoggedIn(true);

      return { success: true };
    } catch (error: any) {
      console.error(error);
      setIsLoggedIn(false);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  // Register function
  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post("/player/register-user", { userName: username, email, password });
      console.warn(response.data)
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

  // Refresh token function
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post("/player/refresh-token", { refreshToken });
      const newAccessToken = response.data.data;
      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout();
      return null;
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // Verify token validity on app load
  useEffect(() => {
    if (accessToken) {
      axios
        .get<ApiResponse<User>>("/player/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((response) =>{
            setIsLoggedIn(true);
            setUser(response.data.data);
        })
        .catch(async () => {
          const newToken = await refreshAccessToken();
          if (newToken) {
            axios
              .get<User>("/player/profile", {
                headers: { Authorization: `Bearer ${newToken}` },
              })
              .then((response) => {
                setIsLoggedIn(true);
                setUser(response.data);
              })
              .catch(logout);
          }
        });
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, accessToken, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
