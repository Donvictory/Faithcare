import { 
  LayoutDashboard, 
  UserPlus, 
  Heart, 
  CheckCircle, 
  BookOpen, 
  Sparkles, 
  Timer, 
  Settings,
  Award,
  UserCheck,
  Users,
  X
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userType: "individual" | "organization";
  isOpen: boolean;
  onClose: () => void;
}

const individualMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sunday-journal', label: 'Sunday Journal', icon: BookOpen },
  { id: 'daily-scripture', label: 'Daily Scripture', icon: Sparkles },
  { id: 'focus-timer', label: 'Focus Timer', icon: Timer },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const organizationMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'first-timers', label: 'First Timers', icon: UserPlus },
  { id: 'second-timers', label: 'Second Timers', icon: UserCheck },
  { id: 'salvation-records', label: 'Salvation Records', icon: Award },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'prayer-requests', label: 'Prayer Requests', icon: Heart },
  { id: 'follow-ups', label: 'Follow Ups', icon: CheckCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange, userType, isOpen, onClose }: SidebarProps) {
  const menuItems = userType === "individual" ? individualMenuItems : organizationMenuItems;
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar sidebar transition classes */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border h-screen flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#d4a574' }} />
              <span className="font-semibold text-lg md:text-xl">FaithCare</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {userType === "individual" ? "Personal Growth" : "Church Management"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 md:hidden hover:bg-muted text-muted-foreground rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto w-full">
          {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 rounded-lg transition-colors text-sm md:text-base ${
                  isActive 
                    ? 'bg-sidebar-accent text-foreground' 
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-3 md:px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm flex-shrink-0">
            {userType === "individual" ? "J" : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {userType === "individual" ? "John Doe" : "Admin User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userType === "individual" ? "john@email.com" : "admin@church.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  </>
  );
}