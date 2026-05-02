import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignIn } from "./Pages/SignIn";
import { LandingPage } from "./Pages/LandingPage";
import { SignUpChoice } from "./Pages/SignUpChoice";
import { OrganizationOnboarding } from "./Pages/OrganizationOnboarding";
import { IndividualOnboarding } from "./Pages/IndividualOnboarding";
import ForgotPassword from "./Pages/ForgotPassword";
import { Settings } from "./Pages/Settings";
import SignUpIndividual from "./Pages/SignUpIndividual";
import SignUpOrganization from "./Pages/SignUpOrganization";
import AppLayout from "./Layouts/AppLayout";
import Dashboard from "./Pages/Dashboard";
import OTPVerification from "./Pages/OTPVerification";

import { ChangePassword } from "./Pages/ChangePassword";

import { SundayJournal } from "./components/SundayJournal";
import { DailyScripture } from "./components/DailyScripture";
import { PrayerRequests } from "./components/PrayerRequests";
import { FocusTimer } from "./components/FocusTimer";
import { FirstTimersManagement } from "./components/FirstTimersManagement";
import { FollowUps } from "./components/FollowUps";
import { SalvationRecords } from "./components/SalvationRecords";
import { SecondTimers } from "./components/SecondTimers";
import { Communities } from "./components/Communities";
import { BulkMessaging } from "./components/BulkMessaging";

import AuthProvider from "./providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./Pages/NotFoundPage";
import UnauthorizedPage from "./Pages/UnauthorizedPage";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <AuthProvider>
        <Routes>
          {/* â”€â”€ Public routes â”€â”€ */}
          <Route path="/" element={<LandingPage />} />

          <Route element={<GuestRoute />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up-individual" element={<SignUpIndividual />} />
            <Route
              path="/sign-up-organization"
              element={<SignUpOrganization />}
            />
            <Route path="/sign-up-choice" element={<SignUpChoice />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/individual-onboarding"
              element={<IndividualOnboarding />}
            />
            <Route
              path="/organization-onboarding"
              element={<OrganizationOnboarding />}
            />
          </Route>

          {/* â”€â”€ Protected routes â€” AppLayout handles auth guard + renders Sidebar/Header â”€â”€ */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/settings/change-password"
              element={<ChangePassword />}
            />

            {/* Individual */}
            <Route path="/sunday-journal" element={<SundayJournal />} />
            <Route path="/daily-scripture" element={<DailyScripture />} />
            <Route path="/focus-timer" element={<FocusTimer />} />

            {/* Organization */}
            <Route path="/first-timers" element={<FirstTimersManagement />} />
            <Route path="/second-timers" element={<SecondTimers />} />
            <Route path="/salvation-records" element={<SalvationRecords />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/prayer-requests" element={<PrayerRequests />} />
            <Route path="/follow-ups" element={<FollowUps />} />
            <Route path="/bulk-messaging" element={<BulkMessaging />} />
          </Route>

          {/* â”€â”€ Fallbacks â”€â”€ */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
