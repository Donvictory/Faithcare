import React, { useEffect } from "react";
import { BookOpen, Sparkles, Timer, TrendingUp, Loader2 } from "lucide-react";
import { Header } from "./Header";
import { useLayout } from "../contexts/LayoutContext";
import { useAuth } from "../providers/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMetadataByUserId,
  getJournalEntries,
  getTimerSessions,
  updateIndividualMetadata,
  completeIndividualOnboarding,
} from "@/api/individual";
import { Link } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import { toast } from "react-hot-toast";

export function IndividualDashboard() {
  const { user, accessToken } = useAuth();
  const { addNotification } = useLayout();
  const queryClient = useQueryClient();
  
  // Robust userId detection
  const userId = React.useMemo(() => {
    // Prefer _id (standard for MongoDB/Express) over id
    const id = user?._id || user?.id || user?.userId;
    if (id) return id;
    
    // Fallback to storage
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed._id || parsed.id || parsed.userId;
      } catch (e) {
        return "";
      }
    }
    return "";
  }, [user]);

  // 1. Fetch personal metadata (for streak and goals)
  const { data: metadataResponse, isLoading: isMetadataLoading, error: metadataError } = useQuery({
    queryKey: ["individual-metadata", userId],
    queryFn: () => getMetadataByUserId(userId),
    enabled: !!accessToken && !!userId,
  });

  useEffect(() => {
    if (!userId && !isMetadataLoading) {
      console.warn("No userId found for streak tracking");
    }
  }, [userId, isMetadataLoading]);

  // 2. Fetch Journals (to count and show latest)
  const { data: journalsResponse, isLoading: isJournalsLoading } = useQuery({
    queryKey: ["journals", userId],
    queryFn: () => getJournalEntries({ userId, limit: 5 }),
    enabled: !!accessToken && !!userId,
  });

  // 3. Fetch Focus Sessions (to count)
  const { data: timerResponse, isLoading: isTimerLoading } = useQuery({
    queryKey: ["timer-sessions", userId],
    queryFn: () => getTimerSessions(userId),
    enabled: !!accessToken && !!userId,
  });

  useEffect(() => {
    if (metadataError) {
      toast.error("Failed to load spiritual profile: " + (metadataError as any).message);
    }
    if (metadataResponse && !metadataResponse.success) {
      toast.error("Spiritual profile error: " + metadataResponse.error);
    }
  }, [metadataResponse, metadataError]);

  const metadataRaw = metadataResponse?.data;
  // Handle nested data structures or arrays
  let metadata = Array.isArray(metadataRaw) 
    ? metadataRaw[0] 
    : (metadataRaw?.data ? (Array.isArray(metadataRaw.data) ? metadataRaw.data[0] : metadataRaw.data) : metadataRaw);
  
  // If metadata is still the wrapper object, unwrap it
  if (metadata && metadata.data && !metadata.dailyBibleReadingStreakCount) {
    metadata = metadata.data;
  }
  
  // Final unwrap for case where it's wrapped in a 'metadata' property
  if (!metadata?.dailyBibleReadingStreakCount && (metadataRaw as any)?.metadata) {
    metadata = (metadataRaw as any).metadata;
  }
  
  // Robust data extraction
  const journalsRaw = journalsResponse?.data || [];
  const journals = Array.isArray(journalsRaw)
    ? journalsRaw
    : journalsRaw.entries || [];

  const timerRaw = timerResponse?.data || [];
  const timerSessions = Array.isArray(timerRaw)
    ? timerRaw
    : timerRaw.sessions || [];

  const journalCount = journalsRaw.total || journals.length;
  const focusCount = timerSessions.length;
  
  // Use robust extraction for display streak
  const streak = metadata?.dailyBibleReadingStreakCount ?? metadata?.streak ?? (localStorage.getItem(`lastStreakUpdate_${userId}`) ? 1 : 0);

  // Calculate Journaling Streak
  const calculateJournalingStreak = (entries: any[]) => {
    if (!entries || entries.length === 0) return 0;
    const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    let streakCount = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const latestEntryDate = new Date(sortedEntries[0].createdAt);
    latestEntryDate.setHours(0, 0, 0, 0);
    const diffDaysFromToday = Math.round((currentDate.getTime() - latestEntryDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDaysFromToday > 1) return 0;
    let lastCheckedDate = latestEntryDate;
    streakCount = 1;
    for (let i = 1; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].createdAt);
      entryDate.setHours(0, 0, 0, 0);
      const diff = Math.round((lastCheckedDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        streakCount++;
        lastCheckedDate = entryDate;
      } else if (diff === 0) {
        continue;
      } else {
        break;
      }
    }
    return streakCount;
  };

  const journalingStreak = calculateJournalingStreak(journals);

  // 4. Streak Logic (Login)
  useEffect(() => {
    if (metadataResponse?.success && userId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastUpdateStr = localStorage.getItem(`lastStreakUpdate_${userId}`);
      const lastUpdate = lastUpdateStr ? new Date(lastUpdateStr) : null;
      if (lastUpdate) lastUpdate.setHours(0, 0, 0, 0);

      const metadataItem = Array.isArray(metadataResponse.data) ? metadataResponse.data[0] : metadataResponse.data;
      const currentStreak = metadataItem?.dailyBibleReadingStreakCount ?? metadataItem?.streak ?? 0;
      const metadataId = metadataItem?._id || metadataItem?.id;

      // If we already updated today, don't do anything
      if (lastUpdate && today.getTime() === lastUpdate.getTime()) return;

      if (!metadataItem) {
        // Case A: No metadata record - Create first one
        completeIndividualOnboarding({ 
          userId, 
          dailyBibleReadingStreakCount: 1,
          lastLoginDate: today.toISOString()
        }).then((res) => {
          if (res.success) {
            localStorage.setItem(`lastStreakUpdate_${userId}`, today.toISOString());
            queryClient.invalidateQueries({ queryKey: ["individual-metadata", userId] });
            addNotification({
              title: "First Login Streak!",
              description: "Welcome! Your 1st day login streak has started.",
              time: "Just now",
              icon: "TrendingUp",
              color: "text-green-500",
              bg: "bg-green-500/10",
              type: "individual",
            });
          } else {
            toast.error("Failed to initialize streak: " + res.error);
          }
        });
      } else {
        // Case B: Metadata exists
        if (!lastUpdate) {
          // First time on this browser/session - synchronize state
          if (currentStreak === 0 && metadataId) {
            updateIndividualMetadata(metadataId, { dailyBibleReadingStreakCount: 1 })
              .then((res) => {
                if (res.success) {
                  localStorage.setItem(`lastStreakUpdate_${userId}`, today.toISOString());
                  queryClient.invalidateQueries({ queryKey: ["individual-metadata", userId] });
                  addNotification({
                    title: "Streak Started!",
                    description: "You've started your daily walk streak. See you tomorrow!",
                    time: "Just now",
                    icon: "TrendingUp",
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                    type: "individual",
                  });
                } else {
                  toast.error("Failed to update streak: " + res.error);
                }
              });
          } else {
            // Already have a streak on server, just mark today as updated locally
            localStorage.setItem(`lastStreakUpdate_${userId}`, today.toISOString());
          }
        } else {
          // Calculate difference between last visit and today
          const diffDays = Math.round((today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1 && metadataId) {
            // Consecutive day!
            const newStreak = currentStreak + 1;
            updateIndividualMetadata(metadataId, { dailyBibleReadingStreakCount: newStreak })
              .then((res) => {
                if (res.success) {
                  localStorage.setItem(`lastStreakUpdate_${userId}`, today.toISOString());
                  queryClient.invalidateQueries({ queryKey: ["individual-metadata", userId] });
                  addNotification({
                    title: "Login Streak Maintained!",
                    description: `You've logged in for ${newStreak} consecutive days! Keep it up.`,
                    time: "Just now",
                    icon: "TrendingUp",
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                    type: "individual",
                  });
                }
              });
          } else if (diffDays > 1 && metadataId) {
            // Missed a day - Reset to 1
            updateIndividualMetadata(metadataId, { dailyBibleReadingStreakCount: 1 })
              .then((res) => {
                if (res.success) {
                  localStorage.setItem(`lastStreakUpdate_${userId}`, today.toISOString());
                  queryClient.invalidateQueries({ queryKey: ["individual-metadata", userId] });
                  addNotification({
                    title: "Login Streak Reset",
                    description: "Fresh start! Let's build a new daily habit starting today.",
                    time: "Just now",
                    icon: "TrendingUp",
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                    type: "individual",
                  });
                }
              });
          }
        }
      }
    }
  }, [metadataResponse, userId, queryClient]);

  // Journaling Streak Notification
  useEffect(() => {
    if (journalingStreak > 0) {
      const lastJournalNote = localStorage.getItem(`lastJournalNote_${userId}`);
      const today = new Date().toDateString();
      if (lastJournalNote !== today) {
        addNotification({
          title: "Journaling Streak!",
          description: `You've maintained a ${journalingStreak} day journaling streak. Your spiritual growth is visible!`,
          time: "Just now",
          icon: "BookOpen",
          color: "text-accent",
          bg: "bg-accent/10",
          type: "individual",
        });
        localStorage.setItem(`lastJournalNote_${userId}`, today);
      }
    }
  }, [journalingStreak, userId]);

  // Calculate progress percentages based on realistic targets
  const journalProgress = Math.min(100, (journalCount / 7) * 100);
  const focusProgress = Math.min(100, (focusCount / 5) * 100);
  const readingProgress = metadata?.readingProgress || 45;

  const stats = [
    {
      title: "Login Streak",
      value: `${metadata?.dailyBibleReadingStreakCount ?? metadata?.streak ?? (localStorage.getItem(`lastStreakUpdate_${userId}`) ? 1 : 0)} days`,
      icon: TrendingUp,
      color: "#22c55e",
    },
    {
      title: "Journaling Streak",
      value: `${journalingStreak} days`,
      icon: BookOpen,
      color: "#d4a574",
    },
    {
      title: "Scriptures Read",
      value: (metadata?.scripturesCount || 0).toString(),
      icon: Sparkles,
      color: "#3b82f6",
    },
    {
      title: "Focus Sessions",
      value: focusCount.toString(),
      icon: Timer,
      color: "#a855f7",
    },
  ];

  if (isMetadataLoading || isJournalsLoading || isTimerLoading) {
    return (
      <LoadingScreen churchName={user?.churchName || user?.organizationName} />
    );
  }

  return (
    <div className="min-h-full font-sans pb-10">
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user?.fullName || user?.name || "Believer"}`}
      />

      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-card rounded-3xl p-8 md:p-12 border border-border relative overflow-hidden shadow-xl shadow-accent/5">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] dark:opacity-[0.07]">
            <Sparkles className="w-64 h-64 text-accent" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
                Peace be with you.
              </h2>
              <p className="text-muted-foreground text-xl mb-8 max-w-xl leading-relaxed opacity-80">
                You've completed {journalCount} meditations this month. Your
                commitment to your spiritual walk is inspiring.
              </p>
              <Link
                to="/daily-scripture"
                className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
              >
                Today's Scripture
              </Link>
            </div>
          </div>
        </div>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-card rounded-3xl p-6 border border-border shadow-sm hover:border-accent/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                      {stat.title}
                    </p>
                    <p className="text-3xl text-foreground group-hover:text-accent transition-colors">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-inner"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress and Journals */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bible Entries (Real) */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                Latest Meditations
              </h3>
              <Link
                to="/sunday-journal"
                className="text-[10px] text-accent hover:underline uppercase tracking-widest bg-accent/5 px-3 py-1.5 rounded-full"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {journals.length > 0 ? (
                journals.slice(0, 3).map((entry: any, index: number) => (
                  <div
                    key={entry._id || index}
                    className="p-5 rounded-2xl border border-border hover:bg-muted/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-foreground group-hover:text-accent transition-colors">
                        {entry.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded uppercase">
                        {new Date(entry.createdAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-accent italic opacity-80">
                      {entry.scriptureReference}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                  <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground italic">
                    Begin your first entry to track your growth.
                  </p>
                </div>
              )}
            </div>

            <Link
              to="/sunday-journal"
              className="block w-full mt-8 px-4 py-4 bg-muted/40 text-foreground rounded-2xl hover:bg-muted/60 transition-all border border-border text-center text-sm"
            >
              Write New Entry
            </Link>
          </div>

          {/* Consistency Tracking */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-10 flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              Consistency Tracking
            </h3>

            <div className="space-y-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-foreground uppercase tracking-wider">
                    Reading Plan
                  </p>
                  <p className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                    {readingProgress}% Complete
                  </p>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-lg"
                    style={{
                      width: `${readingProgress}%`,
                      backgroundColor: "#22c55e",
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-foreground uppercase tracking-wider">
                    Journaling Streak
                  </p>
                  <p className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                    {Math.round(journalingStreak)} days
                  </p>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-lg"
                    style={{
                      width: `${journalProgress}%`,
                      backgroundColor: "#d4a574",
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-foreground uppercase tracking-wider">
                    Focus Sessions
                  </p>
                  <p className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                    {Math.round(focusProgress)}% Goal
                  </p>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-lg"
                    style={{
                      width: `${focusProgress}%`,
                      backgroundColor: "#a855f7",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-accent/5 rounded-2xl border border-accent/10 shadow-inner">
              <p className="text-xs text-foreground italic leading-relaxed text-center opacity-80">
                "Small daily steps lead to deep, lasting faith. Keep pressing
                in."
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-8">
            Spiritual Disciplines
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              to="/daily-scripture"
              className="p-8 rounded-3xl bg-muted/20 border border-border hover:border-accent hover:bg-accent/5 transition-all text-center group"
            >
              <Sparkles className="w-8 h-8 mx-auto mb-4 text-accent transition-all group-hover:scale-125 group-hover:rotate-12" />
              <p className="text-sm text-foreground uppercase tracking-widest">
                Scripture
              </p>
            </Link>
            <Link
              to="/sunday-journal"
              className="p-8 rounded-3xl bg-muted/20 border border-border hover:border-accent hover:bg-accent/5 transition-all text-center group"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-4 text-accent transition-all group-hover:scale-125 group-hover:rotate-12" />
              <p className="text-sm text-foreground uppercase tracking-widest">
                Journaling
              </p>
            </Link>
            <Link
              to="/focus-timer"
              className="p-8 rounded-3xl bg-muted/20 border border-border hover:border-accent hover:bg-accent/5 transition-all text-center group"
            >
              <Timer className="w-8 h-8 mx-auto mb-4 text-accent transition-all group-hover:scale-125 group-hover:rotate-12" />
              <p className="text-sm text-foreground uppercase tracking-widest">
                Focus
              </p>
            </Link>
            <Link
              to="/settings"
              className="p-8 rounded-3xl bg-muted/20 border border-border hover:border-accent hover:bg-accent/5 transition-all text-center group"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-4 text-accent transition-all group-hover:scale-125 group-hover:rotate-12" />
              <p className="text-sm text-foreground uppercase tracking-widest">
                Insights
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
