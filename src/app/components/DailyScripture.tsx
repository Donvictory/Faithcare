import { Sparkles, Book } from "lucide-react";

export function DailyScripture() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 md:p-12 border border-accent/20">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-accent/20">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Date */}
        <p className="text-center text-sm text-muted-foreground mb-4">
          Thursday, March 5, 2026
        </p>

        {/* Scripture */}
        <blockquote className="text-center mb-6">
          <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-4">
            "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."
          </p>
          <footer className="flex items-center justify-center gap-2 text-accent">
            <Book className="w-4 h-4" />
            <cite className="not-italic">Jeremiah 29:11</cite>
          </footer>
        </blockquote>

        {/* Encouragement */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 border border-accent/10">
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-center">
            Today, remember that God has a beautiful plan for your life. Even when the path seems unclear, trust that He is working all things together for your good. Take a moment to reflect on His faithfulness and let His peace guide your steps.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button className="px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
            Reflect & Journal
          </button>
        </div>
      </div>

      {/* Weekly Scripture Card */}
      <div className="mt-6 bg-card rounded-xl p-6 border border-border">
        <h3 className="text-foreground mb-4">This Week's Focus</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#22c55e' }}></div>
            <div>
              <p className="text-sm text-foreground">Monday - Trust in the Lord</p>
              <p className="text-xs text-muted-foreground">Proverbs 3:5-6</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#22c55e' }}></div>
            <div>
              <p className="text-sm text-foreground">Tuesday - Walk by Faith</p>
              <p className="text-xs text-muted-foreground">2 Corinthians 5:7</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#22c55e' }}></div>
            <div>
              <p className="text-sm text-foreground">Wednesday - Be Strong and Courageous</p>
              <p className="text-xs text-muted-foreground">Joshua 1:9</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#d4a574' }}></div>
            <div>
              <p className="text-sm text-foreground">Thursday - Hope for the Future</p>
              <p className="text-xs text-muted-foreground">Jeremiah 29:11</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2"></div>
            <div>
              <p className="text-sm text-muted-foreground">Friday - Peace of God</p>
              <p className="text-xs text-muted-foreground">Philippians 4:6-7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
