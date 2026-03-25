import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminLayout";

const COURSES_KEY = "alangh_courses_content";

interface CourseData {
  id: string;
  title: string;
  level: string;
  description: string;
  chapters: string[];
}

const DEFAULT_COURSES: CourseData[] = [
  {
    id: "1",
    title: "Alangh Cybersecurity Foundation (HackStart\u2122)",
    level: "beginner",
    description:
      "Build a rock-solid foundation in cybersecurity from zero. No IT background required. This structured program covers the essentials to get you job-aware and cyber-confident.",
    chapters: [
      "Introduction to Cybersecurity - What is cybersecurity, CIA triad, types of threats, attack surfaces",
      "Networking Fundamentals - OSI model, TCP/IP, DNS, HTTP/S, ports, protocols, firewalls, VPNs",
      "Operating System Basics - Windows & Linux fundamentals, file systems, user management, permissions",
      "Understanding Cyber Threats - Malware types, phishing, social engineering, ransomware, insider threats",
      "Basic Cryptography - Encryption vs encoding, symmetric/asymmetric, hashing, SSL/TLS, PKI basics",
      "Web Application Basics - How websites work, HTTP requests, cookies, sessions, OWASP Top 10 intro",
      "Identity & Access Management - Authentication, authorization, MFA, password policies, SSO basics",
      "Security Tools Overview - Intro to Wireshark, Nmap, Metasploit, Burp Suite, SIEM basics",
      "Incident Response Basics - IR lifecycle, logs, evidence handling, basic forensics",
      "Cybersecurity Careers & Paths - SOC analyst, pen tester, GRC, cloud security roles and how to choose",
    ],
  },
];

function loadCourses(): CourseData[] {
  try {
    const saved = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
    if (saved && saved.length > 0) return saved;
  } catch {
    // ignore
  }
  return DEFAULT_COURSES;
}

function saveCourses(courses: CourseData[]) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

interface EditForm {
  title: string;
  description: string;
  chaptersText: string;
}

const levelColor: Record<string, string> = {
  beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  advanced: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export function AdminCoursesContent() {
  const [courses, setCourses] = useState<CourseData[]>(loadCourses);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [form, setForm] = useState<EditForm>({
    title: "",
    description: "",
    chaptersText: "",
  });

  const openEdit = (course: CourseData) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      chaptersText: course.chapters.join("\n"),
    });
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Course title is required.");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Course description is required.");
      return;
    }
    if (!editingCourse) return;

    const chapters = form.chaptersText
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    const updated = courses.map((c) =>
      c.id === editingCourse.id
        ? { ...c, title: form.title, description: form.description, chapters }
        : c,
    );

    setCourses(updated);
    saveCourses(updated);
    setEditingCourse(null);
    toast.success("Course details updated successfully!");
  };

  const handleReset = (course: CourseData) => {
    const defaults = DEFAULT_COURSES.find((d) => d.id === course.id);
    if (!defaults) return;
    const updated = courses.map((c) =>
      c.id === course.id ? { ...defaults } : c,
    );
    setCourses(updated);
    saveCourses(updated);
    toast.success("Course reset to default content.");
  };

  return (
    <AdminLayout activePage="courses-content">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold">Courses Content</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edit course titles, descriptions, and chapter listings displayed on
            the public Courses page.
          </p>
        </div>

        {/* Course list */}
        <div className="space-y-4">
          {courses.map((course, idx) => (
            <Card
              key={course.id}
              className="border-border/60 bg-card/60"
              data-ocid={`admin.courses_content.item.${idx + 1}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${levelColor[course.level] ?? ""}`}
                      >
                        {course.level}
                      </Badge>
                    </div>
                    <CardTitle className="font-display text-lg leading-snug">
                      {course.title}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 gap-1.5"
                      onClick={() => openEdit(course)}
                      data-ocid={`admin.courses_content.edit_button.${idx + 1}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40 gap-1.5"
                      onClick={() => handleReset(course)}
                      data-ocid={`admin.courses_content.delete_button.${idx + 1}`}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {course.description}
                </p>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.chapters.length} Chapters
                  </p>
                  <ul className="space-y-1">
                    {course.chapters.map((ch, chIdx) => (
                      <li
                        key={`ch-${chIdx}-${ch.slice(0, 20)}`}
                        className="text-xs text-muted-foreground flex gap-2"
                      >
                        <span className="text-primary/60 shrink-0 font-mono">
                          {String(chIdx + 1).padStart(2, "0")}.
                        </span>
                        {ch}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCourse}
        onOpenChange={(open) => !open && setEditingCourse(null)}
      >
        <DialogContent
          className="bg-card border-border/60 max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.courses_content.dialog"
        >
          <DialogHeader>
            <DialogTitle>Edit Course Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>Course Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Course title"
                data-ocid="admin.courses_content.input"
              />
            </div>

            <div className="space-y-2">
              <Label>Course Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Course description..."
                rows={4}
                data-ocid="admin.courses_content.textarea"
              />
            </div>

            <div className="space-y-2">
              <Label>Chapters (one per line) *</Label>
              <p className="text-xs text-muted-foreground">
                Enter each chapter on a new line. Include topic details after a
                dash.
              </p>
              <Textarea
                value={form.chaptersText}
                onChange={(e) =>
                  setForm({ ...form, chaptersText: e.target.value })
                }
                placeholder="Chapter 1 - Description&#10;Chapter 2 - Description"
                rows={12}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                {form.chaptersText.split("\n").filter((l) => l.trim()).length}{" "}
                chapters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingCourse(null)}
              data-ocid="admin.courses_content.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={handleSave}
              data-ocid="admin.courses_content.save_button"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
