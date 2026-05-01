import { useLayout } from "../contexts/LayoutContext";
import { QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFirstTimers,
  createFollowUp,
  updateFirstTimerStatus,
} from "@/api/church";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { useSearch } from "../contexts/SearchContext";
import { AddMemberModal } from "./AddMemberModal";
import FirstTimersTable from "./FirstTimersTable";
import { Card } from "./ui/card";

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
  const { setHeader } = useLayout();
  useEffect(() => {
    setHeader(
      "First Timers Management",
      "Manage first timers and their registration",
    );
  }, []);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { searchTerm, setSearchTerm } = useSearch();
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
      queryClient.invalidateQueries({
        queryKey: ["first-timers"],
        exact: false,
      });
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
        visit_type: "first_time",
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

  // Keep firstTimersList for local filtering logic only
  const firstTimersList = firstTimersData.map((ft: any) => ({
    id: ft.id || ft._id,
    name: ft.fullName || ft.name || "N/A",
    fullName: ft.fullName || ft.name || "N/A",
    phone: ft.phoneNumber || ft.phone || "N/A",
    phoneNumber: ft.phoneNumber || ft.phone || "N/A",
    email: ft.email || "N/A",
    prayerRequest: ft.prayerRequest || "None",
    status: ft.status || "PENDING",
    sunday: ft.serviceDate || ft.createdAt?.split("T")[0] || "N/A",
    serviceDate: ft.serviceDate || ft.createdAt?.split("T")[0] || "N/A",
    firstVisit: ft.serviceDate || ft.createdAt?.split("T")[0] || "N/A",
    visitType: ft.visitType || ft.visit_type || "first_time",
  })).filter((ft: any) => 
    ft.status !== "PROMOTED" && 
    ft.visitType !== "second_time" && 
    ft.visit_type !== "second_time"
  );

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
    displayedData = displayedData.filter(
      (p) => p.status.toUpperCase() === statusFilter.toUpperCase(),
    );
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
        p.prayerRequest.toLowerCase().includes(lowerSearch),
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Bulk Actions and Add New */}

        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          type="first-timers"
          onSuccess={() =>
            queryClient.invalidateQueries({
              queryKey: ["first-timers"],
              exact: false,
            })
          }
        />

        <div className="space-y-6">
          {/* QR Code and Actions */}
          <div className="">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-foreground text-xl font-medium mb-2">
                  First Timer Registration
                </h3>
                <p className="text-muted-foreground">
                  Scan the QR code to register as a first-time visitor.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-lg p-2 border border-accent/20 flex items-center justify-center">
                  <QrCode className="w-full h-full text-foreground" />
                </div>
              </div>
            </div>
          </div>

          <FirstTimersTable data={firstTimersList} />
        </div>
      </div>
    </div>
  );
}
