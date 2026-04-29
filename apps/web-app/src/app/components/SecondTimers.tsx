import { useLayout } from "../contexts/LayoutContext";
import { useEffect, useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import { useSearch } from "../contexts/SearchContext";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "./ui/card";
import SecondTimersTable from "./SecondTimersTable";

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
  const { setHeader } = useLayout();
  useEffect(() => {
    setHeader("Second Timers", "Manage second timers and their registration");
  }, []);

  const { searchTerm } = useSearch();
  const queryClient = useQueryClient();
  const [timers, setTimers] = useState<FirstTimer[]>(firstTimersData);
  const [selectedSunday, setSelectedSunday] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Client-side search filtering
  const filteredBySearch = timers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.prayerRequest.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Group filtered results by Sunday
  const groupedBySunday = filteredBySearch.reduce(
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

  // Combine all local filters safely
  let displayedData = timers.filter((t) => t.secondVisit);

  if (selectedSunday) {
    displayedData = displayedData.filter(
      (t) => t.secondVisit === selectedSunday,
    );
  }

  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    displayedData = displayedData.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerSearch) ||
        t.email.toLowerCase().includes(lowerSearch) ||
        t.phone.toLowerCase().includes(lowerSearch) ||
        t.prayerRequest.toLowerCase().includes(lowerSearch),
    );
  }

  const firstTimerCount = timers.filter(
    (t) => t.status === "first-timer",
  ).length;
  const secondTimerCount = timers.filter(
    (t) => t.status === "second-timer",
  ).length;

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h2 className="text-foreground font-bold text-xl mb-2">
          Second Timer Tracking
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          View first time visitors who have returned for a second visit. <br />{" "}
          Mark them as "Second Timers" to celebrate their continued engagement
          and plan appropriate follow-up.
        </p>
      </div>
      <div className="space-y-6">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold mb-3 text-accent-foreground/70">
                    First Timers Returned
                  </p>
                  <h3 className="text-3xl font-bold">{firstTimerCount}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Send className="w-6 h-6 opacity-80" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold mb-3 text-accent-foreground/70">
                    Confirmed Second Timers
                  </p>
                  <h3 className="text-3xl font-bold">{secondTimerCount}</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 opacity-80" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-accent-foreground/70 mb-3">
                    Return Rate
                  </p>
                  <h3 className="text-3xl font-bold text-accent-foreground">
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
                  <CheckCircle className="w-6 h-6 opacity-80" />
                </div>
              </div>
            </Card>
          </div>
          <SecondTimersTable data={displayedData} />
        </div>
      </div>
    </div>
  );
}
