import React from 'react'
import { Sidebar } from '../components/Sidebar'
import { LayoutProvider, useLayout } from '../contexts/LayoutContext'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, closeSidebar } = useLayout();

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - responsive */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-[70] transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 bg-card border-r border-border
      `}>
        <Sidebar userType={(localStorage.getItem('userType') as "individual" | "organization") || "individual"} />
      </div>

      <div className='flex-1 flex flex-col min-w-0'>
        <main className='flex-1 overflow-y-auto overflow-x-hidden'>
            {children}
        </main>
      </div>
    </div>
  )
}


export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  )
}
