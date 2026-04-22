import React, { useState } from "react";
import { Sparkles, ArrowRight, User, Mail, MapPin, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { completeIndividualOnboarding } from "@/api/individual";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";

export function IndividualOnboarding() {
  const { user, accessToken } = useAuth();
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
      userId: user?.id || "",
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
      <div className="hidden lg:flex flex-col w-96 bg-gradient-to-br from-accent/20 via-accent/10 to-background p-12 border-r border-border">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-8 h-8 text-accent shadow-sm" />
            <h1 className="text-foreground font-bold tracking-tight">FaithCare</h1>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Start your journey</h2>
          <p className="text-muted-foreground leading-relaxed">
            Personalize your experience so we can help you stay consistent in your walk with God.
          </p>
        </div>

        <div className="space-y-6 flex-1">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
             <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Check className="w-5 h-5 text-accent" />
             </div>
             <h4 className="font-bold text-foreground mb-1">Stay Consistent</h4>
             <p className="text-xs text-muted-foreground">Track your streaks and daily habits.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-xl">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-foreground mb-3">Tell us about yourself</h2>
            <p className="text-muted-foreground">We'll use this to tailor your daily devotionals.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Lagos, Nigeria"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Your Church</label>
                <input
                  type="text"
                  placeholder="e.g. Grace Chapel"
                  value={formData.churchName}
                  onChange={(e) => handleInputChange("churchName", e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">What are your spiritual goals?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.key}
                    type="button"
                    onClick={() => toggleGoal(goal.key)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between group ${
                      formData.goals.includes(goal.key)
                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                        : "border-border hover:border-accent/40 bg-card"
                    }`}
                  >
                    <span className={`text-sm font-medium ${formData.goals.includes(goal.key) ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {goal.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.goals.includes(goal.key) ? "bg-accent border-accent" : "border-muted group-hover:border-accent/40"}`}>
                       {formData.goals.includes(goal.key) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Setting up your journey..." : "Get Started"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
