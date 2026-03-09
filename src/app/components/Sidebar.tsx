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
  Users
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userType: "individual" | "organization";
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

export function Sidebar({ activeSection, onSectionChange, userType }: SidebarProps) {
  const menuItems = userType === "individual" ? individualMenuItems : organizationMenuItems;
  
  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6" style={{ color: '#d4a574' }} />
          <span>FaithCare</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {userType === "individual" ? "Personal Growth" : "Church Management"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
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
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
            {userType === "individual" ? "J" : "A"}
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground">
              {userType === "individual" ? "John Doe" : "Admin User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {userType === "individual" ? "john@email.com" : "admin@church.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}