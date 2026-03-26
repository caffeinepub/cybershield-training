import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Eye, RefreshCw, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminLayout";

interface Registration {
  id?: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  address?: string;
  profile?: string;
  reason?: string;
  registeredAt?: string;
  score?: number;
  enrolledCourse?: string;
  passwordHash?: string;
  disabled?: boolean;
}

function getRegistrations(): Registration[] {
  // Merge alangh_users and alangh_registrations, preferring alangh_users data
  try {
    const users: Registration[] = JSON.parse(
      localStorage.getItem("alangh_users") || "[]",
    );
    const regs: Registration[] = JSON.parse(
      localStorage.getItem("alangh_registrations") || "[]",
    );
    // Start with users list
    const merged = [...users];
    // Add regs not already in users (by email)
    const emails = new Set(users.map((u) => u.email.toLowerCase()));
    for (const r of regs) {
      if (!emails.has(r.email.toLowerCase())) {
        merged.push(r);
      }
    }
    // Merge score from regs into users
    return merged.map((u) => {
      const regMatch = regs.find(
        (r) => r.email.toLowerCase() === u.email.toLowerCase(),
      );
      return { ...u, score: u.score ?? regMatch?.score };
    });
  } catch {
    return [];
  }
}

function saveUserUpdate(updated: Registration) {
  // Update in both stores
  const users: Registration[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("alangh_users") || "[]");
    } catch {
      return [];
    }
  })();
  const ui = users.findIndex(
    (u) => u.email.toLowerCase() === updated.email.toLowerCase(),
  );
  if (ui >= 0) {
    users[ui] = { ...users[ui], ...updated };
    localStorage.setItem("alangh_users", JSON.stringify(users));
  }

  const regs: Registration[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("alangh_registrations") || "[]");
    } catch {
      return [];
    }
  })();
  const ri = regs.findIndex(
    (r) => r.email.toLowerCase() === updated.email.toLowerCase(),
  );
  if (ri >= 0) {
    regs[ri] = { ...regs[ri], ...updated };
    localStorage.setItem("alangh_registrations", JSON.stringify(regs));
  }
}

function deleteUser(email: string) {
  const users: Registration[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("alangh_users") || "[]");
    } catch {
      return [];
    }
  })();
  localStorage.setItem(
    "alangh_users",
    JSON.stringify(
      users.filter((u) => u.email.toLowerCase() !== email.toLowerCase()),
    ),
  );

  const regs: Registration[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("alangh_registrations") || "[]");
    } catch {
      return [];
    }
  })();
  localStorage.setItem(
    "alangh_registrations",
    JSON.stringify(
      regs.filter((r) => r.email.toLowerCase() !== email.toLowerCase()),
    ),
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground whitespace-pre-wrap">
        {value?.trim() || (
          <span className="text-muted-foreground italic">Not provided</span>
        )}
      </p>
    </div>
  );
}

