import type {
  AuditLog as BackendAuditLog,
  backendInterface,
} from "@/backend.d.ts";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorType: "user" | "admin" | "system";
  action: string;
  details: string;
  resource?: string;
  ipHint?: string;
}

const STORAGE_KEY = "alangh_audit_logs";
const MAX_ENTRIES = 5000;

let _backendActor: backendInterface | null = null;

export function setAuditBackendActor(actor: backendInterface | null) {
  _backendActor = actor;
}

export function logAudit(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
  try {
    const logs = getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ipHint: "client",
    };
    logs.push(newEntry);
    // Keep only the most recent MAX_ENTRIES
    const trimmed =
      logs.length > MAX_ENTRIES ? logs.slice(logs.length - MAX_ENTRIES) : logs;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    // Fire-and-forget push to backend
    if (_backendActor) {
      const backendLog: BackendAuditLog = {
        id: newEntry.id,
        timestamp: BigInt(Date.now()),
        actorId: entry.actor,
        actorType: entry.actorType,
        action: entry.action,
        details: entry.details,
        resource: entry.resource || "",
      };
      _backendActor.addAuditLog(backendLog).catch(() => {});
    }
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function getAuditLogs(): AuditLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearAuditLogs(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentActor(): {
  name: string;
  type: "user" | "admin" | "system";
} {
  try {
    const raw = localStorage.getItem("alangh_current_user");
    if (raw) {
      const user = JSON.parse(raw);
      return { name: user.username || user.name || "unknown", type: "user" };
    }
  } catch {
    // ignore
  }
  return { name: "system", type: "system" };
}
