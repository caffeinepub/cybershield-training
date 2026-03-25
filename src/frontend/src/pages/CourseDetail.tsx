import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Loader2,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllCourses,
  useChaptersByCourse,
  useCourseProgress,
  useEnrollInCourse,
  useMarkChapterComplete,
} from "../hooks/useQueries";

export function CourseDetail() {
  const { id } = useParams({ from: "/course/$id" });
  const courseId = BigInt(id);

  const { data: courses, isLoading: loadingCourses } = useAllCourses();
  const { data: chapters, isLoading: loadingChapters } =
    useChaptersByCourse(courseId);
  const { data: progress } = useCourseProgress(courseId);
  const enrollMutation = useEnrollInCourse();
  const markComplete = useMarkChapterComplete();
  const { identity } = useInternetIdentity();

  const course = (courses || []).find((c) => c.id === courseId);
  const sortedChapters = [...(chapters || [])].sort((a, b) =>
    Number(a.order - b.order),
  );
  const [selectedChapter, setSelectedChapter] = useState<bigint | null>(null);

  useEffect(() => {
    if (sortedChapters.length > 0 && selectedChapter === null) {
      setSelectedChapter(sortedChapters[0].id);
    }
  }, [sortedChapters, selectedChapter]);

  const activeChapter = sortedChapters.find((c) => c.id === selectedChapter);
  const completedSet = new Set((progress?.completedChapters || []).map(String));
  const completedCount = sortedChapters.filter((c) =>
    completedSet.has(String(c.id)),
  ).length;
  const progressPct =
    sortedChapters.length > 0
      ? Math.round((completedCount / sortedChapters.length) * 100)
      : 0;

  const isEnrolled = progress?.enrolled ?? false;
  const isCompleted = activeChapter
    ? completedSet.has(String(activeChapter.id))
    : false;

  if (loadingCourses) {
    return (
      <div
        className="container mx-auto px-4 py-12"
        data-ocid="course-detail.loading_state"
      >
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="container mx-auto px-4 py-12 text-center"
        data-ocid="course-detail.error_state"
      >
        <p className="text-muted-foreground">Course not found.</p>
        <Link to="/courses">
          <Button className="mt-4" variant="outline">
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/courses"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          data-ocid="course-detail.back.link"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Courses
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <Badge
              variant="outline"
              className="font-mono text-xs mb-3 border-primary/40 bg-primary/10 text-primary"
            >
              {course.level.toUpperCase()}
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {course.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {course.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 min-w-48">
            {isEnrolled ? (
              <div className="w-full text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    Progress
                  </span>
                  <span className="text-xs font-mono text-primary">
                    {progressPct}%
                  </span>
                </div>
                <Progress value={progressPct} className="h-2 bg-secondary" />
                <p className="text-xs text-muted-foreground mt-1">
                  {completedCount}/{sortedChapters.length} chapters
                </p>
              </div>
            ) : identity ? (
              <Button
                onClick={() => enrollMutation.mutate(courseId)}
                disabled={enrollMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
                data-ocid="course-detail.enroll.button"
              >
                {enrollMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Enrolling...
                  </>
                ) : (
                  "Enroll in Course"
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Layout */}
      {loadingChapters ? (
        <div
          className="space-y-3"
          data-ocid="course-detail.chapters.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : sortedChapters.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="course-detail.chapters.empty_state"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No chapters available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-3 px-1">
                Chapters
              </h3>
              <ScrollArea className="h-[60vh] lg:h-[calc(100vh-220px)]">
                <div className="space-y-1 pr-2">
                  {sortedChapters.map((chapter, i) => {
                    const done = completedSet.has(String(chapter.id));
                    const active = chapter.id === selectedChapter;
                    return (
                      <button
                        type="button"
                        key={chapter.id.toString()}
                        onClick={() => setSelectedChapter(chapter.id)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded flex items-center gap-2.5 transition-all text-sm group",
                          active
                            ? "bg-primary/15 border border-primary/40 text-foreground"
                            : "hover:bg-secondary text-muted-foreground hover:text-foreground",
                        )}
                        data-ocid={`course-detail.chapter.item.${i + 1}`}
                      >
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 shrink-0 opacity-40" />
                        )}
                        <span className="line-clamp-2">{chapter.title}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeChapter ? (
              <motion.div
                key={activeChapter.id.toString()}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-border/60 rounded-xl p-8 bg-card/50"
              >
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                  <h2 className="font-display text-2xl font-bold">
                    {activeChapter.title}
                  </h2>
                  {isEnrolled && !isCompleted && (
                    <Button
                      onClick={() => markComplete.mutate(activeChapter.id)}
                      disabled={markComplete.isPending}
                      className="bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30"
                      data-ocid="course-detail.mark-complete.button"
                    >
                      {markComplete.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Mark
                          Complete
                        </>
                      )}
                    </Button>
                  )}
                  {isCompleted && (
                    <Badge className="bg-accent/20 text-accent border-accent/40">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                    </Badge>
                  )}
                  {!isEnrolled && identity && (
                    <Badge
                      variant="outline"
                      className="border-border/60 text-muted-foreground gap-1"
                    >
                      <Lock className="w-3 h-3" /> Enroll to track progress
                    </Badge>
                  )}
                </div>

                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans text-sm">
                    {activeChapter.content}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
