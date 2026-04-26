import { useState } from "react";
import { CheckCircle, Send, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { Header } from "./Header";
import { useSearch } from "../contexts/SearchContext";
import { DataManagementActions } from "./DataManagementActions";
import { AddMemberModal } from "./AddMemberModal";
import { useQueryClient } from "@tanstack/react-query";

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
  const { searchTerm } = useSearch();
  const queryClient = useQueryClient();
  const [timers, setTimers] = useState<FirstTimer[]>(firstTimersData);
  const [selectedSunday, setSelectedSunday] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Client-side search filtering
  const filteredBySearch = timers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.prayerRequest.toLowerCase().includes(searchTerm.toLowerCase())
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
    displayedData = displayedData.filter((t) => t.secondVisit === selectedSunday);
  }

  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    displayedData = displayedData.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerSearch) ||
        t.email.toLowerCase().includes(lowerSearch) ||
        t.phone.toLowerCase().includes(lowerSearch) ||
        t.prayerRequest.toLowerCase().includes(lowerSearch)
    );
  }

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
        {/* Bulk Actions and Add New */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-foreground">Data Management</h3>
            <p className="text-sm text-muted-foreground italic">Upload or add new records manually</p>
          </div>
          <DataManagementActions 
            type="second-timers" 
            onAddManual={() => setIsAddModalOpen(true)}
            onUploadSuccess={() => queryClient.invalidateQueries({ queryKey: ["first-timers"] })}
          />
        </div>

        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          type="second-timers"
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["first-timers"] })}
        />

        <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-700 mb-1">
                  First Timers Returned
                </p>
                <h3 className="text-3xl font-bold text-blue-900">{firstTimerCount}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-green-700 mb-1">
                  Confirmed Second Timers
                </p>
                <h3 className="text-3xl font-bold text-green-900">{secondTimerCount}</h3>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 border border-accent/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-accent-foreground/70 mb-1">
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
                <CheckCircle className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 border border-accent/20">
          <h3 className="text-foreground font-bold text-lg mb-2">Second Timer Tracking</h3>
          <p className="text-muted-foreground leading-relaxed">
            This page shows first-time visitors who have returned for a second
            visit. Mark them as "Second Timers" to celebrate their continued
            engagement and plan appropriate follow-up.
          </p>
        </div>

        {/* Sunday Filter Tabs */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="text-foreground font-bold text-lg">
              {searchTerm ? `Results for "${searchTerm}" by Return Date` : "Filter by Sunday (Return Date)"}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSunday(null)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedSunday === null
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Sundays ({displayedData.length})
            </button>
            {sundays.map((sunday) => (
              <button
                key={sunday}
                onClick={() => setSelectedSunday(sunday)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  selectedSunday === sunday
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {sunday} ({groupedBySunday[sunday].length})
              </button>
            ))}
          </div>
        </div>

        {/* Second Timers Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Visits</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Prayer Request</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                      No matching records found.
                    </td>
                  </tr>
                ) : displayedData.map((timer) => (
                  <tr
                    key={timer.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                      {timer.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <div className="flex flex-col">
                         <span>{timer.phone}</span>
                         <span>{timer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground/70">1st: {timer.firstVisit}</span>
                        <span className="text-accent font-bold">2nd: {timer.secondVisit || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs italic leading-relaxed">
                      "{timer.prayerRequest}"
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(timer.status)} font-bold text-[10px] uppercase tracking-widest px-2.5 py-1`}
                      >
                        {getStatusLabel(timer.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {timer.status === "first-timer" && timer.secondVisit ? (
                        <button
                          onClick={() => markAsSecondTimer(timer.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-bold shadow-sm active:scale-95"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Mark Second Timer
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-1 rounded">
                          {timer.status === "second-timer"
                            ? "Confirmed"
                            : "Awaiting"}
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
    </div>
  );
}
