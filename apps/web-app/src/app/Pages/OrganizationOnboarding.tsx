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
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import {
  completeOrganizationOnboarding,
  getOrganizationBySlug,
} from "@/api/church";
import { toast } from "react-hot-toast";
import Logo from "../components/Logo";
import SearchableSelect from "../components/ui/SearchableSelect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../components/ui/form";
import { InputField } from "../components/ui/InputField";
import z from "zod";
import { Button } from "@/components/ui/button";

const orgSchema = z.object({
  churchName: z.string().min(1, "Church name is required"),
  denomination: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP Code is required"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().optional(),
  memberCount: z.string().optional(),
  role: z.string().min(1, "Role is required"),
});

type OrgValues = z.infer<typeof orgSchema>;

export function OrganizationOnboarding() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isSearchingChurch, setIsSearchingChurch] = useState(false);
  const [churchOptions, setChurchOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const totalSteps = 3;

  const form = useForm<OrgValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
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
    },
    mode: "onChange",
  });

  const handleSignOut = async () => {
    await logout();
    navigate("/sign-in");
  };

  const handleChurchSearch = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setChurchOptions([]);
      return;
    }

    setIsSearchingChurch(true);
    const slug = searchTerm
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const res = await getOrganizationBySlug(slug);
    console.log("[handleChurchSearch] res:", res);

    if (res.success && Array.isArray(res.data)) {
      setChurchOptions(res.data);
    } else if (res.success && res.data) {
      setChurchOptions([res.data]);
    } else {
      setChurchOptions([]);
    }
    setIsSearchingChurch(false);
  };

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger([
        "churchName",
        "address",
        "city",
        "state",
        "zipCode",
      ]);
    } else if (step === 2) {
      isValid = await form.trigger(["phone", "website"]);
    }

    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: OrgValues) => {
    if (step !== totalSteps) {
      handleNext();
      return;
    }

    setIsLoading(true);
    const payload = {
      name: data.churchName,
      slug: data.churchName
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, ""),
      email: user?.email || localStorage.getItem("pendingEmail") || "",
      denomination: data.denomination?.toUpperCase() || "",
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      phoneNumber: data.phone,
      websiteUrl: data.website || "",
      memberCountRange: data.memberCount || "",
      organizationRole: data.role,
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
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log("Form Errors:", errors),
        )}
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
        <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            type="button"
            className="absolute top-8 right-8 z-50 text-muted-foreground hover:text-foreground bg-secondary/30 hover:bg-secondary/50 font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>

          <div className="w-full max-w-2xl mt-8">
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
            <div
              className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${step === 1 ? "block" : "hidden"}`}
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                  Church Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Tell us about your church organization
                </p>
              </div>

              <div className="space-y-6">
                <InputField
                  control={form.control}
                  name="churchName"
                  label="Church Name *"
                  type="custom"
                  className="w-full"
                >
                  {(field) => (
                    <SearchableSelect
                      placeholder="Grace Community Church"
                      value={field.value}
                      onInputChange={(value) => field.onChange(value)}
                      onSearch={handleChurchSearch}
                      options={churchOptions}
                      isLoading={isSearchingChurch}
                      getDisplayValue={(item) => item.name}
                      getStringValue={(item) => item.name}
                      getListDisplayValue={(item: any) => (
                        <div className="flex flex-col gap-1.5 py-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-foreground text-base leading-tight">
                              {item.name}
                            </span>
                            {item.denomination && (
                              <span className="text-[10px] uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                                {item.denomination}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                            {(item.city || item.state) && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 opacity-70" />
                                <span className="truncate max-w-[150px]">
                                  {[item.city, item.state]
                                    .filter(Boolean)
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                            {item.memberCountRange && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 opacity-70" />
                                <span>{item.memberCountRange} members</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      onSelect={(item) => {
                        if (item) {
                          field.onChange(item.name);
                        }
                      }}
                      icon={Building2}
                      required
                    />
                  )}
                </InputField>

                <InputField
                  control={form.control}
                  name="denomination"
                  label="Denomination / Affiliation"
                  type="select"
                  options={[
                    {
                      value: "non-denominational",
                      label: "Non-denominational",
                    },
                    { value: "baptist", label: "Baptist" },
                    { value: "methodist", label: "Methodist" },
                    { value: "presbyterian", label: "Presbyterian" },
                    { value: "pentecostal", label: "Pentecostal" },
                    { value: "lutheran", label: "Lutheran" },
                    { value: "episcopal", label: "Episcopal" },
                    { value: "other", label: "Other" },
                  ]}
                  placeholder="Select denomination"
                />

                <InputField
                  control={form.control}
                  name="address"
                  label="Address *"
                  placeholder="123 Main Street"
                  type="text"
                  icon={MapPin}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    control={form.control}
                    name="city"
                    label="City *"
                    placeholder="San Francisco"
                    type="text"
                  />
                  <InputField
                    control={form.control}
                    name="state"
                    label="State *"
                    placeholder="CA"
                    type="text"
                  />
                </div>

                <InputField
                  control={form.control}
                  name="zipCode"
                  label="ZIP Code *"
                  placeholder="94102"
                  type="text"
                />
              </div>
            </div>

            {/* Step 2: Contact Details */}
            <div
              className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${step === 2 ? "block" : "hidden"}`}
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                  Contact Details
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  How can people reach your church?
                </p>
              </div>

              <div className="space-y-8">
                <InputField
                  control={form.control}
                  name="phone"
                  label="Phone Number *"
                  placeholder="(555) 123-4567"
                  type="text"
                  icon={Phone}
                />

                <InputField
                  control={form.control}
                  name="website"
                  label="Website"
                  placeholder="https://yourchurch.com"
                  type="text"
                  icon={Globe}
                />

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

            {/* Step 3: Additional Info */}
            <div
              className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${step === 3 ? "block" : "hidden"}`}
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                  Additional Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Help us personalize your FaithCare experience
                </p>
              </div>

              <div className="space-y-8">
                <InputField
                  control={form.control}
                  name="memberCount"
                  label="Approximate Member Count"
                  type="select"
                  options={[
                    { value: "0-50", label: "0-50 members" },
                    { value: "51-100", label: "51-100 members" },
                    { value: "101-250", label: "101-250 members" },
                    { value: "251-500", label: "251-500 members" },
                    { value: "501-1000", label: "501-1,000 members" },
                    { value: "1000+", label: "1,000+ members" },
                  ]}
                  placeholder="Select member count"
                  icon={Users}
                />

                <InputField
                  control={form.control}
                  name="role"
                  label="Your Role *"
                  type="select"
                  options={[
                    { value: "SENIOR_PASTOR", label: "Senior Pastor" },
                    { value: "ASSOCIATE_PASTOR", label: "Associate Pastor" },
                    { value: "YOUTH_PASTOR", label: "Youth Pastor" },
                    { value: "WORSHIP_LEADER", label: "Worship Leader" },
                    { value: "CHURCH_ADMIN", label: "Church Administrator" },
                    { value: "VOLUNTEER_LEADER", label: "Volunteer Leader" },
                    { value: "OTHER", label: "Other" },
                  ]}
                  placeholder="Select your role"
                />

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

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  type="button"
                  className="px-8 font-bold border-2"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                className="px-10 ml-auto shadow-xl shadow-primary/20 font-bold"
              >
                {step === totalSteps ? "Complete Setup" : "Continue"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
