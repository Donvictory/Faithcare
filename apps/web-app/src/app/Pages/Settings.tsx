import { useLayout } from "../contexts/LayoutContext";
import { useState, useEffect } from "react";
import { User, Bell, Lock, Palette, Globe, LogOut } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { Card } from "../components/ui/card";

export function Settings() {
  const { setHeader } = useLayout();
  useEffect(() => {
    setHeader("Settings", "Manage your account and preferences");
  }, []);

  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  // Sync theme with document class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const userName = user?.fullName || user?.name || "Admin User";
  const userEmail = user?.email || "admin@faithcare.com";
  const userRole =
    user?.role ||
    (user?.organizationName ? "Organization Admin" : "Individual User");

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-foreground">Profile Settings</h3>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-all border border-destructive/20 sm:border-transparent"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={userName}
              className="w-full px-4 py-3 bg-muted/30 border-2 border-transparent focus:border-accent rounded-xl outline-none transition-all text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              defaultValue={userEmail}
              className="w-full px-4 py-3 bg-muted/30 border-2 border-transparent focus:border-accent rounded-xl outline-none transition-all text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block uppercase tracking-wider">
              Account Type
            </label>
            <input
              type="text"
              defaultValue={userRole}
              readOnly
              className="w-full px-4 py-3 bg-muted/10 border-2 border-transparent rounded-xl text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-accent" />
          <h3 className="text-foreground font-bold">Appearance</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block uppercase tracking-wider">
              Theme Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all text-sm sm:text-base ${
                  theme === "light"
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-border hover:border-accent/40 text-muted-foreground"
                }`}
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                Light Mode
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all text-sm sm:text-base ${
                  theme === "dark"
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-border hover:border-accent/40 text-muted-foreground"
                }`}
              >
                <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                Dark Mode
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-accent" />
          <h3 className="text-foreground font-bold">Notifications</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive real-time updates about your activities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground">Email Digest</p>
              <p className="text-sm text-muted-foreground">
                Weekly summary of your spiritual growth progress
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-accent" />
          <h3 className="text-foreground font-bold">Security</h3>
        </div>
        <div className="space-y-4">
          <button className="w-full px-6 py-4 bg-muted/30 border-2 border-transparent hover:border-accent/40 rounded-xl transition-all text-left text-foreground flex items-center justify-between group">
            Change Password
            <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-border">
              <Globe className="w-4 h-4 text-accent" />
            </div>
          </button>
          <button className="w-full px-6 py-4 bg-muted/30 border-2 border-transparent hover:border-accent/40 rounded-xl transition-all text-left text-foreground flex items-center justify-between group">
            Two-Factor Authentication
            <span className="px-3 py-1 bg-warning/10 text-warning text-[10px] uppercase rounded-full">
              Recommended
            </span>
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center sm:justify-end pt-4 pb-8">
        <button className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 font-bold">
          Save All Changes
        </button>
      </div>
    </div>
  );
}
