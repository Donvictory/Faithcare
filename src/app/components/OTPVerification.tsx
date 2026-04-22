import { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP, resendOTP } from "@/api/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "../providers/AuthProvider";

export function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setAccessToken } = useAuth();
  const email =
    location.state?.email ||
    localStorage.getItem("pendingEmail") ||
    "your email";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setIsVerifying(true);
    const res = await verifyOTP({ email, otp: otpString });
    setIsVerifying(false);

    if (res.success) {
      toast.success("Verification successful!");

      // If the backend returns tokens/user on verification, set them in context
      // AND persist them to storage so AuthProvider can restore the session
      // without needing a refresh token cookie (which may not exist yet).
      if (res.data?.data?.accessToken) {
        const newAccessToken = res.data.data.accessToken;
        const newUser = res.data.data.user;

        setAccessToken(newAccessToken);
        setUser(newUser);

        // Persist to storage — use sessionStorage by default after sign-up
        // (no "remember me" preference is set at this point)
        const rememberMe = localStorage.getItem("rememberMe") === "true";
        if (rememberMe) {
          localStorage.setItem("accessToken", newAccessToken);
          if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
        } else {
          sessionStorage.setItem("accessToken", newAccessToken);
          if (newUser) sessionStorage.setItem("user", JSON.stringify(newUser));
        }
      }

      const userType = localStorage.getItem("userType");
      if (userType === "individual") {
        navigate("/individual-onboarding");
      } else {
        navigate("/organization-onboarding");
      }
    } else {
      toast.error(res.error || "Verification failed");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setResendTimer(30);
    setCanResend(false);

    const res = await resendOTP(email);
    if (res.success) {
      toast.success("OTP resent successfully");
    } else {
      toast.error(res.error || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent/10 to-accent/5 items-center justify-center p-16">
        <div className="max-w-lg">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 border border-accent/20">
            <ShieldCheck className="w-8 h-8" style={{ color: "#d4a574" }} />
          </div>
          <h2 className="text-foreground mb-4">Security is our priority</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            We've sent a 6-digit verification code to your email. This helps us
            ensure your account stays secure and private.
          </p>

          <div className="bg-white rounded-xl p-6 border border-accent/20">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Two-Factor Authentication
                </p>
                <p className="text-sm">
                  Protecting your spiritual journey and data.
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
            <h2 className="text-foreground mb-2">Verify your email</h2>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to{" "}
              <span className="text-foreground font-medium">{email}</span>
            </p>
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-accent hover:underline mt-1"
            >
              Entered the wrong email?
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-foreground"
                />
              ))}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors disabled:text-muted-foreground"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${!canResend ? "animate-none" : ""}`}
                  />
                  {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
                </button>
              </div>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Didn't receive the code? Check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
