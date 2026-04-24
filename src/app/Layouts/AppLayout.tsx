import React from "react";
import { Sidebar } from "../components/Sidebar";
import { LayoutProvider, useLayout } from "../contexts/LayoutContext";
import { SearchProvider } from "../contexts/SearchContext";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../components/LoadingScreen";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, closeSidebar } = useLayout();
  const { accessToken, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Global theme persistence
  React.useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Authentication Guard
  React.useEffect(() => {
    if (!isLoading && !accessToken) {
      navigate("/");
    }
  }, [accessToken, isLoading, navigate]);

  if (isLoading) {
    // Try to get church name from stored user data for the loading screen
    let churchName = "FaithCare";
    try {
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        churchName = parsed.churchName || parsed.organizationName || "FaithCare";
      }
    } catch (e) {
      // ignore
    }

    return <LoadingScreen churchName={churchName} />;
  }

  if (!accessToken) return null;

  const userType = (localStorage.getItem("userType") as "individual" | "organization") || "individual";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - responsive */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-[70] transition-transform duration-300 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        w-64 bg-card border-r border-border
      `}
      >
        <Sidebar userType={userType} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <SearchProvider>
        <LayoutContent>{children}</LayoutContent>
      </SearchProvider>
    </LayoutProvider>
  );
}
