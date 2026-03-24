import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BookOpen, LogIn, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { useIsAdmin } from "../hooks/useQueries";

export function Navbar() {
  const { data: isAdmin } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    {
      to: "/courses",
      label: "Courses",
      icon: BookOpen,
      ocid: "nav.courses.link",
    },
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
          <img
            src="/assets/Alangh_Logo.png"
            alt="Alangh Academy"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
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

        {/* Auth Button */}
        <div className="flex items-center gap-2">
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