function escapeCsvField(value: string | undefined): string {
  const str = value ?? "";
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportToCsv(registrations: Registration[]) {
  const headers = [
    "Name",
    "Username",
    "Email",
    "Phone",
    "Address",
    "Profile / Work Experience",
    "Enrollment Reason",
    "Enrolled Course",
    "Assessment Score",
    "Assessment Result",
    "Registered On",
    "Status",
  ];
  const rows = registrations.map((r) => [
    escapeCsvField(r.name),
    escapeCsvField(r.username),
    escapeCsvField(r.email),
    escapeCsvField(r.phone),
    escapeCsvField(r.address),
    escapeCsvField(r.profile),
    escapeCsvField(r.reason),
    escapeCsvField(
      r.enrolledCourse ? r.enrolledCourse.split("\u2014")[0].trim() : "",
    ),
    r.score !== undefined ? `${String(r.score)}/20` : "Not taken",
    r.score !== undefined ? (r.score >= 16 ? "Pass" : "Fail") : "Not taken",
    r.registeredAt
      ? new Date(r.registeredAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "",
    r.disabled ? "Disabled" : "Active",
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `alangh-academy-users-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
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
  const [selected, setSelected] = useState<Registration | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [resetPw, setResetPw] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const refresh = () => setRegistrations(getRegistrations());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("alanghUserChanged", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("alanghUserChanged", refresh);
    };
  }, []);

  function refresh() {
    setRegistrations(getRegistrations());
  }

  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.username || "").toLowerCase().includes(search.toLowerCase()),
  );

  function handleResetPassword() {
    if (!selected || !resetPw.trim()) return;
    const updated = { ...selected, passwordHash: btoa(resetPw) };
    saveUserUpdate(updated);
    setSelected(updated);
    setResetPw("");
    setShowResetForm(false);
    toast.success(`Password reset for ${selected.name}`);
    refresh();
  }

  function handleToggleDisable() {
    if (!selected) return;
    const updated = { ...selected, disabled: !selected.disabled };
    saveUserUpdate(updated);
    setSelected(updated);
    toast.success(
      updated.disabled
        ? `${selected.name} has been disabled.`
        : `${selected.name} has been enabled.`,
    );
    refresh();
  }

  function handleDeleteUser() {
    if (!selected) return;
    deleteUser(selected.email);
    toast.success(`${selected.name}'s account has been deleted.`);
    setSelected(null);
    setShowDeleteConfirm(false);
    refresh();
  }

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

        {/* Search + Export */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-border/60 bg-secondary/30"
              data-ocid="admin.users.search.input"
            />
          </div>
          {registrations.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 gap-2"
              onClick={() => exportToCsv(registrations)}
              data-ocid="admin.users.export.button"
            >
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 gap-2"
            onClick={refresh}
            data-ocid="admin.users.refresh.button"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
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
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((reg, idx) => (
                  <TableRow
                    key={reg.email}
                    className="border-border/40 hover:bg-secondary/20"
                    data-ocid={`admin.users.row.${idx + 1}`}
                  >
                    <TableCell className="font-medium">{reg.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm font-mono">
                      {reg.username || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {reg.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {reg.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${courseColor(reg.enrolledCourse)}`}
                      >
                        {reg.enrolledCourse
                          ? reg.enrolledCourse.split("—")[0].trim()
                          : "Not enrolled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {reg.registeredAt
                        ? new Date(reg.registeredAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {reg.score !== undefined ? (
                        <Badge
                          variant="outline"
                          className={`text-xs ${reg.score >= 16 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}
                        >
                          {reg.score}/20 &mdash;{" "}
                          {reg.score >= 16 ? "Pass" : "Fail"}
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
                        className={`text-xs ${reg.disabled ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}
                      >
                        {reg.disabled ? "Disabled" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                        onClick={() => {
                          setSelected(reg);
                          setShowResetForm(false);
                          setShowDeleteConfirm(false);
                        }}
                        data-ocid={`admin.users.view.button.${idx + 1}`}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* User Detail Modal */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent
          className="max-w-lg border-border/60 bg-card"
          data-ocid="admin.users.detail.modal"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              User Details
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-5 mt-2 max-h-[70vh] overflow-y-auto pr-1">
              {/* Personal Info */}
              <div className="rounded-lg border border-border/60 bg-secondary/20 p-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Personal Information
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Full Name" value={selected.name} />
                  <DetailRow label="Username" value={selected.username} />
                  <DetailRow label="Email" value={selected.email} />
                  <DetailRow label="Phone" value={selected.phone} />
                  <DetailRow
                    label="Registered On"
                    value={
                      selected.registeredAt
                        ? new Date(selected.registeredAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "long", year: "numeric" },
                          )
                        : undefined
                    }
                  />
                </div>
                <DetailRow
                  label="Correspondence Address"
                  value={selected.address}
                />
              </div>

              {/* Background */}
              <div className="rounded-lg border border-border/60 bg-secondary/20 p-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Background & Motivation
                </p>
                <DetailRow
                  label="Profile / Work Experience"
                  value={selected.profile}
                />
                <DetailRow
                  label="Why they want to enroll"
                  value={selected.reason}
                />
              </div>

              {/* Enrollment & Assessment */}
              <div className="rounded-lg border border-border/60 bg-secondary/20 p-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Enrollment & Assessment
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Enrolled Course
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${courseColor(selected.enrolledCourse)}`}
                    >
                      {selected.enrolledCourse
                        ? selected.enrolledCourse.split("—")[0].trim()
                        : "Not enrolled"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Self-Assessment Score
                    </p>
                    {selected.score !== undefined ? (
                      <Badge
                        variant="outline"
                        className={`text-xs ${selected.score >= 16 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}
                      >
                        {selected.score}/20 &mdash;{" "}
                        {selected.score >= 16 ? "Pass" : "Fail"}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs text-muted-foreground border-border/40"
                      >
                        Not taken
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="rounded-lg border border-border/60 bg-secondary/20 p-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Admin Actions
                </p>

                {/* Reset Password */}
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border/60 text-muted-foreground hover:text-foreground w-full justify-start gap-2"
                    onClick={() => setShowResetForm((v) => !v)}
                    data-ocid="admin.users.reset_password.button"
                  >
                    🔑 Reset Password
                  </Button>
                  {showResetForm && (
                    <div className="mt-3 space-y-2 p-3 rounded-lg bg-secondary/40 border border-border/40">
                      <Label htmlFor="admin-reset-pw" className="text-xs">
                        New Password
                      </Label>
                      <Input
                        id="admin-reset-pw"
                        type="text"
                        value={resetPw}
                        onChange={(e) => setResetPw(e.target.value)}
                        placeholder="Enter new password for user"
                        className="border-border/60 bg-secondary/30 h-8 text-sm"
                        data-ocid="admin.users.reset_password.input"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleResetPassword}
                          className="flex-1"
                          data-ocid="admin.users.reset_password.confirm_button"
                        >
                          Confirm Reset
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowResetForm(false);
                            setResetPw("");
                          }}
                          className="border-border/60"
                          data-ocid="admin.users.reset_password.cancel_button"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Disable / Enable */}
                <Button
                  size="sm"
                  variant="outline"
                  className={`w-full justify-start gap-2 ${selected.disabled ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10" : "border-amber-500/40 text-amber-400 hover:bg-amber-500/10"}`}
                  onClick={handleToggleDisable}
                  data-ocid="admin.users.toggle_disable.button"
                >
                  {selected.disabled
                    ? "✅ Enable Account"
                    : "⛔ Disable Account"}
                </Button>

                {/* Delete */}
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => setShowDeleteConfirm(true)}
                    data-ocid="admin.users.delete.button"
                  >
                    🗑️ Delete Account
                  </Button>
                  {showDeleteConfirm && (
                    <div
                      className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 space-y-3"
                      data-ocid="admin.users.delete_confirm.dialog"
                    >
                      <p className="text-sm text-destructive font-medium">
                        Are you sure? This cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleDeleteUser}
                          className="flex-1"
                          data-ocid="admin.users.delete.confirm_button"
                        >
                          Yes, Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="border-border/60"
                          data-ocid="admin.users.delete.cancel_button"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  variant="outline"
                  onClick={() => setSelected(null)}
                  className="border-border/60"
                  data-ocid="admin.users.detail.close_button"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
