import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

interface GuestRouteProps {
  children?: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { accessToken, isLoading } = useAuth();
  const location = useLocation();


  if (accessToken) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
