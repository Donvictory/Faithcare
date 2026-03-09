import { UserPlus, CheckCircle, Heart, TrendingUp } from "lucide-react";

export function OrganizationDashboard() {
  const statsData = [
    {
      title: "First Timers This Week",
      value: "12",
      icon: UserPlus,
      color: "#d4a574",
      change: "+3 from last week",
    },
    {
      title: "Pending Follow Ups",
      value: "8",
      icon: CheckCircle,
      color: "#22c55e",
      change: "2 due today",
    },
    {
      title: "Active Prayer Requests",
      value: "24",
      icon: Heart,
      color: "#3b82f6",
      change: "+5 this week",
    },
    {
      title: "Follow Up Rate",
      value: "87%",
      icon: TrendingUp,
      color: "#a855f7",
      change: "+12% this month",
    },
  ];

  const recentActivity = [
    {
      type: "First Timer",
      name: "Sarah Johnson",
      action: "registered",
      time: "2 hours ago",
    },
    {
      type: "Follow Up",
      name: "Michael Chen",
      action: "contacted",
      time: "4 hours ago",
    },
    {
      type: "Prayer Request",
      name: "Emily Rodriguez",
      action: "submitted request",
      time: "5 hours ago",
    },
    {
      type: "First Timer",
      name: "David Thompson",
      action: "registered",
      time: "1 day ago",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
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
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  {activity.type === "First Timer" && (
                    <UserPlus className="w-5 h-5 text-accent" />
                  )}
                  {activity.type === "Follow Up" && (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  )}
                  {activity.type === "Prayer Request" && (
                    <Heart className="w-5 h-5 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity.name}</span> {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground">
            View All Activity
          </button>
        </div>

        {/* Upcoming Follow Ups */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-foreground mb-4">Upcoming Follow Ups</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm text-foreground font-medium">Sarah Johnson</p>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                  Due Today
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Follow up on prayer request for job transition
              </p>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm text-foreground font-medium">Michael Chen</p>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  Tomorrow
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Check in on family situation
              </p>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm text-foreground font-medium">Emily Rodriguez</p>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Mar 7
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Send welcome package and connect with small group
              </p>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            View All Follow Ups
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-8 border border-accent/20">
        <h3 className="text-foreground mb-6">This Month's Overview</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Total New Visitors</p>
            <p className="text-3xl text-foreground mb-1">47</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">78% contacted</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Prayer Requests</p>
            <p className="text-3xl text-foreground mb-1">89</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">92% praying</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Completed Follow Ups</p>
            <p className="text-3xl text-foreground mb-1">134</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">On track</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
