import { useLayout } from "../contexts/LayoutContext";
import { Heart, User, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPrayerRequests,
  updatePrayerRequest,
  deletePrayerRequest,
} from "@/api/church";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { useSearch } from "../contexts/SearchContext";
import { DataManagementActions } from "./DataManagementActions";
import { AddMemberModal } from "./AddMemberModal";
import { Card } from "./ui/card";

export function PrayerRequests() {
  const { setHeader } = useLayout();
  useEffect(() => {
    setHeader("Prayer Requests", "Pray for one another and lift each other up");
  }, []);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { searchTerm, setSearchTerm } = useSearch();
  const organizationId = user?.organizationId || user?.id || user?._id || "";
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: prayerResponse, isLoading } = useQuery({
    queryKey: ["prayer-requests", organizationId],
    queryFn: () => getPrayerRequests(organizationId),
    enabled: !!organizationId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updatePrayerRequest(organizationId, id, { status, organizationId }),
    onSuccess: () => {
      toast.success("Prayer status updated");
      queryClient.invalidateQueries({ queryKey: ["prayer-requests"] });
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePrayerRequest(organizationId, id),
    onSuccess: () => {
      toast.success("Prayer request removed");
      queryClient.invalidateQueries({ queryKey: ["prayer-requests"] });
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to delete request"),
  });

  const prayerRequestsRaw = prayerResponse?.data || [];
  const prayerRequests = Array.isArray(prayerRequestsRaw)
    ? prayerRequestsRaw
    : prayerRequestsRaw.data && Array.isArray(prayerRequestsRaw.data)
      ? prayerRequestsRaw.data
      : [];

  const filteredRequests = prayerRequests.filter((prayer: any) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (prayer.name || "Anonymous").toLowerCase().includes(lowerSearch) ||
      (prayer.description || prayer.request || "")
        .toLowerCase()
        .includes(lowerSearch)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PRAYING":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FOLLOWED UP":
      case "FOLLOWED_UP":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
        <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Data Management
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload or add new requests manually
            </p>
          </div>
          <DataManagementActions
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            hasFilters={false}
            type="prayer-requests"
            onAddManual={() => setIsAddModalOpen(true)}
            onUploadSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["prayer-requests"] })
            }
          />
        </Card>

        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          type="prayer-requests"
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["prayer-requests"] })
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredRequests.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-muted/10 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
              <Heart className="w-12 h-12 text-muted-foreground/30" />
              <p className="text-muted-foreground italic">
                {searchTerm
                  ? `No requests matching"${searchTerm}"`
                  : "No prayer requests at the moment."}
              </p>
            </div>
          ) : (
            filteredRequests.map((prayer: any) => (
              <div
                key={prayer.id || prayer._id}
                className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:shadow-xl hover:border-accent/40 transition-all shadow-sm flex flex-col group relative overflow-hidden"
              >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                  <Heart className="w-24 h-24" />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                      <User className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-lg">
                        {prayer.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        {prayer.createdAt
                          ? new Date(prayer.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(prayer.status || "PENDING")} font-bold uppercase text-[10px] tracking-widest px-2.5 py-1`}
                    >
                      {prayer.status || "PENDING"}
                    </Badge>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this prayer request?",
                          )
                        ) {
                          deleteMutation.mutate(prayer.id || prayer._id);
                        }
                      }}
                      className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prayer Request */}
                <div className="bg-muted/30 rounded-xl p-5 mb-8 flex-1 relative z-10 border border-border/50">
                  <p className="text-foreground/80 leading-relaxed italic text-base">
                    "
                    {prayer.description ||
                      prayer.request ||
                      "No description provided."}
                    "
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-auto relative z-10">
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: prayer.id || prayer._id,
                        status: "PRAYING",
                      })
                    }
                    disabled={
                      updateMutation.isPending || prayer.status === "PRAYING"
                    }
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                      prayer.status === "PRAYING"
                        ? "bg-purple-100 text-purple-700 shadow-purple-100"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${prayer.status === "PRAYING" ? "fill-current" : ""}`}
                    />
                    {prayer.status === "PRAYING" ? "Praying..." : "Praying"}
                  </button>
                  <button className="px-6 py-3.5 border border-border bg-card text-foreground rounded-xl hover:bg-muted transition-all shadow-sm active:scale-95 font-bold">
                    Contact
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
