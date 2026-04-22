import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Loader2,
  History,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Header } from "./Header";
import { useAuth } from "../providers/AuthProvider";
import {
  createTimerSession,
  getActiveTimerSession,
  updateTimerSession,
  completeTimerSession,
  deleteTimerSession,
  getTimerSessions,
} from "@/api/individual";
import { toast } from "react-hot-toast";

interface TimerSession {
  _id: string;
  id?: string;
  duration: number;
  status: string;
  currentProgress: number;
  createdAt: string;
}

export function FocusTimer() {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [totalDuration, setTotalDuration] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [history, setHistory] = useState<TimerSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("25");

  const sessionIdRef = useRef<string | null>(null);
  const timeLeftRef = useRef(timeLeft);
  const totalDurationRef = useRef(totalDuration);
  const isRunningRef = useRef(isRunning); // Safety ref to stop sync instantly

  useEffect(() => {
    timeLeftRef.current = timeLeft;
    totalDurationRef.current = totalDuration;
    isRunningRef.current = isRunning;
  }, [timeLeft, totalDuration, isRunning]);

  useEffect(() => {
    const init = async () => {
      const userId = user?.id || user?._id || user?.userId;
      if (!userId) {
        setIsInitializing(false);
        return;
      }

      try {
        const res = await getActiveTimerSession(userId);
        if (res.success && res.data) {
          const session = res.data;
          
          // Only restore if the session is not already completed
          if (session.status !== "COMPLETED") {
            const durationSecs = (session.duration || 25) * 60;
            const progress = session.currentProgress || 0;
            const remaining = Math.max(0, durationSecs - (durationSecs * progress) / 100);

            setSessionId(session._id || session.id);
            sessionIdRef.current = session._id || session.id;
            setTotalDuration(durationSecs);
            setTimeLeft(Math.floor(remaining));

            if (session.status === "IN_PROGRESS") {
              setIsRunning(true);
            }
          }
        }
        fetchHistory(userId);
      } catch (err) {
        console.error("Failed to restore session", err);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, [user?.id, user?._id]);

  const fetchHistory = async (userId: string) => {
    setIsLoadingHistory(true);
    try {
      const res = await getTimerSessions(userId);
      if (res.success) {
        const entries = Array.isArray(res.data) ? res.data : res.data?.sessions || [];
        setHistory(entries.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    let syncInterval: number | undefined;
    if (isRunning && sessionId) {
      syncInterval = window.setInterval(async () => {
        const userId = user?.id || user?._id || user?.userId;
        
        // Final safety check: don't sync if the timer was just stopped
        if (!isRunningRef.current || !sessionIdRef.current) return;

        const currentProgress = Math.round(((totalDurationRef.current - timeLeftRef.current) / (totalDurationRef.current || 1)) * 100);
        
        if (userId && sessionIdRef.current) {
          await updateTimerSession(sessionIdRef.current, {
            userId,
            duration: Math.floor(totalDurationRef.current / 60),
            status: "IN_PROGRESS",
            currentProgress,
          });
        }
      }, 1000);
    }
    return () => { if (syncInterval) clearInterval(syncInterval); };
  }, [isRunning, sessionId, user]);

  const handleStartPause = async () => {
    const userId = user?.id || user?._id || user?.userId;
    if (!userId) {
      toast.error("Please log in to start a session");
      return;
    }

    if (!isRunning) {
      if (!sessionId) {
        const payload = {
          userId,
          duration: Math.floor(timeLeft / 60),
          status: "NOT_STARTED",
          currentProgress: 0,
        };
        const res = await createTimerSession(payload);
        if (res.success) {
          const newId = res.data._id || res.data.id;
          setSessionId(newId);
          sessionIdRef.current = newId;
          setTotalDuration(timeLeft);
          await updateTimerSession(newId, { ...payload, status: "IN_PROGRESS" });
          fetchHistory(userId);
        }
      } else {
        await updateTimerSession(sessionId, {
          userId,
          duration: Math.floor(totalDuration / 60),
          status: "IN_PROGRESS",
          currentProgress: Math.round(((totalDuration - timeLeft) / (totalDuration || 1)) * 100),
        });
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
      if (sessionId) {
        await updateTimerSession(sessionId, {
          userId,
          duration: Math.floor(totalDuration / 60),
          status: "PAUSED",
          currentProgress: Math.round(((totalDuration - timeLeft) / (totalDuration || 1)) * 100),
        });
      }
    }
  };

  const handleComplete = async () => {
    // STOP EVERYTHING FIRST
    setIsRunning(false);
    isRunningRef.current = false;
    setIsCompleted(true);
    
    const userId = user?.id || user?._id || user?.userId;
    const currentSessionId = sessionId || sessionIdRef.current;
    
    if (currentSessionId) {
      // Optimistic UI update
      setHistory(prev => prev.map(s => 
        (s._id === currentSessionId || s.id === currentSessionId) 
          ? { ...s, status: "COMPLETED" } 
          : s
      ));

      // Mark as null immediately to prevent any more syncs
      setSessionId(null);
      sessionIdRef.current = null;

      await completeTimerSession(currentSessionId);
      
      if (userId) {
        setTimeout(() => fetchHistory(userId), 1500);
      }
    }
  };

  const handleReset = async () => {
    if (sessionId && window.confirm("Reset this session? This will remove your current progress.")) {
      await deleteTimerSession(sessionId);
      const userId = user?.id || user?._id || user?.userId;
      if (userId) fetchHistory(userId);
    }
    setIsRunning(false);
    isRunningRef.current = false;
    setSessionId(null);
    sessionIdRef.current = null;
    const mins = parseInt(customMinutes) || 25;
    setTimeLeft(mins * 60);
    setTotalDuration(mins * 60);
    setIsCompleted(false);
  };

  const handleDeleteHistory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    const res = await deleteTimerSession(id);
    if (res.success) {
      toast.success("Record deleted");
      const userId = user?.id || user?._id || user?.userId;
      if (userId) fetchHistory(userId);
    } else {
      toast.error("Failed to delete record");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const safeProgress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  if (isInitializing) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <Header title="Focus Timer" subtitle="Stay focused and productive with intentional work sessions." />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">
        <div className="lg:col-span-8 flex flex-col items-center justify-start pt-4">
          <div className="w-full max-w-2xl bg-card rounded-3xl p-8 md:p-12 border border-border text-center shadow-xl relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-muted">
              <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${safeProgress}%` }} />
            </div>

            {isCompleted ? (
              <div className="py-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-8"><div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border border-success/20 shadow-inner"><Sparkles className="w-12 h-12 text-success" /></div></div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Well done!</h2>
                <blockquote className="text-xl text-foreground leading-relaxed mb-6 italic opacity-80">"Whatever you do, work at it with all your heart, as working for the Lord..."</blockquote>
                <button onClick={handleReset} className="px-12 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20">Start New Session</button>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <p className="text-xs text-muted-foreground mb-6 font-bold uppercase tracking-[0.2em]">Focus Session</p>
                  <div className="relative inline-block">
                    <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
                      <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/30" />
                      <circle
                        cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="none"
                        strokeDasharray="283" strokeDashoffset={283 * (1 - safeProgress / 100)}
                        strokeLinecap="round" className="text-accent transition-all duration-1000"
                        style={{ strokeDasharray: "283", strokeDashoffset: 283 * (1 - safeProgress / 100) }}
                        pathLength="100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl md:text-7xl font-black text-foreground tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <button onClick={handleStartPause} className="flex items-center gap-3 px-12 py-5 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 font-bold active:scale-95">
                    {isRunning ? <><Pause className="w-6 h-6 fill-current" /> Pause</> : <><Play className="w-6 h-6 fill-current ml-1" /> Start</>}
                  </button>
                  <button onClick={handleReset} className="p-5 border-2 border-border rounded-2xl hover:bg-muted transition-all text-foreground" title="Reset Timer"><RotateCcw className="w-6 h-6" /></button>
                </div>
              </>
            )}
          </div>

          {!isRunning && !isCompleted && (
            <div className="w-full max-w-2xl mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <label className="block text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">Set Custom Duration</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      value={customMinutes}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomMinutes(val);
                        const mins = parseInt(val) || 0;
                        setTimeLeft(mins * 60);
                        setTotalDuration(mins * 60);
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-muted/50 border-2 border-transparent focus:border-accent rounded-xl outline-none transition-all font-bold text-lg"
                      placeholder="Minutes"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[15, 25, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => {
                          setCustomMinutes(mins.toString());
                          setTimeLeft(mins * 60);
                          setTotalDuration(mins * 60);
                        }}
                        className={`px-4 py-4 rounded-xl border font-bold transition-all ${parseInt(customMinutes) === mins ? "bg-accent border-accent text-white" : "bg-card border-border hover:border-accent/40"}`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col h-[calc(100vh-200px)]">
          <div className="bg-card rounded-3xl border border-border flex flex-col h-full shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2"><History className="w-5 h-5 text-accent" /><h3 className="font-bold text-foreground">Session History</h3></div>
              <span className="text-xs font-bold px-2 py-1 bg-accent/10 text-accent rounded-full">{history.length} Records</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mb-4" /><p className="text-sm font-medium">Loading records...</p></div>
              ) : history.length === 0 ? (
                <div className="text-center py-12 px-6"><div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><History className="w-8 h-8 text-muted-foreground/50" /></div><p className="text-sm font-bold text-muted-foreground">No records yet</p></div>
              ) : (
                history.map((session) => (
                  <div key={session._id || session.id} className="group bg-muted/40 hover:bg-muted/80 border border-border/50 rounded-2xl p-4 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className={`mt-1 p-2 rounded-lg ${session.status === "COMPLETED" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                          {session.status === "COMPLETED" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{session.duration} Minutes</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${session.status === "COMPLETED" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>{session.status}</span>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium mt-1">{new Date(session.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteHistory(session._id || session.id!)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
