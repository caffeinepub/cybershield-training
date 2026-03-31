import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type AuditLogEntry,
  clearAuditLogs,
  getAuditLogs,
} from "@/lib/auditLog";
import { Download, Search, Shield, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminLayout } from "./AdminLayout";

type DateRange = "24h" | "7d" | "30d" | "all";
type ActorFilter = "all" | "user" | "admin" | "system";
type CategoryFilter =
  | "all"
  | "auth"
  | "user_mgmt"
  | "content"
  | "assessment"
  | "certificates";

function categorize(action: string): CategoryFilter {
  if (
    action.includes("LOGIN") ||
    action.includes("LOGOUT") ||
    action.includes("PASSWORD") ||
    action.includes("REGISTER")
  )
    return "auth";
  if (
    action.includes("USER_STATUS") ||
    action.includes("USER_DELETED") ||
    action.includes("COURSE_ASSIGNED")
  )
    return "user_mgmt";
  if (action.includes("CONTENT")) return "content";
  if (action.includes("ASSESSMENT") || action.includes("CHAPTER"))
    return "assessment";
  if (action.includes("CERTIFICATE")) return "certificates";
  return "auth";
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} ${d.toLocaleTimeString("en-US", { hour12: false })}`;
  } catch {
    return iso;
  }
}

function rowTint(action: string): string {
  if (action.includes("FAILED") || action.includes("DELETED"))
    return "bg-red-500/5 hover:bg-red-500/10";
  if (action.includes("STATUS_CHANGED") || action.includes("REVOKED"))
    return "bg-amber-500/5 hover:bg-amber-500/10";
  if (action.includes("LOGIN") || action.includes("REGISTER"))
    return "bg-emerald-500/5 hover:bg-emerald-500/10";
  if (action.includes("CONTENT") || action.includes("CERTIFICATE_ISSUED"))
    return "bg-blue-500/5 hover:bg-blue-500/10";
  return "hover:bg-secondary/40";
}

function actorBadgeClass(type: AuditLogEntry["actorType"]): string {
  if (type === "user") return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  if (type === "admin")
    return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
}

function exportCsv(logs: AuditLogEntry[]) {
  const header = [
    "Timestamp",
    "Actor",
    "Type",
    "Action",
    "Details",
    "Resource",
  ].join(",");
  const rows = logs.map((l) =>
    [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorType}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, "'")}"`,
      `"${l.resource || ""}"`,
    ].join(","),
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminAuditLogs() {
  const [rawLogs, setRawLogs] = useState<AuditLogEntry[]>(() =>
    getAuditLogs().reverse(),
  );
  const [search, setSearch] = useState("");
  const [actorFilter, setActorFilter] = useState<ActorFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [showClearDialog, setShowClearDialog] = useState(false);

  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoffs: Record<DateRange, number> = {
      "24h": now - 86400000,
      "7d": now - 7 * 86400000,
      "30d": now - 30 * 86400000,
      all: 0,
    };
    const cutoff = cutoffs[dateRange];
    return rawLogs.filter((l) => {
      if (cutoff > 0 && new Date(l.timestamp).getTime() < cutoff) return false;
      if (actorFilter !== "all" && l.actorType !== actorFilter) return false;
      if (categoryFilter !== "all" && categorize(l.action) !== categoryFilter)
        return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          l.actor.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          (l.resource || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rawLogs, search, actorFilter, categoryFilter, dateRange]);

  function handleClearAll() {
    clearAuditLogs();
    setRawLogs([]);
    setShowClearDialog(false);
  }

  return (
    <AdminLayout activePage="audit-logs">
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Audit Logs
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
              {rawLogs.length !== filtered.length
                ? ` (filtered from ${rawLogs.length} total)`
                : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-border/60 gap-2"
              onClick={() => exportCsv(filtered)}
              data-ocid="audit_logs.export_button"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 gap-2"
              onClick={() => setShowClearDialog(true)}
              data-ocid="audit_logs.clear.open_modal_button"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search actor, action, details, resource…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-border/60 bg-secondary/30"
              data-ocid="audit_logs.search_input"
            />
          </div>
          <Select
            value={actorFilter}
            onValueChange={(v) => setActorFilter(v as ActorFilter)}
          >
            <SelectTrigger
              className="w-40 border-border/60 bg-secondary/30"
              data-ocid="audit_logs.actor_filter.select"
            >
              <SelectValue placeholder="Actor type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}
          >
            <SelectTrigger
              className="w-44 border-border/60 bg-secondary/30"
              data-ocid="audit_logs.category_filter.select"
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="user_mgmt">User Management</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="certificates">Certificates</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={dateRange}
            onValueChange={(v) => setDateRange(v as DateRange)}
          >
            <SelectTrigger
              className="w-36 border-border/60 bg-secondary/30"
              data-ocid="audit_logs.date_filter.select"
            >
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="audit_logs.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary/60" />
            </div>
            <p className="text-muted-foreground font-medium">
              No audit log entries found
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {rawLogs.length === 0
                ? "Logs will appear here as users and admins perform actions."
                : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <Table data-ocid="audit_logs.table">
              <TableHeader>
                <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-44">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-32">
                    Actor
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-52">
                    Action
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Details
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-40">
                    Resource
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log, i) => (
                  <TableRow
                    key={log.id}
                    className={`transition-colors ${rowTint(log.action)}`}
                    data-ocid={`audit_logs.item.${i + 1}`}
                  >
                    <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {log.actor}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${actorBadgeClass(log.actorType)}`}
                      >
                        {log.actorType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded font-mono">
                        {log.action}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-foreground/80">
                      {log.details}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[160px]">
                      {log.resource || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent data-ocid="audit_logs.clear.dialog">
          <DialogHeader>
            <DialogTitle>Clear All Audit Logs?</DialogTitle>
            <DialogDescription>
              This will permanently delete all {rawLogs.length} log entries.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              data-ocid="audit_logs.clear.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              data-ocid="audit_logs.clear.confirm_button"
            >
              Yes, Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
