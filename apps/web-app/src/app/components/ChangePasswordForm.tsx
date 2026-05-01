import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { changePassword } from "@/api/auth";
import ErrorMessage from "./ui/error-message";

export function ChangePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    const res = await changePassword({
      currentPassword,
      newPassword,
    });
    setIsLoading(false);

    if (res.success) {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (onSuccess) onSuccess();
    } else {
      setErrorMsg(res.error || "Failed to change password.");
      toast.error(res.error || "Failed to change password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && <ErrorMessage message={errorMsg} />}
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-4 bg-secondary/30 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-4 bg-secondary/30 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground"
              placeholder="Create new password"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-4 bg-secondary/30 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Changing Password...
          </>
        ) : (
          "Change Password"
        )}
      </button>
    </form>
  );
}
