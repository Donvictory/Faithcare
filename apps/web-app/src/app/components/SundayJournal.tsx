import { useLayout } from "../contexts/LayoutContext";
import { useState, useEffect } from "react";
import {
  Save,
  BookOpen,
  Calendar,
  Loader2,
  Trash2,
  Plus,
  Edit3,
} from "lucide-react";
import {
  createJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/api/individual";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { useSearch } from "../contexts/SearchContext";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface JournalEntry {
  _id: string;
  id?: string;
  title: string;
  scriptureReference: string;
  content: string;
  createdAt: string;
}

export function SundayJournal() {
  const { setHeader } = useLayout();
  useEffect(() => {
    setHeader(
      "Sunday Journal",
      "Keep a record of your spiritual growth and Sunday messages.",
    );
  }, []);

  const { user } = useAuth();
  const { searchTerm } = useSearch();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scripture, setScripture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Debug Helper to identify the data structure
  const extractEntries = (data: any): JournalEntry[] => {
    if (Array.isArray(data)) return data;
    if (data?.entries && Array.isArray(data.entries)) return data.entries;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.docs && Array.isArray(data.docs)) return data.docs;
    return [];
  };

  const fetchEntries = async () => {
    const userId = user?.id || user?._id || user?.userId;
    if (!userId) return;

    setIsFetching(true);
    try {
      const res = await getJournalEntries({ userId });
      if (res.success) {
        const extracted = extractEntries(res.data);
        setEntries(extracted);
      }
    } catch (err) {
      console.error("Failed to load entries", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user?.id, user?._id]);

  const filteredEntries = entries.filter(
    (entry) =>
      (entry.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.scriptureReference || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleSave = async () => {
    const userId = user?.id || user?._id || user?.userId;
    if (!userId) {
      toast.error("Auth session missing. Please try logging in again.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Please provide a title and your reflections.");
      return;
    }

    setIsLoading(true);
    const payload = {
      userId,
      title: title.trim(),
      scriptureReference: scripture.trim(),
      content: content.trim(),
    };

    try {
      let res;
      if (currentEntryId) {
        res = await updateJournalEntry(currentEntryId, payload);
      } else {
        res = await createJournalEntry(payload);
      }

      if (res.success) {
        toast.success(currentEntryId ? "Entry updated!" : "Entry saved!");
        if (!currentEntryId) handleNewEntry();
        setTimeout(fetchEntries, 800);
      } else {
        toast.error(res.error || "Failed to save entry");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this journal entry?")) return;

    try {
      const res = await deleteJournalEntry(id);
      if (res.success) {
        toast.success("Entry deleted");
        if (currentEntryId === id) handleNewEntry();
        fetchEntries();
      }
    } catch (err) {
      toast.error("Failed to delete entry");
    }
  };

  const selectEntry = (entry: JournalEntry) => {
    const id = entry._id || entry.id;
    if (id) {
      setCurrentEntryId(id);
      setTitle(entry.title || "");
      setContent(entry.content || "");
      setScripture(entry.scriptureReference || "");
    }
  };

  const handleNewEntry = () => {
    setCurrentEntryId(null);
    setTitle("");
    setContent("");
    setScripture("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-8 flex-1 max-w-[1600px] mx-auto w-full">
        {/* Main Editor Section */}
        <Card className="flex-1 flex flex-col h-fit p-5 sm:p-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {currentEntryId ? "Edit Reflection" : "New Reflection"}
            </h2>
            <Button
              variant="ghost"
              onClick={handleNewEntry}
              className="flex items-center gap-2 px-4 text-accent"
            >
              <Plus className="w-4 h-4" />
              Reset Form
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground ml-1 font-bold">
                Message Title
              </label>
              <input
                type="text"
                placeholder="What was the sermon title?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg sm:text-2xl text-foreground placeholder:text-muted-foreground/50 bg-secondary/30 border border-border rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground ml-1 font-bold">
                Scripture Reference
              </label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                <input
                  type="text"
                  placeholder="e.g. Philippians 4:13"
                  value={scripture}
                  onChange={(e) => setScripture(e.target.value)}
                  className="w-full pl-11 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all text-foreground text-sm sm:text-base font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground ml-1 font-bold">
                Your Reflections
              </label>
              <textarea
                placeholder="Write down key takeaways and how you plan to apply them..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[250px] sm:min-h-[350px] text-sm sm:text-base text-foreground placeholder:text-muted-foreground/50 bg-secondary/30 border border-border rounded-xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:ring-accent outline-none transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 sm:px-10 rounded-2xl shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {currentEntryId ? "Update Record" : "Save Reflection"}
            </Button>
          </div>
        </Card>

        {/* Previous Entries List */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 h-fit">
          <Card className="flex flex-col max-h-[calc(100vh-200px)]">
            <h3 className="text-foreground mb-6 flex items-center gap-2 font-bold text-xl">
              <Calendar className="w-5 h-5 text-accent" />
              {searchTerm ? "Search Results" : "Message Records"}
            </h3>

            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {isFetching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent mb-2" />
                  <p className="text-sm text-muted-foreground font-bold">
                    Syncing records...
                  </p>
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl">
                  <p className="text-sm text-muted-foreground italic">
                    {searchTerm
                      ? `No records matching"${searchTerm}"`
                      : "No records found. Start your first journal entry!"}
                  </p>
                </div>
              ) : (
                filteredEntries.map((entry) => {
                  const id = entry._id || entry.id;
                  const isActive = currentEntryId === id;
                  return (
                    <Card
                      key={id}
                      onClick={() => selectEntry(entry)}
                      padding="none"
                      variant={isActive ? "accent" : "default"}
                      className={cn(
                        "transition-all cursor-pointer group relative overflow-hidden",
                        isActive ? "ring-1 ring-accent/20" : "hover:border-accent/30 bg-secondary/20 shadow-sm"
                      )}
                    >
                      <div className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <p
                              className={cn(
                                "transition-colors truncate pr-4 font-bold",
                                isActive ? "text-accent" : "text-foreground group-hover:text-accent"
                              )}
                            >
                              {entry.title || "Untitled"}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
                                {entry.createdAt
                                  ? new Date(entry.createdAt).toLocaleDateString(
                                      "en-US",
                                      { month: "short", day: "numeric" },
                                    )
                                  : "New"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground italic font-medium">
                              <BookOpen className="w-3 h-3 text-accent/60" />
                              <span className="truncate">
                                {entry.scriptureReference || "No reference"}
                              </span>
                            </div>

                            <div
                              className={cn(
                                "flex items-center gap-1 transition-all",
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              )}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectEntry(entry);
                                }}
                                className="h-8 w-8 text-accent"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleDelete(id!, e)}
                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </Card>

          <Card variant="accent" className="bg-accent/5 border-accent/10 p-6">
            <h4 className="text-accent font-bold text-sm mb-2 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Spiritual Habit
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Consistently recording your Sunday messages helps you retain 80%
              more of what you learned. Review your records weekly!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
