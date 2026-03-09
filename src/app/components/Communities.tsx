import { useState } from "react";
import { Plus, Upload, Users, Send, MessageCircle, Phone, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";

interface CommunityMember {
  id: number;
  name: string;
  phone: string;
  email: string;
  joinDate: string;
}

interface Community {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  members: CommunityMember[];
  createdDate: string;
}

const initialCommunities: Community[] = [
  {
    id: 1,
    name: "Young Professionals",
    description: "Ages 25-35, career-focused believers",
    memberCount: 24,
    createdDate: "Jan 15, 2026",
    members: [
      {
        id: 1,
        name: "John Smith",
        phone: "(555) 111-2222",
        email: "john.s@email.com",
        joinDate: "Jan 20, 2026",
      },
      {
        id: 2,
        name: "Mary Johnson",
        phone: "(555) 222-3333",
        email: "mary.j@email.com",
        joinDate: "Jan 22, 2026",
      },
      {
        id: 3,
        name: "David Lee",
        phone: "(555) 333-4444",
        email: "david.l@email.com",
        joinDate: "Jan 25, 2026",
      },
    ],
  },
  {
    id: 2,
    name: "Worship Team",
    description: "Musicians and vocalists serving in Sunday services",
    memberCount: 18,
    createdDate: "Feb 1, 2026",
    members: [
      {
        id: 4,
        name: "Sarah Williams",
        phone: "(555) 444-5555",
        email: "sarah.w@email.com",
        joinDate: "Feb 5, 2026",
      },
      {
        id: 5,
        name: "Michael Brown",
        phone: "(555) 555-6666",
        email: "michael.b@email.com",
        joinDate: "Feb 8, 2026",
      },
    ],
  },
  {
    id: 3,
    name: "Small Group Leaders",
    description: "Leaders of home fellowship groups",
    memberCount: 12,
    createdDate: "Feb 10, 2026",
    members: [
      {
        id: 6,
        name: "Robert Davis",
        phone: "(555) 666-7777",
        email: "robert.d@email.com",
        joinDate: "Feb 12, 2026",
      },
      {
        id: 7,
        name: "Jennifer Wilson",
        phone: "(555) 777-8888",
        email: "jennifer.w@email.com",
        joinDate: "Feb 15, 2026",
      },
    ],
  },
];

export function Communities() {
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showNewCommunityForm, setShowNewCommunityForm] = useState(false);
  const [showFollowUpMenu, setShowFollowUpMenu] = useState<number | null>(null);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });

  const handleCreateCommunity = () => {
    if (newCommunity.name.trim()) {
      const community: Community = {
        id: communities.length + 1,
        name: newCommunity.name,
        description: newCommunity.description,
        memberCount: 0,
        members: [],
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setCommunities([...communities, community]);
      setNewCommunity({ name: "", description: "" });
      setShowNewCommunityForm(false);
    }
  };

  const handleFileUpload = (communityId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Uploading ${file.name} for community ${communityId}`);
      // In a real app, this would parse the Excel file and add members
      alert(`File "${file.name}" uploaded successfully! Members will be imported.`);
    }
  };

  const handleFollowUp = (memberId: number, method: string) => {
    console.log(`Following up with member ${memberId} via ${method}`);
    setShowFollowUpMenu(null);
    alert(`${method} follow-up initiated!`);
  };

  const handleDeleteCommunity = (communityId: number) => {
    if (confirm("Are you sure you want to delete this community?")) {
      setCommunities(communities.filter((c) => c.id !== communityId));
      if (selectedCommunity?.id === communityId) {
        setSelectedCommunity(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-foreground">Communities</h2>
          <p className="text-muted-foreground mt-1">
            Manage your church communities and stay connected with members
          </p>
        </div>
        <button
          onClick={() => setShowNewCommunityForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Community
        </button>
      </div>

      {/* New Community Form */}
      {showNewCommunityForm && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-foreground mb-4">Create New Community</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Community Name
              </label>
              <input
                type="text"
                value={newCommunity.name}
                onChange={(e) =>
                  setNewCommunity({ ...newCommunity, name: e.target.value })
                }
                placeholder="e.g., Young Adults Fellowship"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Description
              </label>
              <textarea
                value={newCommunity.description}
                onChange={(e) =>
                  setNewCommunity({ ...newCommunity, description: e.target.value })
                }
                placeholder="Brief description of this community"
                rows={3}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateCommunity}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Community
              </button>
              <button
                onClick={() => {
                  setShowNewCommunityForm(false);
                  setNewCommunity({ name: "", description: "" });
                }}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div
            key={community.id}
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedCommunity(community)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCommunity(community.id);
                }}
                className="text-muted-foreground hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-foreground mb-2">{community.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {community.description}
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {community.memberCount} Members
              </Badge>
              <span className="text-xs text-muted-foreground">
                {community.createdDate}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Community Details */}
      {selectedCommunity && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground mb-2">{selectedCommunity.name}</h3>
                <p className="text-muted-foreground">{selectedCommunity.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Excel
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => handleFileUpload(selectedCommunity.id, e)}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setSelectedCommunity(null)}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Members Table */}
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
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">
                    Follow Up
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selectedCommunity.members.length > 0 ? (
                  selectedCommunity.members.map((member) => (
                    <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {member.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {member.joinDate}
                      </td>
                      <td className="px-6 py-4 relative">
                        <button
                          onClick={() =>
                            setShowFollowUpMenu(
                              showFollowUpMenu === member.id ? null : member.id
                            )
                          }
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Follow Up
                        </button>

                        {/* Follow Up Menu */}
                        {showFollowUpMenu === member.id && (
                          <div className="absolute right-6 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleFollowUp(member.id, "SMS")}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                Send SMS
                              </button>
                              <button
                                onClick={() => handleFollowUp(member.id, "WhatsApp")}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                                Send WhatsApp
                              </button>
                              <button
                                onClick={() => handleFollowUp(member.id, "Call")}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                                Make Call
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No members yet. Upload an Excel file to add members to this community.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
