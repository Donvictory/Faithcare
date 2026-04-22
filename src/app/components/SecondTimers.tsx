import { useState } from "react";
import { CheckCircle, Send, Calendar, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { Header } from "./Header";

interface FirstTimer {
  id: number;
  name: string;
  phone: string;
  email: string;
  firstVisit: string;
  secondVisit?: string;
  status: "first-timer" | "second-timer";
  prayerRequest: string;
  sunday: string; // The Sunday they returned (second visit)
}

const firstTimersData: FirstTimer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "(555) 123-4567",
    email: "sarah.j@email.com",
    firstVisit: "Feb 23, 2026",
    secondVisit: "Mar 2, 2026",
    sunday: "Mar 2, 2026",
    status: "first-timer",
    prayerRequest: "Guidance in new job transition",
  },
  {
    id: 2,
    name: "Michael Chen",
    phone: "(555) 234-5678",
    email: "mchen@email.com",
    firstVisit: "Feb 16, 2026",
    secondVisit: "Mar 2, 2026",
    sunday: "Mar 2, 2026",
    status: "first-timer",
    prayerRequest: "Family healing and reconciliation",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    phone: "(555) 345-6789",
    email: "emily.r@email.com",
    firstVisit: "Feb 16, 2026",
    secondVisit: "Feb 23, 2026",
    sunday: "Feb 23, 2026",
    status: "second-timer",
    prayerRequest: "Strength during health challenges",
  },
  {
    id: 4,
    name: "David Thompson",
    phone: "(555) 456-7890",
    email: "dthompson@email.com",
    firstVisit: "Feb 9, 2026",
    secondVisit: "Feb 23, 2026",
    sunday: "Feb 23, 2026",
    status: "first-timer",
    prayerRequest: "Wisdom in life decisions",
  },
  {
    id: 5,
    name: "Amanda White",
    phone: "(555) 567-8901",
    email: "amanda.w@email.com",
    firstVisit: "Feb 9, 2026",
    secondVisit: "Feb 16, 2026",
    sunday: "Feb 16, 2026",
    status: "second-timer",
    prayerRequest: "Peace and comfort",
  },
  {
    id: 6,
    name: "James Miller",
    phone: "(555) 678-9012",
    email: "james.m@email.com",
    firstVisit: "Feb 2, 2026",
    secondVisit: "Feb 16, 2026",
    sunday: "Feb 16, 2026",
    status: "first-timer",
    prayerRequest: "Faith and trust in God",
  },
];

export function SecondTimers() {
  const [timers, setTimers] = useState<FirstTimer[]>(firstTimersData);
  const [selectedSunday, setSelectedSunday] = useState<string | null>(null);

  // Group second timers by Sunday (second visit date)
  const groupedBySunday = timers.reduce(
    (acc, timer) => {
      if (timer.secondVisit) {
        if (!acc[timer.sunday]) {
          acc[timer.sunday] = [];
        }
        acc[timer.sunday].push(timer);
      }
      return acc;
    },
    {} as Record<string, FirstTimer[]>,
  );

  // Get sorted Sunday dates (most recent first)
  const sundays = Object.keys(groupedBySunday).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const markAsSecondTimer = (id: number) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, status: "second-timer" } : timer,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "first-timer":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "second-timer":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "first-timer":
        return "First Timer";
      case "second-timer":
        return "Second Timer";
      default:
        return status;
    }
  };

  const displayedData = selectedSunday
    ? groupedBySunday[selectedSunday]
    : timers.filter((t) => t.secondVisit);

  const firstTimerCount = timers.filter(
    (t) => t.status === "first-timer",
  ).length;
  const secondTimerCount = timers.filter(
    (t) => t.status === "second-timer",
  ).length;

  return (
    <div className="min-h-full">
      <Header
        title="Second Timers"
        subtitle="Manage second timers and their registration"
      />
      <div className="p-4 md:p-8 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">
                  First Timers Returned
                </p>
                <h3 className="text-3xl text-blue-900">{firstTimerCount}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">
                  Confirmed Second Timers
                </p>
                <h3 className="text-3xl text-green-900">{secondTimerCount}</h3>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-foreground/70 mb-1">
                  Return Rate
                </p>
                <h3 className="text-3xl text-accent-foreground">
                  {timers.length > 0
                    ? Math.round(
                        (timers.filter((t) => t.secondVisit).length /
                          timers.length) *
                          100,
                      )
                    : 0}
                  %
                </h3>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 border border-accent/20">
          <h3 className="text-foreground mb-2">Second Timer Tracking</h3>
          <p className="text-muted-foreground">
            This page shows first-time visitors who have returned for a second
            visit. Mark them as "Second Timers" to celebrate their continued
            engagement and plan appropriate follow-up.
          </p>
        </div>

        {/* Sunday Filter Tabs */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-foreground">Filter by Sunday (Return Date)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSunday(null)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedSunday === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Sundays ({timers.filter((t) => t.secondVisit).length})
            </button>
            {sundays.map((sunday) => (
              <button
                key={sunday}
                onClick={() => setSelectedSunday(sunday)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedSunday === sunday
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {sunday} ({groupedBySunday[sunday].length})
              </button>
            ))}
          </div>
        </div>

        {/* Second Timers Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                    First Visit
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                    Second Visit (Sunday)
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                    Prayer Request
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedData.map((timer) => (
                  <tr
                    key={timer.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground">
                      {timer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {timer.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {timer.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {timer.firstVisit}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {timer.secondVisit || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                      {timer.prayerRequest}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={getStatusColor(timer.status)}
                      >
                        {getStatusLabel(timer.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {timer.status === "first-timer" && timer.secondVisit ? (
                        <button
                          onClick={() => markAsSecondTimer(timer.id)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Second Timer
                        </button>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {timer.status === "second-timer"
                            ? "Confirmed"
                            : "Awaiting return"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
