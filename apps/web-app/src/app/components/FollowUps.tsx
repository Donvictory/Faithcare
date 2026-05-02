import { useLayout } from "../contexts/LayoutContext";
import { CheckCircle, Clock, User, Trash2, Loader2, MessageSquare, MessageCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFollowUps, updateFollowUp, deleteFollowUp } from "@/api/church";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { useSearch } from "../contexts/SearchContext";
import { DataManagementActions } from "./DataManagementActions";
import { AddMemberModal } from "./AddMemberModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "@/components/ui/button";

export function FollowUps() {
  const { setHeader } = useLayout();
  useEffect(() => {
    setHeader("Follow Ups", "Track and manage pastor follow-ups with members");
  }, []);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { searchTerm, setSearchTerm } = useSearch();
  const organizationId = user?.organizationId || user?.id || user?._id || "";
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

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

  // Debug: log API response shape so we can verify what the server returns
  console.log("[FollowUps] Raw API response:", followUpsResponse);

  // Helper to robustly find the data array
  const followUps = (() => {
    if (!followUpsResponse) return [];
    if (Array.isArray(followUpsResponse)) return followUpsResponse;
    if (Array.isArray(followUpsResponse.data)) return followUpsResponse.data;
    if (followUpsResponse.data && Array.isArray(followUpsResponse.data.data)) return followUpsResponse.data.data;
    if (followUpsResponse.data && Array.isArray(followUpsResponse.data.followUps)) return followUpsResponse.data.followUps;
    // Deep search fallback
    const findArray = (obj: any): any[] => {
      if (!obj || typeof obj !== "object") return [];
      for (const key in obj) {
        if (Array.isArray(obj[key])) return obj[key];
        if (typeof obj[key] === "object" && obj[key] !== null) {
          const nested = findArray(obj[key]);
          if (nested.length > 0) return nested;
        }
      }
      return [];
    };
    return findArray(followUpsResponse);
  })();

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
      <div className="space-y-6">
        <div className="flex-1 flex items-center justify-center p-12">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="space-y-6">
        {/* Bulk Actions and Add New */}
        <Card className="flex flex-col gap-3 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-accent/20 text-accent hover:bg-accent/10 font-bold text-sm h-9"
              onClick={() => navigate("/bulk-messaging")}
            >
              <MessageCircle className="w-4 h-4" />
              Send Bulk Follow-up
            </Button>
          </div>
          <DataManagementActions
            hasFilters={false}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            type="follow-ups"
            onAddManual={() => setIsAddModalOpen(true)}
            onUploadSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["follow-ups"] })
            }
          />
        </Card>

        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          type="follow-ups"
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["follow-ups"] })
          }
        />

        <div className="space-y-6">
          {filteredFollowUps.length === 0 ? (
            <Card variant="ghost" padding="xl" className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle className="w-12 h-12 text-muted-foreground/30" />
              <p className="text-muted-foreground italic text-center">
                {searchTerm
                  ? `No follow-ups matching"${searchTerm}"`
                  : "No pending follow-ups at the moment."}
              </p>
            </Card>
          ) : (
            filteredFollowUps.map((followUp: any) => (
              <Card
                key={followUp.id || followUp._id}
                padding="none"
                className={`transition-all group ${
                  followUp.status?.toUpperCase() === "COMPLETED"
                    ? "opacity-60"
                    : "hover:shadow-xl hover:border-accent/40"
                }`}
              >
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left Side */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground font-bold text-base sm:text-lg truncate">
                            {followUp.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {(followUp.tags || []).map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className={`${getTypeColor(tag)} font-bold text-[10px] tracking-wider uppercase px-2 py-0.5`}
                              >
                                {tag.replace("_", "")}
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
                      <div className="pl-[52px] sm:pl-[60px]">
                        <p className="text-foreground/80 mb-3 leading-relaxed text-sm sm:text-base">
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
                    <div className="flex flex-col sm:flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                      <div className="flex items-center gap-2 justify-center sm:justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            toast.success(`Opening WhatsApp for ${followUp.name}`);
                            window.open(`https://wa.me/${followUp.phone || ""}?text=${encodeURIComponent("Hi " + followUp.name + ", this is Faithcare...")}`, "_blank");
                          }}
                          className="text-accent border-accent/20"
                          title="Send WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            toast.success(`Opening SMS for ${followUp.name}`);
                          }}
                          className="text-blue-500 border-blue-100 hover:bg-blue-50"
                          title="Send SMS"
                        >
                          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Delete this follow-up record?")) {
                              deleteMutation.mutate(followUp.id || followUp._id);
                            }
                          }}
                          className="text-muted-foreground hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                      {followUp.status?.toUpperCase() === "COMPLETED" ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200 w-full sm:w-auto">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Completed
                          </span>
                        </div>
                      ) : (
                        <Button
                          onClick={() =>
                            updateMutation.mutate({
                              id: followUp.id || followUp._id,
                              status: "COMPLETED",
                            })
                          }
                          disabled={updateMutation.isPending}
                          className="w-full sm:w-auto px-6 rounded-xl shadow-lg shadow-primary/20"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
