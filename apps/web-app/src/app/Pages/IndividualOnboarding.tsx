import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  Check,
  Loader2,
  Building2,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { completeIndividualOnboarding } from "@/api/individual";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import Logo from "../components/Logo";
import { useForm } from "react-hook-form";
import { Form } from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingScreen } from "../components/LoadingScreen";
import { InputField } from "../components/ui/InputField";
import { Button } from "@/components/ui/button";
import z from "zod";

const individualOnboardingSchema = z.object({
  location: z.string().min(1, "Location is required"),
  churchName: z.string().min(1, "Church name is required"),
  goals: z
    .array(z.string())
    .min(1, "Please select at least one spiritual goal"),
});

type IndividualOnboardingValues = z.infer<typeof individualOnboardingSchema>;

const goalOptions = [
  { label: "Daily Bible reading", key: "dailyBibleReading" },
  { label: "Daily prayer", key: "dailyPrayer" },
  { label: "Consistent prayer life", key: "consistentPrayerLife" },
  { label: "Scripture memorization", key: "scriptureMemorization" },
  { label: "Spiritual journaling", key: "scripturalJournaling" },
  { label: "Better time management", key: "betterTimeManagement" },
  { label: "Deeper faith", key: "deeperFaith" },
];

export function IndividualOnboarding() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id || user?._id || user?.userId || "";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IndividualOnboardingValues>({
    resolver: zodResolver(individualOnboardingSchema),
    defaultValues: {
      location: "",
      churchName: "",
      goals: [],
    },
  });

  const handleSignOut = async () => {
    await logout();
    navigate("/sign-in");
  };

  const onSubmit = async (data: IndividualOnboardingValues) => {
    if (!userId) {
      toast.error("User session not found. Please sign in again.");
      console.error("No userId found in user object:", user);
      return;
    }

    setIsLoading(true);

    const spiritualGoals = {
      dailyBibleReading: data.goals.includes("dailyBibleReading"),
      dailyPrayer: data.goals.includes("dailyPrayer"),
      consistentPrayerLife: data.goals.includes("consistentPrayerLife"),
      scriptureMemorization: data.goals.includes("scriptureMemorization"),
      scripturalJournaling: data.goals.includes("scripturalJournaling"),
      betterTimeManagement: data.goals.includes("betterTimeManagement"),
      deeperFaith: data.goals.includes("deeperFaith"),
    };

    const payload = {
      userId: userId,
      location: data.location,
      organization: "64a1f2c3e4b5d6e7f8a9b0c1", // Fallback ID
      churchName: data.churchName,
      spiritualGoals: spiritualGoals,
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
        <Button
          variant="ghost"
          onClick={handleSignOut}
          type="button"
          className="absolute top-8 right-8 z-50 text-muted-foreground hover:text-foreground bg-secondary/30 hover:bg-secondary/50 font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64 opacity-30" />
        <div className="w-full max-w-2xl relative z-10">
          <div className="mb-16 mt-8">
            <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
              Tell us about yourself
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed opacity-70">
              We'll use these intentional details to tailor your daily
              devotionals and focus areas.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8">
                <InputField
                  control={form.control}
                  name="location"
                  label="Location"
                  placeholder="e.g. Lagos, Nigeria"
                  type="text"
                  icon={MapPin}
                />

                <InputField
                  control={form.control}
                  name="churchName"
                  label="Your Church"
                  placeholder="e.g. Grace Chapel"
                  type="text"
                  icon={Building2}
                />
              </div>

              <InputField
                control={form.control}
                name="goals"
                label="Spiritual Intentions"
                description="Select as many as resonate with your current walk..."
                type="card-multi-select"
                options={goalOptions.map((g) => ({
                  label: g.label,
                  value: g.key,
                }))}
              />

              <Button
                isLoading={isLoading}
                type="submit"
                className="w-full mt-8 shadow-2xl shadow-primary/20 group font-bold"
              >
                {isLoading ? (
                  "Beginning..."
                ) : (
                  <>
                    Begin Your Journey
                    <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
