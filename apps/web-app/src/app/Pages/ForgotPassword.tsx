import { forgotPassword, resetPassword } from "@/api/auth";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Logo from "../components/Logo";
import ErrorMessage from "../components/ui/error-message";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z
  .object({
    otp: z.string().length(6, "Enter the 6-digit code sent to your email"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailValues = z.infer<typeof emailSchema>;
type ResetValues = z.infer<typeof resetSchema>;

type Step = "email" | "reset" | "done";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const onEmailSubmit = async (data: EmailValues) => {
    setIsLoading(true);
    setError(null);
    const result = await forgotPassword(data.email.toLowerCase());
    setIsLoading(false);
    if (result.success) {
      setSubmittedEmail(data.email.toLowerCase());
      setStep("reset");
    } else {
      setError(result.error || "Failed to send reset code. Please try again.");
    }
  };

  const onResetSubmit = async (data: ResetValues) => {
    setIsLoading(true);
    setError(null);
    const result = await resetPassword({
      email: submittedEmail,
      otp: data.otp,
      newPassword: data.newPassword,
    });
    setIsLoading(false);
    if (result.success) {
      setStep("done");
    } else {
      setError(
        result.error ||
          "Failed to reset password. Check your code and try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Logo />

          {/* Step: Email */}
          {step === "email" && (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                  Forgot your password?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Enter your account email and we'll send you a reset code.
                </p>
              </div>

              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...emailForm.register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-5 py-4 bg-secondary/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg ${
                        emailForm.formState.errors.email
                          ? "border-destructive"
                          : "border-border"
                      }`}
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-xs text-destructive ml-1">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {error && <ErrorMessage message={error} />}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </>
          )}

          {/* Step: Reset */}
          {step === "reset" && (
            <>
              <div className="mb-10">
                <button
                  onClick={() => {
                    setStep("email");
                    setError(null);
                  }}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                  Set a new password
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We sent a 6-digit code to{" "}
                  <span className="text-foreground font-medium">
                    {submittedEmail}
                  </span>
                  . Enter it below along with your new password.
                </p>
              </div>

              <form
                onSubmit={resetForm.handleSubmit(onResetSubmit)}
                className="space-y-6"
              >
                {/* OTP */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Reset Code
                  </label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...resetForm.register("otp")}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      className={`w-full pl-12 pr-5 py-4 bg-secondary/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg tracking-widest ${
                        resetForm.formState.errors.otp
                          ? "border-destructive"
                          : "border-border"
                      }`}
                    />
                  </div>
                  {resetForm.formState.errors.otp && (
                    <p className="text-xs text-destructive ml-1">
                      {resetForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...resetForm.register("newPassword")}
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      className={`w-full pl-12 pr-12 py-4 bg-secondary/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg ${
                        resetForm.formState.errors.newPassword
                          ? "border-destructive"
                          : "border-border"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-xs text-destructive ml-1">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...resetForm.register("confirmPassword")}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your new password"
                      className={`w-full pl-12 pr-12 py-4 bg-secondary/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground text-lg ${
                        resetForm.formState.errors.confirmPassword
                          ? "border-destructive"
                          : "border-border"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive ml-1">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                    <p className="text-sm text-destructive font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-8">
                <svg
                  className="w-10 h-10 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                Password reset!
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Your password has been updated successfully. You can now sign in
                with your new password.
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
              >
                Back to Sign In
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step !== "done" && (
            <p className="text-center text-muted-foreground mt-10">
              Remember your password?{" "}
              <Link
                to="/"
                className="text-accent hover:text-accent/80 transition-all font-medium"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent/10 to-accent/5 items-center justify-center p-16">
        <div className="max-w-lg">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-8 border border-accent/20 shadow-xl shadow-accent/5">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-6 tracking-tight">
            Empowering spiritual growth for your community
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10 opacity-80">
            FaithCare helps churches nurture deeper connections with their
            members while providing tools for personal spiritual development.
          </p>
          <div className="space-y-6">
            {[
              {
                title: "Member Care Management",
                desc: "Track first timers, prayer requests, and follow-ups with automated tools.",
              },
              {
                title: "Spiritual Productivity",
                desc: "Daily scripture, journaling, and focus tools designed for modern believers.",
              },
              {
                title: "Built for Young Professionals",
                desc: "Modern, intuitive design that fits your lifestyle and elevates your experience.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-1 bg-success/10 border border-success/20 shadow-inner shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-success" />
                </div>
                <div>
                  <p className="text-foreground font-bold text-lg">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
