import { Sparkles, Book, CheckCircle2, Loader2 } from "lucide-react";
import { Header } from "./Header";
import { useAuth } from "../providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMetadataByUserId,
  updateIndividualMetadata,
} from "@/api/individual";
import { toast } from "react-hot-toast";
import { useState } from "react";

export function DailyScripture() {
  const { user, accessToken } = useAuth();
  const userId = user?.id || user?._id || user?.userId || "";
  const queryClient = useQueryClient();
  const [isMarking, setIsMarking] = useState(false);

  // Fetch metadata to get current scripture count
  const { data: metadataResponse, isLoading } = useQuery({
    queryKey: ["individual-metadata", userId],
    queryFn: () => getMetadataByUserId(userId),
    enabled: !!accessToken && !!userId,
  });

  const metadataRaw = metadataResponse?.data;
  const metadata = Array.isArray(metadataRaw) 
    ? metadataRaw[0] 
    : (metadataRaw?.data ? metadataRaw.data : metadataRaw);
  
  const currentCount = metadata?.scripturesCount || 0;

  const markAsReadMutation = useMutation({
    mutationFn: (newCount: number) =>
      updateIndividualMetadata(metadata?._id || metadata?.id, {
        scripturesCount: newCount,
      }),
    onSuccess: () => {
      toast.success("Scripture marked as read!");
      queryClient.invalidateQueries({
        queryKey: ["individual-metadata", userId],
      });
    },
    onError: () => {
      toast.error("Failed to update progress");
    },
    onSettled: () => setIsMarking(false),
  });

  const handleMarkAsRead = () => {
    if (!metadata?._id && !metadata?.id) {
      toast.error("Metadata not found. Please complete onboarding.");
      return;
    }
    setIsMarking(true);
    markAsReadMutation.mutate(currentCount + 1);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-full font-sans">
      <Header
        title="Daily Scripture"
        subtitle="Start your day with God's Word."
      />
      <div className="p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="bg-card rounded-3xl p-12 border border-border flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-muted-foreground">Preparing today's word...</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl p-6 md:p-12 border border-accent/20 shadow-xl shadow-accent/5 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                <Sparkles className="w-48 h-48 text-accent" />
              </div>

              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-card flex items-center justify-center border border-accent/20 shadow-lg">
                    <Sparkles className="w-10 h-10 text-accent" />
                  </div>
                </div>

                {/* Date */}
                <p className="text-sm text-muted-foreground mb-6 uppercase tracking-[0.2em] opacity-70">
                  {today}
                </p>

                {/* Scripture */}
                <blockquote className="mb-10">
                  <p className="text-2xl md:text-3xl font-serif text-foreground leading-relaxed mb-6 italic">
                    "For I know the plans I have for you," declares the Lord,
                    "plans to prosper you and not to harm you, plans to give you
                    hope and a future."
                  </p>
                  <footer className="flex items-center justify-center gap-3 text-accent bg-accent/5 py-2 px-4 rounded-full w-fit mx-auto">
                    <Book className="w-4 h-4" />
                    <cite className="not-italic font-bold">Jeremiah 29:11</cite>
                  </footer>
                </blockquote>

                {/* Encouragement */}
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-accent/10 shadow-inner">
                  <p className="text-muted-foreground leading-relaxed italic text-sm md:text-base">
                    Today, remember that God has a beautiful plan for your life.
                    Even when the path seems unclear, trust that He is working
                    all things together for your good. Take a moment to reflect
                    on His faithfulness and let His peace guide your steps.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleMarkAsRead}
                    disabled={isMarking}
                    className="w-full sm:w-auto px-10 py-4 bg-accent text-accent-foreground rounded-2xl hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isMarking ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    Mark as Read
                  </button>
                  <button className="w-full sm:w-auto px-10 py-4 bg-card text-foreground border border-border rounded-2xl hover:bg-muted transition-all active:scale-95">
                    Reflect & Journal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Scripture Card */}
          <div className="mt-12 bg-card rounded-3xl p-8 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Book className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                This Week's Focus
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  day: "Monday",
                  title: "Trust in the Lord",
                  ref: "Proverbs 3:5-6",
                  color: "#22c55e",
                  completed: true,
                },
                {
                  day: "Tuesday",
                  title: "Walk by Faith",
                  ref: "2 Corinthians 5:7",
                  color: "#22c55e",
                  completed: true,
                },
                {
                  day: "Wednesday",
                  title: "Be Strong",
                  ref: "Joshua 1:9",
                  color: "#22c55e",
                  completed: true,
                },
                {
                  day: "Thursday",
                  title: "Hope",
                  ref: "Jeremiah 29:11",
                  color: "#d4a574",
                  current: true,
                },
                {
                  day: "Friday",
                  title: "Peace",
                  ref: "Philippians 4:6-7",
                  color: "#94a3b8",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    item.current
                      ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                      : "border-border/50 hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-2 h-2 rounded-full mt-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <p
                        className={`text-sm ${item.current ? "text-foreground font-bold" : "text-muted-foreground"}`}
                      >
                        {item.day} - {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        {item.ref}
                      </p>
                    </div>
                  </div>
                  {item.completed && (
                    <CheckCircle2 className="w-4 h-4 text-success opacity-60" />
                  )}
                  {item.current && (
                    <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded uppercase font-bold">
                      Today
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
