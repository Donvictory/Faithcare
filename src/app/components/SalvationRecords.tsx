import { useState } from "react";
import { Phone, MessageCircle, PhoneCall, Send } from "lucide-react";
import { Badge } from "./ui/badge";
import { Header } from "./Header";

interface SalvationRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  dateOfDecision: string;
  followUpStatus: string;
  notes: string;
}

const salvationRecordsData: SalvationRecord[] = [
  {
    id: 1,
    name: "Jennifer Williams",
    phone: "(555) 789-0123",
    email: "jennifer.w@email.com",
    dateOfDecision: "Mar 5, 2026",
    followUpStatus: "Pending",
    notes: "Made decision during altar call",
  },
  {
    id: 2,
    name: "Marcus Anderson",
    phone: "(555) 890-1234",
    email: "marcus.a@email.com",
    dateOfDecision: "Mar 3, 2026",
    followUpStatus: "Contacted",
    notes: "Requested baptism information",
  },
  {
    id: 3,
    name: "Lisa Martinez",
    phone: "(555) 901-2345",
    email: "lisa.m@email.com",
    dateOfDecision: "Feb 28, 2026",
    followUpStatus: "Followed Up",
    notes: "Connected with small group",
  },
  {
    id: 4,
    name: "Robert Taylor",
    phone: "(555) 012-3456",
    email: "robert.t@email.com",
    dateOfDecision: "Feb 26, 2026",
    followUpStatus: "Pending",
    notes: "Came forward during worship",
  },
];

export function SalvationRecords() {
  const [showFollowUpMenu, setShowFollowUpMenu] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Contacted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Followed Up":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleFollowUp = (recordId: number, method: string) => {
    console.log(`Following up with record ${recordId} via ${method}`);
    setShowFollowUpMenu(null);
    // In a real app, this would trigger the respective communication method
  };

  return (
    <div className="min-h-full">
      <Header
        title="Salvation Records"
        subtitle="Manage salvation records and their registration"
      />
      <div className="p-4 md:p-8 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Total Salvations</p>
                <h3 className="text-3xl text-green-900">
                  {salvationRecordsData.length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">
                  Pending Follow Ups
                </p>
                <h3 className="text-3xl text-yellow-900">
                  {
                    salvationRecordsData.filter(
                      (r) => r.followUpStatus === "Pending",
                    ).length
                  }
                </h3>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">This Month</p>
                <h3 className="text-3xl text-blue-900">
                  {
                    salvationRecordsData.filter((r) =>
                      r.dateOfDecision.includes("Mar"),
                    ).length
                  }
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Salvation Records Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground font-bold">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground font-bold">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground font-bold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground font-bold">
                    Decision Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground font-bold">
                    Notes
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground font-bold">
                    Follow Up
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {salvationRecordsData.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground">
                      {record.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {record.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {record.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {record.dateOfDecision}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                      {record.notes}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={getStatusColor(record.followUpStatus)}
                      >
                        {record.followUpStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={() =>
                          setShowFollowUpMenu(
                            showFollowUpMenu === record.id ? null : record.id,
                          )
                        }
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Send Follow Up
                      </button>

                      {/* Follow Up Menu */}
                      {showFollowUpMenu === record.id && (
                        <div className="absolute right-6 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleFollowUp(record.id, "SMS")}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Send SMS
                            </button>
                            <button
                              onClick={() =>
                                handleFollowUp(record.id, "WhatsApp")
                              }
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              Send WhatsApp
                            </button>
                            <button
                              onClick={() => handleFollowUp(record.id, "Call")}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <PhoneCall className="w-4 h-4" />
                              Make Call
                            </button>
                          </div>
                        </div>
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
