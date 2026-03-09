import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Building2, Users, MapPin, Phone, Globe, Check } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
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
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Progress & Info */}
      <div className="hidden lg:flex flex-col w-96 bg-gradient-to-br from-accent/10 to-accent/5 p-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-8 h-8" style={{ color: '#d4a574' }} />
            <h1 className="text-foreground">FaithCare</h1>
          </div>
          <h2 className="text-foreground mb-3">Welcome to FaithCare</h2>
          <p className="text-muted-foreground">
            Let's set up your church profile in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-8 flex-1">
          <div className={`flex gap-4 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step > 1 ? 'bg-accent border-accent' : step === 1 ? 'border-accent' : 'border-border'
            }`}>
              {step > 1 ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className={step === 1 ? 'text-accent' : 'text-muted-foreground'}>1</span>
              )}
            </div>
            <div>
              <p className="text-foreground">Church Information</p>
              <p className="text-sm text-muted-foreground">Basic details about your church</p>
            </div>
          </div>

          <div className={`flex gap-4 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step > 2 ? 'bg-accent border-accent' : step === 2 ? 'border-accent' : 'border-border'
            }`}>
              {step > 2 ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className={step === 2 ? 'text-accent' : 'text-muted-foreground'}>2</span>
              )}
            </div>
            <div>
              <p className="text-foreground">Contact Details</p>
              <p className="text-sm text-muted-foreground">How to reach your church</p>
            </div>
          </div>

          <div className={`flex gap-4 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step > 3 ? 'bg-accent border-accent' : step === 3 ? 'border-accent' : 'border-border'
            }`}>
              {step > 3 ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className={step === 3 ? 'text-accent' : 'text-muted-foreground'}>3</span>
              )}
            </div>
            <div>
              <p className="text-foreground">Additional Info</p>
              <p className="text-sm text-muted-foreground">Help us personalize your experience</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 space-y-3">
          <p className="text-sm text-muted-foreground mb-4">What you'll get:</p>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22c55e20' }}>
              <Check className="w-3 h-3" style={{ color: '#22c55e' }} />
            </div>
            Member care management
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22c55e20' }}>
              <Check className="w-3 h-3" style={{ color: '#22c55e' }} />
            </div>
            Prayer request tracking
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22c55e20' }}>
              <Check className="w-3 h-3" style={{ color: '#22c55e' }} />
            </div>
            Spiritual productivity tools
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22c55e20' }}>
              <Check className="w-3 h-3" style={{ color: '#22c55e' }} />
            </div>
            Follow-up automation
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Sparkles className="w-8 h-8" style={{ color: '#d4a574' }} />
            <h1 className="text-foreground">FaithCare</h1>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Step 1: Church Information */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <h2 className="text-foreground mb-2">Church Information</h2>
                <p className="text-muted-foreground">
                  Tell us about your church organization
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Church Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Grace Community Church"
                      value={formData.churchName}
                      onChange={(e) => handleInputChange("churchName", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Denomination / Affiliation
                  </label>
                  <select
                    value={formData.denomination}
                    onChange={(e) => handleInputChange("denomination", e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground"
                  >
                    <option value="">Select denomination</option>
                    <option value="non-denominational">Non-denominational</option>
                    <option value="baptist">Baptist</option>
                    <option value="methodist">Methodist</option>
                    <option value="presbyterian">Presbyterian</option>
                    <option value="pentecostal">Pentecostal</option>
                    <option value="lutheran">Lutheran</option>
                    <option value="episcopal">Episcopal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="San Francisco"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="CA"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    placeholder="94102"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div>
              <div className="mb-8">
                <h2 className="text-foreground mb-2">Contact Details</h2>
                <p className="text-muted-foreground">
                  How can people reach your church?
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://yourchurch.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    />
                  </div>
                </div>

                <div className="bg-accent/10 rounded-lg p-6 border border-accent/20">
                  <h4 className="text-foreground mb-3">Contact Information Usage</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your contact information will be used to help first-timers and members reach out to your church. It will also appear on any materials generated through FaithCare, such as QR codes and follow-up messages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Info */}
          {step === 3 && (
            <div>
              <div className="mb-8">
                <h2 className="text-foreground mb-2">Additional Information</h2>
                <p className="text-muted-foreground">
                  Help us personalize your FaithCare experience
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Approximate Member Count
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      value={formData.memberCount}
                      onChange={(e) => handleInputChange("memberCount", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground"
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

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Your Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground"
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

                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-8 border border-accent/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-accent/20 flex-shrink-0">
                      <Sparkles className="w-6 h-6" style={{ color: '#d4a574' }} />
                    </div>
                    <div>
                      <h4 className="text-foreground mb-2">You're almost there!</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Once you complete this setup, you'll have access to all of FaithCare's powerful features to help your church grow and your members thrive spiritually.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors ml-auto"
            >
              {step === totalSteps ? "Complete Setup" : "Continue"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
