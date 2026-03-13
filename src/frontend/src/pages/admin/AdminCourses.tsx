import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BookOpen, Edit2, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AdminLayout } from "./AdminLayout";

const COURSES = [
  {
    id: "beginner",
    title: "Alangh Cybersecurity Foundation (HackStart™)",
    level: "Beginner",
    chapters: 10,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "intermediate",
    title: "Alangh Professional Cybersecurity Track (CyberElevate™)",
    level: "Intermediate",
    chapters: 13,
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
];

interface Announcement {
  id: string;
  courseId: string;
  text: string;
  createdAt: string;
}

function getAnnouncements(): Announcement[] {
  try {
    return JSON.parse(
      localStorage.getItem("alangh_course_announcements") || "[]",
    );
  } catch {
    return [];
  }
}

function saveAnnouncements(items: Announcement[]) {
  localStorage.setItem("alangh_course_announcements", JSON.stringify(items));
}

function CourseCard({
  course,
  index,
}: {
  course: (typeof COURSES)[0];
  index: number;
}) {
  const [announcements, setAnnouncements] = useState(() =>
    getAnnouncements().filter((a) => a.courseId === course.id),
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [text, setText] = useState("");

  const refresh = () => {
    setAnnouncements(
      getAnnouncements().filter((a) => a.courseId === course.id),
    );
  };

  const handleAdd = () => {
    const all = getAnnouncements();
    const newItem: Announcement = {
      id: Date.now().toString(),
      courseId: course.id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    saveAnnouncements([...all, newItem]);
    setText("");
    setAddOpen(false);
    refresh();
  };

  const handleEdit = () => {
    if (!editItem) return;
    const all = getAnnouncements().map((a) =>
      a.id === editItem.id ? { ...a, text: text.trim() } : a,
    );
    saveAnnouncements(all);
    setEditItem(null);
    setText("");
    refresh();
  };

  const handleDelete = (id: string) => {
    saveAnnouncements(getAnnouncements().filter((a) => a.id !== id));
    refresh();
  };

  return (
    <Card
      className="border-border/60 bg-card/80"
      data-ocid={`admin.courses.item.${index + 1}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display text-base leading-snug">
                {course.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className={`text-xs ${course.color}`}>
                  {course.level}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {course.chapters} chapters
                </span>
              </div>
            </div>
          </div>

          {/* Add Announcement */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-border/60 hover:border-primary/40 shrink-0"
                data-ocid="admin.announcement.open_modal_button"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Announcement
              </Button>
            </DialogTrigger>
            <DialogContent
              className="border-border/60 bg-card"
              data-ocid="admin.announcement.dialog"
            >
              <DialogHeader>
                <DialogTitle className="font-display">
                  Add Announcement
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Announcement Text</Label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Enter announcement for students..."
                  data-ocid="admin.announcement.textarea"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAddOpen(false);
                    setText("");
                  }}
                  data-ocid="admin.announcement.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!text.trim()}
                  className="bg-primary text-primary-foreground"
                  data-ocid="admin.announcement.submit_button"
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {announcements.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            No announcements for this course.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Announcements
            </p>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/40 group"
              >
                <p className="text-sm flex-1">{ann.text}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {/* Edit */}
                  <Dialog
                    open={editItem?.id === ann.id}
                    onOpenChange={(o) => {
                      if (!o) {
                        setEditItem(null);
                        setText("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:text-primary"
                        onClick={() => {
                          setEditItem(ann);
                          setText(ann.text);
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-border/60 bg-card">
                      <DialogHeader>
                        <DialogTitle className="font-display">
                          Edit Announcement
                        </DialogTitle>
                      </DialogHeader>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditItem(null);
                            setText("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleEdit}
                          disabled={!text.trim()}
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
                    className="h-6 w-6 p-0 hover:text-destructive"
                    onClick={() => handleDelete(ann.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminCourses() {
  return (
    <AdminLayout activePage="courses">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">
            Course <span className="text-primary">Management</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage courses and post announcements for students.
          </p>
        </div>

        <div className="space-y-5" data-ocid="admin.courses.list">
          {COURSES.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
