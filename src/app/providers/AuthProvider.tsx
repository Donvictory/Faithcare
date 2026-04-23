import { createContext, useContext, useState, useEffect } from "react";
import {
  refreshToken as callRefreshTokenAPI,
  logout as callLogoutAPI,
} from "@/api/auth";
import { useQueryClient } from "@tanstack/react-query";

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
    if (userData?.organizationId || userData?.role === 'ADMIN' || userData?.role === 'ORGANIZATION' || userData?.organizationName) {
      return "organization";
    }
    return "individual";
  };

  // Helper to get the correct storage based on rememberMe
  const getStorage = () => {
    return localStorage.getItem("rememberMe") === "true" ? localStorage : sessionStorage;
  };

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    const storage = getStorage();
    if (token) {
      storage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
    }
  };

  const setUser = (userData: any) => {
    setUserState(userData);
    const storage = getStorage();
    if (userData) {
      storage.setItem("user", JSON.stringify(userData));
      // Sync userType whenever user is set
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
    // These will now trigger storage updates via the wrappers above
    setAccessToken(token);
    setUser(userData);
  };

  const switchOrganization = async (orgId: string) => {
    try {
      const { switchOrganization: callSwitchOrgAPI } = await import("@/api/auth");
      const result = await callSwitchOrgAPI(orgId);
      if (result.success && result.data) {
        // Update user and token with new organization data
        const remember = localStorage.getItem("rememberMe") === "true";
        login(result.data.user, result.data.accessToken, remember);
        queryClient.clear(); // Clear cache after switching
      } else {
        throw new Error(result.error || "Failed to switch organization");
      }
    } catch (error) {
      console.error("Switch organization failed", error);
      throw error;
    }
  };

  const initializeSession = async (hasStoredSession = false) => {
    try {
      const result = await callRefreshTokenAPI();
      if (result.success && result.data?.data) {
        // Use login to update everything consistently
        const remember = localStorage.getItem("rememberMe") === "true";
        login(result.data.data.user, result.data.data.accessToken, remember);
      } else {
        if (!hasStoredSession) {
          await logout();
        }
      }
    } catch (error) {
      console.error("Failed to initialize session", error);
      if (!hasStoredSession) {
        await logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await callLogoutAPI();
    } catch (error) {
      console.warn("API logout call failed, cleaning up local session", error);
    } finally {
      setAccessTokenState(null);
      setUserState(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("userType");
      localStorage.removeItem("pendingEmail");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      
      // Clear query cache to prevent data leakage between accounts
      queryClient.clear();
    }
  };

  useEffect(() => {
    const storedToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAccessTokenState(storedToken);
        setUserState(parsedUser);
        
        // Sync userType on load
        const userType = determineUserType(parsedUser);
        localStorage.setItem("userType", userType);

        setIsLoading(false);
        initializeSession(true);
      } catch (e) {
        console.error("Error parsing stored user data", e);
        logout();
      }
    } else {
      initializeSession(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setUser, setAccessToken, login, isLoading, logout, switchOrganization }}
    >
      {!isLoading && children}
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
