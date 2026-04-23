import {
  Bell,
  Search,
  Menu,
  Command,
  User,
  BookOpen,
  MessageSquare,
  Settings,
  UserPlus,
  Heart,
  Sparkles,
  TrendingUp,
  Timer,
  CheckCircle,
  UserCheck,
  Award,
  Users,
} from "lucide-react";
import { useLayout } from "../contexts/LayoutContext";
import * as React from "react";

// Icon mapping for serialization safety
const iconMap: Record<string, any> = {
  Heart,
  MessageSquare,
  UserPlus,
  Sparkles,
  BookOpen,
  TrendingUp,
  Timer,
  CheckCircle,
  UserCheck,
  Award,
};
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const {
    toggleSidebar,
    notifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    addNotification,
  } = useLayout();
  const [open, setOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const navigate = useNavigate();
  const userType =
    (localStorage.getItem("userType") as "individual" | "organization") ||
    "individual";

  // Keyboard shortcut for search
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Notifications are now dynamic and populated by system events

  const filteredNotifications = notifications.filter(
    (n) => n.type === userType,
  );
  const hasUnread = filteredNotifications.some((n) => n.status === "unread");
  const allRead =
    filteredNotifications.length > 0 &&
    filteredNotifications.every((n) => n.status === "read");

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
            <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 truncate hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Trigger */}
          <div
            onClick={() => setOpen(true)}
            className="relative hidden md:block cursor-pointer group"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            <div className="pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-muted-foreground w-48 lg:w-64 transition-all group-hover:border-accent/50 flex justify-between items-center">
              <span>Search...</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 hover:bg-muted rounded-lg transition-colors border border-border group"
          >
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            {(hasUnread || allRead) && (
              <span
                className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-card animate-pulse transition-colors duration-500 ${hasUnread ? "bg-red-500" : "bg-green-500"}`}
              ></span>
            )}
          </button>
        </div>
      </div>

      {/* Search Palette */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search or command..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                navigate("/dashboard");
                setOpen(false);
              }}
            >
              <Menu className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>

            {userType === "individual" && (
              <>
                <CommandItem
                  onSelect={() => {
                    navigate("/sunday-journal");
                    setOpen(false);
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Sunday Journal</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/daily-scripture");
                    setOpen(false);
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Daily Scripture</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/focus-timer");
                    setOpen(false);
                  }}
                >
                  <Timer className="mr-2 h-4 w-4" />
                  <span>Focus Timer</span>
                </CommandItem>
              </>
            )}

            {userType === "organization" && (
              <>
                <CommandItem
                  onSelect={() => {
                    navigate("/prayer-requests");
                    setOpen(false);
                  }}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Prayer Requests</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/first-timers");
                    setOpen(false);
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>First Timers</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/follow-ups");
                    setOpen(false);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Follow Ups</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/second-timers");
                    setOpen(false);
                  }}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Second Timers</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/salvation-records");
                    setOpen(false);
                  }}
                >
                  <Award className="mr-2 h-4 w-4" />
                  <span>Salvation Records</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    navigate("/communities");
                    setOpen(false);
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>Communities</span>
                </CommandItem>
              </>
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem
              onSelect={() => {
                navigate("/settings");
                setOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Notifications Drawer */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent side="right" className="w-[90%] sm:max-w-md p-0">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="text-xl font-bold">Notifications</SheetTitle>
            <SheetDescription>
              Stay updated with your latest church activities.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredNotifications.map((n) => {
                  const Icon = iconMap[n.icon as string] || Bell;
                  return (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-6 transition-colors cursor-pointer group relative ${n.status === "unread" ? "bg-accent/5" : "hover:bg-muted/30"}`}
                    >
                      {n.status === "unread" && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                      )}
                      <div className="flex gap-4">
                        <div
                          className={`w-10 h-10 rounded-full ${n.bg} flex items-center justify-center shrink-0`}
                        >
                          <Icon className={`w-5 h-5 ${n.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p
                              className={`text-sm font-semibold truncate group-hover:text-accent transition-colors ${n.status === "unread" ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {n.title}
                            </p>
                            <span className="text-[10px] text-muted-foreground uppercase whitespace-nowrap">
                              {n.time}
                            </span>
                          </div>
                          <p
                            className={`text-xs leading-relaxed ${n.status === "unread" ? "text-foreground/80" : "text-muted-foreground"}`}
                          >
                            {n.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground italic">
                  No new notifications
                </p>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-border mt-auto">
            <button
              onClick={() => {
                markAllNotificationsAsRead();
                setShowNotifications(false);
              }}
              className="w-full py-3 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Mark all as read
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
