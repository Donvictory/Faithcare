import { Bell, Search, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

export function Header({ title, subtitle, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 md:px-8 py-4 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button 
            onClick={onMenuToggle}
            className="p-2 -ml-2 hover:bg-muted rounded-lg md:hidden text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4">
        {/* Search */}
        <div className="relative flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"></span>
        </button>
      </div>
    </header>
  );
}
