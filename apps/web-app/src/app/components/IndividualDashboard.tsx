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
import { useSearch } from "../contexts/SearchContext";

export function IndividualDashboard() {
  const { user, accessToken } = useAuth();
  const { addNotification } = useLayout();
  const { searchTerm } = useSearch();
  const queryClient = useQueryClient();

  // Robust userId detection
  const userId = React.useMemo(() => {
    const id = user?._id || user?.id || user?.userId;
    if (id) return id;
    const stored =
      localStorage.getItem("user") || sessionStorage.getItem("user");
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
  const {
    data: metadataResponse,
    isLoading: isMetadataLoading,
    error: metadataError,
  } = useQuery({
    queryKey: ["individual-metadata", userId],
    queryFn: () => getMetadataByUserId(userId),
    enabled: !!accessToken && !!userId,
  });

  // 2. Fetch Journals (to count and show latest)
  const { data: journalsResponse, isLoading: isJournalsLoading } = useQuery({
    queryKey: ["journals", userId],
    queryFn: () => getJournalEntries({ userId, limit: 10 }), // Fetch more to allow better search filtering on dashboard
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
      toast.error(
        "Failed to load spiritual profile: " + (metadataError as any).message,
      );
    }
  }, [metadataError]);

  const metadataRaw = metadataResponse?.data;
  let metadata = Array.isArray(metadataRaw)
    ? metadataRaw[0]
    : metadataRaw?.data
      ? Array.isArray(metadataRaw.data)
        ? metadataRaw.data[0]
        : metadataRaw.data
      : metadataRaw;
  if (metadata && metadata.data && !metadata.dailyBibleReadingStreakCount)
    metadata = metadata.data;
  if (!metadata?.dailyBibleReadingStreakCount && (metadataRaw as any)?.metadata)
    metadata = (metadataRaw as any).metadata;

  const journalsRaw = journalsResponse?.data || [];
  const journals = Array.isArray(journalsRaw)
    ? journalsRaw
    : journalsRaw.entries || [];

  // Apply Search Filtering to Journals on Dashboard
  const filteredJournals = journals.filter(
    (j: any) =>
      (j.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.scriptureReference || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const timerRaw = timerResponse?.data || [];
  const timerSessions = Array.isArray(timerRaw)
    ? timerRaw
    : timerRaw.sessions || [];

  const journalCount = journalsRaw.total || journals.length;
  const focusCount = timerSessions.length;

  const streak =
    metadata?.dailyBibleReadingStreakCount ??
    metadata?.streak ??
    (localStorage.getItem(`lastStreakUpdate_${userId}`) ? 1 : 0);

  const calculateJournalingStreak = (entries: any[]) => {
    if (!entries || entries.length === 0) return 0;
    const sortedEntries = [...entries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    let streakCount = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const latestEntryDate = new Date(sortedEntries[0].createdAt);
    latestEntryDate.setHours(0, 0, 0, 0);
    const diffDaysFromToday = Math.round(
      (currentDate.getTime() - latestEntryDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (diffDaysFromToday > 1) return 0;
    let lastCheckedDate = latestEntryDate;
    streakCount = 1;
    for (let i = 1; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].createdAt);
      entryDate.setHours(0, 0, 0, 0);
      const diff = Math.round(
        (lastCheckedDate.getTime() - entryDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (diff === 1) {
        streakCount++;
        lastCheckedDate = entryDate;
      } else if (diff === 0) continue;
      else break;
    }
    return streakCount;
  };

  const journalingStreak = calculateJournalingStreak(journals);

  useEffect(() => {
    if (metadataResponse?.success && userId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastUpdateStr = localStorage.getItem(`lastStreakUpdate_${userId}`);
      const lastUpdate = lastUpdateStr ? new Date(lastUpdateStr) : null;
      if (lastUpdate) lastUpdate.setHours(0, 0, 0, 0);

      const metadataItem = Array.isArray(metadataResponse.data)
        ? metadataResponse.data[0]
        : metadataResponse.data;
      const currentStreak =
        metadataItem?.dailyBibleReadingStreakCount ?? metadataItem?.streak ?? 0;
      const metadataId = metadataItem?._id || metadataItem?.id;

      if (lastUpdate && today.getTime() === lastUpdate.getTime()) return;

      if (!metadataItem) {
        completeIndividualOnboarding({
          userId,
          dailyBibleReadingStreakCount: 1,
          lastLoginDate: today.toISOString(),
        }).then((res) => {
          if (res.success) {
            localStorage.setItem(
              `lastStreakUpdate_${userId}`,
              today.toISOString(),
            );
            queryClient.invalidateQueries({
              queryKey: ["individual-metadata", userId],
            });
            addNotification({
              title: "Welcome to FaithCare!",
              description:
                "We're glad to have you. Your journey of spiritual growth starts today.",
              time: "Just now",
              icon: "Sparkles",
              color: "text-accent",
              bg: "bg-accent/10",
              type: "individual",
            });
          }
        });
      } else {
        if (!lastUpdate) {
          if (currentStreak === 0 && metadataId) {
            updateIndividualMetadata(metadataId, {
              dailyBibleReadingStreakCount: 1,
            }).then((res) => {
              if (res.success) {
                localStorage.setItem(
                  `lastStreakUpdate_${userId}`,
                  today.toISOString(),
                );
                queryClient.invalidateQueries({
                  queryKey: ["individual-metadata", userId],
                });
              }
            });
          } else {
            localStorage.setItem(
              `lastStreakUpdate_${userId}`,
              today.toISOString(),
            );
          }
        } else {
          const diffDays = Math.round(
            (today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (diffDays === 1 && metadataId) {
            updateIndividualMetadata(metadataId, {
              dailyBibleReadingStreakCount: currentStreak + 1,
            }).then((res) => {
              if (res.success) {
                localStorage.setItem(
                  `lastStreakUpdate_${userId}`,
                  today.toISOString(),
                );
                queryClient.invalidateQueries({
                  queryKey: ["individual-metadata", userId],
                });
              }
            });
          } else if (diffDays > 1 && metadataId) {
            updateIndividualMetadata(metadataId, {
              dailyBibleReadingStreakCount: 1,
            }).then((res) => {
              if (res.success) {
                localStorage.setItem(
                  `lastStreakUpdate_${userId}`,
                  today.toISOString(),
                );
                queryClient.invalidateQueries({
                  queryKey: ["individual-metadata", userId],
                });
              }
            });
          }
        }
      }
    }
  }, [metadataResponse, userId]);

  const journalProgress = Math.min(100, (journalCount / 7) * 100);
  const focusProgress = Math.min(100, (focusCount / 5) * 100);
  const readingProgress = metadata?.readingProgress || 0;

  const stats = [
    {
      title: "Login Streak",
      value: `${streak === 1 ? "1 day" : `${streak} days`}`,
      icon: TrendingUp,
      color: "#22c55e",
    },
    {
      title: "Journaling Streak",
      value: `${journalingStreak === 1 ? "1 day" : `${journalingStreak} days`}`,
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
                className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 font-bold"
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
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3 ">
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
                {searchTerm ? `Search: "${searchTerm}"` : "Latest Meditations"}
              </h3>
              <Link
                to="/sunday-journal"
                className="text-[10px] text-accent hover:underline uppercase tracking-widest bg-accent/5 px-3 py-1.5 rounded-full font-bold"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {filteredJournals.length > 0 ? (
                filteredJournals
                  .slice(0, 3)
                  .map((entry: any, index: number) => (
                    <div
                      key={entry._id || index}
                      className="p-5 rounded-2xl border border-border hover:bg-muted/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-foreground group-hover:text-accent transition-colors">
                          {entry.title}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded uppercase">
                          {new Date(entry.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )}
                        </p>
                      </div>
                      <p className="text-xs text-accent italic opacity-80 font-medium">
                        {entry.scriptureReference}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="py-16 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                  <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground italic">
                    {searchTerm
                      ? `No meditations found matching "${searchTerm}"`
                      : "Begin your first entry to track your growth."}
                  </p>
                </div>
              )}
            </div>

            <Link
              to="/sunday-journal"
              className="block w-full mt-8 px-4 py-4 bg-muted/40 text-foreground rounded-2xl hover:bg-muted/60 transition-all border border-border text-center text-sm "
            >
              Write New Entry
            </Link>
          </div>

          {/* Consistency Tracking */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-10 flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              Consistency Tracking
            </h3>

            <div className="space-y-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-foreground uppercase tracking-wider">
                    Reading Plan
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
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
                  <p className="text-sm font-bold text-foreground uppercase tracking-wider">
                    Journaling Streak
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
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
                  <p className="text-sm font-bold text-foreground uppercase tracking-wider">
                    Focus Sessions
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
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
          </div>
        </div>

        {/* Quick Tools */}
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-8">
            Spiritual Disciplines
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { to: "/daily-scripture", icon: Sparkles, label: "Scripture" },
              { to: "/sunday-journal", icon: BookOpen, label: "Journaling" },
              { to: "/focus-timer", icon: Timer, label: "Focus" },
              { to: "/settings", icon: TrendingUp, label: "Insights" },
            ].map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="p-8 rounded-3xl bg-muted/20 border border-border hover:border-accent hover:bg-accent/5 transition-all text-center group active:scale-95"
              >
                <tool.icon className="w-8 h-8 mx-auto mb-4 text-accent transition-all group-hover:scale-125 group-hover:rotate-12" />
                <p className="text-sm font-bold text-foreground uppercase tracking-widest">
                  {tool.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
