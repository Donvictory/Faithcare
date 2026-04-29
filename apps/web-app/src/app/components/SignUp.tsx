import { signUpOrg, signUpUser } from "@/api/auth";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  Phone,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Valid phone number is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain letters")
      .regex(/[0-9]/, "Password must contain numbers"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUp({ type }: { type: string }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverEmailError, setServerEmailError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    setIsLoading(true);
    setServerEmailError(null);
    localStorage.setItem("userType", type);

    // Normalize email to lowercase for case-insensitive uniqueness
    const normalizedEmail = data.email.toLowerCase();

    const signUpFn = type === "individual" ? signUpUser : signUpOrg;

    const res = await signUpFn({
      email: normalizedEmail,
      password: data.password,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
    });

    setIsLoading(false);

    if (res.success) {
      localStorage.setItem("pendingEmail", normalizedEmail);
      navigate("/otp-verification", { state: { email: normalizedEmail } });
    } else {
      const errMsg = res.error || "Registration failed";
      if (
        errMsg.toLowerCase().includes("already exists") ||
        errMsg.toLowerCase().includes("already registered") ||
        errMsg.toLowerCase().includes("email is taken") ||
        errMsg.toLowerCase().includes("duplicate")
      ) {
        setServerEmailError(
          "An account with this email already exists. Please sign in instead.",
        );
      } else {
        toast.error(errMsg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent/10 to-accent/5 items-center justify-center p-16">
        <div className="max-w-lg">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 border border-accent/20">
            <Sparkles className="w-8 h-8" style={{ color: "#d4a574" }} />
          </div>
          <h2 className="text-foreground mb-4">
            Join thousands of churches growing together
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Start your journey with FaithCare and transform how you connect with
            your community and grow spiritually.
          </p>

          <div className="bg-white rounded-xl p-6 border border-accent/20">
            <p className="text-muted-foreground italic mb-4">
              "FaithCare has revolutionized how we care for our members. The
              combination of church management and personal spiritual tools is
              exactly what our community needed."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                JM
              </div>
              <div>
                <p className="text-foreground text-sm">Pastor John Miller</p>
                <p className="text-xs text-muted-foreground">
                  Grace Community Church
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-8 h-8" style={{ color: "#d4a574" }} />
            <h1 className="text-foreground">FaithCare</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Get started with FaithCare in just a few steps
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-11 pr-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
                    errors.fullName ? "border-red-500" : "border-border"
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
                    errors.email || serverEmailError
                      ? "border-red-500 focus:ring-red-400"
                      : "border-border"
                  }`}
                />
              </div>
              {(errors.email || serverEmailError) && (
                <div className="mt-2 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <svg
                    className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-red-500 font-bold">
                      {errors.email?.message || serverEmailError}
                    </p>
                    {serverEmailError && (
                      <Link
                        to="/"
                        className="text-xs text-accent hover:underline mt-0.5 inline-block"
                      >
                        Sign in instead →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("phoneNumber")}
                  type="text"
                  placeholder="xxxxxxx"
                  className={`w-full pl-11 pr-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
                    errors.phoneNumber ? "border-red-500" : "border-border"
                  }`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`w-full pl-11 pr-11 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
                    errors.password ? "border-red-500" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">
                  Must be at least 8 characters with letters and numbers
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className={`w-full pl-11 pr-11 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all ${
                    errors.confirmPassword ? "border-red-500" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                {...register("terms")}
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded border-border text-accent focus:ring-accent mt-1"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-500">{errors.terms.message}</p>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:grayscale active:scale-95 shadow-xl shadow-primary/20"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted/30 transition-colors text-foreground">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
