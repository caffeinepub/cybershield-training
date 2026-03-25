import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  Lock,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Registration {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profile?: string;
  reason?: string;
  enrolledCourse?: string;
  assessmentScore?: number;
  registeredAt: string;
  passwordHash?: string;
}

type LoginState =
  | "form"
  | "found"
  | "notfound"
  | "wrongpassword"
  | "nopassword";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>("form");
  const [user, setUser] = useState<Registration | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function validate() {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "Email address is required.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
      newErrors.email = "Enter a valid email address.";
    if (!password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Check new alangh_users first
    const users: Registration[] = (() => {
      try {
        return JSON.parse(localStorage.getItem("alangh_users") || "[]");
      } catch {
        return [];
      }
    })();
    let match = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );

    // Fall back to legacy alangh_registrations
    if (!match) {
      const raw = localStorage.getItem("alangh_registrations");
      const registrations: Registration[] = raw ? JSON.parse(raw) : [];
      match = registrations.find(
        (r) => r.email.toLowerCase() === email.trim().toLowerCase(),
      );
    }

    if (!match) {
      setLoginState("notfound");
      return;
    }

    // Account has no password stored (registered before password feature)
    if (!match.passwordHash) {
      setLoginState("nopassword");
      return;
    }

    // Wrong password
    if (btoa(password) !== match.passwordHash) {
      setErrors((prev) => ({
        ...prev,
        password: "Incorrect password. Please try again.",
      }));
      return;
    }

    // Success
    const userId =
      match.id || `user_${match.email.replace(/[^a-z0-9]/gi, "_")}`;

    // Enrich with latest assessment result
    const results = (() => {
      try {
        return JSON.parse(
          localStorage.getItem("alangh_assessment_results") || "[]",
        ) as Array<{ userId: string; score: number; passed: boolean }>;
      } catch {
        return [];
      }
    })();
    const userResults = results.filter((r) => r.userId === userId);
    const bestScore =
      userResults.length > 0
        ? Math.max(...userResults.map((r) => r.score))
        : undefined;

    const currentUser = {
      id: userId,
      name: match.name,
      email: match.email,
      phone: match.phone,
      registeredAt: match.registeredAt,
      assessmentScore: bestScore,
      enrolledCourse: match.enrolledCourse,
    };
    localStorage.setItem("alangh_current_user", JSON.stringify(currentUser));
    window.dispatchEvent(new CustomEvent("alanghUserChanged"));

    const enrichedMatch = { ...match, assessmentScore: bestScore };
    setUser(enrichedMatch);
    setLoginState("found");
  }

  function handleReset() {
    setLoginState("form");
    setUser(null);
    setEmail("");
    setPassword("");
    setErrors({});
  }

  function handleGoToProfile() {
    navigate({ to: "/profile" });
  }

  const passed =
    user !== null &&
    user !== undefined &&
    typeof user.assessmentScore === "number" &&
    user.assessmentScore >= 16;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          data-ocid="login.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <AnimatePresence mode="wait">
          {loginState === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground text-sm">
                  Log in to view your assessment history and profile.
                </p>
              </div>

              <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    data-ocid="login.modal"
                  >
                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-email"
                        className="text-foreground font-medium"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email)
                            setErrors((p) => ({ ...p, email: undefined }));
                        }}
                        className={`bg-background/60 border-border/60 focus:border-primary/60 ${
                          errors.email ? "border-destructive" : ""
                        }`}
                        data-ocid="login.input"
                      />
                      {errors.email && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="login.error_state"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-password"
                        className="text-foreground font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password)
                              setErrors((p) => ({ ...p, password: undefined }));
                          }}
                          className={`bg-background/60 border-border/60 focus:border-primary/60 pr-10 ${
                            errors.password ? "border-destructive" : ""
                          }`}
                          data-ocid="login.input"
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
                      {errors.password && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="login.error_state"
                        >
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                      data-ocid="login.submit_button"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Log In
                    </Button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-border/40 text-center">
                    <p className="text-sm text-muted-foreground">
                      New to Alangh Academy?{" "}
                      <Link
                        to="/register"
                        className="text-primary hover:underline font-medium"
                        data-ocid="login.link"
                      >
                        Register here
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {loginState === "found" && user && (
            <motion.div
              key="found"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Card
                className="border-accent/40 bg-card/80 backdrop-blur-sm"
                data-ocid="login.success_state"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="font-display text-2xl text-foreground">
                    Welcome back, {user.name}!
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re now logged in.
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Assessment result */}
                  <div className="bg-secondary/40 border border-border/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Self-Assessment
                      </span>
                    </div>

                    {typeof user.assessmentScore === "number" ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Score
                          </span>
                          <span className="font-bold text-foreground">
                            {user.assessmentScore} / 20
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Result
                          </span>
                          {passed ? (
                            <Badge className="bg-accent/20 text-accent border-accent/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Passed
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/20 text-destructive border-destructive/40 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Not Passed
                            </Badge>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No assessment taken yet.
                      </p>
                    )}
                  </div>

                  {/* Enrolled course */}
                  {user.enrolledCourse && (
                    <div className="bg-secondary/40 border border-border/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          Enrolled Course
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.enrolledCourse}
                      </p>
                    </div>
                  )}

                  {/* Registration date */}
                  <div className="bg-secondary/40 border border-border/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        Registered On
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.registeredAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleGoToProfile}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold mt-2"
                    data-ocid="login.primary_button"
                  >
                    <User className="w-4 h-4 mr-2" />
                    View My Profile
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-border/50"
                    onClick={handleReset}
                    data-ocid="login.secondary_button"
                  >
                    Log in with a different account
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {loginState === "notfound" && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Card
                className="border-border/60 bg-card/80 backdrop-blur-sm text-center"
                data-ocid="login.error_state"
              >
                <CardContent className="py-12 px-8">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mx-auto mb-5">
                    <XCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    Account Not Found
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                    We couldn&apos;t find an account with that email address.
                    Please register to get started.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                        data-ocid="login.primary_button"
                      >
                        Register Now
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-border/50"
                      onClick={handleReset}
                      data-ocid="login.secondary_button"
                    >
                      Try a different email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {loginState === "nopassword" && (
            <motion.div
              key="nopassword"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Card
                className="border-yellow-500/40 bg-card/80 backdrop-blur-sm text-center"
                data-ocid="login.error_state"
              >
                <CardContent className="py-12 px-8">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center mx-auto mb-5">
                    <Shield className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                    Password Not Set
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                    Your account was created before passwords were added. Please
                    re-register to set a password.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                        data-ocid="login.primary_button"
                      >
                        Re-Register
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-border/50"
                      onClick={handleReset}
                      data-ocid="login.secondary_button"
                    >
                      Back to Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
