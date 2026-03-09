import { User, Bell, Lock, Palette, Globe } from "lucide-react";

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-accent" />
          <h3 className="text-foreground">Profile Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Admin User"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="admin@faithcare.com"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Role
            </label>
            <input
              type="text"
              defaultValue="Church Administrator"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-accent" />
          <h3 className="text-foreground">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground">New First Timers</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications for new first timer registrations
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground">Prayer Requests</p>
              <p className="text-sm text-muted-foreground">
                Get notified when new prayer requests are submitted
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground">Follow Up Reminders</p>
              <p className="text-sm text-muted-foreground">
                Daily reminders for pending follow ups
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-accent" />
          <h3 className="text-foreground">Security</h3>
        </div>
        <div className="space-y-4">
          <button className="w-full px-4 py-3 bg-input-background border border-border rounded-lg hover:bg-muted transition-colors text-left text-foreground">
            Change Password
          </button>
          <button className="w-full px-4 py-3 bg-input-background border border-border rounded-lg hover:bg-muted transition-colors text-left text-foreground">
            Enable Two-Factor Authentication
          </button>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-accent" />
          <h3 className="text-foreground">Appearance</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Theme
            </label>
            <select className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground">
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="text-foreground">Language & Region</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Language
            </label>
            <select className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Time Zone
            </label>
            <select className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground">
              <option>Pacific Time (PT)</option>
              <option>Mountain Time (MT)</option>
              <option>Central Time (CT)</option>
              <option>Eastern Time (ET)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
