import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background max-w-xl mx-auto px-4">
      <Logo size="large" />
      <h1 className="text-4xl font-bold text-red-800/80 mb-4 mt-4">
        Page not found
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        Oops! It seems this page has journeyed elsewhere. But don't worry, your
        path to spiritual growth is still here.
      </p>
      <button
        onClick={() => navigate("/")}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  );
}
