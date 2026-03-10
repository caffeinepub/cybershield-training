import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  Edit2,
  Loader2,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Level,
  UserRole,
  useAddChapter,
  useAddCourse,
  useAllCourses,
  useAllEnrollments,
  useAllUsers,
  useAssignRole,
  useChaptersByCourse,
  useDeleteChapter,
  useDeleteCourse,
  useUpdateChapter,
  useUpdateCourse,
} from "../../hooks/useQueries";
import type { Chapter, Course } from "../../hooks/useQueries";

// ——— Users Tab ———
function UsersTab() {
  const { data: users, isLoading } = useAllUsers();
  const assignRole = useAssignRole();

  return (
    <div data-ocid="admin.users.panel">
      <h2 className="font-display text-xl font-bold mb-6">User Management</h2>
      {isLoading ? (
        <div
          className="flex items-center gap-2 text-muted-foreground"
          data-ocid="admin.users.loading_state"
        >
          <Loader2 className="w-4 h-4 animate-spin" /> Loading users...
        </div>
      ) : !users || users.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.users.empty_state"
        >
          <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No users registered yet.</p>
        </div>
      ) : (
        <div
          className="border border-border/60 rounded-lg overflow-hidden"
          data-ocid="admin.users.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 bg-secondary/20">
                <TableHead>Principal</TableHead>
                <TableHead className="w-40">Assign Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: Principal, i: number) => (
                <TableRow
                  key={user.toString()}
                  className="border-border/60"
                  data-ocid={`admin.users.row.${i + 1}`}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-xs">
                    {user.toString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(role) =>
                        assignRole.mutate({ user, role: role as UserRole })
                      }
                      data-ocid={`admin.users.role.select.${i + 1}`}
                    >
                      <SelectTrigger
                        className="h-8 text-xs border-border/60 w-32"
                        data-ocid={`admin.users.role.select.${i + 1}`}
                      >
                        <SelectValue placeholder="Set role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.admin}>Admin</SelectItem>
                        <SelectItem value={UserRole.user}>User</SelectItem>
                        <SelectItem value={UserRole.guest}>Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ——— Chapter Manager ———
function ChapterManager({ course }: { course: Course }) {
  const { data: chapters, isLoading } = useChaptersByCourse(course.id);
  const addChapter = useAddChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();
  const [addOpen, setAddOpen] = useState(false);
  const [editChapter, setEditChapter] = useState<Chapter | null>(null);
  const [form, setForm] = useState({ title: "", content: "", order: "1" });

  const sortedChapters = [...(chapters || [])].sort((a, b) =>
    Number(a.order - b.order),
  );

  const openEdit = (ch: Chapter) => {
    setEditChapter(ch);
    setForm({
      title: ch.title,
      content: ch.content,
      order: ch.order.toString(),
    });
  };

  const handleAdd = async () => {
    await addChapter.mutateAsync({
      courseId: course.id,
      title: form.title,
      content: form.content,
      order: BigInt(form.order),
    });
    setForm({ title: "", content: "", order: "1" });
    setAddOpen(false);
  };

  const handleEdit = async () => {
    if (!editChapter) return;
    await updateChapter.mutateAsync({
      id: editChapter.id,
      courseId: course.id,
      title: form.title,
      content: form.content,
      order: BigInt(form.order),
    });
    setEditChapter(null);
  };

  return (
    <div className="mt-4 ml-4 pl-4 border-l border-border/40">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-muted-foreground">
          Chapters
        </h4>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-primary hover:bg-primary/10"
              data-ocid="admin.chapter.open_modal_button"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Chapter
            </Button>
          </DialogTrigger>
          <DialogContent
            className="border-border/60 bg-card"
            data-ocid="admin.chapter.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">Add Chapter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="border-border/60 mt-1"
                  data-ocid="admin.chapter.title.input"
                />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  className="border-border/60 mt-1 min-h-24"
                  data-ocid="admin.chapter.content.textarea"
                />
              </div>
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: e.target.value }))
                  }
                  className="border-border/60 mt-1 w-24"
                  data-ocid="admin.chapter.order.input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setAddOpen(false)}
                data-ocid="admin.chapter.cancel.button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={addChapter.isPending || !form.title.trim()}
                className="bg-primary text-primary-foreground"
                data-ocid="admin.chapter.submit.button"
              >
                {addChapter.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p
          className="text-xs text-muted-foreground"
          data-ocid="admin.chapter.loading_state"
        >
          Loading chapters...
        </p>
      ) : sortedChapters.length === 0 ? (
        <p
          className="text-xs text-muted-foreground"
          data-ocid="admin.chapter.empty_state"
        >
          No chapters yet.
        </p>
      ) : (
        <div className="space-y-1.5">
          {sortedChapters.map((ch, i) => (
            <div
              key={ch.id.toString()}
              className="flex items-center justify-between gap-2 py-1.5 px-3 rounded bg-secondary/20 hover:bg-secondary/40 transition-colors"
              data-ocid={`admin.chapter.item.${i + 1}`}
            >
              <span className="text-xs truncate flex-1">
                <span className="font-mono text-muted-foreground mr-2">
                  {String(ch.order)}.
                </span>
                {ch.title}
              </span>
              <div className="flex gap-1">
                <Dialog
                  open={editChapter?.id === ch.id}
                  onOpenChange={(o) => !o && setEditChapter(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:text-primary"
                      onClick={() => openEdit(ch)}
                      data-ocid={`admin.chapter.edit.button.${i + 1}`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="border-border/60 bg-card"
                    data-ocid="admin.chapter-edit.dialog"
                  >
                    <DialogHeader>
                      <DialogTitle className="font-display">
                        Edit Chapter
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={form.title}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, title: e.target.value }))
                          }
                          className="border-border/60 mt-1"
                          data-ocid="admin.chapter-edit.title.input"
                        />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={form.content}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, content: e.target.value }))
                          }
                          className="border-border/60 mt-1 min-h-24"
                          data-ocid="admin.chapter-edit.content.textarea"
                        />
                      </div>
                      <div>
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={form.order}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, order: e.target.value }))
                          }
                          className="border-border/60 mt-1 w-24"
                          data-ocid="admin.chapter-edit.order.input"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setEditChapter(null)}
                        data-ocid="admin.chapter-edit.cancel.button"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleEdit}
                        disabled={updateChapter.isPending}
                        className="bg-primary text-primary-foreground"
                        data-ocid="admin.chapter-edit.save.button"
                      >
                        {updateChapter.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:text-destructive"
                      data-ocid={`admin.chapter.delete.button.${i + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    className="border-border/60 bg-card"
                    data-ocid="admin.chapter-delete.dialog"
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Chapter?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{ch.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="admin.chapter-delete.cancel.button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteChapter.mutate(ch.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        data-ocid="admin.chapter-delete.confirm.button"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ——— Courses Tab ———
function CoursesTab() {
  const { data: courses, isLoading } = useAllCourses();
  const addCourse = useAddCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [addOpen, setAddOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<bigint | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: Level.beginner as Level,
  });

  const openEdit = (c: Course) => {
    setEditCourse(c);
    setForm({ title: c.title, description: c.description, level: c.level });
  };

  const handleAdd = async () => {
    await addCourse.mutateAsync(form);
    setForm({ title: "", description: "", level: Level.beginner });
    setAddOpen(false);
  };

  const handleEdit = async () => {
    if (!editCourse) return;
    await updateCourse.mutateAsync({ id: editCourse.id, ...form });
    setEditCourse(null);
  };

  return (
    <div data-ocid="admin.courses.panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Course Management</h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              data-ocid="admin.course.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent
            className="border-border/60 bg-card"
            data-ocid="admin.course.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">Add New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="border-border/60 mt-1"
                  data-ocid="admin.course.title.input"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="border-border/60 mt-1"
                  data-ocid="admin.course.description.textarea"
                />
              </div>
              <div>
                <Label>Level</Label>
                <Select
                  value={form.level}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, level: v as Level }))
                  }
                >
                  <SelectTrigger
                    className="border-border/60 mt-1"
                    data-ocid="admin.course.level.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Level.beginner}>Beginner</SelectItem>
                    <SelectItem value={Level.intermediate}>
                      Intermediate
                    </SelectItem>
                    <SelectItem value={Level.advanced}>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setAddOpen(false)}
                data-ocid="admin.course.cancel.button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={addCourse.isPending || !form.title.trim()}
                className="bg-primary text-primary-foreground"
                data-ocid="admin.course.submit.button"
              >
                {addCourse.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add Course"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          className="flex items-center gap-2 text-muted-foreground"
          data-ocid="admin.courses.loading_state"
        >
          <Loader2 className="w-4 h-4 animate-spin" /> Loading courses...
        </div>
      ) : !courses || courses.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.courses.empty_state"
        >
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No courses yet. Add one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course, i) => (
            <div
              key={course.id.toString()}
              className="border border-border/60 rounded-lg bg-card/50"
              data-ocid={`admin.courses.item.${i + 1}`}
            >
              <div className="flex items-center gap-3 p-4">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCourse(
                      expandedCourse === course.id ? null : course.id,
                    )
                  }
                  className="flex items-center gap-2 flex-1 text-left group"
                  data-ocid={`admin.courses.expand.button.${i + 1}`}
                >
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${expandedCourse === course.id ? "rotate-180" : ""}`}
                  />
                  <div className="flex-1">
                    <span className="font-semibold group-hover:text-primary transition-colors">
                      {course.title}
                    </span>
                    <Badge
                      variant="outline"
                      className="ml-3 text-xs font-mono capitalize border-border/40"
                    >
                      {course.level}
                    </Badge>
                  </div>
                </button>
                <div className="flex gap-1">
                  {/* Edit */}
                  <Dialog
                    open={editCourse?.id === course.id}
                    onOpenChange={(o) => !o && setEditCourse(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:text-primary"
                        onClick={() => openEdit(course)}
                        data-ocid={`admin.courses.edit.button.${i + 1}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="border-border/60 bg-card"
                      data-ocid="admin.course-edit.dialog"
                    >
                      <DialogHeader>
                        <DialogTitle className="font-display">
                          Edit Course
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={form.title}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, title: e.target.value }))
                            }
                            className="border-border/60 mt-1"
                            data-ocid="admin.course-edit.title.input"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={form.description}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                description: e.target.value,
                              }))
                            }
                            className="border-border/60 mt-1"
                            data-ocid="admin.course-edit.description.textarea"
                          />
                        </div>
                        <div>
                          <Label>Level</Label>
                          <Select
                            value={form.level}
                            onValueChange={(v) =>
                              setForm((f) => ({ ...f, level: v as Level }))
                            }
                          >
                            <SelectTrigger
                              className="border-border/60 mt-1"
                              data-ocid="admin.course-edit.level.select"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Level.beginner}>
                                Beginner
                              </SelectItem>
                              <SelectItem value={Level.intermediate}>
                                Intermediate
                              </SelectItem>
                              <SelectItem value={Level.advanced}>
                                Advanced
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => setEditCourse(null)}
                          data-ocid="admin.course-edit.cancel.button"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleEdit}
                          disabled={updateCourse.isPending}
                          className="bg-primary text-primary-foreground"
                          data-ocid="admin.course-edit.save.button"
                        >
                          {updateCourse.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:text-destructive"
                        data-ocid={`admin.courses.delete.button.${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className="border-border/60 bg-card"
                      data-ocid="admin.course-delete.dialog"
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{course.title}" and all
                          its chapters.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="admin.course-delete.cancel.button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteCourse.mutate(course.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          data-ocid="admin.course-delete.confirm.button"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {expandedCourse === course.id && (
                <ChapterManager course={course} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ——— Enrollments Tab ———
function EnrollmentsTab() {
  const { data: enrollments, isLoading } = useAllEnrollments();
  const { data: courses } = useAllCourses();

  const getCourseTitle = (id: bigint) =>
    (courses || []).find((c) => c.id === id)?.title || id.toString();

  return (
    <div data-ocid="admin.enrollments.panel">
      <h2 className="font-display text-xl font-bold mb-6">
        Enrollment Overview
      </h2>
      {isLoading ? (
        <div
          className="flex items-center gap-2 text-muted-foreground"
          data-ocid="admin.enrollments.loading_state"
        >
          <Loader2 className="w-4 h-4 animate-spin" /> Loading enrollments...
        </div>
      ) : !enrollments || enrollments.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.enrollments.empty_state"
        >
          <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No enrollments yet.</p>
        </div>
      ) : (
        <div
          className="border border-border/60 rounded-lg overflow-hidden"
          data-ocid="admin.enrollments.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 bg-secondary/20">
                <TableHead>Principal</TableHead>
                <TableHead>Enrolled Courses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map(([principal, courseIds], i) => (
                <TableRow
                  key={principal.toString()}
                  className="border-border/60"
                  data-ocid={`admin.enrollments.row.${i + 1}`}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-xs">
                    {principal.toString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {courseIds.map((cid) => (
                        <Badge
                          key={cid.toString()}
                          variant="outline"
                          className="text-xs border-primary/40 bg-primary/10 text-primary"
                        >
                          {getCourseTitle(cid)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ——— Main Admin Portal ———
export function AdminPortal() {
  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">
            Admin <span className="text-primary glow-text">Portal</span>
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage users, courses, and enrollments.
        </p>
      </motion.div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="bg-secondary/50 border border-border/60">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="admin.users.tab"
          >
            <Users className="w-4 h-4 mr-1.5" /> Users
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="admin.courses.tab"
          >
            <BookOpen className="w-4 h-4 mr-1.5" /> Courses
          </TabsTrigger>
          <TabsTrigger
            value="enrollments"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="admin.enrollments.tab"
          >
            <BarChart3 className="w-4 h-4 mr-1.5" /> Enrollments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>
        <TabsContent value="enrollments">
          <EnrollmentsTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
