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
  userType: "individual" | "organization" | null;
  setUser: (user: any) => void;
  setAccessToken: (token: string | null) => void;
  login: (userData: any, token: string, remember: boolean) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
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

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    setInMemoryToken(token);
  };

  const setUser = (userData: any) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
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

  const initializeSession = async () => {
    try {
      const result = await callRefreshTokenAPI();
      // Robust session data extraction
      const sessionData = result.data?.data || result.data;
      const token =
        typeof sessionData === "string"
          ? sessionData
          : sessionData?.accessToken;

      console.log("Refresh token check:", {
        success: result.success,
        hasToken: !!token,
        hasUser: !!(sessionData?.user || sessionData?.email),
      });

      if (result.success && token) {
        const remember = localStorage.getItem("rememberMe") === "true";

        // Robust user extraction
        const userData =
          sessionData.user ||
          (sessionData.email || sessionData.role
            ? { ...sessionData, accessToken: undefined }
            : null);

        // Use the new user data if available, otherwise keep the current user (from localStorage)
        login(userData || user, token, remember);
      } else {
        setAccessToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to initialize session:", error);
      setAccessToken(null);
      setUser(null);
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
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("userType");
      localStorage.removeItem("pendingEmail");
      queryClient.clear();
    }
  };

  useEffect(() => {
    initializeSession();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        userType: user ? determineUserType(user) : null,
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
