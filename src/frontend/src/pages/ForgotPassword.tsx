import type { Backend } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { logAudit } from "@/lib/auditLog";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Shield,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface PasswordPolicy {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

function checkPolicy(password: string): PasswordPolicy {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
  };
}

function isPolicyMet(p: PasswordPolicy) {
  return (
    p.minLength &&
    p.hasUppercase &&
    p.hasLowercase &&
    p.hasNumber &&
    p.hasSpecial
  );
}

function PolicyRow({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      )}
      <span
        className={`text-xs ${met ? "text-green-500" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const first = local.charAt(0);
  const lastTwo = local.length >= 3 ? local.slice(-2) : local.slice(-1);
  return `${first}***${lastTwo}@${domain.toUpperCase()}`;
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function lookupByUsername(
  usernameInput: string,
): { email: string; name: string } | null {
  const lower = usernameInput.trim().toLowerCase();
  const users: { username?: string; email?: string; name?: string }[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("alangh_users") || "[]");
    } catch {
      return [];
    }
  })();
  const found = users.find(
    (u) => u.username && u.username.toLowerCase() === lower,
  );
  if (found?.email && found?.name)
    return { email: found.email, name: found.name };

  const regs: { username?: string; email?: string; name?: string }[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("alangh_registrations") || "[]");
    } catch {
      return [];
    }
  })();
  const reg = regs.find(
    (r) => r.username && r.username.toLowerCase() === lower,
  );
  if (reg?.email && reg?.name) return { email: reg.email, name: reg.name };

  return null;
}

function updatePassword(usernameInput: string, newPassword: string) {
  const lower = usernameInput.trim().toLowerCase();
  const hash = btoa(newPassword);

  const users: { username?: string; passwordHash?: string }[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("alangh_users") || "[]");
    } catch {
      return [];
    }
  })();
  const ui = users.findIndex(
    (u) => u.username && u.username.toLowerCase() === lower,
  );
  if (ui >= 0) {
    users[ui].passwordHash = hash;
    localStorage.setItem("alangh_users", JSON.stringify(users));
  }

  const regs: { username?: string; passwordHash?: string }[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("alangh_registrations") || "[]");
    } catch {
      return [];
    }
  })();
  const ri = regs.findIndex(
    (r) => r.username && r.username.toLowerCase() === lower,
  );
  if (ri >= 0) {
    regs[ri].passwordHash = hash;
    localStorage.setItem("alangh_registrations", JSON.stringify(regs));
  }
}

type Step = "username" | "confirm" | "reset" | "done";

export function ForgotPassword() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [step, setStep] = useState<Step>("username");

  // Step 1
  const [inputUsername, setInputUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // Step 2
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [foundUsername, setFoundUsername] = useState("");

  // Step 3
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetErrors, setResetErrors] = useState<{
    otp?: string;
    password?: string;
    confirm?: string;
  }>({});

  const policy = checkPolicy(newPassword);

  async function handleUsernameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputUsername.trim()) {
      setUsernameError("Please enter your username.");
      return;
    }

    // Try backend first
    let rawEmail: string | null = null;
    try {
      if (actor) {
        rawEmail = await (actor as unknown as Backend).getMaskedEmailByUsername(
          inputUsername.trim().toLowerCase(),
        );
      }
    } catch (err) {
      console.warn("Backend unavailable for forgot password:", err);
    }

    if (rawEmail) {
      // Backend returned the raw email — mask it client-side
      setMaskedEmail(maskEmail(rawEmail));
    } else {
      // Fall back to localStorage lookup
      const user = lookupByUsername(inputUsername);
      if (!user) {
        setUsernameError("No account found with that username.");
        return;
      }
      setMaskedEmail(maskEmail(user.email));
    }

    setFoundUsername(inputUsername.trim());
    const generatedOtp = generateOtp();
    setOtp(generatedOtp);
    setStep("confirm");
  }

  function handleConfirmSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("reset");
  }

  function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: { otp?: string; password?: string; confirm?: string } = {};
    if (enteredOtp.trim() !== otp)
      errs.otp = "Invalid OTP code. Please check and try again.";
    if (!newPassword) errs.password = "New password is required.";
    else if (!isPolicyMet(policy))
      errs.password = "Password must meet all requirements.";
    if (!confirmPassword) errs.confirm = "Please confirm your new password.";
    else if (newPassword !== confirmPassword)
      errs.confirm = "Passwords do not match.";
    setResetErrors(errs);
    if (Object.keys(errs).length > 0) return;

    updatePassword(foundUsername, newPassword);
    logAudit({
      actor: foundUsername,
      actorType: "user",
      action: "USER_PASSWORD_RESET",
      details: `Password reset completed for: ${foundUsername}`,
      resource: foundUsername,
    });
    setStep("done");
    setTimeout(() => navigate({ to: "/login" }), 2000);
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center py-16">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-md">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="forgot_password.back.link"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-5">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">
            Reset Your <span className="text-primary glow-text">Password</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === "username" && "Enter your username to find your account"}
            {step === "confirm" && "Verify your email and receive a reset code"}
            {step === "reset" && "Enter your OTP and set a new password"}
            {step === "done" && "Password updated successfully"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["username", "confirm", "reset"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                  step === s || (step === "done" && i < 3)
                    ? "bg-primary border-primary text-primary-foreground"
                    : ["username", "confirm", "reset"].indexOf(step) > i
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-secondary/40 border-border/40 text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-8 h-px ${["username", "confirm", "reset"].indexOf(step) > i ? "bg-primary" : "bg-border/40"}`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1 — Enter Username */}
          {step === "username" && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Find Your Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUsernameSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fp-username">Username</Label>
                      <Input
                        id="fp-username"
                        type="text"
                        value={inputUsername}
                        onChange={(e) => {
                          setInputUsername(e.target.value);
                          setUsernameError("");
                        }}
                        placeholder="Enter your username"
                        className={`border-border/60 bg-secondary/30 ${usernameError ? "border-destructive" : ""}`}
                        data-ocid="forgot_password.username.input"
                      />
                      {usernameError && (
                        <p className="text-xs text-destructive">
                          {usernameError}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      data-ocid="forgot_password.find_account.button"
                    >
                      Find My Account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2 — Confirm Email & Show OTP */}
          {step === "confirm" && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Confirm Your Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleConfirmSubmit} className="space-y-4">
                    <div className="rounded-lg bg-secondary/40 border border-border/60 p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        We'll send a reset code to:
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {maskedEmail}
                      </p>
                    </div>

                    <div
                      className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4"
                      data-ocid="forgot_password.otp_display"
                    >
                      <p className="text-xs text-amber-400/80 mb-1">
                        ⚠️ For testing purposes (in live version this code would
                        be sent to your email):
                      </p>
                      <p className="text-sm text-amber-300">
                        Your OTP code is:{" "}
                        <span className="font-mono font-bold text-lg tracking-widest">
                          {otp}
                        </span>
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      data-ocid="forgot_password.send_code.button"
                    >
                      Send Reset Code
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3 — Enter OTP + New Password */}
          {step === "reset" && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Set New Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fp-otp">6-Digit OTP Code</Label>
                      <Input
                        id="fp-otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => {
                          setEnteredOtp(e.target.value.replace(/[^0-9]/g, ""));
                          setResetErrors((p) => ({ ...p, otp: undefined }));
                        }}
                        placeholder="Enter the 6-digit code"
                        className={`border-border/60 bg-secondary/30 font-mono tracking-widest text-center text-lg ${resetErrors.otp ? "border-destructive" : ""}`}
                        data-ocid="forgot_password.otp.input"
                      />
                      {resetErrors.otp && (
                        <p className="text-xs text-destructive">
                          {resetErrors.otp}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="fp-new-pw">New Password</Label>
                      <div className="relative">
                        <Input
                          id="fp-new-pw"
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setResetErrors((p) => ({
                              ...p,
                              password: undefined,
                            }));
                          }}
                          placeholder="Create a new strong password"
                          className={`border-border/60 bg-secondary/30 pr-10 ${resetErrors.password ? "border-destructive" : ""}`}
                          data-ocid="forgot_password.new_password.input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNew ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {resetErrors.password && (
                        <p className="text-xs text-destructive">
                          {resetErrors.password}
                        </p>
                      )}
                      {newPassword && (
                        <div className="mt-2 p-3 rounded-lg bg-secondary/40 border border-border/40 space-y-1.5">
                          <PolicyRow
                            met={policy.minLength}
                            label="At least 8 characters"
                          />
                          <PolicyRow
                            met={policy.hasUppercase}
                            label="At least one uppercase letter"
                          />
                          <PolicyRow
                            met={policy.hasLowercase}
                            label="At least one lowercase letter"
                          />
                          <PolicyRow
                            met={policy.hasNumber}
                            label="At least one number"
                          />
                          <PolicyRow
                            met={policy.hasSpecial}
                            label="At least one special character"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="fp-confirm-pw">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="fp-confirm-pw"
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setResetErrors((p) => ({
                              ...p,
                              confirm: undefined,
                            }));
                          }}
                          placeholder="Repeat your new password"
                          className={`border-border/60 bg-secondary/30 pr-10 ${resetErrors.confirm ? "border-destructive" : ""}`}
                          data-ocid="forgot_password.confirm_password.input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirm ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {resetErrors.confirm && (
                        <p className="text-xs text-destructive">
                          {resetErrors.confirm}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      data-ocid="forgot_password.reset_password.button"
                    >
                      Reset Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* DONE */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">
                Password Reset!
              </h2>
              <p className="text-muted-foreground mb-2">
                Your password has been updated successfully.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to login...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
