import { useState } from "react";
import Table from "./ui/table/Table";
import { TableColumn } from "./ui/table/types";
import { Card } from "./ui/card";
import { useSearch } from "../contexts/SearchContext";
import { AddMemberModal } from "./AddMemberModal";
import { useQueryClient } from "@tanstack/react-query";
import { DataManagementActions } from "./DataManagementActions";

const columns: TableColumn[] = [
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
  },
  {
    key: "actions",
    label: "Actions",
    // render: (value) => <Button variant="outline">{value}</Button>,
  },
];

export default function FirstTimersTable({ data }: { data: any[] }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

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
          contacts: `${item.phone} - ${item.email}`,
          visits: `${item.firstVisit} - ${item.secondVisit}`,
          prayerRequests: item.prayerRequest,
          status: item.status,
          actions: "Actions",
        }))}
        columns={columns}
      />
    </Card>
  );
}
