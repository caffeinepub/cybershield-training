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

function PolicyRow({
  met,
  label,
}: {
  met: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      )}
      <span
        className={`text-xs ${
          met ? "text-green-500" : "text-muted-foreground"
        }`}
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

    // Save to legacy alangh_registrations for backward compat
    const existing: unknown[] = JSON.parse(
      localStorage.getItem("alangh_registrations") || "[]",
    );
    const newReg = {
      name: form.name,
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
            {/* STEP 1 — Registration form */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-border/60 bg-card/60 shadow-cyber">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-xl text-muted-foreground font-normal">
                      All fields marked{" "}
                      <span className="text-destructive">*</span> are required
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-6"
                    >
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className={`border-border/60 focus-visible:ring-primary ${
                            errors.name
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          data-ocid="register.input"
                        />
                        {errors.name && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.error_state"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold"
                        >
                          Email Address{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className={`border-border/60 focus-visible:ring-primary ${
                            errors.email
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          data-ocid="register.input"
                        />
                        {errors.email && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.error_state"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-semibold"
                        >
                          Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={form.password}
                            onChange={(e) =>
                              handleChange("password", e.target.value)
                            }
                            className={`border-border/60 focus-visible:ring-primary pr-10 ${
                              errors.password
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                            }`}
                            data-ocid="register.input"
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
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Password policy checklist */}
                        {form.password.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-secondary/30 border border-border/40 rounded-lg p-3 space-y-1.5"
                          >
                            <p className="text-xs font-semibold text-muted-foreground mb-2">
                              Password Requirements:
                            </p>
                            <PolicyRow
                              met={policy.minLength}
                              label="At least 8 characters"
                            />
                            <PolicyRow
                              met={policy.hasUppercase}
                              label="At least one uppercase letter (A-Z)"
                            />
                            <PolicyRow
                              met={policy.hasLowercase}
                              label="At least one lowercase letter (a-z)"
                            />
                            <PolicyRow
                              met={policy.hasNumber}
                              label="At least one number (0-9)"
                            />
                            <PolicyRow
                              met={policy.hasSpecial}
                              label="At least one special character (!@#$%^&*...)"
                            />
                          </motion.div>
                        )}

                        {errors.password && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.error_state"
                          >
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-semibold"
                        >
                          Confirm Password{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Re-enter your password"
                            value={form.confirmPassword}
                            onChange={(e) =>
                              handleChange("confirmPassword", e.target.value)
                            }
                            className={`border-border/60 focus-visible:ring-primary pr-10 ${
                              errors.confirmPassword
                                ? "border-destructive focus-visible:ring-destructive"
                                : form.confirmPassword &&
                                    form.password === form.confirmPassword
                                  ? "border-green-500/60"
                                  : ""
                            }`}
                            data-ocid="register.input"
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
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.error_state"
                          >
                            {errors.confirmPassword}
                          </p>
                        )}
                        {!errors.confirmPassword &&
                          form.confirmPassword &&
                          form.password === form.confirmPassword && (
                            <p className="text-xs text-green-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Passwords
                              match
                            </p>
                          )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-semibold"
                        >
                          Phone Number{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={form.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className={`border-border/60 focus-visible:ring-primary ${
                            errors.phone
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          data-ocid="register.input"
                        />
                        {errors.phone && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.error_state"
                          >
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-sm font-semibold"
                        >
                          Correspondence Address{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Enter your full correspondence address"
                          rows={3}
                          value={form.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                          className={`border-border/60 focus-visible:ring-primary resize-none ${
                            errors.address
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          data-ocid="register.textarea"
                        />
                        {errors.address && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.error_state"
                          >
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Profile / Work Experience */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="profile"
                          className="text-sm font-semibold"
                        >
                          Tell us about yourself and your work experience
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Share your educational background, current role, and
                          any relevant experience.
                        </p>
                        <Textarea
                          id="profile"
                          placeholder="E.g. I'm a commerce graduate currently working as a data entry operator..."
                          rows={5}
                          value={form.profile}
                          onChange={(e) =>
                            handleChange("profile", e.target.value)
                          }
                          className="border-border/60 focus-visible:ring-primary resize-none"
                          data-ocid="register.textarea"
                        />
                      </div>

                      {/* Enrollment Reason */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="reason"
                          className="text-sm font-semibold"
                        >
                          Why do you want to enroll for cybersecurity training?
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Tell us your goals, motivations, and what you hope to
                          achieve from this program.
                        </p>
                        <Textarea
                          id="reason"
                          placeholder="E.g. I want to switch careers into cybersecurity..."
                          rows={5}
                          value={form.reason}
                          onChange={(e) =>
                            handleChange("reason", e.target.value)
                          }
                          className="border-border/60 focus-visible:ring-primary resize-none"
                          data-ocid="register.textarea"
                        />
                      </div>

                      {/* Submit */}
                      <div className="pt-2">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                          data-ocid="register.submit_button"
                        >
                          Register &amp; Take Self-Assessment
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Success / redirect */}
            {step === "done" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  className="border-accent/40 bg-accent/5 text-center"
                  data-ocid="register.success_state"
                >
                  <CardContent className="py-16 px-8">
                    <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="font-display text-2xl font-bold mb-3 text-foreground">
                      Registration Successful!
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Welcome aboard! Redirecting you to the self-assessment...
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                      Please wait a moment.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
