import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import {
  type Level,
  useAllCourses,
  useCourseProgress,
  useEnrolledCourseIds,
} from "../hooks/useQueries";
import { useCallerUserProfile } from "../hooks/useQueries";
import { Level as LevelEnum } from "../hooks/useQueries";

const LEVEL_COLORS: Record<Level, string> = {
  [LevelEnum.beginner]: "border-accent/40 bg-accent/10 text-accent",
  [LevelEnum.intermediate]: "border-primary/40 bg-primary/10 text-primary",
  [LevelEnum.advanced]:
    "border-destructive/40 bg-destructive/10 text-destructive",
};

function EnrolledCourseCard({
  courseId,
  courses,
}: { courseId: bigint; courses: ReturnType<typeof useAllCourses>["data"] }) {
  const course = (courses || []).find((c) => c.id === courseId);
  const { data: progress, isLoading } = useCourseProgress(courseId);

  if (!course) return null;

  const chapters = progress?.completedChapters || [];
  const progressPct =
    chapters.length > 0 ? Math.min(100, chapters.length * 10) : 0;

  return (
    <Card className="border-border/60 bg-card/50 hover:border-primary/40 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant="outline"
            className={`text-xs font-mono ${LEVEL_COLORS[course.level]}`}
          >
            {course.level.toUpperCase()}
          </Badge>
          {progress?.completedChapters &&
            progress.completedChapters.length > 0 && (
              <CheckCircle2 className="w-4 h-4 text-accent" />
            )}
        </div>
        <h3 className="font-display font-semibold mb-3 line-clamp-2">
          {course.title}
        </h3>
        <div className="mb-4">
          {isLoading ? (
            <Skeleton className="h-2 w-full" />
          ) : (
            <>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span className="font-mono text-primary">
                  {progress?.completedChapters?.length || 0} chapters done
                </span>
              </div>
              <Progress value={progressPct} className="h-1.5 bg-secondary" />
            </>
          )}
        </div>
        <Link to="/course/$id" params={{ id: course.id.toString() }}>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-border/60 hover:border-primary/60"
            data-ocid="dashboard.course.button"
          >
            Continue <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { data: profile, isLoading: loadingProfile } = useCallerUserProfile();
  const { data: courses, isLoading: loadingCourses } = useAllCourses();
  const { data: enrolledIds, isLoading: loadingEnroll } =
    useEnrolledCourseIds();

  const isLoading = loadingProfile || loadingCourses || loadingEnroll;

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        {loadingProfile ? (
          <Skeleton className="h-8 w-48 mb-2" />
        ) : (
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-primary glow-text">
              {profile?.name || "Agent"}
            </span>
          </h1>
        )}
        <p className="text-muted-foreground">
          Your cybersecurity training dashboard.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          {
            label: "Enrolled Courses",
            value: enrolledIds?.length ?? 0,
            icon: BookOpen,
          },
          {
            label: "Courses Available",
            value: courses?.length ?? 0,
            icon: Shield,
          },
          {
            label: "Modules in Progress",
            value: enrolledIds?.length ?? 0,
            icon: CheckCircle2,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="border-border/60 bg-card/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">
                    {isLoading ? "..." : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">My Courses</h2>
          <Link to="/courses" data-ocid="dashboard.browse.link">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/40 text-primary hover:bg-primary/10"
            >
              Browse Courses <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="dashboard.courses.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : (enrolledIds || []).length === 0 ? (
          <div
            className="text-center py-20 border border-dashed border-border/60 rounded-xl text-muted-foreground"
            data-ocid="dashboard.courses.empty_state"
          >
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-display text-lg mb-1">No courses yet</p>
            <p className="text-sm mb-4">
              Start your cybersecurity journey today.
            </p>
            <Link to="/courses">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/80"
                data-ocid="dashboard.enroll.button"
              >
                Explore Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(enrolledIds || []).map((id, i) => (
              <motion.div
                key={id.toString()}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`dashboard.course.item.${i + 1}`}
              >
                <EnrolledCourseCard courseId={id} courses={courses} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
