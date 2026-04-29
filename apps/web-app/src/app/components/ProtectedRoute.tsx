import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import UnauthorizedPage from "@/app/Pages/UnauthorizedPage";

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
  const { user, accessToken, isLoading } = useAuth();

  // Wait for the auth state to resolve before making any access decision
  if (isLoading) {
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

  // Authenticated (and authorised): render children when used as a
  // layout wrapper, or fall through to <Outlet /> when used as a route element
  return children ? <>{children}</> : <Outlet />;
}
