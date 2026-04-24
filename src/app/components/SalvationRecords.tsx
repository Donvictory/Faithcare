import { useState } from "react";
import { Phone, MessageCircle, PhoneCall, Send, Heart, Search } from "lucide-react";
import { Badge } from "./ui/badge";
import { Header } from "./Header";
import { useSearch } from "../contexts/SearchContext";

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
  const { searchTerm, setSearchTerm } = useSearch();
  const [showFollowUpMenu, setShowFollowUpMenu] = useState<number | null>(null);

  const filteredRecords = salvationRecordsData.filter((record) => {
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      record.name.toLowerCase().includes(searchLower) ||
      record.notes.toLowerCase().includes(searchLower) ||
      record.email.toLowerCase().includes(searchLower) ||
      record.phone.toLowerCase().includes(searchLower)
    );
  });

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
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-green-700 mb-1">Total Salvations</p>
                <h3 className="text-3xl font-bold text-green-900">
                  {salvationRecordsData.length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-6 border border-yellow-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-yellow-700 mb-1">
                  Pending Follow Ups
                </p>
                <h3 className="text-3xl font-bold text-yellow-900">
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

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-700 mb-1">This Month</p>
                <h3 className="text-3xl font-bold text-blue-900">
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

        {/* Info Section */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm border-l-4 border-l-green-500">
           <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
             <Heart className="w-5 h-5 text-red-500 fill-red-500" />
             Reaching Souls
           </h3>
           <p className="text-muted-foreground leading-relaxed">
             Track every soul won for the kingdom. Ensure no decision goes without follow-up and discipleship.
             {searchTerm && (
                <span className="block mt-2 text-accent font-bold">
                  Searching for: "{searchTerm}"
                </span>
             )}
           </p>
        </div>

        {/* Salvation Records Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Info</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Decision Date</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Reflections/Notes</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground italic">
                      No records found matching your search.
                    </td>
                  </tr>
                ) : filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-5 text-sm font-bold text-foreground">
                      {record.name}
                    </td>
                    <td className="px-6 py-5 text-xs text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{record.phone}</span>
                        <span>{record.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-foreground/70">
                      {record.dateOfDecision}
                    </td>
                    <td className="px-6 py-5 text-xs text-muted-foreground max-w-xs leading-relaxed italic">
                      "{record.notes}"
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(record.followUpStatus)} font-bold text-[10px] uppercase tracking-widest px-2.5 py-1`}
                      >
                        {record.followUpStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right relative">
                      <button
                        onClick={() =>
                          setShowFollowUpMenu(
                            showFollowUpMenu === record.id ? null : record.id,
                          )
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-bold shadow-md shadow-primary/20 active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                        Follow Up
                      </button>

                      {/* Follow Up Menu */}
                      {showFollowUpMenu === record.id && (
                        <div className="absolute right-6 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in zoom-in-95 duration-200 text-left">
                           <button
                              onClick={() => handleFollowUp(record.id, "SMS")}
                              className="w-full flex items-center gap-3 px-5 py-3 text-sm text-foreground hover:bg-muted transition-colors font-bold"
                            >
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              Send SMS
                            </button>
                            <button
                              onClick={() => handleFollowUp(record.id, "WhatsApp")}
                              className="w-full flex items-center gap-3 px-5 py-3 text-sm text-foreground hover:bg-muted transition-colors font-bold"
                            >
                              <Phone className="w-4 h-4 text-green-600" />
                              WhatsApp
                            </button>
                            <button
                              onClick={() => handleFollowUp(record.id, "Call")}
                              className="w-full flex items-center gap-3 px-5 py-3 text-sm text-foreground hover:bg-muted transition-colors font-bold"
                            >
                              <PhoneCall className="w-4 h-4 text-blue-500" />
                              Make Call
                            </button>
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
