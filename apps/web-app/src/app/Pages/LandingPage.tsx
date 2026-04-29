import { useEffect } from "react";
import { LoadingScreen } from "../components/LoadingScreen";

export function LandingPage() {
  const landingPage = import.meta.env.VITE_LANDING_PAGE_URL;

  useEffect(() => {
    if (landingPage) {
      window.location.href = landingPage;
    }
  }, [landingPage]);

  return <LoadingScreen />;
}
