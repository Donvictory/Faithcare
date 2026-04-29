import React, { useState } from "react";
import Table from "./ui/table/Table";
import { TableColumn } from "./ui/table/types";
import { Card } from "./ui/card";
import SearchBar from "./ui/search-bar";
import { useSearch } from "../contexts/SearchContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ListFilter } from "lucide-react";
import { Button } from "./ui/button";
import { DataManagementActions } from "./DataManagementActions";
import { AddMemberModal } from "./AddMemberModal";
import { useQueryClient } from "@tanstack/react-query";

const columns: TableColumn[] = [
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
  },
  {
    key: "actions",
    label: "Actions",
    // render: (value) => <Button variant="outline">{value}</Button>,
  },
];

export default function SecondTimersTable({ data }: { data: any[] }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

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
          queryClient.invalidateQueries({ queryKey: ["first-timers"] })
        }
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        type="second-timers"
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
