import { createContext, useContext, useState, useEffect } from "react";
import { refreshToken as callRefreshTokenAPI, logout as callLogoutAPI } from "@/api/auth";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  setUser: (user: any) => void;
  setAccessToken: (token: string | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeSession = async (hasStoredSession = false) => {
    try {
      const result = await callRefreshTokenAPI();
      if (result.success && result.data?.data) {
        setAccessToken(result.data.data.accessToken);
        setUser(result.data.data.user);

        // Update storage so the session stays fresh
        if (localStorage.getItem("rememberMe") === "true") {
          if (result.data.data.accessToken)
            localStorage.setItem("accessToken", result.data.data.accessToken);
          if (result.data.data.user)
            localStorage.setItem("user", JSON.stringify(result.data.data.user));
        } else {
          if (result.data.data.accessToken)
            sessionStorage.setItem("accessToken", result.data.data.accessToken);
          if (result.data.data.user)
            sessionStorage.setItem("user", JSON.stringify(result.data.data.user));
        }
      } else {
        // Only log out if there is NO existing stored session to fall back on.
        // A freshly signed-up user has a valid access token in storage but
        // no refresh cookie yet — calling logout() here would erase their session.
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
      console.error("API logout failed", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
    }
  };

  useEffect(() => {
    // Check if we already have a stored session
    const storedToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        // Immediately hydrate context from storage so the UI renders fast
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsLoading(false);

        // Then try to refresh in the background.
        // Pass hasStoredSession=true — if the refresh fails (e.g. no cookie yet
        // after a fresh sign-up) we keep the stored token rather than logging out.
        initializeSession(true);
      } catch (e) {
        console.error("Error parsing stored user data", e);
        logout();
        initializeSession(false);
      }
    } else {
      // No stored session at all — must refresh or redirect to login
      initializeSession(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setUser, setAccessToken, isLoading, logout }}
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
