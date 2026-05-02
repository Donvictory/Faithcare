import { createContext, useContext, useState, useEffect } from "react";
import {
  refreshToken as callRefreshTokenAPI,
  logout as callLogoutAPI,
} from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { setInMemoryToken } from "@/api/helper";
import { LoadingScreen } from "../components/LoadingScreen";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  setUser: (user: any) => void;
  setAccessToken: (token: string | null) => void;
  login: (userData: any, token: string, remember: boolean) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<any>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Helper to determine userType
  const determineUserType = (userData: any): "individual" | "organization" => {
    if (
      userData?.organizationId ||
      userData?.role === "ADMIN" ||
      userData?.role === "ORGANIZATION" ||
      userData?.organizationName
    ) {
      return "organization";
    }
    return "individual";
  };

  // Helper to get the correct storage based on rememberMe
  const getStorage = () => {
    return localStorage.getItem("rememberMe") === "true"
      ? localStorage
      : sessionStorage;
  };

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    setInMemoryToken(token);
  };

  const setUser = (userData: any) => {
    setUserState(userData);
    const storage = getStorage();
    if (userData) {
      storage.setItem("user", JSON.stringify(userData));
      const userType = determineUserType(userData);
      localStorage.setItem("userType", userType);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      sessionStorage.removeItem("user");
    }
  };

  const login = (userData: any, token: string, remember: boolean) => {
    localStorage.setItem("rememberMe", remember ? "true" : "false");
    setAccessToken(token);
    setUser(userData);
  };

  const switchOrganization = async (orgId: string) => {
    try {
      const { switchOrganization: callSwitchOrgAPI } =
        await import("@/api/auth");
      const result = await callSwitchOrgAPI(orgId);
      if (result.success && result.data) {
        const remember = localStorage.getItem("rememberMe") === "true";
        login(result.data.user, result.data.accessToken, remember);
        queryClient.clear();
      } else {
        throw new Error(result.error || "Failed to switch organization");
      }
    } catch (error) {
      console.error("Switch organization failed", error);
      throw error;
    }
  };

  const initializeSession = async (initialUser: any = null) => {
    try {
      const result = await callRefreshTokenAPI();
      const sessionData = result.data?.data || result.data;

      if (result.success && sessionData?.accessToken) {
        const remember = localStorage.getItem("rememberMe") === "true";

        // Merge with initialUser (from storage) to prevent data loss on refresh
        const updatedUser = {
          ...(initialUser || {}),
          ...(sessionData.user || {}),
        };

        login(updatedUser, sessionData.accessToken, remember);
      } else {
        const isAuthError =
          result.error?.includes("401") ||
          result.error?.toLowerCase().includes("unauthorized") ||
          result.status === 401;

        if (initialUser && isAuthError) {
          await logout();
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Failed to initialize session:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await callLogoutAPI();
    } catch (error) {
      console.warn("API logout call failed", error);
    } finally {
      setAccessTokenState(null);
      setInMemoryToken(null);
      setUserState(null);
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("userType");
      localStorage.removeItem("pendingEmail");
      sessionStorage.removeItem("user");
      queryClient.clear();
    }
  };

  useEffect(() => {
    const storedUserStr =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedUserStr && storedUserStr !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUserStr);
        setUserState(parsedUser);

        const userType = determineUserType(parsedUser);
        localStorage.setItem("userType", userType);

        initializeSession(parsedUser);
      } catch (e) {
        console.error("Error parsing stored user data", e);
        setIsLoading(false);
      }
    } else {
      initializeSession(null);
    }
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        setUser,
        setAccessToken,
        login,
        isLoading,
        logout,
        switchOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
