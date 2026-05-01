import { useState, useMemo } from "react";
import Table from "./ui/table/Table";
import { TableColumn } from "./ui/table/types";
import { Card } from "./ui/card";
import { useSearch } from "../contexts/SearchContext";
import { AddMemberModal } from "./AddMemberModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataManagementActions } from "./DataManagementActions";

import { Button } from "./ui/button";
import { updateFirstTimerStatus, createFollowUp, updateFirstTimerVisitType } from "@/api/church";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function FirstTimersTable({ data }: { data: any[] }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const organizationId = user?.organizationId || user?.id || user?._id || "";

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateFirstTimerStatus(id, { status, notes: `Status updated to ${status}` }),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["first-timers"] });
    },
    onError: (error: any) => toast.error(error.message || "Failed to update status"),
  });

  const followUpMutation = useMutation({
    mutationFn: (payload: any) => createFollowUp(organizationId, payload),
    onSuccess: (_, variables) => {
      toast.success("Follow-up sent — status updated to Contacted");
      // Update status to CONTACTED after a successful follow-up
      statusMutation.mutate({ id: variables.newMemberId, status: "CONTACTED" });
      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
      queryClient.invalidateQueries({ queryKey: ["first-timers"] });
    },
    onError: (error: any) => toast.error(error.message || "Failed to send follow-up"),
  });

  const visitTypeMutation = useMutation({
    mutationFn: (payload: any) =>
      updateFirstTimerVisitType(organizationId, payload.id, payload),
    onSuccess: () => {
      toast.success("Updated to second timer");
      // Invalidate both to ensure consistency across pages
      queryClient.invalidateQueries({ queryKey: ["first-timers"] });
      queryClient.invalidateQueries({ queryKey: ["second-timers"] });
      navigate("/second-timers");
    },
    onError: (error: any) => toast.error(error.message || "Failed to update visit type"),
  });

  const handleSendFollowUp = (item: any) => {
    const itemId = item.id || item._id;
    const payload = {
      newMemberId: itemId,
      name: item.fullName || item.name,
      phoneNumber: item.phoneNumber || item.phone,
      email: item.email,
      tags: ["FIRST_TIMER"],
      priority: "HIGH" as const,
      description: item.prayerRequest || "First-time visitor check-in",
      dueDate: new Date().toISOString().split("T")[0],
      organizationId,
    };

    followUpMutation.mutate(payload);
  };

  const handleMakeSecondTimer = (item: any) => {
    const itemId = item.id || item._id;
    visitTypeMutation.mutate({ id: itemId, ...item });
  };

  const columns: TableColumn[] = useMemo(() => [
    {
      key: "fullName",
      label: "Name",
    },
    {
      key: "prayerRequest",
      label: "Prayer Request",
    },
    {
      key: "firstVisit",
      label: "First Visit",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => {
        const itemId = item.id || item._id;
        const isUpdating = statusMutation.isPending && statusMutation.variables?.id === itemId;
        const status = isUpdating
          ? statusMutation.variables?.status
          : item.status?.toUpperCase() || "PENDING";

        const statusStyles: Record<string, string> = {
          PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          CONTACTED: "bg-blue-100 text-blue-800 border border-blue-200",
          FOLLOWED_UP: "bg-green-100 text-green-800 border border-green-200",
        };
        const statusLabels: Record<string, string> = {
          PENDING: "Pending",
          CONTACTED: "Contacted",
          FOLLOWED_UP: "Follow-up",
        };

        const style = statusStyles[status] || "bg-gray-100 text-gray-800 border border-gray-200";
        const label = statusLabels[status] || status;

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
            {isUpdating ? "Updating..." : label}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => {
        const itemId = item.id || item._id;
        const isFollowUpPending = followUpMutation.isPending && followUpMutation.variables?.newMemberId === itemId;
        const isStatusPending = statusMutation.isPending && statusMutation.variables?.id === itemId;
        const isDisabled = item.status?.toUpperCase() === "CONTACTED" || isFollowUpPending || isStatusPending;

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleSendFollowUp(item);
            }}
            disabled={isDisabled}
          >
            {isFollowUpPending ? "Sending..." : "Send follow-up"}
          </Button>
        );
      },
    },
    {
      key: "activate",
      label: "Activate",
      render: (item) => {
        const itemId = item.id || item._id;
        const isPending = visitTypeMutation.isPending && visitTypeMutation.variables?.id === itemId;

        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleMakeSecondTimer(item);
            }}
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Make second timer"}
          </Button>
        );
      },
    },
  ], [statusMutation, followUpMutation, visitTypeMutation, handleSendFollowUp, handleMakeSecondTimer]);

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-foreground font-bold text-lg">First Timers</h1>
        </div>
      </div>
      <DataManagementActions
        type="first-timers"
        onAddManual={() => setIsAddModalOpen(true)}
        onUploadSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["first-timers"] })
        }
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        type="first-timers"
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["first-timers"] })
        }
      />
      <Table
        data={data.map((item) => ({
          ...item,
          contacts: `${item.phoneNumber || item.phone} - ${item.email}`,
          visits: `${item.firstVisit || item.serviceDate} - ${item.secondVisit || "N/A"}`,
          prayerRequests: item.prayerRequest,
        }))}
        columns={columns}
      />
    </Card>
  );
}


