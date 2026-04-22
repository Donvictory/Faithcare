import { BookOpen, Sparkles, Timer, TrendingUp, Loader2 } from "lucide-react";
import { Header } from "./Header";
import { useAuth } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getMetadataByUserId } from "@/api/individual";

export function IndividualDashboard() {
  const { user, accessToken } = useAuth();

  // Fetch personal metadata and goals
  const { data: metadataResponse, isLoading } = useQuery({
    queryKey: ["individual-metadata", user?.id],
    queryFn: () => getMetadataByUserId(user?.id || ""),
    enabled: !!accessToken && !!user?.id,
  });

  const metadata = metadataResponse?.success ? metadataResponse.data : null;
  const spiritualGoals = metadata?.spiritualGoals?.[0] || {};

  const stats = [
    {
      title: "Current Streak",
      value: `${metadata?.dailyBibleReadingStreakCount || 0} days`,
      icon: TrendingUp,
      color: "#22c55e",
    },
    {
      title: "Journal Entries",
      value: metadata?.journalCount || "0",
      icon: BookOpen,
      color: "#d4a574",
    },
    {
      title: "Scriptures Read",
      value: metadata?.scripturesCount || "0",
      icon: Sparkles,
      color: "#3b82f6",
    },
    {
      title: "Focus Sessions",
      value: metadata?.focusSessionsCount || "0",
      icon: Timer,
      color: "#a855f7",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-muted-foreground font-light italic">
          Syncing your spiritual journey...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full font-sans">
      <Header
        title="Dashboard"
        subtitle={`Welcome, ${user?.name || "Believer"}`}
      />

      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6 md:p-10 border border-accent/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Sparkles className="w-32 h-32 text-accent" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-light text-foreground mb-3  ">
                Peace be with you. ✨
              </h2>
              <p className="text-muted-foreground text-lg font-light mb-8 max-w-xl leading-relaxed">
                You're making great progress in your walk with God. Today is
                another opportunity to grow in faith.
              </p>
              <button className="px-8 py-3.5 bg-accent text-accent-foreground rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg active:scale-95">
                Today's Scripture
              </button>
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
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:border-accent/30 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl transition-transform group-hover:scale-110"
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
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Spiritual Journal
              </h3>
              <button className="text-xs font-bold text-accent hover:underline uppercase tracking-wider">
                Full Record
              </button>
            </div>

            <div className="space-y-4">
              {metadata?.latestJournals?.length > 0 ? (
                metadata.latestJournals.map((entry: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-border hover:bg-muted/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                        {entry.title}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        {entry.date}
                      </p>
                    </div>
                    <p className="text-xs text-accent italic">
                      {entry.scripture}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground font-light italic">
                    Begin your first entry to track your growth.
                  </p>
                </div>
              )}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-secondary text-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all border border-border">
              Draft New Meditation
            </button>
          </div>

          {/* This Week's Goals Progress */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Faith Consistency
            </h3>

            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-foreground">
                    Bible Reading Plan
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    {metadata?.readingProgress || "0"}% Complete
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${metadata?.readingProgress || 0}%`,
                      backgroundColor: "#22c55e",
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-foreground">
                    Prayer Consistency
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    {spiritualGoals.dailyPrayer ? "Consistent" : "Tracking..."}
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: spiritualGoals.dailyPrayer ? "100%" : "30%",
                      backgroundColor: "#d4a574",
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-foreground">
                    Spiritual Focus
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    {metadata?.focusRate || "0"}%
                  </p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${metadata?.focusRate || 0}%`,
                      backgroundColor: "#a855f7",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 bg-accent/5 rounded-2xl border border-accent/10 shadow-inner">
              <p className="text-xs text-foreground italic leading-relaxed text-center font-light">
                "Your commitment to growth is inspiring. Small daily steps lead
                to deep, lasting faith. Keep pressing in."
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">
            Spiritual Disciplines
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-6 rounded-2xl bg-secondary/30 border border-border hover:border-accent hover:bg-accent/5 transition-all text-center group">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-accent transition-transform group-hover:scale-110" />
              <p className="text-sm font-bold text-foreground">Scripture</p>
            </button>
            <button className="p-6 rounded-2xl bg-secondary/30 border border-border hover:border-accent hover:bg-accent/5 transition-all text-center group">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-accent transition-transform group-hover:scale-110" />
              <p className="text-sm font-bold text-foreground">Journaling</p>
            </button>
            <button className="p-6 rounded-2xl bg-secondary/30 border border-border hover:border-accent hover:bg-accent/5 transition-all text-center group">
              <Timer className="w-8 h-8 mx-auto mb-3 text-accent transition-transform group-hover:scale-110" />
              <p className="text-sm font-bold text-foreground">Focus</p>
            </button>
            <button className="p-6 rounded-2xl bg-secondary/30 border border-border hover:border-accent hover:bg-accent/5 transition-all text-center group">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-accent transition-transform group-hover:scale-110" />
              <p className="text-sm font-bold text-foreground">Insights</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
