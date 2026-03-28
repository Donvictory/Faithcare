import React, { createContext, useContext, useState } from 'react';

interface LayoutContextType {
  title: string;
  subtitle?: string;
  setHeader: (title: string, subtitle?: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitleState] = useState('Dashboard');
  const [subtitle, setSubtitleState] = useState<string | undefined>('Welcome back');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const setHeader = (newTitle: string, newSubtitle?: string) => {
    setTitleState(newTitle);
    setSubtitleState(newSubtitle);
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <LayoutContext.Provider value={{
      title,
      subtitle,
      setHeader,
      isSidebarOpen,
      toggleSidebar,
      closeSidebar
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
