import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);

  const footerLinks = [
    { to: "/about", label: "About Us" },
    { to: "/terms", label: "Terms of Use" },
    { to: "/refund-policy", label: "Refund Policy" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/disclaimer", label: "Disclaimer" },
    { to: "/code-of-conduct", label: "Code of Conduct" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <footer className="border-t border-border/60 bg-background/80 mt-auto">
      <div className="container mx-auto px-4 py-10">
        {/* Logo & tagline */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <img
            src="/assets/Alangh_Logo.png"
            alt="Alangh Academy"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Footer links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              data-ocid={`footer.${link.to.replace(/\/|-/g, "")}.link`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground text-center">
          &copy; {year} Alangh Academy. Built with{" "}
          <Heart className="w-3 h-3 inline text-primary" /> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
