import { useState } from "react";
import { Sparkles, ArrowRight, User, Mail, MapPin, Check } from "lucide-react";

interface IndividualOnboardingProps {
  onComplete: () => void;
}

export function IndividualOnboarding({ onComplete }: IndividualOnboardingProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    church: "",
    goals: [] as string[],
  });

  const goalOptions = [
    "Daily Bible reading",
    "Consistent prayer life",
    "Scripture memorization",
    "Spiritual journaling",
    "Better time management",
    "Deeper faith",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleGoal = (goal: string) => {
    if (formData.goals.includes(goal)) {
      setFormData({
        ...formData,
        goals: formData.goals.filter((g) => g !== goal),
      });
    } else {
      setFormData({
        ...formData,
        goals: [...formData.goals, goal],
      });
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Info */}
      <div className="hidden lg:flex flex-col w-96 bg-gradient-to-br from-accent/10 to-accent/5 p-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-8 h-8" style={{ color: '#d4a574' }} />
            <h1 className="text-foreground">FaithCare</h1>
          </div>
          <h2 className="text-foreground mb-3">Welcome to your spiritual journey</h2>
          <p className="text-muted-foreground">
            Let's personalize your FaithCare experience to help you grow spiritually
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6 flex-1">
          <div className="bg-white rounded-lg p-6 border border-accent/20">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h4 className="text-foreground mb-2">Daily Scripture</h4>
            <p className="text-sm text-muted-foreground">
              Start each day with God's Word and inspiring devotionals
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-accent/20">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-foreground mb-2">Journal Your Growth</h4>
            <p className="text-sm text-muted-foreground">
              Reflect on Sunday messages and track your spiritual journey
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-accent/20">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-foreground mb-2">Stay Focused</h4>
            <p className="text-sm text-muted-foreground">
              Use the focus timer to be intentional with your time
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xl">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Sparkles className="w-8 h-8" style={{ color: '#d4a574' }} />
            <h1 className="text-foreground">FaithCare</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-foreground mb-2">Tell us about yourself</h2>
            <p className="text-muted-foreground">
              This helps us create a personalized experience for you
            </p>
          </div>

          <form onSubmit={handleComplete} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Church */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Your Church (Optional)
              </label>
              <input
                type="text"
                placeholder="Grace Community Church"
                value={formData.church}
                onChange={(e) => handleInputChange("church", e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              />
            </div>

            {/* Goals */}
            <div>
              <label className="text-sm text-muted-foreground mb-3 block">
                What are your spiritual goals?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.goals.includes(goal)
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{goal}</span>
                      {formData.goals.includes(goal) && (
                        <Check className="w-4 h-4 text-accent" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
