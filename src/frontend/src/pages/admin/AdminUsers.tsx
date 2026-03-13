import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AdminLayout } from "./AdminLayout";

interface Registration {
  name: string;
  email: string;
  phone?: string;
  address?: string;
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

function courseColor(course?: string) {
  if (!course) return "border-border/40 text-muted-foreground";
  if (course.toLowerCase().includes("beginner"))
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (course.toLowerCase().includes("intermediate"))
    return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
}

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const registrations = getRegistrations();

  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout activePage="users">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">
            User <span className="text-primary">Management</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {registrations.length} registered user
            {registrations.length !== 1 ? "s" : ""} &bull;{" "}
            {registrations.filter((r) => r.enrolledCourse).length} enrolled
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-border/60 bg-secondary/30"
            data-ocid="admin.users.search.input"
          />
        </div>

        {registrations.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            data-ocid="admin.users.empty_state"
          >
            <Users className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">No registered users yet</p>
            <p className="text-sm mt-1">
              Users who complete registration will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No users match your search.</p>
          </div>
        ) : (
          <div
            className="border border-border/60 rounded-lg overflow-hidden"
            data-ocid="admin.users.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 border-border/60">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Enrolled Course</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((reg) => (
                  <TableRow
                    key={reg.email}
                    className="border-border/40 hover:bg-secondary/20"
                  >
                    <TableCell className="font-medium">{reg.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {reg.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {reg.phone || "\u2014"}
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
                    <TableCell className="text-muted-foreground text-sm">
                      {reg.registeredAt
                        ? new Date(reg.registeredAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "\u2014"}
                    </TableCell>
                    <TableCell>
                      {reg.score !== undefined ? (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            reg.score >= 16
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {reg.score}/20
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground border-border/40"
                        >
                          Not taken
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          reg.enrolledCourse
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {reg.enrolledCourse ? "Enrolled" : "Registered"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
