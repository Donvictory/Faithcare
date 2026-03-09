import { BookOpen, Sparkles, Timer, TrendingUp } from "lucide-react";

export function IndividualDashboard() {
  const stats = [
    {
      title: "Current Streak",
      value: "7 days",
      icon: TrendingUp,
      color: "#22c55e",
    },
    {
      title: "Journal Entries",
      value: "12",
      icon: BookOpen,
      color: "#d4a574",
    },
    {
      title: "Scriptures Read",
      value: "28",
      icon: Sparkles,
      color: "#3b82f6",
    },
    {
      title: "Focus Sessions",
      value: "15",
      icon: Timer,
      color: "#a855f7",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-8 border border-accent/20">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-foreground mb-2">Good morning! ✨</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Welcome back to your spiritual journey. Keep up the great work!
            </p>
            <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
              Today's Scripture
            </button>
          </div>
          <div className="hidden md:block w-32 h-32 rounded-full bg-white/50 flex items-center justify-center">
            <Sparkles className="w-16 h-16" style={{ color: '#d4a574' }} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                  <p className="text-3xl text-foreground">{stat.value}</p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Journal Entries */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recent Journal Entries
          </h3>
          <div className="space-y-3">
            {[
              {
                title: "The Power of Grace",
                date: "Mar 3, 2026",
                scripture: "Ephesians 2:8-9",
              },
              {
                title: "Walking in Faith",
                date: "Feb 25, 2026",
                scripture: "Hebrews 11:1",
              },
              {
                title: "Love One Another",
                date: "Feb 18, 2026",
                scripture: "John 13:34-35",
              },
            ].map((entry, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <p className="text-foreground mb-1">{entry.title}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                  <p className="text-xs text-accent">{entry.scripture}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground">
            View All Entries
          </button>
        </div>

        {/* This Week's Progress */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            This Week's Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-foreground">Daily Scripture Reading</p>
                <p className="text-sm text-muted-foreground">5/7 days</p>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: "71%", backgroundColor: "#22c55e" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-foreground">Journal Entries</p>
                <p className="text-sm text-muted-foreground">2/3 entries</p>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: "67%", backgroundColor: "#d4a574" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-foreground">Focus Sessions</p>
                <p className="text-sm text-muted-foreground">4/5 sessions</p>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: "80%", backgroundColor: "#a855f7" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Encouragement */}
          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm text-foreground italic">
              "Great progress this week! You're building consistent spiritual habits. Keep going!"
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-accent" />
            <p className="text-sm text-foreground">Daily Scripture</p>
          </button>
          <button className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-accent" />
            <p className="text-sm text-foreground">New Journal</p>
          </button>
          <button className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors text-center">
            <Timer className="w-6 h-6 mx-auto mb-2 text-accent" />
            <p className="text-sm text-foreground">Focus Timer</p>
          </button>
          <button className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-accent" />
            <p className="text-sm text-foreground">View Progress</p>
          </button>
        </div>
      </div>
    </div>
  );
}
