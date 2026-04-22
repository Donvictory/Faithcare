import { Heart, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Header } from "./Header";

const prayerRequestsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    request:
      "Please pray for my family as we navigate a difficult health diagnosis. We need strength and peace during this challenging time.",
    date: "Mar 4, 2026",
    status: "Praying",
  },
  {
    id: 2,
    name: "Michael Chen",
    request:
      "Asking for prayers for restoration in my marriage and wisdom to be a better husband and father.",
    date: "Mar 3, 2026",
    status: "Contacted",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    request:
      "I'm seeking God's guidance on a major career decision. Pray for clarity and courage to follow His path.",
    date: "Mar 3, 2026",
    status: "Praying",
  },
  {
    id: 4,
    name: "David Thompson",
    request:
      "Prayers for my mother's recovery from surgery and for our family's peace of mind.",
    date: "Mar 2, 2026",
    status: "Followed Up",
  },
  {
    id: 5,
    name: "Lisa Martinez",
    request:
      "Need prayer for financial breakthrough and provision as I face unexpected expenses.",
    date: "Mar 1, 2026",
    status: "Contacted",
  },
  {
    id: 6,
    name: "James Wilson",
    request:
      "Requesting prayers for my teenage son who is struggling with his faith and making difficult choices.",
    date: "Feb 29, 2026",
    status: "Followed Up",
  },
];

export function PrayerRequests() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Praying":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Contacted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Followed Up":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-full">
      <Header
        title="Prayer Requests"
        subtitle="Pray for one another and lift each other up"
      />
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {prayerRequestsData.map((prayer) => (
            <div
              key={prayer.id}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow shadow-sm flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-foreground">{prayer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {prayer.date}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(prayer.status)} font-bold`}
                >
                  {prayer.status}
                </Badge>
              </div>

              {/* Prayer Request */}
              <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
                "{prayer.request}"
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-auto">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-95">
                  <Heart className="w-4 h-4" />
                  Praying
                </button>
                <button className="px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors text-foreground shadow-sm">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
