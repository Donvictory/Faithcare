import { useAuth } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getDashboardTrends, getFirstTimers, getFollowUps } from "@/api/church";
import { UserPlus, CheckCircle, Heart, TrendingUp } from "lucide-react";
import { Header } from "./Header";
import { DashboardOverview } from "./DashboardOverview";
import { LoadingScreen } from "./LoadingScreen";

export function OrganizationDashboard() {
  const { accessToken, user } = useAuth();
  const organizationId = user?.organizationId || user?.id || "";

  const { data: trendsData, isLoading: leadsLoading } = useQuery({
    queryKey: ["dashboard-trends", organizationId],
    queryFn: () => getDashboardTrends(organizationId),
    enabled: !!organizationId,
  });

  const { data: firstTimersData } = useQuery({
    queryKey: ["dashboard-first-timers"],
    queryFn: () => getFirstTimers(),
    enabled: !!user,
  });

  const { data: followUpsData } = useQuery({
    queryKey: ["dashboard-followups", organizationId],
    queryFn: () => getFollowUps(organizationId),
    enabled: !!organizationId,
  });

  const statsData = [
    {
      title: "First Timers This Week",
      value: trendsData?.data?.firstTimersCount || "0",
      icon: UserPlus,
      color: "#d4a574",
      change: trendsData?.data?.firstTimersChange || "--",
    },
    {
      title: "Pending Follow Ups",
      value: trendsData?.data?.pendingFollowUps || "0",
      icon: CheckCircle,
      color: "#22c55e",
      change: trendsData?.data?.followUpsChange || "--",
    },
    {
      title: "Active Prayer Requests",
      value: trendsData?.data?.activePrayers || "0",
      icon: Heart,
      color: "#3b82f6",
      change: trendsData?.data?.prayersChange || "--",
    },
    {
      title: "Follow Up Rate",
      value: trendsData?.data?.followUpRate || "0%",
      icon: TrendingUp,
      color: "#a855f7",
      change: trendsData?.data?.rateChange || "--",
    },
  ];

  const recentActivity =
    firstTimersData?.success && Array.isArray(firstTimersData?.data)
      ? firstTimersData.data.slice(0, 4).map((ft: any) => ({
          type: "First Timer",
          name: ft.fullName || ft.name || "Unknown",
          action: "registered",
          time: ft.createdAt?.split("T")[0] || "Recently",
        }))
      : [];

  if (leadsLoading) {
    return <LoadingScreen churchName={user?.churchName || user?.name} />;
  }

  return (
    <div className="min-h-full font-sans">
      <Header
        title="Organization Overview"
        subtitle={`Viewing insights for ${user?.name || "your ministry"}`}
      />
      <DashboardOverview />
      <div className="p-4 md:p-8 space-y-8">
        {/* Real-time Stats Grid */}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Activity Log */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">
                Recent Activity
              </h3>
              <button className="text-[10px] text-accent hover:underline uppercase tracking-widest bg-accent/5 px-3 py-1.5 rounded-full">
                Live Feed
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-all border border-transparent hover:border-border"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Successfully {activity.action} in the system
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase bg-muted/50 px-2 py-1 rounded">
                      {activity.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground italic">
                    No recent activity recorded yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Critical Follow-ups */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">
                Upcoming Follow Ups
              </h3>
              <Badge variant="outline" className="border-accent text-accent">
                Active
              </Badge>
            </div>
            <div className="space-y-4">
              {followUpsData?.success &&
              Array.isArray(followUpsData?.data) &&
              followUpsData.data.length > 0 ? (
                followUpsData.data.slice(0, 3).map((fu: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl border-l-4 shadow-sm ${fu.status === "overdue" ? "border-l-red-500 bg-red-50/30" : "border-l-accent bg-accent/5"}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-foreground italic">
                        "{fu.name}"
                      </p>
                      <span
                        className={`text-[10px] font-bold uppercase ${fu.status === "overdue" ? "text-red-600 bg-red-100" : "text-accent bg-accent/10"} px-2 py-1 rounded`}
                      >
                        {fu.dueDate || "Planned"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {fu.description ||
                        fu.notes ||
                        "Follow up action required for this member."}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground italic">
                    Your follow-up list is currently clear.
                  </p>
                </div>
              )}
            </div>
            <button className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-95">
              Manage All Follow Ups
            </button>
          </div>
        </div>

        {/* Original Overview Chart Component */}
      </div>
    </div>
  );
}

function Badge({ children, className, variant = "default" }: any) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${className}`}
    >
      {children}
    </span>
  );
}
