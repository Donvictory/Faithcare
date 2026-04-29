import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  User,
  Mail,
  MapPin,
  Check,
  Loader2,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { completeIndividualOnboarding } from "@/api/individual";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import Logo from "../components/Logo";

export function IndividualOnboarding() {
  const { user, accessToken } = useAuth();
  const userId = user?.id || user?._id || user?.userId || "";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    location: "",
    churchId: "",
    churchName: "",
    goals: [] as string[],
  });

  const goalOptions = [
    { label: "Daily Bible reading", key: "dailyBibleReading" },
    { label: "Daily prayer", key: "dailyPrayer" },
    { label: "Consistent prayer life", key: "consistentPrayerLife" },
    { label: "Scripture memorization", key: "scriptureMemorization" },
    { label: "Spiritual journaling", key: "scripturalJournaling" },
    { label: "Better time management", key: "betterTimeManagement" },
    { label: "Deeper faith", key: "deeperFaith" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleGoal = (goalKey: string) => {
    if (formData.goals.includes(goalKey)) {
      setFormData({
        ...formData,
        goals: formData.goals.filter((g) => g !== goalKey),
      });
    } else {
      setFormData({
        ...formData,
        goals: [...formData.goals, goalKey],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const spiritualGoals = {
      dailyBibleReading: formData.goals.includes("dailyBibleReading"),
      dailyPrayer: formData.goals.includes("dailyPrayer"),
      consistentPrayerLife: formData.goals.includes("consistentPrayerLife"),
      scriptureMemorization: formData.goals.includes("scriptureMemorization"),
      scripturalJournaling: formData.goals.includes("scripturalJournaling"),
      betterTimeManagement: formData.goals.includes("betterTimeManagement"),
      deeperFaith: formData.goals.includes("deeperFaith"),
    };

    const payload = {
      userId: user?.id || user?._id || user?.userId || "",
      location: formData.location,
      organization: formData.churchId || "64a1f2c3e4b5d6e7f8a9b0c1", // Fallback ID
      churchName: formData.churchName,
      spiritualGoals: [spiritualGoals],
      dailyBibleReadingStreakCount: 0,
    };

    const res = await completeIndividualOnboarding(payload);

    if (res.success) {
      toast.success("Welcome to FaithCare!");
      navigate("/dashboard");
    } else {
      toast.error(res.error || "Failed to complete setup");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Left Side - Info */}
      <div className="hidden lg:flex flex-col w-[400px] bg-gradient-to-br from-secondary/50 via-secondary/30 to-background p-16 border-r border-border/40 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="mb-16 relative z-10">
          <Logo />
          <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight">
            Start your journey
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed opacity-70">
            Personalize your experience so we can help you stay consistent in
            your walk with God.
          </p>
        </div>

        <div className="space-y-10 flex-1 relative z-10">
          <div className="bg-card/50 rounded-3xl p-8 border border-border/40 shadow-inner space-y-6 backdrop-blur-sm group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-xl shadow-emerald-500/5 group-hover:scale-110 transition-transform">
              <Check className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-foreground tracking-tight">
                Stay Consistent
              </h4>
              <p className="text-sm font-bold text-muted-foreground leading-relaxed opacity-70">
                Track your spiritual streaks and build meaningful daily habits
                that last a lifetime.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto relative z-10">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">
            Your path to spiritual growth begins here.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64 opacity-30" />
        <div className="w-full max-w-2xl relative z-10">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
              Tell us about yourself
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed opacity-70">
              We'll use these intentional details to tailor your daily
              devotionals and focus areas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 opacity-60">
                  Location
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors opacity-60" />
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Nigeria"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full pl-14 pr-6 py-5 bg-secondary/30 border border-border/60 focus:border-accent focus:ring-4 focus:ring-accent/5 rounded-[24px] outline-none transition-all text-foreground font-bold tracking-tight text-lg"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 opacity-60">
                  Your Church
                </label>
                <div className="relative group">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors opacity-60" />
                  <input
                    type="text"
                    placeholder="e.g. Grace Chapel"
                    value={formData.churchName}
                    onChange={(e) =>
                      handleInputChange("churchName", e.target.value)
                    }
                    className="w-full pl-14 pr-6 py-5 bg-secondary/30 border border-border/60 focus:border-accent focus:ring-4 focus:ring-accent/5 rounded-[24px] outline-none transition-all text-foreground font-bold tracking-tight text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 opacity-60">
                  Spiritual Intentions
                </label>
                <p className="text-sm font-bold text-muted-foreground opacity-40 italic">
                  Select as many as resonate with your current walk...
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.key}
                    type="button"
                    onClick={() => toggleGoal(goal.key)}
                    className={`p-6 rounded-[28px] border-2 transition-all text-left flex items-center justify-between group relative overflow-hidden active:scale-95 ${
                      formData.goals.includes(goal.key)
                        ? "border-accent bg-accent/5 ring-4 ring-accent/5"
                        : "border-border/60 hover:border-accent/40 bg-card/40"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold tracking-tight transition-colors ${formData.goals.includes(goal.key) ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                    >
                      {goal.label}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${formData.goals.includes(goal.key) ? "bg-accent border-accent rotate-0 scale-100" : "border-muted group-hover:border-accent/40 rotate-90 scale-90"}`}
                    >
                      {formData.goals.includes(goal.key) && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full flex items-center justify-center gap-4 px-10 py-6 bg-primary text-primary-foreground rounded-[28px] hover:bg-primary/90 transition-all font-bold shadow-2xl shadow-primary/20 active:scale-95 disabled:opacity-50 group mt-8"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-lg uppercase tracking-widest">
                    Begin Your Journey
                  </span>
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
