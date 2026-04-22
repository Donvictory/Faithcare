import { BookOpen, Sparkles, Timer, TrendingUp, Loader2 } from "lucide-react";
import { Header } from "./Header";
import { useAuth } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import {
  getMetadataByUserId,
  getJournalEntries,
  getTimerSessions,
} from "@/api/individual";
import { Link } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

export function IndividualDashboard() {
  const { user, accessToken } = useAuth();
  const userId = user?.id || user?._id || user?.userId || "";

  // 1. Fetch personal metadata (for streak and goals)
  const { data: metadataResponse, isLoading: isMetadataLoading } = useQuery({
    queryKey: ["individual-metadata", userId],
    queryFn: () => getMetadataByUserId(userId),
    enabled: !!accessToken && !!userId,
  });

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

  const metadata = metadataResponse?.success ? metadataResponse.data : null;

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
  const streak = metadata?.dailyBibleReadingStreakCount || 0;

  // Calculate progress percentages based on realistic targets
  const journalProgress = Math.min(100, (journalCount / 7) * 100);
  const focusProgress = Math.min(100, (focusCount / 5) * 100);
  const readingProgress = metadata?.readingProgress || 45;

  const stats = [
    {
      title: "Current Streak",
      value: `${streak} days`,
      icon: TrendingUp,
      color: "#22c55e",
    },
    {
      title: "Journal Entries",
      value: journalCount.toString(),
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
                    {Math.round(journalProgress)}% Accuracy
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
