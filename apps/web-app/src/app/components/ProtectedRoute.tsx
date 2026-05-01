import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import UnauthorizedPage from "@/app/Pages/UnauthorizedPage";
import { useQuery } from "@tanstack/react-query";
import { getMetadataByUserId } from "@/api/individual";

interface ProtectedRouteProps {
  /** Role strings that are allowed to access this route (case-insensitive).
   *  Omit to allow any authenticated user regardless of role. */
  allowedRoles?: string[];
  /** Optional children — render as a layout wrapper. Omit when used as a
   *  plain <Route element> so it falls through to <Outlet />. */
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user, accessToken, isLoading: isAuthLoading } = useAuth();
  const location = useLocation();

  const userType = localStorage.getItem("userType") || "individual";

  // Check individual metadata using React Query
  const { data: metadataRes, isLoading: isMetadataLoading } = useQuery({
    queryKey: ["userMetadata", user?.id || user?._id],
    queryFn: () => getMetadataByUserId(user?.id || user?._id),
    enabled: !!accessToken && userType === "individual" && !!(user?.id || user?._id),
    retry: false,
  });

  // Wait for the auth state and metadata check to resolve before making any access decision
  if (isAuthLoading || (userType === "individual" && isMetadataLoading && !!accessToken)) {
    return <LoadingScreen />;
  }

  // Not authenticated — redirect to sign-in
  if (!accessToken) {
    return <Navigate to="/sign-in" replace />;
  }

  // Role guard — only applied when allowedRoles is explicitly provided
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    (!user?.role || !allowedRoles.includes(user.role.toUpperCase()))
  ) {
    return <UnauthorizedPage />;
  }

  // ── Onboarding Checks ──

  // Admin Check
  if (
    userType === "organization" ||
    user?.role === "ORGANIZATION" ||
    user?.role === "ADMIN"
  ) {
    // If backend already provides isOnboarded, use it. Otherwise rely on organizationId check.
    if (user?.isOnboarded === false || (user?.isOnboarded === undefined && !user?.organizationId)) {
      if (location.pathname !== "/organization-onboarding") {
        return <Navigate to="/organization-onboarding" replace state={{ from: location }} />;
      }
    } else if (location.pathname === "/organization-onboarding") {
      // User is already onboarded, prevent access to onboarding page
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Individual Check
  if (userType === "individual") {
    // If backend already provides isOnboarded, use it. Otherwise rely on metadata check.
    if (user?.isOnboarded === false || (user?.isOnboarded === undefined && (!metadataRes?.success || !metadataRes?.data))) {
      if (location.pathname !== "/individual-onboarding") {
        return <Navigate to="/individual-onboarding" replace state={{ from: location }} />;
      }
    } else if (location.pathname === "/individual-onboarding") {
      // User is already onboarded, prevent access to onboarding page
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Authenticated (and authorised): render children when used as a
  // layout wrapper, or fall through to <Outlet /> when used as a route element
  return children ? <>{children}</> : <Outlet />;
}
