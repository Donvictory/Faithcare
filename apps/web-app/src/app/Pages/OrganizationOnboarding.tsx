import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building2,
  Users,
  MapPin,
  Phone,
  Globe,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { completeOrganizationOnboarding } from "@/api/church";
import { toast } from "react-hot-toast";
import { LoadingScreen } from "../components/LoadingScreen";
import Logo from "../components/Logo";

export function OrganizationOnboarding() {
  const navigate = useNavigate();
  const { accessToken, user, setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    churchName: "",
    denomination: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    website: "",
    memberCount: "",
    role: "",
  });

  const totalSteps = 3;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      setIsLoading(true);
      const payload = {
        name: formData.churchName,
        slug: formData.churchName
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
        email: user?.email || localStorage.getItem("pendingEmail") || "",
        denomination: formData.denomination.toUpperCase(),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phoneNumber: formData.phone,
        websiteUrl: formData.website,
        memberCountRange: formData.memberCount,
        organizationRole: formData.role.toUpperCase().replace(/-/g, "_"),
      };

      const res = await completeOrganizationOnboarding(payload);
      setIsLoading(false);

      if (res.success) {
        if (res.data) {
          setUser({ ...user, organizationId: res.data.id });
        }
        toast.success("Profile set up successfully!");
        navigate("/dashboard");
      } else {
        toast.error(res.error || "Failed to complete setup");
      }
    } else {
      handleNext();
    }
  };

  if (isLoading) {
    return <LoadingScreen churchName={formData.churchName} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-background flex font-sans"
    >
      {/* Left Side - Progress & Info */}
      <div className="hidden lg:flex flex-col w-96 bg-gradient-to-br from-accent/10 to-accent/5 p-12">
        <div className="mb-12">
          <Logo />
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Welcome to FaithCare
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Let's set up your church profile in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-8 flex-1">
          <div
            className={`flex gap-4 ${step >= 1 ? "opacity-100" : "opacity-40"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step > 1
                  ? "bg-accent border-accent shadow-lg shadow-accent/20"
                  : step === 1
                    ? "border-accent"
                    : "border-border"
              }`}
            >
              {step > 1 ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span
                  className={`font-bold ${step === 1 ? "text-accent" : "text-muted-foreground"}`}
                >
                  1
                </span>
              )}
            </div>
            <div>
              <p className="text-foreground font-bold">Church Information</p>
              <p className="text-xs text-muted-foreground">
                Basic details about your church
              </p>
            </div>
          </div>

          <div
            className={`flex gap-4 ${step >= 2 ? "opacity-100" : "opacity-40"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step > 2
                  ? "bg-accent border-accent shadow-lg shadow-accent/20"
                  : step === 2
                    ? "border-accent"
                    : "border-border"
              }`}
            >
              {step > 2 ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span
                  className={`font-bold ${step === 2 ? "text-accent" : "text-muted-foreground"}`}
                >
                  2
                </span>
              )}
            </div>
            <div>
              <p className="text-foreground font-bold">Contact Details</p>
              <p className="text-xs text-muted-foreground">
                How to reach your church
              </p>
            </div>
          </div>

          <div
            className={`flex gap-4 ${step >= 3 ? "opacity-100" : "opacity-40"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step > 3
                  ? "bg-accent border-accent shadow-lg shadow-accent/20"
                  : step === 3
                    ? "border-accent"
                    : "border-border"
              }`}
            >
              {step > 3 ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span
                  className={`font-bold ${step === 3 ? "text-accent" : "text-muted-foreground"}`}
                >
                  3
                </span>
              )}
            </div>
            <div>
              <p className="text-foreground font-bold">Additional Info</p>
              <p className="text-xs text-muted-foreground">
                Help us personalize your experience
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 space-y-4 bg-white/50 rounded-2xl p-6 border border-accent/10 shadow-inner">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
            What you'll get:
          </p>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-success/10 border border-success/20">
              <Check className="w-3 h-3 text-success" />
            </div>
            Member care management
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-success/10 border border-success/20">
              <Check className="w-3 h-3 text-success" />
            </div>
            Prayer request tracking
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-success/10 border border-success/20">
              <Check className="w-3 h-3 text-success" />
            </div>
            Spiritual productivity tools
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-success/10 border border-success/20">
              <Check className="w-3 h-3 text-success" />
            </div>
            Follow-up automation
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-2xl">
          {/* Mobile Logo */}
          <Logo className="lg:hidden" />

          {/* Step Indicator */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Step {step} of {totalSteps}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-accent transition-all duration-1000 shadow-[0_0_8px_rgba(212,165,116,0.3)]"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Step 1: Church Information */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                  Church Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Tell us about your church organization
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Church Name *
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      placeholder="Grace Community Church"
                      value={formData.churchName}
                      onChange={(e) =>
                        handleInputChange("churchName", e.target.value)
                      }
                      className="w-full pl-12 pr-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Denomination / Affiliation
                  </label>
                  <select
                    value={formData.denomination}
                    onChange={(e) =>
                      handleInputChange("denomination", e.target.value)
                    }
                    className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg appearance-none cursor-pointer"
                  >
                    <option value="">Select denomination</option>
                    <option value="non-denominational">
                      Non-denominational
                    </option>
                    <option value="baptist">Baptist</option>
                    <option value="methodist">Methodist</option>
                    <option value="presbyterian">Presbyterian</option>
                    <option value="pentecostal">Pentecostal</option>
                    <option value="lutheran">Lutheran</option>
                    <option value="episcopal">Episcopal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Address *
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="w-full pl-12 pr-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground ml-1">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="San Francisco"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground ml-1">
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="CA"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    placeholder="94102"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                  Contact Details
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  How can people reach your church?
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Phone Number *
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full pl-12 pr-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Website
                  </label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      type="url"
                      placeholder="https://yourchurch.com"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      className="w-full pl-12 pr-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg"
                    />
                  </div>
                </div>

                <div className="bg-accent/5 rounded-2xl p-8 border border-accent/20 shadow-inner">
                  <h4 className="text-lg font-bold text-foreground mb-4">
                    Contact Information Usage
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">
                    Your contact information will be used to help first-timers
                    and members reach out to your church. It will also appear on
                    any materials generated through FaithCare, such as QR codes
                    and follow-up messages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Info */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                  Additional Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Help us personalize your FaithCare experience
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Approximate Member Count
                  </label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <select
                      value={formData.memberCount}
                      onChange={(e) =>
                        handleInputChange("memberCount", e.target.value)
                      }
                      className="w-full pl-12 pr-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg appearance-none cursor-pointer"
                    >
                      <option value="">Select member count</option>
                      <option value="0-50">0-50 members</option>
                      <option value="51-100">51-100 members</option>
                      <option value="101-250">101-250 members</option>
                      <option value="251-500">251-500 members</option>
                      <option value="501-1000">501-1,000 members</option>
                      <option value="1000+">1,000+ members</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Your Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="w-full px-5 py-4 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="senior-pastor">Senior Pastor</option>
                    <option value="associate-pastor">Associate Pastor</option>
                    <option value="youth-pastor">Youth Pastor</option>
                    <option value="worship-leader">Worship Leader</option>
                    <option value="administrator">Church Administrator</option>
                    <option value="volunteer">Volunteer Leader</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8 border border-accent/20 shadow-xl shadow-accent/5">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-accent/20 flex-shrink-0 shadow-md">
                      <Sparkles className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        You're almost there!
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed opacity-90">
                        Once you complete this setup, you'll have access to all
                        of FaithCare's powerful features to help your church
                        grow and your members thrive spiritually.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-8 py-4 border-2 border-border rounded-2xl hover:bg-secondary/50 transition-all text-foreground font-bold active:scale-95 shadow-sm"
                type="button"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all ml-auto shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
            >
              {step === totalSteps ? "Complete Setup" : "Continue"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
