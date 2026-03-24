import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Calendar, ChevronRight, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";

interface Registration {
  name: string;
  email: string;
  phone?: string;
  registeredAt?: string;
  score?: number;
  enrolledCourse?: string;
}

function getRegistrations(): Registration[] {
  try {
    return JSON.parse(localStorage.getItem("alangh_registrations") || "[]");
  } catch {
    return [];
  }
}

function getSessions(): unknown[] {
  try {
    return JSON.parse(localStorage.getItem("alangh_sessions") || "[]");
  } catch {
    return [];
  }
}

function courseColor(course?: string) {
  if (!course) return "border-border/40 text-muted-foreground";
  if (course.toLowerCase().includes("beginner"))
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (course.toLowerCase().includes("intermediate"))
    return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
}

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [sessions, setSessions] = useState<unknown[]>([]);

  useEffect(() => {
    setRegistrations(getRegistrations());
    setSessions(getSessions());
  }, []);

  const recent = registrations.slice(-5).reverse();
  const enrolledCount = registrations.filter((r) => r.enrolledCourse).length;

  const stats = [
    {
      label: "Registered Users",
      value: registrations.length,
      icon: Users,
      ocid: "admin.dashboard.users.card",
      href: "/admin/users",
      color: "text-blue-400",
    },
    {
      label: "Course Enrollments",
      value: enrolledCount,
      icon: BookOpen,
      ocid: "admin.dashboard.courses.card",
      href: "/admin/users",
      color: "text-emerald-400",
    },
    {
      label: "Upcoming Sessions",
      value: sessions.length,
      icon: Calendar,
      ocid: "admin.dashboard.sessions.card",
      href: "/admin/schedule",
      color: "text-amber-400",
    },
  ];

  return (
    <AdminLayout activePage="dashboard">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of Alangh Academy platform activity.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {stats.map(({ label, value, icon: Icon, ocid, href, color }) => (
            <a key={label} href={href}>
              <Card
                className="border-border/60 bg-card/80 hover:border-primary/40 transition-all cursor-pointer group"
                data-ocid={ocid}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">{label}</p>
                      <p className="text-4xl font-bold mt-1">{value}</p>
                    </div>
                    <div
                      className={`${color} opacity-70 group-hover:opacity-100 transition-opacity`}
                    >
                      <Icon className="w-10 h-10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* Recent registrations */}
        <Card className="border-border/60 bg-card/80 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg">
                Recent Registrations
              </CardTitle>
              <a
                href="/admin/users"
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </CardHeader>
          <CardContent data-ocid="admin.dashboard.registrations.table">
            {recent.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No registrations yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40">
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Email</TableHead>
                    <TableHead className="text-xs">Enrolled Course</TableHead>
                    <TableHead className="text-xs">Registered</TableHead>
                    <TableHead className="text-xs">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((reg) => (
                    <TableRow key={reg.email} className="border-border/40">
                      <TableCell className="text-sm font-medium">
                        {reg.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {reg.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${courseColor(reg.enrolledCourse)}`}
                        >
                          {reg.enrolledCourse
                            ? reg.enrolledCourse.split("\u2014")[0].trim()
                            : "Not enrolled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {reg.registeredAt
                          ? new Date(reg.registeredAt).toLocaleDateString()
                          : "\u2014"}
                      </TableCell>
                      <TableCell>
                        {reg.score !== undefined ? (
                          <Badge
                            className={`text-xs ${
                              reg.score >= 16
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}
                            variant="outline"
                          >
                            {reg.score}/20
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs border-border/40 text-muted-foreground"
                          >
                            Not taken
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Manage Users", href: "/admin/users", icon: Users },
            { label: "Manage Courses", href: "/admin/courses", icon: BookOpen },
            {
              label: "Schedule Sessions",
              href: "/admin/schedule",
              icon: Calendar,
            },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/40 transition-all group"
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                {label}
              </span>
              <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </a>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
