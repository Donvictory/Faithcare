 
import { BrowserRouter , Route, Routes } from "react-router-dom";
import { SignIn } from "./Pages/SignIn";
import { SignUpChoice } from "./Pages/SignUpChoice";
import { OrganizationOnboarding } from "./Pages/OrganizationOnboarding";
import { IndividualOnboarding } from "./Pages/IndividualOnboarding";
import ForgotPassword from "./Pages/ForgotPassword";
import { Settings } from "./Pages/Settings";
import SignUpIndividual from "./Pages/SignUpIndividual";
import SignUpOrganization from "./Pages/SignUpOrganization";
import AppLayout from "./Layouts/AppLayout";
import Dashboard from "./Pages/Dashboard";
import { SundayJournal } from "./components/SundayJournal";
import { DailyScripture } from "./components/DailyScripture";
import { PrayerRequests } from "./components/PrayerRequests";
import { FocusTimer } from "./components/FocusTimer";
import { FirstTimersManagement } from "./components/FirstTimersManagement";
import { FollowUps } from "./components/FollowUps";
import { SalvationRecords } from "./components/SalvationRecords";
import { SecondTimers } from "./components/SecondTimers";
import { Communities } from "./components/Communities";



export default function App() {
 return (
     <BrowserRouter>
      
     <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up-individual" element={<SignUpIndividual />} />
      <Route path="/sign-up-organization" element={<SignUpOrganization />} />
      <Route path="/sign-up-choice" element={<SignUpChoice  />} />
      <Route path="/individual-onboarding" element={<IndividualOnboarding/>} />
      <Route path="/organization-onboarding" element={<OrganizationOnboarding />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      <Route path="/dashboard" element={<AppLayout><Dashboard  /></AppLayout>} />
      <Route path="/sunday-journal" element={<AppLayout><SundayJournal  /></AppLayout>} />
      <Route path="/daily-scripture" element={<AppLayout><DailyScripture  /></AppLayout>} />
      <Route path="/prayer-requests" element={<AppLayout><PrayerRequests  /></AppLayout>} />
      <Route path="/focus-timer" element={<AppLayout><FocusTimer  /></AppLayout>} />
      <Route path="/first-timers" element={<AppLayout><FirstTimersManagement  /></AppLayout>} />
      <Route path="/follow-ups" element={<AppLayout><FollowUps  /></AppLayout>} />
      <Route path="/second-timers" element={<AppLayout><SecondTimers  /></AppLayout>} />
      <Route path="/salvation-records" element={<AppLayout><SalvationRecords  /></AppLayout>} />
      <Route path="/communities" element={<AppLayout><Communities  /></AppLayout>} />
     </Routes>

     </BrowserRouter>
  )
}
      
 
  