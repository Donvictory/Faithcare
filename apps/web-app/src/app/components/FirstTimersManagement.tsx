import { Send, QrCode, Calendar, Filter } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Header } from "./Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFirstTimers,
  createFollowUp,
  updateFirstTimerStatus,
} from "@/api/church";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { useSearch } from "../contexts/SearchContext";
import { DataManagementActions } from "./DataManagementActions";
import { AddMemberModal } from "./AddMemberModal";

interface FirstTimer {
  id: string;
  name: string;
  phone: string;
  email: string;
  prayerRequest: string;
  status: string;
  sunday: string;
  visitType: string;
}

export function FirstTimersManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { searchTerm } = useSearch();
  const organizationId = user?.organizationId || user?.id || user?._id || "";

  // States for filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSunday, setSelectedSunday] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: string;
      notes: string;
    }) => updateFirstTimerStatus(id, { status, notes }),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["first-timers"], exact: false });
    },
    onError: (error: any) => {
      toast.error(error.message || "Update failed");
    },
  });

  const followUpMutation = useMutation({
    mutationFn: (payload: any) => createFollowUp(organizationId, payload),
    onSuccess: () => {
      toast.success("Follow-up created successfully");
      queryClient.invalidateQueries({ queryKey: ["follow-ups"], exact: false });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create follow-up");
    },
  });

  const handleSendFollowUp = (person: FirstTimer) => {
    const payload = {
      newMemberId: person.id,
      name: person.name,
      tags: ["FIRST_TIMER"],
      priority: "HIGH" as const,
      description: person.prayerRequest || "First-time visitor check-in",
      dueDate: new Date().toISOString().split("T")[0],
    };
    followUpMutation.mutate(payload);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    statusMutation.mutate({
      id,
      status: newStatus,
      notes: `Status changed to ${newStatus} from dashboard`,
    });
  };

  const { data: firstTimersResponse, isLoading } = useQuery({
    queryKey: ["first-timers", organizationId, statusFilter, searchTerm],
    queryFn: () =>
      getFirstTimers({
        organizationId,
        status: statusFilter === "all" ? undefined : (statusFilter as any),
        search: searchTerm || undefined,
      }),
    enabled: !!organizationId,
  });

  // Helper to deeply find the first array in an object
  const findArray = (obj: any): any[] => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    if (typeof obj === "object") {
      for (const key in obj) {
        if (Array.isArray(obj[key])) return obj[key];
        if (typeof obj[key] === "object" && obj[key] !== null) {
          const nested = findArray(obj[key]);
          if (nested.length > 0) return nested;
        }
      }
    }
    return [];
  };

  const firstTimersData = findArray(firstTimersResponse);

  console.log("firstTimersResponse:", firstTimersResponse);
  console.log("firstTimersData:", firstTimersData);

  const firstTimersList: FirstTimer[] = firstTimersData.map((ft: any) => ({
    id: ft.id || ft._id,
    name: ft.fullName || ft.name || "N/A",
    phone: ft.phoneNumber || ft.phone || "N/A",
    email: ft.email || "N/A",
    prayerRequest: ft.prayerRequest || "None",
    status: ft.status || "PENDING",
    sunday: ft.serviceDate || ft.createdAt?.split("T")[0] || "N/A",
    visitType: ft.visitType || "first_time",
  }));

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FOLLOWED_UP":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const groupedBySunday = firstTimersList.reduce(
    (acc: Record<string, FirstTimer[]>, person: FirstTimer) => {
      if (!acc[person.sunday]) {
        acc[person.sunday] = [];
      }
      acc[person.sunday].push(person);
      return acc;
    },
    {} as Record<string, FirstTimer[]>,
  );

  const sundays = Object.keys(groupedBySunday).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  // Combine all local filters safely
  let displayedData = firstTimersList;

  if (statusFilter && statusFilter !== "all") {
    displayedData = displayedData.filter((p) => p.status.toUpperCase() === statusFilter.toUpperCase());
  }

  if (selectedSunday) {
    displayedData = displayedData.filter((p) => p.sunday === selectedSunday);
  }

  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    displayedData = displayedData.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.email.toLowerCase().includes(lowerSearch) ||
        p.phone.toLowerCase().includes(lowerSearch) ||
        p.prayerRequest.toLowerCase().includes(lowerSearch)
    );
  }

  return (
    <div className="min-h-full">
      <Header
        title="First Timers Management"
        subtitle="Manage first timers and their registration"
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Bulk Actions and Add New */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-foreground">Data Management</h3>
            <p className="text-sm text-muted-foreground italic">Upload or add new records manually</p>
          </div>
          <DataManagementActions 
            type="first-timers" 
            onAddManual={() => setIsAddModalOpen(true)}
            onUploadSuccess={() => queryClient.invalidateQueries({ queryKey: ["first-timers"], exact: false })}
          />
        </div>

        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          type="first-timers"
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["first-timers"], exact: false })}
        />

        <div className="space-y-6">
        {/* QR Code and Actions */}
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 border border-accent/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-foreground text-xl font-medium mb-2">
                First Timer Registration
              </h3>
              <p className="text-muted-foreground">
                Display this QR code for visitors to register immediately.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-white rounded-lg p-2 border border-accent/20 flex items-center justify-center">
                <QrCode className="w-full h-full text-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters section (Search removed, handled by Header) */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSunday(null)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                    selectedSunday === null
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All Sundays
                </button>
                {sundays.map((sunday) => (
                  <button
                    key={sunday}
                    onClick={() => setSelectedSunday(sunday)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                      selectedSunday === sunday
                        ? "bg-primary text-primary-foreground font-medium"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {sunday}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONTACTED">Contacted</option>
                <option value="FOLLOWED_UP">Followed Up</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Visitor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Prayer Request
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Visit Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      Loading your visitor records...
                    </td>
                  </tr>
                ) : displayedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No visitor records found.
                    </td>
                  </tr>
                ) : (
                  displayedData.map((person) => (
                    <tr
                      key={person.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {person.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {person.phone}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {person.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs italic">
                          "{person.prayerRequest}"
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-foreground font-medium uppercase">
                            {person.visitType.replace("_", " ")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {person.sunday}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={person.status.toUpperCase()}
                          onChange={(e) =>
                            handleStatusChange(person.id, e.target.value)
                          }
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border border-transparent focus:ring-2 focus:ring-accent outline-none cursor-pointer ${getStatusColor(person.status)}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="FOLLOWED_UP">Followed Up</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSendFollowUp(person)}
                          disabled={followUpMutation.isPending}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm"
                        >
                          <Send className="w-4 h-4" />
                          {followUpMutation.isPending
                            ? "Syncing..."
                            : "Assign Follow Up"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
