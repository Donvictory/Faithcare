import { UserPlus, CheckCircle, Heart, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getDashboardTrends } from "@/api/church";

export function DashboardOverview() {
  const { accessToken, user } = useAuth();
  const organizationId = user?.organizationId || user?.id || "";

  const { data: trendsData, isLoading } = useQuery({
    queryKey: ["dashboard-trends-overview", organizationId],
    queryFn: () => getDashboardTrends(organizationId),
    enabled: !!organizationId,
  });

  const statsData = [
    {
      title: "First Timers This Week",
      value: trendsData?.data?.firstTimersCount || "0",
      icon: UserPlus,
      color: "#d4a574",
    },
    {
      title: "Pending Follow Ups",
      value: trendsData?.data?.pendingFollowUps || "0",
      icon: CheckCircle,
      color: "#22c55e",
    },
    {
      title: "Prayer Requests Submitted",
      value: trendsData?.data?.activePrayers || "0",
      icon: Heart,
      color: "#3b82f6",
    },
    {
      title: "Members Journal Entries",
      value: trendsData?.data?.journalEntries || "0",
      icon: BookOpen,
      color: "#a855f7",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-6 border-t border-border/50">
      {isLoading ? (
        <div className="col-span-full py-8 text-center text-muted-foreground flex items-center justify-center gap-2">
           <Loader2 className="w-4 h-4 animate-spin" />
           Syncing metrics...
        </div>
      ) : statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-card/50 rounded-xl p-5 md:p-6 border border-border/60 hover:border-accent/40 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div
                className="p-2.5 rounded-lg"
                style={{ backgroundColor: `${stat.color}10` }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
