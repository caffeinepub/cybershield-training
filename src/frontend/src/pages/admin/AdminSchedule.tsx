import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calendar, Edit2, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AdminLayout } from "./AdminLayout";

interface Session {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  mode: string;
  maxParticipants: string;
  description: string;
}

const emptyForm: Omit<Session, "id"> = {
  title: "",
  course: "Beginner",
  date: "",
  time: "",
  mode: "Online",
  maxParticipants: "",
  description: "",
};

function getSessions(): Session[] {
  try {
    return JSON.parse(localStorage.getItem("alangh_sessions") || "[]");
  } catch {
    return [];
  }
}

function saveSessions(sessions: Session[]) {
  localStorage.setItem("alangh_sessions", JSON.stringify(sessions));
}

const modeColors: Record<string, string> = {
  Online: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Hybrid: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Onsite: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function AdminSchedule() {
  const [sessions, setSessions] = useState<Session[]>(getSessions);
  const [addOpen, setAddOpen] = useState(false);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [form, setForm] = useState<Omit<Session, "id">>(emptyForm);

  const handleAdd = () => {
    const newSession: Session = { id: Date.now().toString(), ...form };
    const updated = [...getSessions(), newSession];
    saveSessions(updated);
    setSessions(updated);
    setForm(emptyForm);
    setAddOpen(false);
  };

  const handleEdit = () => {
    if (!editSession) return;
    const updated = getSessions().map((s) =>
      s.id === editSession.id ? { ...s, ...form } : s,
    );
    saveSessions(updated);
    setSessions(updated);
    setEditSession(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    const updated = getSessions().filter((s) => s.id !== id);
    saveSessions(updated);
    setSessions(updated);
  };

  const openEdit = (session: Session) => {
    setEditSession(session);
    const { id: _id, ...rest } = session;
    setForm(rest);
  };

  const F = ({
    label,
    children,
  }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );

  const SessionForm = (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <F label="Session Title">
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="border-border/60 bg-secondary/30"
            placeholder="e.g. Network Security Lab - Batch 3"
          />
        </F>
      </div>
      <F label="Course">
        <Select
          value={form.course}
          onValueChange={(v) => setForm((f) => ({ ...f, course: v }))}
        >
          <SelectTrigger className="border-border/60 bg-secondary/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner (HackStart™)</SelectItem>
            <SelectItem value="Intermediate">
              Intermediate (CyberElevate™)
            </SelectItem>
            <SelectItem value="Corporate">Corporate Training</SelectItem>
          </SelectContent>
        </Select>
      </F>
      <F label="Mode">
        <Select
          value={form.mode}
          onValueChange={(v) => setForm((f) => ({ ...f, mode: v }))}
        >
          <SelectTrigger className="border-border/60 bg-secondary/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="Onsite">Onsite</SelectItem>
          </SelectContent>
        </Select>
      </F>
      <F label="Date">
        <Input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="border-border/60 bg-secondary/30"
        />
      </F>
      <F label="Time">
        <Input
          type="time"
          value={form.time}
          onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          className="border-border/60 bg-secondary/30"
        />
      </F>
      <div className="col-span-2">
        <F label="Max Participants">
          <Input
            type="number"
            value={form.maxParticipants}
            onChange={(e) =>
              setForm((f) => ({ ...f, maxParticipants: e.target.value }))
            }
            className="border-border/60 bg-secondary/30"
            placeholder="e.g. 30"
          />
        </F>
      </div>
      <div className="col-span-2">
        <F label="Description">
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
            className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Optional session notes or agenda..."
          />
        </F>
      </div>
    </div>
  );

  return (
    <AdminLayout activePage="schedule">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Training <span className="text-primary">Schedule</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and schedule training sessions.
            </p>
          </div>

          {/* Add Session Dialog */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="admin.schedule.open_modal_button"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Session
              </Button>
            </DialogTrigger>
            <DialogContent
              className="border-border/60 bg-card max-w-lg"
              data-ocid="admin.schedule.dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display">
                  Schedule New Session
                </DialogTitle>
              </DialogHeader>
              {SessionForm}
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAddOpen(false);
                    setForm(emptyForm);
                  }}
                  data-ocid="admin.schedule.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!form.title.trim() || !form.date}
                  className="bg-primary text-primary-foreground"
                  data-ocid="admin.schedule.submit_button"
                >
                  Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {sessions.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed border-border/60 rounded-xl"
            data-ocid="admin.schedule.empty_state"
          >
            <Calendar className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">No sessions scheduled</p>
            <p className="text-sm mt-1">
              Click "Add Session" to schedule a training.
            </p>
          </div>
        ) : (
          <div
            className="border border-border/60 rounded-lg overflow-hidden"
            data-ocid="admin.schedule.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 border-border/60">
                  <TableHead>Session</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Max</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session, i) => (
                  <TableRow
                    key={session.id}
                    className="border-border/40 hover:bg-secondary/20"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{session.title}</p>
                        {session.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
                            {session.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs border-border/40"
                      >
                        {session.course}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <p>
                          {session.date
                            ? new Date(session.date).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </p>
                        {session.time && (
                          <p className="text-xs text-muted-foreground">
                            {session.time}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          modeColors[session.mode] || "border-border/40"
                        }`}
                      >
                        {session.mode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {session.maxParticipants || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit dialog */}
                        <Dialog
                          open={editSession?.id === session.id}
                          onOpenChange={(o) => {
                            if (!o) {
                              setEditSession(null);
                              setForm(emptyForm);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:text-primary"
                              onClick={() => openEdit(session)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-border/60 bg-card max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="font-display">
                                Edit Session
                              </DialogTitle>
                            </DialogHeader>
                            {SessionForm}
                            <DialogFooter>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setEditSession(null);
                                  setForm(emptyForm);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleEdit}
                                disabled={!form.title.trim()}
                                className="bg-primary text-primary-foreground"
                              >
                                Save
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:text-destructive"
                          onClick={() => handleDelete(session.id)}
                          data-ocid={`admin.session.delete.button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
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
