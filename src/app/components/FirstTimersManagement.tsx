import { Send, QrCode, Calendar, UserCheck } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Header } from "./Header";

const firstTimersData = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "(555) 123-4567",
    email: "sarah.j@email.com",
    prayerRequest: "Guidance in new job transition",
    status: "Pending",
    dateRegistered: "Mar 2, 2026",
    sunday: "Mar 2, 2026",  
  },
  {
    id: 2,
    name: "Michael Chen",
    phone: "(555) 234-5678",
    email: "mchen@email.com",
    prayerRequest: "Family healing and reconciliation",
    status: "Contacted",
    dateRegistered: "Mar 2, 2026",
    sunday: "Mar 2, 2026",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    phone: "(555) 345-6789",
    email: "emily.r@email.com",
    prayerRequest: "Strength during health challenges",
    status: "Pending",
    dateRegistered: "Feb 23, 2026",
    sunday: "Feb 23, 2026",  
  },
  {
    id: 4,
    name: "David Thompson",
    phone: "(555) 456-7890",
    email: "dthompson@email.com",
    prayerRequest: "Wisdom in life decisions",
    status: "Followed Up",
    dateRegistered: "Feb 23, 2026",
    sunday: "Feb 23, 2026",
  },
  {
    id: 5,
    name: "Jessica Brown",
    phone: "(555) 567-8901",
    email: "jessica.b@email.com",
    prayerRequest: "Career guidance and direction",
    status: "Pending",
    dateRegistered: "Feb 16, 2026",
    sunday: "Feb 16, 2026", 
   }, 
  {
    id: 6,
    name: "Robert Wilson",
    phone: "(555) 678-9012",
    email: "robert.w@email.com",
    prayerRequest: "Financial breakthrough",
    status: "Contacted",
    dateRegistered: "Feb 16, 2026",
    sunday: "Feb 16, 2026",
  },
];

export function FirstTimersManagement() {
  const [selectedSunday, setSelectedSunday] = useState<string | null>(null);

  // Group first timers by Sunday
  const groupedBySunday = firstTimersData.reduce((acc, person) => {
    if (!acc[person.sunday]) {
      acc[person.sunday] = [];
    }
    acc[person.sunday].push(person);
    return acc;
  }, {} as Record<string, typeof firstTimersData>);

  // Get sorted Sunday dates (most recent first)
  const sundays = Object.keys(groupedBySunday).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

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

  const displayedData = selectedSunday
    ? groupedBySunday[selectedSunday]
    : firstTimersData;

  return (
    <div className="min-h-full">
      <Header title="First Timers Management" subtitle="Manage first timers and their registration"/>
      <div className="p-4 md:p-8 space-y-6">
      {/* QR Code Card */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 md:p-8 border border-accent/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 text-center md:text-left">
          <div>
            <h3 className="text-foreground text-lg md:text-xl font-medium mb-1 md:mb-2">First Timer Registration</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Scan to register as a First Timer
            </p>
          </div>
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg p-2 md:p-3 border border-accent/20 flex flex-shrink-0 items-center justify-center">
            <QrCode className="w-full h-full text-foreground" />
          </div>
        </div>
      </div>

      {/* Sunday Filter Tabs */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-foreground">Filter by Sunday</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSunday(null)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedSunday === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Sundays ({firstTimersData.length})
          </button>
          {sundays.map((sunday) => (
            <button
              key={sunday}
              onClick={() => setSelectedSunday(sunday)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedSunday === sunday
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {sunday} ({groupedBySunday[sunday].length})
            </button>
          ))}
        </div>
      </div>

      {/* First Timers Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                  Prayer Request
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                  Sunday
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                  Activate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayedData.map((person) => (
                <tr key={person.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">
                    {person.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {person.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {person.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                    {person.prayerRequest}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {person.sunday}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={getStatusColor(person.status)}
                    >
                      {person.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0 whitespace-nowrap">
                      <Send className="w-4 h-4" />
                      Send Follow Up
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors flex-shrink-0 whitespace-nowrap">
                      <UserCheck className="w-4 h-4" />
                      Make Second Timer
                    </button>
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