import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Loader2, Search, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  Level,
  useAllCourses,
  useEnrollInCourse,
  useEnrolledCourseIds,
} from "../hooks/useQueries";

const LEVEL_COLORS: Record<Level, string> = {
  [Level.beginner]: "bg-accent/20 text-accent border-accent/40",
  [Level.intermediate]: "bg-primary/20 text-primary border-primary/40",
  [Level.advanced]: "bg-destructive/20 text-destructive border-destructive/40",
};

const LEVELS = [
  "all",
  Level.beginner,
  Level.intermediate,
  Level.advanced,
] as const;

export function Courses() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { data: courses, isLoading } = useAllCourses();
  const { data: enrolledIds } = useEnrolledCourseIds();
  const enrollMutation = useEnrollInCourse();
  const { identity } = useInternetIdentity();

  const filtered = (courses || []).filter((c) => {
    const matchLevel = filter === "all" || c.level === filter;
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  const isEnrolled = (id: bigint) => (enrolledIds || []).some((e) => e === id);

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display text-4xl font-bold mb-2">
          Course <span className="text-primary glow-text">Catalog</span>
        </h1>
        <p className="text-muted-foreground">
          Choose your path. Master cybersecurity at your pace.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-border/60 focus-visible:ring-primary"
            data-ocid="courses.search.input"
          />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-secondary/50">
            {LEVELS.map((level) => (
              <TabsTrigger
                key={level}
                value={level}
                className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-ocid={`courses.${level}.tab`}
              >
                {level === "all" ? "All" : level}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center py-20"
          data-ocid="courses.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="courses.empty_state"
        >
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-display text-lg mb-1">No courses found</p>
          <p className="text-sm">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="border-border/60 bg-card/50 hover:border-primary/40 transition-all duration-300 group flex flex-col h-full"
                data-ocid={`courses.course.item.${i + 1}`}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="outline"
                      className={`text-xs font-mono ${LEVEL_COLORS[course.level]}`}
                    >
                      {course.level.toUpperCase()}
                    </Badge>
                    {isEnrolled(course.id) && (
                      <Badge
                        variant="outline"
                        className="text-xs border-accent/40 bg-accent/10 text-accent"
                      >
                        Enrolled
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-6">
                    {course.description}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to="/courses/$id"
                      params={{ id: course.id.toString() }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-border/60 hover:border-primary/60 group-hover:border-primary/40"
                        data-ocid={`courses.view.button.${i + 1}`}
                      >
                        View <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    {identity && !isEnrolled(course.id) && (
                      <Button
                        className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40"
                        onClick={() => enrollMutation.mutate(course.id)}
                        disabled={enrollMutation.isPending}
                        data-ocid={`courses.enroll.button.${i + 1}`}
                      >
                        {enrollMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Enroll"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
