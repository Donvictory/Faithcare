import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsCompleted(false);
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-12 border border-success/20 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border border-success/20">
              <Sparkles className="w-10 h-10" style={{ color: '#22c55e' }} />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-foreground mb-4">Well done!</h2>
          <blockquote className="text-xl text-foreground leading-relaxed mb-6">
            "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."
          </blockquote>
          <p className="text-sm text-muted-foreground mb-8">
            Colossians 3:23
          </p>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-xl p-12 border border-border text-center">
        {/* Timer Display */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-4">Focus Timer</p>
          <div className="relative inline-block">
            {/* Progress Circle */}
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#d4a574"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            {/* Time Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl text-foreground tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleStartPause}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="p-3 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Take 25 minutes to focus on your work or study. During this time, minimize distractions and work with intention.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => {
            setTimeLeft(15 * 60);
            setIsRunning(false);
            setIsCompleted(false);
          }}
          className="p-4 bg-card rounded-lg border border-border hover:bg-muted/30 transition-colors text-center"
        >
          <p className="text-foreground">15 min</p>
          <p className="text-xs text-muted-foreground">Quick Session</p>
        </button>
        <button
          onClick={() => {
            setTimeLeft(25 * 60);
            setIsRunning(false);
            setIsCompleted(false);
          }}
          className="p-4 bg-accent/10 rounded-lg border border-accent/20 hover:bg-accent/20 transition-colors text-center"
        >
          <p className="text-foreground">25 min</p>
          <p className="text-xs text-muted-foreground">Standard</p>
        </button>
        <button
          onClick={() => {
            setTimeLeft(45 * 60);
            setIsRunning(false);
            setIsCompleted(false);
          }}
          className="p-4 bg-card rounded-lg border border-border hover:bg-muted/30 transition-colors text-center"
        >
          <p className="text-foreground">45 min</p>
          <p className="text-xs text-muted-foreground">Deep Work</p>
        </button>
      </div>
    </div>
  );
}
