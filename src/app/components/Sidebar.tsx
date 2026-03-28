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
import { Link, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
 

interface SidebarProps {
  userType: "individual" | "organization";
}

const individualMenuItems = [
  { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: '/sunday-journal', label: 'Sunday Journal', icon: BookOpen },
  { id: '/daily-scripture', label: 'Daily Scripture', icon: Sparkles },
  { id: '/focus-timer', label: 'Focus Timer', icon: Timer },
  { id: '/settings', label: 'Settings', icon: Settings },
];

const organizationMenuItems = [
  { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: '/first-timers', label: 'First Timers', icon: UserPlus },
  { id: '/second-timers', label: 'Second Timers', icon: UserCheck },
  { id: '/salvation-records', label: 'Salvation Records', icon: Award },
  { id: '/communities', label: 'Communities', icon: Users },
  { id: '/prayer-requests', label: 'Prayer Requests', icon: Heart },
  { id: '/follow-ups', label: 'Follow Ups', icon: CheckCircle },
  { id: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({userType}: SidebarProps) {
  const { closeSidebar } = useLayout();
  const menuItems = userType === "individual" ? individualMenuItems : organizationMenuItems;
  const {pathname} = useLocation()
  
  return (
    <aside className="w-full bg-card flex flex-col h-full">
      {/* Logo & Close Button */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-foreground flex items-center gap-2 font-bold">
            <Sparkles className="w-6 h-6" style={{ color: '#d4a574' }} />
            <span>FaithCare</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {userType === "individual" ? "Personal Growth" : "Church Management"}
          </p>
        </div>
        <button 
          onClick={closeSidebar}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close Menu"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.id;
          
          return (
            <Link
              key={item.id}
              to={item.id}
              onClick={closeSidebar}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                isActive 
                  ? 'bg-sidebar-accent text-foreground font-medium shadow-sm' 
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-xl border border-border/50">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold shadow-sm">
            {userType === "individual" ? "J" : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground font-semibold truncate">
              {userType === "individual" ? "John Doe" : "Admin User"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {userType === "individual" ? "john@email.com" : "admin@church.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}