import { UserPlus, CheckCircle, Heart, BookOpen } from "lucide-react";

const statsData = [
  {
    title: "First Timers This Week",
    value: "12",
    icon: UserPlus,
    color: "#d4a574",
  },
  {
    title: "Pending Follow Ups",
    value: "8",
    icon: CheckCircle,
    color: "#22c55e",
  },
  {
    title: "Prayer Requests Submitted",
    value: "24",
    icon: Heart,
    color: "#3b82f6",
  },
  {
    title: "Members Journal Entries",
    value: "47",
    icon: BookOpen,
    color: "#a855f7",
  },
];

export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-card rounded-xl p-5 md:p-6 border border-border hover:shadow-md transition-shadow shadow-sm"
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
  );
}
