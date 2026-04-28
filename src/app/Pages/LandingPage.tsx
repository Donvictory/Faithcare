import { Link } from "react-router-dom";
import { 
  Users, MessageSquare, ArrowRight, ShieldCheck, 
  Smartphone, Clock, Sparkles, CheckCircle2, ChevronRight
} from "lucide-react";

export function LandingPage() {
  return (
    <>
      <style>
        {`
          /* Custom variables following ui-design.md Phase 2, 3, & 7 */
          :root {
            --ease-out: cubic-bezier(0, 0, 0.2, 1);
            --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
          
          .animate-fade-up {
            animation: fadeUp 0.6s var(--ease-out) both;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .delay-400 { animation-delay: 400ms; }
          .delay-500 { animation-delay: 500ms; }
          
          .shadow-card {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.04);
          }
          .shadow-premium {
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.04), 0 16px 32px rgba(0, 0, 0, 0.04);
          }
          .shadow-glow {
            box-shadow: 0 0 20px rgba(212, 165, 116, 0.25), 0 0 60px rgba(212, 165, 116, 0.1);
          }
          
          .transition-spring {
            transition: all 0.4s var(--ease-spring);
          }

          /* Phase 8: Layered Backgrounds */
          .bg-grid-subtle {
            background-image: 
              linear-gradient(rgba(150, 150, 150, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(150, 150, 150, 0.06) 1px, transparent 1px);
            background-size: 32px 32px;
          }
          
          .grain-overlay::after {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: 0.03;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            background-size: 256px 256px;
            z-index: 10;
          }
        `}
      </style>

      <div className="min-h-screen bg-background font-sans selection:bg-accent/20 relative overflow-hidden grain-overlay">
        
        {/* Navigation - Phase 6.4 */}
        <nav className="fixed top-0 left-0 right-0 bg-background/85 backdrop-blur-xl z-50 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 transition-spring hover:opacity-80">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="text-[1.125rem] font-bold text-foreground tracking-tight">FaithCare</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/sign-in" className="text-[0.875rem] font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link to="/sign-up-choice" className="text-[0.875rem] font-semibold bg-foreground text-background px-5 py-2.5 rounded-[8px] hover:bg-foreground/90 transition-spring hover:-translate-y-[1px] hover:shadow-card active:translate-y-0 active:shadow-none">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        <main>
          {/* Hero Section - Phase 8.1 (12-col grid), Phase 4 (Hierarchy), Phase 7 (Motion) */}
          <section className="relative pt-20 pb-16 min-h-screen flex items-center bg-grid-subtle">
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
              <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
                
                {/* Left Column: Copy (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-center text-left">
                  <div className="animate-fade-up flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-[0.75rem] font-semibold uppercase tracking-[0.1em] rounded-full border border-accent/20">
                      Two Experiences. One Unified Platform.
                    </span>
                  </div>
                  
                  <h1 className="animate-fade-up delay-100 text-[3rem] lg:text-[4rem] font-extrabold text-foreground tracking-[-0.03em] leading-[1.1] mb-6">
                    Structure Your Ministry.<br />
                    <span className="text-accent">Deepen Your Faith.</span>
                  </h1>
                  
                  <p className="animate-fade-up delay-200 text-[1.125rem] lg:text-[1.25rem] text-muted-foreground max-w-[55ch] leading-[1.6] mb-10">
                    The complete ecosystem for churches to manage their congregation, and for individuals to track their personal spiritual growth. Choose your path.
                  </p>
                  
                  <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Link to="/sign-up-choice" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-[8px] text-[1rem] font-semibold transition-spring hover:bg-accent/90 hover:shadow-glow hover:-translate-y-[2px] active:translate-y-0 active:shadow-none border border-accent">
                      Register Organization
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/sign-up-choice" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-foreground px-8 py-4 rounded-[8px] text-[1rem] font-medium border border-border/80 transition-spring hover:bg-secondary/50 hover:border-border hover:-translate-y-[1px] active:translate-y-0">
                      Join as Individual
                    </Link>
                  </div>
                  
                  <p className="animate-fade-up delay-400 mt-8 text-[0.875rem] text-muted-foreground flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Separate dashboards. Tailored experiences.
                  </p>
                </div>
                
                {/* Right Column: Visuals (5 cols) */}
                <div className="lg:col-span-5 relative lg:h-[600px] flex items-center justify-center animate-fade-up delay-500">
                  <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[24px] bg-secondary border border-border/50 shadow-premium overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/50" />
                    
                    {/* Floating UI Elements inside */}
                    <div className="absolute inset-0 p-8 flex flex-col gap-6 animate-float">
                      
                      {/* Mockup Card 1: First Timer */}
                      <div className="bg-card border border-border/40 rounded-[12px] p-5 shadow-card transition-spring hover:-translate-y-[2px] hover:shadow-premium cursor-default">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <p className="text-[1rem] font-semibold text-foreground leading-[1.2]">John Doe</p>
                            <p className="text-[0.75rem] text-muted-foreground mt-1">First Timer • Attended Sunday</p>
                          </div>
                        </div>
                        <div className="h-[1px] w-full bg-border/40 mb-4" />
                        <div className="flex justify-between items-center text-[0.75rem]">
                          <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> 2 days ago</span>
                          <span className="text-success font-medium bg-success/10 px-2 py-0.5 rounded-[4px]">Follow-up Needed</span>
                        </div>
                      </div>

                      {/* Mockup Card 2: Feedback */}
                      <div className="bg-card border border-border/40 rounded-[12px] p-5 shadow-card ml-6 relative z-10 transition-spring hover:-translate-y-[2px] hover:shadow-premium cursor-default">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2 text-[0.875rem] font-medium text-foreground">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            Admin Feedback
                          </div>
                          <span className="text-[0.75rem] text-muted-foreground">10:30 AM</span>
                        </div>
                        <p className="text-[0.875rem] text-muted-foreground leading-[1.5]">
                          "Hi John, it was great having you at service this Sunday. Do you have any prayer requests?"
                        </p>
                      </div>

                      {/* Mockup Card 3: WhatsApp Action */}
                      <div className="bg-success text-success-foreground rounded-[12px] p-4 shadow-card flex items-center justify-between mr-6 mt-2 transition-spring hover:-translate-y-[2px] hover:shadow-premium cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5" />
                          <span className="text-[0.875rem] font-semibold">Send WhatsApp Template</span>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      </div>

                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </section>

          {/* The Problem Section - Phase 4 (Hierarchy) */}
          <section className="py-24 lg:py-[128px] bg-secondary/30 border-y border-border/30 relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="max-w-[65ch] mb-16">
                <h2 className="text-[2.25rem] lg:text-[3rem] font-bold text-foreground tracking-[-0.02em] leading-[1.2] mb-6">
                  The Chaos of Manual Tracking
                </h2>
                <p className="text-[1.125rem] text-muted-foreground leading-[1.6]">
                  Many churches struggle to retain visitors because their follow-up processes are fragmented, manual, and easily forgotten.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Lost First-Timer Data",
                    desc: "Paper cards and messy spreadsheets lead to lost contact details and missed opportunities to connect with new visitors."
                  },
                  {
                    title: "Unorganized Feedback",
                    desc: "Feedback from members gets lost in the noise. There's no clear timestamp or history of who reached out and when."
                  },
                  {
                    title: "Delayed Follow-ups",
                    desc: "Without automated messaging and templates, reaching out to members takes too long, causing them to slip through the cracks."
                  }
                ].map((problem, i) => (
                  <div key={i} className="bg-card p-8 rounded-[16px] border border-border/60 shadow-sm transition-spring hover:-translate-y-[4px] hover:shadow-card hover:border-border">
                    <div className="w-12 h-12 rounded-[8px] bg-destructive/10 text-destructive flex items-center justify-center mb-6">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    <h3 className="text-[1.25rem] font-bold text-foreground leading-[1.3] mb-3">{problem.title}</h3>
                    <p className="text-[1rem] text-muted-foreground leading-[1.6]">{problem.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section - Left/Right Alternate Layout */}
          <section className="py-24 lg:py-[128px]">
            <div className="max-w-7xl mx-auto px-6">
              
              {/* Admin Features Header */}
              <div className="text-center max-w-[65ch] mx-auto mb-20 lg:mb-[128px]">
                <h2 className="text-[2.25rem] lg:text-[3rem] font-bold text-foreground tracking-[-0.02em] leading-[1.2] mb-6">
                  For Organizations & Admins
                </h2>
                <p className="text-[1.125rem] text-muted-foreground leading-[1.6]">
                  A comprehensive command center to track attendance, manage feedback, and communicate effortlessly with your entire congregation.
                </p>
              </div>
              
              {/* Admin Feature 1 */}
              <div className="grid lg:grid-cols-12 gap-16 items-center mb-[128px]">
                <div className="lg:col-span-6 order-2 lg:order-1 bg-secondary rounded-[24px] p-2 border border-border/50 shadow-inner overflow-hidden flex items-center justify-center max-h-[500px]">
                   <div className="w-full h-full rounded-[20px] overflow-hidden border border-border/40 shadow-premium bg-background">
                     <img src="/images/features/admin-dashboard.png" alt="Admin Dashboard Overview" className="w-full h-full object-cover object-left-top" />
                   </div>
                </div>
                
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-6">
                    Management & Feedback
                  </div>
                  <h3 className="text-[2.25rem] lg:text-[3rem] font-bold text-foreground tracking-[-0.02em] leading-[1.15] mb-6">
                    Track Attendances & Timestamped Feedbacks
                  </h3>
                  <p className="text-[1.125rem] text-muted-foreground leading-[1.6] max-w-[55ch] mb-8">
                    Keep a centralized database of who attended, when, and their visitation history. Manage feedback from first-timers directly within the platform.
                  </p>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <span className="text-[1rem] font-semibold text-foreground block mb-1">Transparent History</span>
                        <span className="text-[0.875rem] text-muted-foreground leading-[1.5] block">See messages sent by admins and responses received, completely time-stamped for accountability.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <span className="text-[1rem] font-semibold text-foreground block mb-1">Admin-Centric Model</span>
                        <span className="text-[0.875rem] text-muted-foreground leading-[1.5] block">Organizations manage members. Members don't need their own login, keeping friction at absolute zero.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-6">
                    Communication
                  </div>
                  <h3 className="text-[2.25rem] lg:text-[3rem] font-bold text-foreground tracking-[-0.02em] leading-[1.15] mb-6">
                    WhatsApp & Bulk SMS Integrations
                  </h3>
                  <p className="text-[1.125rem] text-muted-foreground leading-[1.6] max-w-[55ch] mb-8">
                    Reaching out shouldn't require switching between apps. FaithCare connects your church directly to your members' phones.
                  </p>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Smartphone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-[1rem] font-semibold text-foreground block mb-1">WhatsApp Integration</span>
                        <span className="text-[0.875rem] text-muted-foreground leading-[1.5] block">Redirect or text users directly from within the platform using the WhatsApp API.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-[1rem] font-semibold text-foreground block mb-1">Message Templates & Bulk SMS</span>
                        <span className="text-[0.875rem] text-muted-foreground leading-[1.5] block">Utilize pre-saved follow-up templates or send mass SMS broadcasts to the entire congregation instantly.</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-6 bg-secondary rounded-[24px] p-2 border border-border/50 shadow-inner overflow-hidden flex items-center justify-center max-h-[500px]">
                   <div className="w-full h-full rounded-[20px] overflow-hidden border border-border/40 shadow-premium bg-background">
                     <img src="/images/features/admin-messaging.png" alt="Admin Messaging and Bulk SMS" className="w-full h-full object-cover object-left-top" />
                   </div>
                </div>
              </div>

            </div>
          </section>

          {/* Member Features Section */}
          <section className="py-24 lg:py-[128px] bg-secondary/20 border-t border-border/30">
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="text-center max-w-[65ch] mx-auto mb-20 lg:mb-[128px]">
                <h2 className="text-[2.25rem] lg:text-[3rem] font-bold text-foreground tracking-[-0.02em] leading-[1.2] mb-6">
                  For Individual Believers
                </h2>
                <p className="text-[1.125rem] text-muted-foreground leading-[1.6]">
                  FaithCare isn't just an administration tool for churches. It's a powerful, independent daily companion for individuals on their spiritual journey.
                </p>
              </div>

              {/* Member Feature 1: Dashboard & Progress */}
              <div className="grid lg:grid-cols-12 gap-16 items-center mb-[128px]">
                <div className="lg:col-span-6 order-2 lg:order-1 bg-secondary rounded-[24px] p-2 border border-border/50 shadow-inner overflow-hidden flex items-center justify-center max-h-[500px]">
                   <div className="w-full h-full rounded-[20px] overflow-hidden border border-border/40 shadow-premium bg-background">
                     <img src="/images/features/dashboard.png" alt="FaithCare User Dashboard" className="w-full h-full object-cover object-left-top" />
                   </div>
                </div>
                
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-6">
                    Personal Growth
                  </div>
                  <h3 className="text-[2.25rem] lg:text-[3rem] font-bold text-foreground tracking-[-0.02em] leading-[1.15] mb-6">
                    Spiritual Habit Tracking
                  </h3>
                  <p className="text-[1.125rem] text-muted-foreground leading-[1.6] max-w-[55ch] mb-8">
                    Individuals can log in to a beautifully designed, independent dashboard to track their streaks, monitor their weekly progress, and build consistent spiritual habits.
                  </p>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <span className="text-[1rem] font-semibold text-foreground block mb-1">Visual Progress</span>
                        <span className="text-[0.875rem] text-muted-foreground leading-[1.5] block">Easily view scriptures read, focus sessions completed, and journal entries written over time.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Member Feature 2: Daily Scripture */}
              <div className="grid lg:grid-cols-12 gap-16 items-center mb-[128px]">
                <div className="lg:col-span-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-6">
                    Daily Devotion
                  </div>
                  <h3 className="text-[2.25rem] lg:text-[3rem] font-bold text-foreground tracking-[-0.02em] leading-[1.15] mb-6">
                    Daily Scriptures & Focus Timer
                  </h3>
                  <p className="text-[1.125rem] text-muted-foreground leading-[1.6] max-w-[55ch] mb-8">
                    Start every day with the Word. Our curated daily scriptures and built-in focus timer help individuals dedicate uninterrupted time to God.
                  </p>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Smartphone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-[1rem] font-semibold text-foreground block mb-1">Weekly Focus</span>
                        <span className="text-[0.875rem] text-muted-foreground leading-[1.5] block">Follow a structured reading plan with the "This Week's Focus" timeline to stay grounded and grow consistently in your faith.</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-6 bg-secondary rounded-[24px] p-2 border border-border/50 shadow-inner overflow-hidden flex items-center justify-center max-h-[500px]">
                   <div className="w-full h-full rounded-[20px] overflow-hidden border border-border/40 shadow-premium bg-background">
                     <img src="/images/features/daily-scripture.png" alt="Daily Scripture Feature" className="w-full h-full object-cover object-left-top" />
                   </div>
                </div>
              </div>

              {/* Member Feature 3: Sunday Journal */}
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-6 order-2 lg:order-1 bg-secondary rounded-[24px] p-2 border border-border/50 shadow-inner overflow-hidden flex items-center justify-center max-h-[500px]">
                   <div className="w-full h-full rounded-[20px] overflow-hidden border border-border/40 shadow-premium bg-background">
                     <img src="/images/features/sunday-journal.png" alt="Sunday Journal Feature" className="w-full h-full object-cover object-left-top" />
                   </div>
                </div>
                
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[0.75rem] font-semibold uppercase tracking-[0.1em] mb-6">
                    Reflection
                  </div>
                  <h3 className="text-[2.25rem] lg:text-[3rem] font-bold text-foreground tracking-[-0.02em] leading-[1.15] mb-6">
                    Sunday Journal
                  </h3>
                  <p className="text-[1.125rem] text-muted-foreground leading-[1.6] max-w-[55ch] mb-8">
                    A dedicated space to reflect on Sunday's message, take notes, and refer back to previous sermons. Never lose your sermon notes again.
                  </p>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <span className="text-[1rem] font-semibold text-foreground block mb-1">Organized History</span>
                        <span className="text-[0.875rem] text-muted-foreground leading-[1.5] block">Access all your previous entries in one place. Easily recall what God spoke to you weeks or months ago.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </section>

          {/* Final CTA - Phase 4 */}
          <section className="py-[128px] bg-foreground text-background relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-subtle opacity-10" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold mb-6 tracking-[-0.03em] leading-[1.1]">
                Ready to Join FaithCare?
              </h2>
              <p className="text-[1.25rem] text-background/70 mb-10 max-w-[55ch] mx-auto leading-[1.6]">
                Whether you're organizing a ministry or building your personal spiritual habits, FaithCare is built for you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/sign-up-choice" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-10 py-5 rounded-[8px] text-[1.125rem] font-bold transition-spring hover:bg-accent/90 hover:-translate-y-[2px] hover:shadow-glow active:translate-y-0 border border-accent">
                  Register Organization
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/sign-up-choice" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-background px-10 py-5 rounded-[8px] text-[1.125rem] font-medium transition-spring hover:bg-background/10 hover:-translate-y-[2px] active:translate-y-0 border border-background/30">
                  Join as Individual
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-background py-12 border-t border-border/40 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-[1rem] font-bold text-foreground">FaithCare</span>
            </div>
            <p className="text-[0.875rem] text-muted-foreground">
              © {new Date().getFullYear()} FaithCare. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[0.875rem] text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-[0.875rem] text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-[0.875rem] text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
