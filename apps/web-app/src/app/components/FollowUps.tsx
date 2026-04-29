import { CheckCircle, Clock, User, Trash2, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Header } from "./Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFollowUps, updateFollowUp, deleteFollowUp } from "@/api/church";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { useSearch } from "../contexts/SearchContext";
import { DataManagementActions } from "./DataManagementActions";
import { AddMemberModal } from "./AddMemberModal";
import { useState } from "react";

export function FollowUps() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { searchTerm } = useSearch();
  const organizationId = user?.organizationId || user?.id || user?._id || "";
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: followUpsResponse, isLoading } = useQuery({
    queryKey: ["follow-ups", organizationId],
    queryFn: () => getFollowUps(organizationId),
    enabled: !!organizationId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateFollowUp(organizationId, id, { status, organizationId }),
    onSuccess: () => {
      toast.success("Follow-up updated");
      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
    },
    onError: (error: any) => toast.error(error.message || "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFollowUp(organizationId, id),
    onSuccess: () => {
      toast.success("Follow-up removed");
      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete"),
  });

  const followUpsRaw = followUpsResponse?.data || [];
  const followUps = Array.isArray(followUpsRaw)
    ? followUpsRaw
    : followUpsRaw.data && Array.isArray(followUpsRaw.data)
      ? followUpsRaw.data
      : [];

  const filteredFollowUps = followUps.filter((f: any) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (f.name || "").toLowerCase().includes(lowerSearch) ||
      (f.description || f.note || "").toLowerCase().includes(lowerSearch)
    );
  });

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (tag: string) => {
    switch (tag?.toUpperCase()) {
      case "FIRST_TIMER":
      case "FIRST TIMER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "PRAYER_REQUEST":
      case "PRAYER REQUEST":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FOLLOW_UP":
      case "FOLLOW UP":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full flex flex-col">
        <Header
          title="Follow Ups"
          subtitle="Track and manage pastor follow-ups with members"
        />
        <div className="flex-1 flex items-center justify-center p-12">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <Header
        title="Follow Ups"
        subtitle="Track and manage pastor follow-ups with members"
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Bulk Actions and Add New */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-foreground">Data Management</h3>
            <p className="text-sm text-muted-foreground italic">Upload or add new records manually</p>
          </div>
          <DataManagementActions 
            type="follow-ups" 
            onAddManual={() => setIsAddModalOpen(true)}
            onUploadSuccess={() => queryClient.invalidateQueries({ queryKey: ["follow-ups"] })}
          />
        </div>

        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          type="follow-ups"
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["follow-ups"] })}
        />

        <div className="space-y-6">
        {filteredFollowUps.length === 0 ? (
          <div className="py-24 text-center bg-muted/10 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-muted-foreground italic">
              {searchTerm ? `No follow-ups matching "${searchTerm}"` : "No pending follow-ups at the moment."}
            </p>
          </div>
        ) : (
          filteredFollowUps.map((followUp: any) => (
            <div
              key={followUp.id || followUp._id}
              className={`bg-card rounded-2xl p-6 md:p-8 border transition-all group ${
                followUp.status?.toUpperCase() === "COMPLETED"
                  ? "border-border opacity-60"
                  : "border-border hover:shadow-xl hover:border-accent/40"
              }`}
            >
              <div className="flex items-start justify-between">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                      <User className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-lg">
                        {followUp.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {(followUp.tags || []).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`${getTypeColor(tag)} font-bold text-[10px] tracking-wider uppercase px-2 py-0.5`}
                          >
                            {tag.replace("_", " ")}
                          </Badge>
                        ))}
                        <Badge
                          variant="outline"
                          className={`${getPriorityColor(followUp.priority)} font-bold text-[10px] tracking-wider uppercase px-2 py-0.5`}
                        >
                          {followUp.priority || "MEDIUM"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="ml-[64px]">
                    <p className="text-foreground/80 mb-4 leading-relaxed">
                      {followUp.description || followUp.note}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 w-fit px-3 py-1.5 rounded-lg border border-border/50">
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">
                        Due{" "}
                        {followUp.dueDate
                          ? new Date(followUp.dueDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="ml-4 flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    {followUp.status?.toUpperCase() === "COMPLETED" ? (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Completed
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            id: followUp.id || followUp._id,
                            status: "COMPLETED",
                          })
                        }
                        disabled={updateMutation.isPending}
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 text-sm font-bold disabled:opacity-50"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm("Delete this follow-up record?")) {
                          deleteMutation.mutate(followUp.id || followUp._id);
                        }
                      }}
                      className="p-2.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
