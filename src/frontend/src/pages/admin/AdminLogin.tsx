import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logAudit } from "@/lib/auditLog";
import { Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "alangh@2024") {
        localStorage.setItem("adminLoggedIn", "true");
        logAudit({
          actor: "admin",
          actorType: "admin",
          action: "ADMIN_LOGIN",
          details: "Admin logged in",
        });
        window.location.href = "/admin/dashboard";
      } else {
        setError("Invalid username or password. Please try again.");
        logAudit({
          actor: username || "unknown",
          actorType: "admin",
          action: "ADMIN_LOGIN_FAILED",
          details: "Failed admin login attempt",
        });
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.6 0.15 200) 1px, transparent 1px), linear-gradient(90deg, oklch(0.6 0.15 200) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Alangh Academy
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Admin Portal — Restricted Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="border-border/60 bg-secondary/30 h-11"
                data-ocid="admin.login.input"
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="border-border/60 bg-secondary/30 h-11"
                data-ocid="admin.login.password.input"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm"
                data-ocid="admin.login.error_state"
              >
                <span>⚠</span>
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              data-ocid="admin.login.submit_button"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Authorized personnel only. All access is logged.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
