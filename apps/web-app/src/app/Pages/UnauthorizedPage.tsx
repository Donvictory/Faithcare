import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background max-w-xl mx-auto px-4">
      <Logo size="large" />
      <h1 className="text-4xl font-bold text-red-800/80 mb-4 mt-4">
        Unauthorized Access
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        You do not have the necessary permissions to access this page. Please
        contact the administrator if you believe this is an error.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
