import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, Settings, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsAdmin } from "../hooks/useQueries";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export function Navbar() {
  const { data: isAdmin } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("alangh_current_user");
        setCurrentUser(raw ? JSON.parse(raw) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    read();
    window.addEventListener("storage", read);
    window.addEventListener("alanghUserChanged", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("alanghUserChanged", read);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("alangh_current_user");
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent("alanghUserChanged"));
    setMobileOpen(false);
    window.location.href = "/";
  };

  const navLinks = [
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
    <header
      className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl"
      style={{ backgroundColor: "oklch(0.22 0.08 240 / 0.97)" }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo only — no text */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.home.link"
        >
          <img
            src="/assets/Alangh_Logo.png"
            alt="Alangh Academy"
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
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

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <Link to="/profile" data-ocid="nav.profile.link">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {currentUser.name.split(" ")[0]}
                  </span>
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5"
                data-ocid="nav.logout.button"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                data-ocid="nav.login.button"
                className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Login
              </Button>
            </Link>
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
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded text-sm text-primary hover:bg-primary/10 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {currentUser.name.split(" ")[0]}'s Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                  data-ocid="nav.mobile.logout.button"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
