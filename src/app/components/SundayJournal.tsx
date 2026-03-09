import { useState } from "react";
import { Save, BookOpen, Calendar } from "lucide-react";

const previousEntries = [
  {
    id: 1,
    title: "The Power of Grace",
    date: "Feb 25, 2026",
    scripture: "Ephesians 2:8-9",
  },
  {
    id: 2,
    title: "Walking in Faith",
    date: "Feb 18, 2026",
    scripture: "Hebrews 11:1",
  },
  {
    id: 3,
    title: "Love One Another",
    date: "Feb 11, 2026",
    scripture: "John 13:34-35",
  },
  {
    id: 4,
    title: "Finding Peace",
    date: "Feb 4, 2026",
    scripture: "Philippians 4:6-7",
  },
];

export function SundayJournal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scripture, setScripture] = useState("");

  const handleSave = () => {
    // Mock save functionality
    alert("Journal entry saved!");
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* Main Editor */}
      <div className="flex-1 bg-card rounded-xl border border-border p-8 overflow-y-auto">
        {/* Title */}
        <input
          type="text"
          placeholder="Message Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl text-foreground placeholder:text-muted-foreground bg-transparent border-none outline-none mb-6"
        />

        {/* Scripture Reference */}
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-accent/10 rounded-lg border border-accent/20">
          <BookOpen className="w-5 h-5 text-accent" />
          <input
            type="text"
            placeholder="Scripture Reference (e.g., John 3:16)"
            value={scripture}
            onChange={(e) => setScripture(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Content Editor */}
        <textarea
          placeholder="What did God speak to you today? Write your reflections, key takeaways, and how you plan to apply this message to your life..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[400px] text-foreground placeholder:text-muted-foreground bg-transparent border-none outline-none resize-none leading-relaxed"
        />

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Entry
          </button>
        </div>
      </div>

      {/* Previous Entries Sidebar */}
      <div className="w-80 bg-card rounded-xl border border-border p-6 overflow-y-auto">
        <h3 className="text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Previous Entries
        </h3>
        <div className="space-y-3">
          {previousEntries.map((entry) => (
            <button
              key={entry.id}
              className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors group"
            >
              <p className="text-foreground group-hover:text-accent transition-colors mb-1">
                {entry.title}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {entry.date}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-accent">
                <BookOpen className="w-3 h-3" />
                <span>{entry.scripture}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
