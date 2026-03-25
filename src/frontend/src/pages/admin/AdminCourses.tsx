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
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Edit2,
  FileText,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AdminLayout } from "./AdminLayout";

const COURSES = [
  {
    id: "beginner",
    title: "Alangh Cybersecurity Foundation (HackStart\u2122)",
    level: "Beginner",
    chapters: 10,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "intermediate",
    title: "Alangh Professional Cybersecurity Track (CyberElevate\u2122)",
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

interface Chapter {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
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

function getCourseContent(courseId: string): Chapter[] {
  try {
    const all: Array<{ courseId: string; chapters: Chapter[] }> = JSON.parse(
      localStorage.getItem("alangh_course_content") || "[]",
    );
    return all.find((c) => c.courseId === courseId)?.chapters ?? [];
  } catch {
    return [];
  }
}

function saveCourseContent(courseId: string, chapters: Chapter[]) {
  try {
    const all: Array<{ courseId: string; chapters: Chapter[] }> = JSON.parse(
      localStorage.getItem("alangh_course_content") || "[]",
    );
    const idx = all.findIndex((c) => c.courseId === courseId);
    if (idx >= 0) {
      all[idx] = { courseId, chapters };
    } else {
      all.push({ courseId, chapters });
    }
    localStorage.setItem("alangh_course_content", JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

function CourseCard({
  course,
  index,
}: {
  course: (typeof COURSES)[0];
  index: number;
}) {
  // Announcements state
  const [announcements, setAnnouncements] = useState(() =>
    getAnnouncements().filter((a) => a.courseId === course.id),
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [annText, setAnnText] = useState("");

  // Chapter content state
  const [chapters, setChapters] = useState<Chapter[]>(() =>
    getCourseContent(course.id),
  );
  const [showContent, setShowContent] = useState(false);
  const [addChapterOpen, setAddChapterOpen] = useState(false);
  const [editChapter, setEditChapter] = useState<Chapter | null>(null);
  const [chapterForm, setChapterForm] = useState({
    title: "",
    description: "",
    subtopicsRaw: "",
  });
  const [newSubtopic, setNewSubtopic] = useState("");
  const [subtopicsList, setSubtopicsList] = useState<string[]>([]);

  const refreshAnnouncements = () => {
    setAnnouncements(
      getAnnouncements().filter((a) => a.courseId === course.id),
    );
  };

  // Announcement handlers
  const handleAddAnn = () => {
    const all = getAnnouncements();
    const newItem: Announcement = {
      id: Date.now().toString(),
      courseId: course.id,
      text: annText.trim(),
      createdAt: new Date().toISOString(),
    };
    saveAnnouncements([...all, newItem]);
    setAnnText("");
    setAddOpen(false);
    refreshAnnouncements();
  };

  const handleEditAnn = () => {
    if (!editItem) return;
    const all = getAnnouncements().map((a) =>
      a.id === editItem.id ? { ...a, text: annText.trim() } : a,
    );
    saveAnnouncements(all);
    setEditItem(null);
    setAnnText("");
    refreshAnnouncements();
  };

  const handleDeleteAnn = (id: string) => {
    saveAnnouncements(getAnnouncements().filter((a) => a.id !== id));
    refreshAnnouncements();
  };

  // Chapter handlers
  const openAddChapter = () => {
    setChapterForm({ title: "", description: "", subtopicsRaw: "" });
    setSubtopicsList([]);
    setNewSubtopic("");
    setEditChapter(null);
    setAddChapterOpen(true);
  };

  const openEditChapter = (ch: Chapter) => {
    setChapterForm({
      title: ch.title,
      description: ch.description,
      subtopicsRaw: "",
    });
    setSubtopicsList([...ch.subtopics]);
    setNewSubtopic("");
    setEditChapter(ch);
    setAddChapterOpen(true);
  };

  const handleAddSubtopic = () => {
    if (!newSubtopic.trim()) return;
    setSubtopicsList((prev) => [...prev, newSubtopic.trim()]);
    setNewSubtopic("");
  };

  const handleRemoveSubtopic = (idx: number) => {
    setSubtopicsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveChapter = () => {
    if (!chapterForm.title.trim()) return;
    let updated: Chapter[];
    if (editChapter) {
      updated = chapters.map((ch) =>
        ch.id === editChapter.id
          ? {
              ...ch,
              title: chapterForm.title.trim(),
              description: chapterForm.description.trim(),
              subtopics: subtopicsList,
            }
          : ch,
      );
    } else {
      const newCh: Chapter = {
        id: `ch_${Date.now()}`,
        title: chapterForm.title.trim(),
        description: chapterForm.description.trim(),
        subtopics: subtopicsList,
      };
      updated = [...chapters, newCh];
    }
    setChapters(updated);
    saveCourseContent(course.id, updated);
    setAddChapterOpen(false);
  };

  const handleDeleteChapter = (chId: string) => {
    const updated = chapters.filter((ch) => ch.id !== chId);
    setChapters(updated);
    saveCourseContent(course.id, updated);
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
                <Textarea
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  rows={4}
                  className="resize-none"
                  placeholder="Enter announcement for students..."
                  data-ocid="admin.announcement.textarea"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAddOpen(false);
                    setAnnText("");
                  }}
                  data-ocid="admin.announcement.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAnn}
                  disabled={!annText.trim()}
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

      <CardContent className="space-y-5">
        {/* Announcements section */}
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
                        setAnnText("");
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
                          setAnnText(ann.text);
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
                      <Textarea
                        value={annText}
                        onChange={(e) => setAnnText(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditItem(null);
                            setAnnText("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleEditAnn}
                          disabled={!annText.trim()}
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
                    onClick={() => handleDeleteAnn(ann.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chapter Content Management */}
        <div className="border-t border-border/40 pt-4">
          <button
            type="button"
            className="flex items-center gap-2 w-full text-left mb-3"
            onClick={() => setShowContent(!showContent)}
          >
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Manage Course Content</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({chapters.length} chapters)
            </span>
            {showContent ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
            )}
          </button>

          {showContent && (
            <div className="space-y-3">
              {chapters.length === 0 ? (
                <p className="text-xs text-muted-foreground italic px-1">
                  No custom content uploaded. Students see the default
                  curriculum.
                </p>
              ) : (
                <div className="space-y-2">
                  {chapters.map((ch) => (
                    <div
                      key={ch.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 border border-border/40 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {ch.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {ch.subtopics.length} subtopics
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:text-primary"
                          onClick={() => openEditChapter(ch)}
                          data-ocid="admin.chapter.edit_button"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:text-destructive"
                          onClick={() => handleDeleteChapter(ch.id)}
                          data-ocid="admin.chapter.delete_button"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 w-full"
                onClick={openAddChapter}
                data-ocid="admin.chapter.open_modal_button"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Chapter
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Chapter Dialog */}
      <Dialog
        open={addChapterOpen}
        onOpenChange={(o) => {
          if (!o) {
            setAddChapterOpen(false);
            setEditChapter(null);
          }
        }}
      >
        <DialogContent
          className="border-border/60 bg-card max-w-lg"
          data-ocid="admin.chapter.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editChapter ? "Edit Chapter" : "Add Chapter"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Chapter Title</Label>
              <Input
                value={chapterForm.title}
                onChange={(e) =>
                  setChapterForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Introduction to Cybersecurity"
                data-ocid="admin.chapter.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={chapterForm.description}
                onChange={(e) =>
                  setChapterForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="resize-none"
                placeholder="Brief description of what this chapter covers..."
                data-ocid="admin.chapter.textarea"
              />
            </div>
            <div className="space-y-2">
              <Label>Subtopics</Label>
              <div className="flex gap-2">
                <Input
                  value={newSubtopic}
                  onChange={(e) => setNewSubtopic(e.target.value)}
                  placeholder="Add a subtopic..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubtopic();
                    }
                  }}
                  data-ocid="admin.chapter.input"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddSubtopic}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {subtopicsList.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {subtopicsList.map((st, i) => (
                    <div
                      key={st}
                      className="flex items-center gap-2 text-sm bg-secondary/30 rounded px-3 py-1.5"
                    >
                      <span className="flex-1">{st}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtopic(i)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setAddChapterOpen(false);
                setEditChapter(null);
              }}
              data-ocid="admin.chapter.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChapter}
              disabled={!chapterForm.title.trim()}
              className="bg-primary text-primary-foreground"
              data-ocid="admin.chapter.submit_button"
            >
              {editChapter ? "Save Changes" : "Add Chapter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            Manage courses, post announcements, and upload chapter content for
            students.
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
