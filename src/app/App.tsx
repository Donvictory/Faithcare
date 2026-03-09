import { useState } from "react";
import { SignIn } from "./components/SignIn";
import { SignUpChoice } from "./components/SignUpChoice";
import { SignUp } from "./components/SignUp";
import { Onboarding } from "./components/Onboarding";
import { IndividualOnboarding } from "./components/IndividualOnboarding";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { IndividualDashboard } from "./components/IndividualDashboard";
import { OrganizationDashboard } from "./components/OrganizationDashboard";
import { FirstTimersManagement } from "./components/FirstTimersManagement";
import { SecondTimers } from "./components/SecondTimers";
import { SalvationRecords } from "./components/SalvationRecords";
import { Communities } from "./components/Communities";
import { PrayerRequests } from "./components/PrayerRequests";
import { FollowUps } from "./components/FollowUps";
import { SundayJournal } from "./components/SundayJournal";
import { DailyScripture } from "./components/DailyScripture";
import { FocusTimer } from "./components/FocusTimer";
import { Settings } from "./components/Settings";

type AppState = "sign-in" | "sign-up-choice" | "sign-up" | "individual-onboarding" | "organization-onboarding" | "dashboard";
type UserType = "individual" | "organization";

export default function App() {
  const [appState, setAppState] = useState<AppState>("sign-in");
  const [userType, setUserType] = useState<UserType>("individual");
  const [activeSection, setActiveSection] = useState("dashboard");

  // Authentication handlers
  const handleSignIn = () => {
    // In a real app, this would validate credentials and determine user type
    // For demo, we'll default to individual
    setUserType("individual");
    setAppState("dashboard");
  };

  const handleChooseIndividual = () => {
    setUserType("individual");
    setAppState("sign-up");
  };

  const handleChooseOrganization = () => {
    setUserType("organization");
    setAppState("sign-up");
  };

  const handleSignUp = () => {
    // After successful sign up, go to appropriate onboarding
    if (userType === "individual") {
      setAppState("individual-onboarding");
    } else {
      setAppState("organization-onboarding");
    }
  };

  const handleOnboardingComplete = () => {
    // After onboarding, go to dashboard
    setAppState("dashboard");
    setActiveSection("dashboard");
  };

  // Show authentication screens
  if (appState === "sign-in") {
    return (
      <SignIn
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => setAppState("sign-up-choice")}
      />
    );
  }

  if (appState === "sign-up-choice") {
    return (
      <SignUpChoice
        onChooseIndividual={handleChooseIndividual}
        onChooseOrganization={handleChooseOrganization}
        onBackToSignIn={() => setAppState("sign-in")}
      />
    );
  }

  if (appState === "sign-up") {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => setAppState("sign-in")}
      />
    );
  }

  if (appState === "individual-onboarding") {
    return <IndividualOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (appState === "organization-onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Main dashboard content - different based on user type
  const renderContent = () => {
    // Individual user routes
    if (userType === "individual") {
      switch (activeSection) {
        case "dashboard":
          return (
            <>
              <Header 
                title="Dashboard" 
                subtitle="Your personal spiritual growth journey"
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <IndividualDashboard />
              </main>
            </>
          );
        
        case "sunday-journal":
          return (
            <>
              <Header 
                title="Sunday Journal" 
                subtitle="Reflect on this week's message and what God is teaching you."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <SundayJournal />
              </main>
            </>
          );
        
        case "daily-scripture":
          return (
            <>
              <Header 
                title="Daily Scripture" 
                subtitle="Start your day with God's Word."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <DailyScripture />
              </main>
            </>
          );
        
        case "focus-timer":
          return (
            <>
              <Header 
                title="Focus Timer" 
                subtitle="Stay focused and productive with intentional work sessions."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <FocusTimer />
              </main>
            </>
          );
        
        case "settings":
          return (
            <>
              <Header 
                title="Settings" 
                subtitle="Manage your account and preferences."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <Settings />
              </main>
            </>
          );
        
        default:
          return null;
      }
    }

    // Organization user routes
    if (userType === "organization") {
      switch (activeSection) {
        case "dashboard":
          return (
            <>
              <Header 
                title="Dashboard" 
                subtitle="Welcome back! Here's what's happening in your community."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <OrganizationDashboard />
              </main>
            </>
          );
        
        case "first-timers":
          return (
            <>
              <Header 
                title="First Timers" 
                subtitle="Manage and follow up with new visitors to your church."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <FirstTimersManagement />
              </main>
            </>
          );
        
        case "second-timers":
          return (
            <>
              <Header 
                title="Second Timers" 
                subtitle="Manage and follow up with visitors who have returned to your church."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <SecondTimers />
              </main>
            </>
          );
        
        case "salvation-records":
          return (
            <>
              <Header 
                title="Salvation Records" 
                subtitle="Track and manage the salvation records of your church members."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <SalvationRecords />
              </main>
            </>
          );
        
        case "communities":
          return (
            <>
              <Header 
                title="Communities" 
                subtitle="Manage and organize the different communities within your church."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <Communities />
              </main>
            </>
          );
        
        case "prayer-requests":
          return (
            <>
              <Header 
                title="Prayer Requests" 
                subtitle="Stay connected with your community's prayer needs."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <PrayerRequests />
              </main>
            </>
          );
        
        case "follow-ups":
          return (
            <>
              <Header 
                title="Follow Ups" 
                subtitle="Keep track of pending follow ups and connections."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <FollowUps />
              </main>
            </>
          );
        
        case "settings":
          return (
            <>
              <Header 
                title="Settings" 
                subtitle="Manage your account and preferences."
              />
              <main className="flex-1 p-8 overflow-y-auto">
                <Settings />
              </main>
            </>
          );
        
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        userType={userType}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}