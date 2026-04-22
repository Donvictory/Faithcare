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
import { Header } from "./Header";
import {
  createJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/api/individual";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-hot-toast";

interface JournalEntry {
  _id: string;
  id?: string;
  title: string;
  scriptureReference: string;
  content: string;
  createdAt: string;
}

export function SundayJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scripture, setScripture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Debug Helper to identify the data structure
  const extractEntries = (data: any): JournalEntry[] => {
    console.log("Journal API Response Data:", data);

    if (Array.isArray(data)) return data;
    if (data?.entries && Array.isArray(data.entries)) return data.entries;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.docs && Array.isArray(data.docs)) return data.docs; // common in paginated APIs
    return [];
  };

  const fetchEntries = async () => {
    const userId = user?.id || user?._id || user?.userId;
    if (!userId) {
      console.warn("Journal: No userId found in user object:", user);
      return;
    }

    setIsFetching(true);
    try {
      const res = await getJournalEntries({ userId });
      if (res.success) {
        const extracted = extractEntries(res.data);
        console.log("Extracted Entries Array:", extracted);
        setEntries(extracted);
      } else {
        console.error("Journal Fetch Error:", res.error);
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
        // Fetch again after a short delay
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
    <div className="min-h-full flex flex-col bg-background">
      <Header
        title="Sunday Journal"
        subtitle="Keep a record of your spiritual growth and Sunday messages."
      />

      <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8 flex-1 max-w-[1600px] mx-auto w-full">
        {/* Main Editor Section */}
        <div className="flex-1 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm flex flex-col h-fit">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {currentEntryId ? "Edit Reflection" : "New Reflection"}
            </h2>
            <button
              onClick={handleNewEntry}
              className="flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-accent/10 rounded-full transition-all"
            >
              <Plus className="w-4 h-4" />
              Reset Form
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground ml-1">
                Message Title
              </label>
              <input
                type="text"
                placeholder="What was the sermon title?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl text-foreground placeholder:text-muted-foreground/50 bg-secondary/30 border border-border rounded-xl px-5 py-4 focus:ring-2 focus:ring-accent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground ml-1">
                Scripture Reference
              </label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                <input
                  type="text"
                  placeholder="e.g. Philippians 4:13"
                  value={scripture}
                  onChange={(e) => setScripture(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground ml-1">
                Your Reflections
              </label>
              <textarea
                placeholder="Write down key takeaways and how you plan to apply them..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[350px] text-foreground placeholder:text-muted-foreground/50 bg-secondary/30 border border-border rounded-xl px-5 py-4 focus:ring-2 focus:ring-accent outline-none transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {currentEntryId ? "Update Record" : "Save to Records"}
            </button>
          </div>
        </div>

        {/* Previous Entries List */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 h-fit">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col max-h-[calc(100vh-200px)]">
            <h3 className="text-foreground mb-6 flex items-center gap-2 font-bold text-xl">
              <Calendar className="w-5 h-5 text-accent" />
              Message Records
            </h3>

            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {isFetching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Syncing records...
                  </p>
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    No records found. Start your first journal entry!
                  </p>
                </div>
              ) : (
                entries.map((entry) => {
                  const id = entry._id || entry.id;
                  const isActive = currentEntryId === id;
                  return (
                    <div
                      key={id}
                      onClick={() => selectEntry(entry)}
                      className={`w-full p-4 rounded-xl border transition-all cursor-pointer group relative ${
                        isActive
                          ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                          : "border-border hover:border-accent/30 bg-secondary/20"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <p
                            className={`transition-colors truncate pr-4 ${
                              isActive
                                ? "text-accent"
                                : "text-foreground group-hover:text-accent"
                            }`}
                          >
                            {entry.title || "Untitled"}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-tighter text-muted-foreground">
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
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground italic">
                            <BookOpen className="w-3 h-3 text-accent/60" />
                            <span className="truncate">
                              {entry.scriptureReference || "No reference"}
                            </span>
                          </div>

                          <div
                            className={`flex items-center gap-1 transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                selectEntry(entry);
                              }}
                              className="p-1.5 rounded-md hover:bg-accent/10 text-accent transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(id!, e)}
                              className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-accent/5 rounded-2xl border border-accent/10 p-6">
            <h4 className="text-accent font-bold text-sm mb-2 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Spiritual Habit
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Consistently recording your Sunday messages helps you retain 80%
              more of what you learned. Review your records weekly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
