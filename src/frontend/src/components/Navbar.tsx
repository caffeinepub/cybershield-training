import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import {
  BookOpen,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export function Navbar() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!identity;

  const navLinks = [
    {
      to: "/courses",
      label: "Courses",
      icon: BookOpen,
      ocid: "nav.courses.link",
    },
    ...(isLoggedIn
      ? [
          {
            to: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            ocid: "nav.dashboard.link",
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            to: "/admin",
            label: "Admin",
            icon: Settings,
            ocid: "nav.admin.link",
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.home.link"
        >
          <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center glow-cyan group-hover:scale-110 transition-transform">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            <span className="text-primary glow-text">Cyber</span>
            <span className="text-foreground">Shield</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={link.ocid}
              className="flex items-center gap-1.5 px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              activeProps={{ className: "text-primary bg-primary/10" }}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Button */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              data-ocid="nav.logout.button"
              className="border-border/60 hover:border-destructive/60 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.login.button"
              className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              {isLoggingIn ? "Connecting..." : "Login"}
            </Button>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={link.ocid}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                activeProps={{ className: "text-primary bg-primary/10" }}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
