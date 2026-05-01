import React, { useState, useMemo } from "react";
import Table from "./ui/table/Table";
import { TableColumn } from "./ui/table/types";
import { Card } from "./ui/card";
import { useSearch } from "../contexts/SearchContext";
import { DataManagementActions } from "./DataManagementActions";
import { AddMemberModal } from "./AddMemberModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFirstTimerStatus } from "@/api/church";
import { toast } from "react-hot-toast";

export default function SecondTimersTable({ data }: { data: any[] }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateFirstTimerStatus(id, { status, notes: `Status updated to ${status}` }),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["second-timers"] });
    },
    onError: (error: any) => toast.error(error.message || "Failed to update status"),
  });

  const columns: TableColumn[] = useMemo(() => [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "contacts",
      label: "Contacts",
    },
    {
      key: "visits",
      label: "Visits",
    },
    {
      key: "prayerRequests",
      label: "Prayer Requests",
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
  ], [statusMutation]);

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-foreground font-bold text-lg">Second Timers</h1>
        </div>
      </div>
      <DataManagementActions
        type="second-timers"
        onAddManual={() => setIsAddModalOpen(true)}
        onUploadSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["second-timers"] })
        }
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        type="second-timers"
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["second-timers"] })
        }
      />
      <Table
        data={data.map((item) => ({
          ...item,
          contacts: `${item.phoneNumber || item.phone || "N/A"} - ${item.email || "N/A"}`,
          visits: `${item.firstVisit || item.serviceDate || "N/A"} - ${item.secondVisit || item.secondVisitDate || "N/A"}`,
          prayerRequests: item.prayerRequest || "None",
        }))}
        columns={columns}
      />
    </Card>
  );
}
