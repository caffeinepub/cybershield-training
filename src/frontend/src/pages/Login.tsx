import type { Backend } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { logAudit } from "@/lib/auditLog";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ClipboardList,
  Eye,
  EyeOff,
  Lock,
  Shield,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Registration {
  id?: string;
  name: string;
  username?: string;
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
  const { actor } = useActor();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>("form");
  const [user, setUser] = useState<Registration | null>(null);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  function validate() {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = "Username is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    const hash = btoa(password);
    const lowerUsername = username.trim().toLowerCase();

    // Try backend first
    let backendMatch: Registration | null = null;
    try {
      if (actor) {
        const result = await (actor as unknown as Backend).loginUser(
          lowerUsername,
          hash,
        );
        if (result) {
          backendMatch = {
            id: `user_${result.username}`,
            name: result.fullName,
            username: result.username,
            email: result.email,
            phone: result.phone,
            address: result.address,
            profile: result.profileBio,
            reason: result.reason,
            registeredAt: new Date(
              Number(result.createdAt) / 1_000_000,
            ).toISOString(),
            enrolledCourse: result.enrolledCourse ?? undefined,
            passwordHash: result.passwordHash,
          } as Registration;
        }
      }
    } catch (err) {
      console.warn(
        "Backend login unavailable, falling back to localStorage:",
        err,
      );
    }

    // Fall back to localStorage
    let match: Registration | null = backendMatch;
    if (!match) {
      const users: Registration[] = (() => {
        try {
          return JSON.parse(localStorage.getItem("alangh_users") || "[]");
        } catch {
          return [];
        }
      })();
      match =
        users.find(
          (u) => u.username && u.username.toLowerCase() === lowerUsername,
        ) || null;

      if (!match) {
        const raw = localStorage.getItem("alangh_registrations");
        const registrations: Registration[] = raw ? JSON.parse(raw) : [];
        match =
          registrations.find(
            (r) => r.username && r.username.toLowerCase() === lowerUsername,
          ) || null;
      }

      if (match) {
        if (!match.passwordHash) {
          setIsLoading(false);
          setLoginState("nopassword");
          return;
        }
        if (hash !== match.passwordHash) {
          logAudit({
            actor: lowerUsername,
            actorType: "user",
            action: "USER_LOGIN_FAILED",
            details: `Failed login attempt for username: ${lowerUsername} (wrong password)`,
          });
          setIsLoading(false);
          setLoginState("wrongpassword");
          return;
        }
      }
    }

    if (!match) {
      logAudit({
        actor: lowerUsername,
        actorType: "user",
        action: "USER_LOGIN_FAILED",
        details: `Failed login attempt for username: ${lowerUsername}`,
      });
      setIsLoading(false);
      setLoginState("notfound");
      return;
    }

    // Check disabled
    if ((match as Registration & { disabled?: boolean }).disabled) {
      setIsLoading(false);
      setLoginState("notfound");
      return;
    }

    // Success
    setUser(match);
    setLoginState("found");

    const currentUser = {
      id: match.id || `user_${Date.now()}`,
      name: match.name,
      username: match.username,
      email: match.email,
      enrolledCourse: match.enrolledCourse,
    };
    localStorage.setItem("alangh_current_user", JSON.stringify(currentUser));
    // Also sync to localStorage users list for session use
    const existingUsers: Registration[] = (() => {
      try {
        return JSON.parse(localStorage.getItem("alangh_users") || "[]");
      } catch {
        return [];
      }
    })();
    const ui = existingUsers.findIndex(
      (u) => (u.username || "").toLowerCase() === lowerUsername,
    );
    if (ui >= 0) {
      existingUsers[ui] = { ...existingUsers[ui], ...match };
    } else {
      existingUsers.push(match);
    }
    localStorage.setItem("alangh_users", JSON.stringify(existingUsers));

    sessionStorage.setItem("alangh_current_email", match.email);
    window.dispatchEvent(new CustomEvent("alanghUserChanged"));
    logAudit({
      actor: match.username || match.name,
      actorType: "user",
      action: "USER_LOGIN",
      details: `User logged in: ${match.username || match.name}`,
      resource: match.username || match.name,
    });

    setIsLoading(false);
    setTimeout(() => {
      navigate({ to: "/profile" });
    }, 1500);
  }

  function handleReset() {
    setLoginState("form");
    setUsername("");
    setPassword("");
    setErrors({});
    setUser(null);
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center py-16">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-md">
        <AnimatePresence mode="wait">
          {/* LOGIN FORM */}
          {(loginState === "form" ||
            loginState === "notfound" ||
            loginState === "wrongpassword" ||
            loginState === "nopassword") && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-5">
                  <Shield
                    className="w-8 h-8 text-primary"
                    style={{ animation: "float 4s ease-in-out infinite" }}
                  />
                </div>
                <h1 className="font-display text-3xl font-bold mb-2">
                  Welcome <span className="text-primary glow-text">Back</span>
                </h1>
                <p className="text-muted-foreground">
                  Log in to your Alangh Academy account
                </p>
              </div>

              <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-foreground/80">
                    Sign In
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    data-ocid="login.form"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="login-username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-username"
                          type="text"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setErrors((p) => ({ ...p, username: undefined }));
                            setLoginState("form");
                          }}
                          placeholder="Enter your username"
                          className={`pl-9 border-border/60 bg-secondary/30 ${errors.username ? "border-destructive" : ""}`}
                          data-ocid="login.username.input"
                        />
                      </div>
                      {errors.username && (
                        <p className="text-xs text-destructive">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((p) => ({ ...p, password: undefined }));
                            setLoginState("form");
                          }}
                          placeholder="Enter your password"
                          className={`pl-9 pr-10 border-border/60 bg-secondary/30 ${errors.password ? "border-destructive" : ""}`}
                          data-ocid="login.password.input"
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
                      <div className="text-right">
                        <Link
                          to="/forgot-password"
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </div>

                    {/* Error states */}
                    {loginState === "notfound" && (
                      <div
                        className="rounded-lg bg-destructive/10 border border-destructive/30 p-3"
                        data-ocid="login.error_state"
                      >
                        <p className="text-sm text-destructive">
                          No account found with that username. Please register
                          to get started.
                        </p>
                        <Link
                          to="/register"
                          className="text-xs text-primary hover:underline mt-1 block"
                        >
                          Create an account →
                        </Link>
                      </div>
                    )}
                    {loginState === "wrongpassword" && (
                      <div
                        className="rounded-lg bg-destructive/10 border border-destructive/30 p-3"
                        data-ocid="login.error_state"
                      >
                        <p className="text-sm text-destructive">
                          Incorrect password. Please try again.
                        </p>
                      </div>
                    )}
                    {loginState === "nopassword" && (
                      <div
                        className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3"
                        data-ocid="login.error_state"
                      >
                        <p className="text-sm text-amber-400">
                          Your account was registered before password
                          authentication was added. Please re-register to set a
                          password.
                        </p>
                        <Link
                          to="/register"
                          className="text-xs text-primary hover:underline mt-1 block"
                        >
                          Re-register →
                        </Link>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      data-ocid="login.submit_button"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-primary hover:underline"
                      >
                        Register here
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* SUCCESS */}
          {loginState === "found" && user && (
            <motion.div
              key="login-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
                <CardContent className="pt-10 pb-8 px-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                    <Shield className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">
                    Welcome back, {user.name.split(" ")[0]}!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Login successful. Taking you to your profile...
                  </p>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg bg-secondary/40 p-3">
                      <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Course Access
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/40 p-3">
                      <ClipboardList className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Assessment History
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/40 p-3">
                      <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Progress Tracking
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Badge
                      variant="outline"
                      className={`${
                        user.enrolledCourse
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "border-border/40 text-muted-foreground"
                      }`}
                    >
                      {user.enrolledCourse
                        ? `Enrolled: ${user.enrolledCourse}`
                        : "No course enrolled yet"}
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to login
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
