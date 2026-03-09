import { CheckCircle, Clock, User } from "lucide-react";
import { Badge } from "./ui/badge";

const followUpsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    type: "First Timer",
    note: "Follow up on prayer request for job transition",
    dueDate: "Mar 6, 2026",
    priority: "High",
    status: "Pending",
  },
  {
    id: 2,
    name: "Michael Chen",
    type: "Prayer Request",
    note: "Check in on family situation",
    dueDate: "Mar 5, 2026",
    priority: "High",
    status: "Pending",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    type: "First Timer",
    note: "Send welcome package and connect with small group",
    dueDate: "Mar 7, 2026",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: 4,
    name: "David Thompson",
    type: "Follow Up",
    note: "Prayer answered - celebrate with them!",
    dueDate: "Mar 4, 2026",
    priority: "Low",
    status: "Completed",
  },
  {
    id: 5,
    name: "Lisa Martinez",
    type: "Prayer Request",
    note: "Financial needs follow up",
    dueDate: "Mar 8, 2026",
    priority: "Medium",
    status: "Pending",
  },
];

export function FollowUps() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "First Timer":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Prayer Request":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Follow Up":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {followUpsData.map((followUp) => (
        <div
          key={followUp.id}
          className={`bg-card rounded-xl p-6 border transition-all ${
            followUp.status === "Completed"
              ? "border-border opacity-60"
              : "border-border hover:shadow-md"
          }`}
        >
          <div className="flex items-start justify-between">
            {/* Left Side */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground">{followUp.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={getTypeColor(followUp.type)}
                    >
                      {followUp.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(followUp.priority)}
                    >
                      {followUp.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground ml-[52px] mb-3">
                {followUp.note}
              </p>
              <div className="flex items-center gap-2 ml-[52px] text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Due {followUp.dueDate}</span>
              </div>
            </div>

            {/* Right Side */}
            <div className="ml-4">
              {followUp.status === "Completed" ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Completed</span>
                </div>
              ) : (
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Complete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
