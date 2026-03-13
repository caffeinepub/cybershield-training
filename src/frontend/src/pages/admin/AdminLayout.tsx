import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: "dashboard" | "users" | "courses" | "schedule";
}

export function AdminLayout({ children, activePage }: AdminLayoutProps) {
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (!loggedIn) {
      window.location.href = "/admin/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "/admin/login";
  };

  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      ocid: "admin.sidebar.dashboard.link",
    },
    {
      key: "users",
      label: "Users",
      icon: Users,
      href: "/admin/users",
      ocid: "admin.sidebar.users.link",
    },
    {
      key: "courses",
      label: "Courses",
      icon: BookOpen,
      href: "/admin/courses",
      ocid: "admin.sidebar.courses.link",
    },
    {
      key: "schedule",
      label: "Schedule",
      icon: Calendar,
      href: "/admin/schedule",
      ocid: "admin.sidebar.schedule.link",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-card border-r border-border/60 flex flex-col fixed left-0 top-0 bottom-0 z-40">
        {/* Brand */}
        <div className="p-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-sm leading-tight">
                Alangh Academy
              </p>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ key, label, icon: Icon, href, ocid }) => {
            const isActive = activePage === key;
            return (
              <a
                key={key}
                href={href}
                data-ocid={ocid}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border/60">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full transition-all"
            data-ocid="admin.sidebar.logout.button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">{children}</main>
    </div>
  );
}
