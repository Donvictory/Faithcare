import { Sparkles, Book } from "lucide-react";
import { Header } from "./Header";

export function DailyScripture() {
  return (
    <div className="min-h-full">
      <Header title="Daily Scripture" subtitle="Start your day with God's Word." />
      <div className="p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 md:p-12 border border-accent/20 shadow-sm">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-accent/20">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
            </div>

            {/* Date */}
            <p className="text-center text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wide">
              Thursday, March 5, 2026
            </p>

            {/* Scripture */}
            <blockquote className="text-center mb-6">
              <p className="text-2xl font-serif text-foreground leading-relaxed mb-4 italic">
                "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."
              </p>
              <footer className="flex items-center justify-center gap-2 text-accent">
                <Book className="w-4 h-4" />
                <cite className="not-italic font-semibold">Jeremiah 29:11</cite>
              </footer>
            </blockquote>

            {/* Encouragement */}
            <div className="bg-white/80 rounded-lg p-6 mb-6 border border-accent/10">
              <p className="text-muted-foreground leading-relaxed text-center italic">
                Today, remember that God has a beautiful plan for your life. Even when the path seems unclear, trust that He is working all things together for your good. Take a moment to reflect on His faithfulness and let His peace guide your steps.
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors shadow-sm">
                Reflect & Journal
              </button>
            </div>
          </div>

          {/* Weekly Scripture Card */}
          <div className="mt-8 bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-foreground mb-4 font-semibold">This Week's Focus</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#22c55e' }}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Monday - Trust in the Lord</p>
                  <p className="text-xs text-muted-foreground">Proverbs 3:5-6</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#22c55e' }}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Tuesday - Walk by Faith</p>
                  <p className="text-xs text-muted-foreground">2 Corinthians 5:7</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#22c55e' }}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Wednesday - Be Strong and Courageous</p>
                  <p className="text-xs text-muted-foreground">Joshua 1:9</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#d4a574' }}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Thursday - Hope for the Future</p>
                  <p className="text-xs text-muted-foreground">Jeremiah 29:11</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
                <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Friday - Peace of God</p>
                  <p className="text-xs text-muted-foreground">Philippians 4:6-7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
