import { Bell, Search, Menu } from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { toggleSidebar } = useLayout();

  return (
    <header className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 w-full sticky top-0 z-50 shadow-sm backdrop-blur-md bg-card/95">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors border border-border"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring w-48 lg:w-64 transition-all"
            />
          </div>
          
          <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors border border-border">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-card" style={{ backgroundColor: '#22c55e' }}></span>
          </button>
        </div>
      </div>
    </header>
  );
}
