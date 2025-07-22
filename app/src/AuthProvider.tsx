import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "./api/axios";

interface ApiResponse<T> {
  data: T;
}

interface User {
  id: string;
  playerName: string;
  points: number;
  isGuest:boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string | null, password: string | null, isGuest: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  changeUsername: (username: string) => Promise<{ success: boolean; message?: string }>
  accessToken: string | null;
  isLoggedIn: boolean;
  records: (number|null)[];
  setRecords: React.Dispatch<React.SetStateAction<(number|null)[]>>;
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
  const [records, setRecords] = useState<(number|null)[]>([null, null, null]);

  // Login function
  const login = async (email: string | null, password: string | null, isGuest: boolean): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post("/player/login", { email: email, password, isGuest });
      if(!response.data.success){
        return { success: false, message:response.data.message };
      }
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
      setIsLoggedIn(false);
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      return { success: false, message: errorMessage };
    }
  };

  const changeUsername = async (userName: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await axios.put(
        `http://51.20.207.233:5000/api/player/change-username`,
        null, // No body needed, as userName is sent as a query parameter
        {
          params: { userName: userName }, // Add userName as a query parameter
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      
        const userProfile = await axios.get<ApiResponse<User>>("/player/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      setUser(userProfile.data.data);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Username change failed";
      console.error("Error details:", JSON.stringify(error.response?.data, null, 2));
      return { success: false, message: errorMessage };
    }
  };
  
  

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post("/player/register-user", { playerName: username, email, password });
      console.warn(response.data)
      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

  

  const logout = (): void => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
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
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, changeUsername, accessToken, isLoggedIn, records, setRecords }}>
      {children}
    </AuthContext.Provider>
  );
};
