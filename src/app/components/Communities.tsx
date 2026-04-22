import { useState } from "react";
import { Plus, Upload, Users, Send, MessageCircle, Phone, Trash2, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Header } from "./Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCommunities, createCommunity, deleteCommunity, updateCommunity } from "@/api/church";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { LoadingScreen } from "./LoadingScreen";

interface CommunityMember {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  joinDate: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: CommunityMember[];
  createdDate: string;
  profileImage?: string;
}

export function Communities() {
  const { accessToken, user } = useAuth();
  const queryClient = useQueryClient();
  const organizationId = user?.organizationId || user?.id || "";

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showNewCommunityForm, setShowNewCommunityForm] = useState(false);
  const [showFollowUpMenu, setShowFollowUpMenu] = useState<string | number | null>(null);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });

  // Query communities
  const { data: communitiesResponse, isLoading } = useQuery({
    queryKey: ["communities", organizationId],
    queryFn: () => getCommunities(organizationId),
    enabled: !!organizationId,
  });

  const communities: Community[] = communitiesResponse?.success
    ? communitiesResponse.data.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || "No description provided",
        memberCount: c.members?.length || 0,
        members: (c.members || []).map((m: any) => ({
          id: m.id,
          name: m.fullName || m.name || "Unknown",
          phone: m.phoneNumber || "N/A",
          email: m.email || "N/A",
          joinDate: m.createdAt?.split('T')[0] || "N/A"
        })),
        profileImage: c.profileImage,
        createdDate: c.createdAt?.split('T')[0] || "N/A",
      }))
    : [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => createCommunity(organizationId, payload),
    onSuccess: () => {
      toast.success("Community created!");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      setShowNewCommunityForm(false);
      setNewCommunity({ name: "", description: "" });
    },
    onError: (error: any) => toast.error(error.message || "Failed to create community"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCommunity(organizationId, id),
    onSuccess: () => {
      toast.success("Community deleted");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      setSelectedCommunity(null);
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete"),
  });

  const handleCreateCommunity = () => {
    if (newCommunity.name.trim()) {
      createMutation.mutate({
        name: newCommunity.name,
        description: newCommunity.description,
        organizationId: organizationId,
      });
    }
  };

  const handleFileUpload = (communityId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)), // Mock upload
        {
          loading: 'Importing members...',
          success: 'Members imported successfully!',
          error: 'Import failed.',
        }
      );
    }
  };

  if (isLoading) {
    return <LoadingScreen churchName={user?.churchName || user?.name} />;
  }
  return (
    <div className="min-h-full font-sans">
      <Header title="Communities" subtitle="Manage your church groups and fellowships" />
      
      <div className="p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
             <Users className="w-5 h-5 text-accent" />
             Active Groups
          </h2>
          <button
            onClick={() => setShowNewCommunityForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Community
          </button>
        </div>

        {showNewCommunityForm && (
          <div className="bg-card rounded-xl border border-border p-8 shadow-md">
            <h3 className="text-lg font-bold text-foreground mb-6">Create New Fellowship Group</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground uppercase tracking-wider ml-1">Group Name</label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                  placeholder="e.g., Young Adults Fellowship"
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground uppercase tracking-wider ml-1">Description</label>
                <input
                  type="text"
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  placeholder="e.g., Connect with believers aged 18-35"
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateCommunity}
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {createMutation.isPending ? "Creating..." : "Save Fellowship"}
              </button>
              <button
                onClick={() => setShowNewCommunityForm(false)}
                className="px-6 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communities.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border">
              <p className="text-muted-foreground italic mb-4">No communities set up yet.</p>
              <button onClick={() => setShowNewCommunityForm(true)} className="text-primary hover:underline">Create your first group</button>
            </div>
          ) : communities.map((community) => (
            <div
              key={community.id}
              onClick={() => setSelectedCommunity(community)}
              className={`group relative bg-card rounded-2xl border p-6 transition-all cursor-pointer hover:border-accent hover:shadow-xl ${selectedCommunity?.id === community.id ? 'border-accent ring-1 ring-accent bg-accent/5' : 'border-border'}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center overflow-hidden border border-accent/20">
                  {community.profileImage ? (
                    <img src={community.profileImage} alt={community.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-7 h-7 text-accent" />
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${community.name}" group?`)) deleteMutation.mutate(community.id);
                  }}
                  className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{community.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] mb-6">
                {community.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {community.memberCount} Members
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground bg-muted p-1 px-2 rounded-md">
                  Since {community.createdDate}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedCommunity && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-8 border-b border-border">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{selectedCommunity.name}</h3>
                  <p className="text-muted-foreground max-w-xl">{selectedCommunity.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all cursor-pointer font-medium shadow-md">
                    <Upload className="w-4 h-4" />
                    Import Members
                    <input type="file" accept=".xlsx,.csv" onChange={(e) => handleFileUpload(selectedCommunity.id, e)} className="hidden" />
                  </label>
                  <button onClick={() => setSelectedCommunity(null)} className="px-5 py-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all font-medium">
                    Close Details
                  </button>
                </div>
              </div>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Member</th>
                    <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                    <th className="px-8 py-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Follow Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {selectedCommunity.members.length > 0 ? (
                    selectedCommunity.members.map((member) => (
                      <tr key={member.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">{member.name}</span>
                            <span className="text-xs text-muted-foreground">{member.phone} • {member.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs text-muted-foreground">{member.joinDate}</span>
                        </td>
                        <td className="px-8 py-5 text-right relative">
                          <button
                            onClick={() => setShowFollowUpMenu(showFollowUpMenu === member.id ? null : member.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Message
                          </button>
                          
                          {showFollowUpMenu === member.id && (
                            <div className="absolute right-8 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-in zoom-in-95 duration-200">
                               <button onClick={() => {toast.success("SMS Sent!"); setShowFollowUpMenu(null)}} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"><MessageCircle className="w-4 h-4 text-green-500" /> Send SMS</button>
                               <button onClick={() => {toast.success("WhatsApp Sent!"); setShowFollowUpMenu(null)}} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"><Phone className="w-4 h-4 text-green-600" /> WhatsApp</button>
                               <button onClick={() => {toast.success("Call Initiated!"); setShowFollowUpMenu(null)}} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"><Phone className="w-4 h-4 text-blue-500" /> Make Call</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-8 py-16 text-center text-muted-foreground italic">
                        The "{selectedCommunity.name}" group has no members yet. Use the import button to add believers from your Excel/CSV records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
