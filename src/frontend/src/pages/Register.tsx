import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Shield,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  profile: string;
  reason: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
}

interface PasswordPolicy {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

function checkPasswordPolicy(password: string): PasswordPolicy {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
  };
}

function isPolicyMet(policy: PasswordPolicy): boolean {
  return (
    policy.minLength &&
    policy.hasUppercase &&
    policy.hasLowercase &&
    policy.hasNumber &&
    policy.hasSpecial
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

export function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "done">("form");
  const [form, setForm] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    profile: "",
    reason: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const policy = checkPasswordPolicy(form.password);
  const policyMet = isPolicyMet(policy);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";

    // Username validation
    if (!form.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    } else if (form.username.length > 20) {
      newErrors.username = "Username must be 20 characters or less.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores.";
    } else {
      // Check uniqueness
      const users: { username?: string }[] = (() => {
        try {
          return JSON.parse(localStorage.getItem("alangh_users") || "[]");
        } catch {
          return [];
        }
      })();
      const regs: { username?: string }[] = (() => {
        try {
          return JSON.parse(
            localStorage.getItem("alangh_registrations") || "[]",
          );
        } catch {
          return [];
        }
      })();
      const taken = [...users, ...regs].some(
        (u) =>
          u.username &&
          u.username.toLowerCase() === form.username.trim().toLowerCase(),
      );
      if (taken)
        newErrors.username =
          "Username already taken. Please choose a different one.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (!policyMet) {
      newErrors.password = "Password must meet all requirements listed below.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!form.address.trim())
      newErrors.address = "Correspondence address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const userId = `user_${Date.now()}`;
    const registeredAt = new Date().toISOString();
    const passwordHash = btoa(form.password);
    const username = form.username.trim().toLowerCase();

    // Save to legacy alangh_registrations for backward compat
    const existing: unknown[] = JSON.parse(
      localStorage.getItem("alangh_registrations") || "[]",
    );
    const newReg = {
      name: form.name,
      username,
      email: form.email,
      phone: form.phone,
      address: form.address,
      profile: form.profile,
      reason: form.reason,
      registeredAt,
      enrolledCourse: "",
      score: undefined,
      passwordHash,
    };
    const idx = (existing as { email: string }[]).findIndex(
      (r) => r.email === form.email,
    );
    if (idx >= 0) {
      (existing as Record<string, unknown>[])[idx] = newReg;
    } else {
      existing.push(newReg);
    }
    localStorage.setItem("alangh_registrations", JSON.stringify(existing));

    // Save to new alangh_users schema
    const users: unknown[] = JSON.parse(
      localStorage.getItem("alangh_users") || "[]",
    );
    const userObj = {
      id: userId,
      name: form.name,
      username,
      email: form.email,
      phone: form.phone,
      address: form.address,
      profile: form.profile,
      reason: form.reason,
      registeredAt,
      passwordHash,
    };
    const userIdx = (users as { email: string }[]).findIndex(
      (u) => u.email === form.email,
    );
    if (userIdx >= 0) {
      (users as Record<string, unknown>[])[userIdx] = userObj;
    } else {
      users.push(userObj);
    }
    localStorage.setItem("alangh_users", JSON.stringify(users));

    // Set current user and notify listeners
    localStorage.setItem("alangh_current_user", JSON.stringify(userObj));
    sessionStorage.setItem("alangh_current_email", form.email);
    window.dispatchEvent(new CustomEvent("alanghUserChanged"));

    setStep("done");
    setTimeout(() => {
      navigate({ to: "/self-assessment" });
    }, 1200);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <main className="relative min-h-screen py-16">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-5">
              <Shield
                className="w-8 h-8 text-primary"
                style={{ animation: "float 4s ease-in-out infinite" }}
              />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Register for{" "}
              <span className="text-primary glow-text">
                Cybersecurity Training
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Take the first step toward your cybersecurity career. Fill in your
              details below to get started.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground/90">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="name">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          className={`border-border/60 bg-secondary/30 ${errors.name ? "border-destructive" : ""}`}
                          data-ocid="register.name.input"
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Username */}
                      <div className="space-y-1.5">
                        <Label htmlFor="username">
                          Username <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="username"
                          value={form.username}
                          onChange={(e) =>
                            handleChange("username", e.target.value)
                          }
                          placeholder="Choose a unique username (letters, numbers, underscores only)"
                          className={`border-border/60 bg-secondary/30 ${errors.username ? "border-destructive" : ""}`}
                          data-ocid="register.username.input"
                        />
                        {errors.username ? (
                          <p className="text-xs text-destructive">
                            {errors.username}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            This will be used to log in. Email is used only for
                            password recovery.
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label htmlFor="email">
                          Email Address{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          placeholder="your@email.com"
                          className={`border-border/60 bg-secondary/30 ${errors.email ? "border-destructive" : ""}`}
                          data-ocid="register.email.input"
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <Label htmlFor="password">
                          Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(e) =>
                              handleChange("password", e.target.value)
                            }
                            placeholder="Create a strong password"
                            className={`border-border/60 bg-secondary/30 pr-10 ${errors.password ? "border-destructive" : ""}`}
                            data-ocid="register.password.input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-xs text-destructive">
                            {errors.password}
                          </p>
                        )}
                        {form.password && (
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

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword">
                          Confirm Password{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={(e) =>
                              handleChange("confirmPassword", e.target.value)
                            }
                            placeholder="Repeat your password"
                            className={`border-border/60 bg-secondary/30 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                            data-ocid="register.confirm_password.input"
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
                        {errors.confirmPassword && (
                          <p className="text-xs text-destructive">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">
                          Phone Number{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          placeholder="+91 XXXXX XXXXX"
                          className={`border-border/60 bg-secondary/30 ${errors.phone ? "border-destructive" : ""}`}
                          data-ocid="register.phone.input"
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="space-y-1.5">
                        <Label htmlFor="address">
                          Correspondence Address{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          value={form.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                          placeholder="Your current address"
                          rows={3}
                          className={`border-border/60 bg-secondary/30 resize-none ${errors.address ? "border-destructive" : ""}`}
                          data-ocid="register.address.textarea"
                        />
                        {errors.address && (
                          <p className="text-xs text-destructive">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Profile */}
                      <div className="space-y-1.5">
                        <Label htmlFor="profile">
                          Profile / Work Experience
                        </Label>
                        <Textarea
                          id="profile"
                          value={form.profile}
                          onChange={(e) =>
                            handleChange("profile", e.target.value)
                          }
                          placeholder="Tell us about your background, current role, years of experience..."
                          rows={4}
                          className="border-border/60 bg-secondary/30 resize-none"
                          data-ocid="register.profile.textarea"
                        />
                      </div>

                      {/* Reason */}
                      <div className="space-y-1.5">
                        <Label htmlFor="reason">
                          Why do you want to enroll?
                        </Label>
                        <Textarea
                          id="reason"
                          value={form.reason}
                          onChange={(e) =>
                            handleChange("reason", e.target.value)
                          }
                          placeholder="What motivated you to pursue cybersecurity training?"
                          rows={3}
                          className="border-border/60 bg-secondary/30 resize-none"
                          data-ocid="register.reason.textarea"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full gap-2"
                        data-ocid="register.submit_button"
                      >
                        Complete Registration
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-3">
                  Registration Complete!
                </h2>
                <p className="text-muted-foreground text-lg">
                  Redirecting you to the self-assessment...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
