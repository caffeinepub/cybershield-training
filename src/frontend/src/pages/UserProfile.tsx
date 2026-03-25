import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Lock,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: string;
}

interface AssessmentResult {
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  passed: boolean;
  date: string;
  attempt: number;
}

interface CourseProgress {
  userId: string;
  courseId: string;
  completedChapters: string[];
}

interface Certificate {
  certificateId: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  issuedAt: string;
  revokedAt?: string;
}

function load<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export function UserProfile() {
  const currentUser = load<CurrentUser | null>("alangh_current_user", null);

  const [assessmentResults, setAssessmentResults] = useState<
    AssessmentResult[]
  >([]);
  const [courseProgresses, setCourseProgresses] = useState<CourseProgress[]>(
    [],
  );
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const results = (
      load("alangh_assessment_results", []) as AssessmentResult[]
    )
      .filter((r) => r.userId === currentUser.id)
      .sort((a, b) => b.attempt - a.attempt);
    setAssessmentResults(results);

    const progresses = (
      load("alangh_course_progress", []) as CourseProgress[]
    ).filter((p) => p.userId === currentUser.id);
    setCourseProgresses(progresses);

    const certs = (load("alangh_certificates", []) as Certificate[]).filter(
      (c) => c.userId === currentUser.id && !c.revokedAt,
    );
    setCertificates(certs);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please log in to view your profile and activity.
          </p>
          <Link to="/login">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
              data-ocid="profile.primary_button"
            >
              Log In
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const bestScore =
    assessmentResults.length > 0
      ? Math.max(...assessmentResults.map((r) => r.score))
      : null;
  const hasPassed = assessmentResults.some((r) => r.passed);

  return (
    <main className="relative min-h-screen py-12" data-ocid="profile.page">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">
                {currentUser.name}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {currentUser.email}
              </p>
              {currentUser.phone && (
                <p className="text-muted-foreground text-xs">
                  {currentUser.phone}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-6" data-ocid="profile.tab">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessments">Assessment History</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="certificate">Certificate</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/60 bg-card/60 mb-6">
                <CardContent className="py-6 px-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold">
                      Welcome back, {currentUser.name.split(" ")[0]}!
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Here's a summary of your progress at Alangh Academy.
                    Continue your journey to become a cybersecurity
                    professional.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Member since{" "}
                    {new Date(currentUser.registeredAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Assessments Taken",
                    value: assessmentResults.length,
                    icon: ClipboardList,
                    color: "text-primary",
                  },
                  {
                    label: "Best Score",
                    value: bestScore !== null ? `${bestScore}/20` : "\u2014",
                    icon: Award,
                    color: "text-accent",
                  },
                  {
                    label: "Courses Enrolled",
                    value: courseProgresses.length,
                    icon: BookOpen,
                    color: "text-blue-400",
                  },
                  {
                    label: "Certificates",
                    value: certificates.length,
                    icon: Award,
                    color: "text-emerald-400",
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <Card key={label} className="border-border/50 bg-card/60">
                    <CardContent className="py-5 px-4 text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
                      <p className="text-2xl font-bold font-mono">{value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {hasPassed && certificates.length === 0 && (
                <Card className="border-accent/30 bg-accent/5 mt-6">
                  <CardContent className="py-4 px-5 flex items-center gap-3">
                    <Award className="w-5 h-5 text-accent shrink-0" />
                    <p className="text-sm text-accent">
                      You've passed the assessment! Your certificate will be
                      issued by our team shortly.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* Assessment History Tab */}
          <TabsContent value="assessments">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-lg font-semibold mb-4">
                Assessment History
              </h2>
              {assessmentResults.length === 0 ? (
                <div
                  className="text-center py-16"
                  data-ocid="profile.empty_state"
                >
                  <ClipboardList className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No assessments taken yet.
                  </p>
                  <Link to="/self-assessment" className="mt-4 inline-block">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/80 mt-4"
                      data-ocid="profile.primary_button"
                    >
                      Take Self-Assessment
                    </Button>
                  </Link>
                </div>
              ) : (
                <Card className="border-border/60 bg-card/60">
                  <Table data-ocid="profile.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Attempt</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessmentResults.map((result, idx) => (
                        <TableRow
                          key={`${result.attempt}-${idx}`}
                          data-ocid={`profile.item.${idx + 1}`}
                        >
                          <TableCell className="font-mono text-sm">
                            #{result.attempt}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(result.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="font-bold font-mono">
                            {result.score} / 20
                          </TableCell>
                          <TableCell>
                            {result.passed ? (
                              <Badge className="border-accent/40 bg-accent/10 text-accent flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3" />
                                Pass
                              </Badge>
                            ) : (
                              <Badge className="border-destructive/40 bg-destructive/10 text-destructive flex items-center gap-1 w-fit">
                                <XCircle className="w-3 h-3" />
                                Fail
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-lg font-semibold mb-4">
                My Courses
              </h2>
              {courseProgresses.length === 0 ? (
                <div
                  className="text-center py-16"
                  data-ocid="profile.empty_state"
                >
                  <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    You haven't started any courses yet.
                  </p>
                  <Link to="/courses" className="mt-4 inline-block">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/80 mt-4"
                      data-ocid="profile.primary_button"
                    >
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4" data-ocid="profile.list">
                  {courseProgresses.map((cp, idx) => {
                    const total = 10;
                    const pct = Math.round(
                      (cp.completedChapters.length / total) * 100,
                    );
                    const title =
                      cp.courseId === "beginner"
                        ? "Alangh Cybersecurity Foundation (HackStart\u2122)"
                        : `${cp.courseId.charAt(0).toUpperCase() + cp.courseId.slice(1)} Course`;
                    return (
                      <Card
                        key={cp.courseId}
                        className="border-border/60 bg-card/60"
                        data-ocid={`profile.item.${idx + 1}`}
                      >
                        <CardContent className="py-5 px-5">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <p className="font-semibold text-sm">{title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {cp.completedChapters.length} of {total}{" "}
                                chapters completed
                              </p>
                            </div>
                            <Link
                              to="/learn/$level"
                              params={{ level: cp.courseId }}
                            >
                              <Button
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/80 shrink-0"
                                data-ocid="profile.secondary_button"
                              >
                                Continue Learning
                              </Button>
                            </Link>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
              {/* Quick start beginner if not started */}
              {courseProgresses.find((c) => c.courseId === "beginner") ===
                undefined && (
                <Card className="border-primary/20 bg-primary/5 mt-4">
                  <CardContent className="py-4 px-5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">
                        Alangh Cybersecurity Foundation (HackStart\u2122)
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Beginner · 10 chapters
                      </p>
                    </div>
                    <Link to="/learn/$level" params={{ level: "beginner" }}>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/80"
                        data-ocid="profile.primary_button"
                      >
                        Start Course
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* Certificate Tab */}
          <TabsContent value="certificate">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-lg font-semibold mb-4">
                Certificate
              </h2>
              {certificates.length === 0 ? (
                <Card className="border-border/60 bg-card/60">
                  <CardContent
                    className="py-12 px-8 text-center"
                    data-ocid="profile.empty_state"
                  >
                    <Award className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                    <h3 className="font-display text-lg font-semibold mb-2">
                      No Certificate Yet
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                      Complete the self-assessment with a passing score (16/20
                      or higher) to become eligible. Once approved by our team,
                      your certificate will appear here.
                    </p>
                    {!hasPassed && (
                      <Link to="/self-assessment" className="mt-5 inline-block">
                        <Button
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/80 mt-2"
                          data-ocid="profile.primary_button"
                        >
                          Take Self-Assessment
                        </Button>
                      </Link>
                    )}
                    {hasPassed && (
                      <div className="mt-5 bg-accent/10 border border-accent/30 rounded-lg px-5 py-3 inline-block">
                        <p className="text-accent text-sm">
                          ✓ Assessment passed. Certificate will be issued by our
                          team shortly.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4" data-ocid="profile.list">
                  {certificates.map((cert, idx) => (
                    <Card
                      key={cert.certificateId}
                      className="border-accent/40 bg-accent/5"
                      data-ocid={`profile.item.${idx + 1}`}
                    >
                      <CardContent className="py-5 px-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-5 h-5 text-accent" />
                              <Badge className="border-accent/40 bg-accent/10 text-accent text-xs">
                                Issued
                              </Badge>
                            </div>
                            <p className="font-semibold">{cert.courseName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Issued{" "}
                              {new Date(cert.issuedAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                              ID: {cert.certificateId}
                            </p>
                          </div>
                          <Link
                            to="/certificate/$id"
                            params={{ id: cert.certificateId }}
                          >
                            <Button
                              size="sm"
                              className="bg-accent text-accent-foreground hover:bg-accent/80 shrink-0"
                              data-ocid="profile.primary_button"
                            >
                              Download
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
