import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Loader2,
  Search,
  Shield,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  Level,
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

const STATIC_COURSES = [
  {
    id: 1n,
    title: "Alangh Cybersecurity Foundation (HackStart\u2122)",
    level: Level.beginner,
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

const COURSES_KEY = "alangh_courses_content";

export function Courses() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { data: enrolledIds, isLoading } = useEnrolledCourseIds();
  const enrollMutation = useEnrollInCourse();
  const { identity } = useInternetIdentity();

  const [dynamicCourses] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
      if (saved && saved.length > 0) {
        return STATIC_COURSES.map((c, i) =>
          saved[i]
            ? {
                ...c,
                title: saved[i].title || c.title,
                description: saved[i].description || c.description,
                chapters: saved[i].chapters || c.chapters,
              }
            : c,
        );
      }
    } catch {
      // ignore
    }
    return STATIC_COURSES;
  });

  const filtered = dynamicCourses.filter((c) => {
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
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="border-primary/40 text-primary bg-primary/10 text-xs mb-4"
          >
            <Shield className="w-3 h-3 mr-1.5" /> Structured Learning Paths
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Our{" "}
            <span className="text-primary glow-text">Training Programs</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start with the Beginner course to build your cybersecurity
            foundation. Advanced programs launching soon.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <Tabs
            value={filter}
            onValueChange={setFilter}
            data-ocid="courses.filter.tab"
          >
            <TabsList className="bg-secondary/40 border border-border/60">
              {LEVELS.map((l) => (
                <TabsTrigger
                  key={l}
                  value={l}
                  className="text-xs capitalize"
                  data-ocid={`courses.${l}.tab`}
                >
                  {l === "all" ? "All Levels" : l}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-9 border-border/60 bg-secondary/20 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="courses.search_input"
            />
          </div>
        </div>

        {/* Course list */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="courses.empty_state"
          >
            <p>No courses match your search.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((course, idx) => {
              const enrolled = isEnrolled(course.id);
              return (
                <motion.div
                  key={String(course.id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  data-ocid={`courses.item.${idx + 1}`}
                >
                  <Card className="border-border/60 bg-card/60 hover:border-primary/40 transition-all group shadow-cyber">
                    <CardContent className="p-0">
                      <div className="p-6 md:p-8">
                        {/* Top badge row */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize font-medium ${
                              LEVEL_COLORS[course.level as Level]
                            }`}
                          >
                            {course.level}
                          </Badge>
                          {enrolled && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-accent/10 text-accent border-accent/30"
                            >
                              Enrolled
                            </Badge>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {course.title}
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Chapters */}
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                            What You'll Learn ({course.chapters.length}{" "}
                            Chapters)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            {course.chapters.map((chapter, i) => (
                              <div
                                key={`ch-${i}-${chapter.slice(0, 20)}`}
                                className="flex gap-2 items-start text-sm"
                              >
                                <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">
                                  {chapter}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          {enrolled ? (
                            <Link
                              to="/learn/$level"
                              params={{ level: "beginner" }}
                            >
                              <Button
                                className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan gap-2"
                                data-ocid={`courses.item.${idx + 1}.primary_button`}
                              >
                                Continue Learning
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          ) : (
                            <>
                              {identity ? (
                                <Button
                                  className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan gap-2"
                                  disabled={
                                    enrollMutation.isPending || isLoading
                                  }
                                  onClick={() =>
                                    enrollMutation.mutate(course.id)
                                  }
                                  data-ocid={`courses.item.${idx + 1}.primary_button`}
                                >
                                  {enrollMutation.isPending || isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      Enroll Now
                                      <ArrowRight className="w-4 h-4" />
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Link to="/register">
                                  <Button
                                    className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan gap-2"
                                    data-ocid={`courses.item.${idx + 1}.primary_button`}
                                  >
                                    <UserPlus className="w-4 h-4" />
                                    Register to Enroll
                                  </Button>
                                </Link>
                              )}
                              <Link
                                to="/course/$id"
                                params={{ id: String(course.id) }}
                              >
                                <Button
                                  variant="outline"
                                  className="border-border/60 hover:border-primary/40"
                                  data-ocid={`courses.item.${idx + 1}.secondary_button`}
                                >
                                  View Details
                                </Button>
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </main>
  );
}
