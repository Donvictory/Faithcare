import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import UnauthorizedPage from "@/app/Pages/UnauthorizedPage";
import { useQuery } from "@tanstack/react-query";
import { getMetadataByUserId } from "@/api/individual";
import { LoadingScreen } from "./LoadingScreen";

interface ProtectedRouteProps {
  /** Role strings that are allowed to access this route (case-insensitive).
   *  Omit to allow any authenticated user regardless of role. */
  allowedRoles?: string[];
  /** Optional children â€” render as a layout wrapper. Omit when used as a
   *  plain <Route element> so it falls through to <Outlet />. */
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user, accessToken, isLoading: isAuthLoading, userType } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute check:", { 
    path: location.pathname, 
    isLoading: isAuthLoading, 
    hasToken: !!accessToken, 
    hasUser: !!user,
    userType
  });

  // Wait for auth state to resolve before deciding
  if (isAuthLoading) {
    return null; // Or a smaller spinner if preferred, but null is consistent with GuestRoute
  }

  // Not authenticated or user data missing â€” redirect to sign-in
  if (!accessToken || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Role guard â€” only applied when allowedRoles is explicitly provided
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    (!user?.role || !allowedRoles.includes(user.role.toUpperCase()))
  ) {
    return <UnauthorizedPage />;
  }

  // â”€â”€ Onboarding Checks â”€â”€
  const isOnboarded = user?.isOnboarded;

  // Organization Onboarding
  if (userType === "organization") {
    if (isOnboarded === false || (isOnboarded === undefined && !user?.organizationId)) {
      if (location.pathname !== "/organization-onboarding") {
        return <Navigate to="/organization-onboarding" replace state={{ from: location }} />;
      }
    } else if (location.pathname === "/organization-onboarding") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Individual Onboarding
  if (userType === "individual") {
    if (isOnboarded === false) {
      if (location.pathname !== "/individual-onboarding") {
        return <Navigate to="/individual-onboarding" replace state={{ from: location }} />;
      }
    } else if (isOnboarded === true && location.pathname === "/individual-onboarding") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
