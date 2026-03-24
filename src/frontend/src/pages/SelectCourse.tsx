import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Shield, Star, Zap } from "lucide-react";
import { motion } from "motion/react";

const COURSES = [
  {
    id: "beginner",
    title: "HackStart\u2122",
    level: "Beginner",
    subtitle: "Zero to Foundations",
    description:
      "Perfect for those with no prior cybersecurity knowledge. Build solid foundations in networking, security concepts, ethical hacking basics, and real-world defence techniques.",
    chapters: 10,
    duration: "4 months",
    highlights: [
      "No prior experience needed",
      "Networking & security fundamentals",
      "Ethical hacking basics",
      "Hands-on labs & projects",
    ],
    color: "emerald" as const,
    icon: Shield,
    enrollLabel: "HackStart\u2122 \u2014 Beginner",
  },
  {
    id: "intermediate",
    title: "CyberElevate\u2122",
    level: "Intermediate",
    subtitle: "Skills to Job-Ready",
    description:
      "For those with basic IT knowledge ready to go deeper. Master VAPT, SOC operations, threat hunting, incident response, and cloud security to become job-ready.",
    chapters: 13,
    duration: "6 months",
    highlights: [
      "Requires basic IT background",
      "VAPT & penetration testing",
      "SOC operations & threat hunting",
      "Cloud & enterprise security",
    ],
    color: "cyan" as const,
    icon: Star,
    enrollLabel: "CyberElevate\u2122 \u2014 Intermediate",
  },
];

export function SelectCourse() {
  const navigate = useNavigate();
  const currentEmail = sessionStorage.getItem("alangh_current_email");

  const handleSelect = (enrollLabel: string) => {
    if (!currentEmail) return;
    const existing: Record<string, unknown>[] = JSON.parse(
      localStorage.getItem("alangh_registrations") || "[]",
    );
    const idx = existing.findIndex((r) => r.email === currentEmail);
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], enrolledCourse: enrollLabel };
    }
    localStorage.setItem("alangh_registrations", JSON.stringify(existing));
    navigate({ to: "/payment" });
  };

  if (!currentEmail) {
    return (
      <main className="relative min-h-screen py-16 flex items-center justify-center">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <Card className="border-border/60 bg-card/60 max-w-md mx-auto text-center">
          <CardContent className="py-12 px-8">
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-3">
              Session Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find your registration session. Please register first
              to continue.
            </p>
            <Link to="/register">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
                data-ocid="select_course.register.link"
              >
                Go to Registration
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen py-16">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-5">
              <Zap className="w-4 h-4" />
              Assessment Passed — Choose Your Path
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Choose Your{" "}
              <span className="text-primary glow-text">Learning Path</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Congratulations on passing the self-assessment! Select the course
              that best matches your current knowledge level and career goals.
            </p>
          </div>

          {/* Course cards */}
          <div
            className="grid md:grid-cols-2 gap-6"
            data-ocid="select_course.list"
          >
            {COURSES.map((course, i) => {
              const Icon = course.icon;
              const isEmerald = course.color === "emerald";
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  data-ocid={`select_course.item.${i + 1}`}
                >
                  <Card
                    className={`h-full border-2 bg-card/60 transition-all hover:scale-[1.02] ${
                      isEmerald
                        ? "border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]"
                        : "border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                    }`}
                  >
                    <CardContent className="p-7 flex flex-col h-full">
                      {/* Icon + badge */}
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center border ${
                            isEmerald
                              ? "bg-emerald-500/15 border-emerald-500/30"
                              : "bg-cyan-400/15 border-cyan-400/30"
                          }`}
                        >
                          <Icon
                            className={`w-7 h-7 ${
                              isEmerald ? "text-emerald-400" : "text-cyan-400"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full border font-semibold tracking-wide uppercase ${
                            isEmerald
                              ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                              : "border-cyan-400/40 text-cyan-400 bg-cyan-400/10"
                          }`}
                        >
                          {course.level}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-display text-2xl font-bold mb-1">
                        {course.title}
                      </h2>
                      <p
                        className={`text-sm font-medium mb-3 ${
                          isEmerald ? "text-emerald-400" : "text-cyan-400"
                        }`}
                      >
                        {course.subtitle}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                        {course.description}
                      </p>

                      {/* Highlights */}
                      <ul className="space-y-2 mb-6 flex-1">
                        {course.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                isEmerald ? "bg-emerald-400" : "bg-cyan-400"
                              }`}
                            />
                            <span className="text-muted-foreground">{h}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Meta */}
                      <div className="flex gap-5 text-xs text-muted-foreground mb-6">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.chapters} Chapters
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          {course.duration}
                        </span>
                      </div>

                      {/* CTA */}
                      <Button
                        size="lg"
                        onClick={() => handleSelect(course.enrollLabel)}
                        className={`w-full font-semibold ${
                          isEmerald
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                            : "bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                        }`}
                        data-ocid={`select_course.item.${i + 1}.primary_button`}
                      >
                        Select &amp; Continue
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Not sure which to choose?{" "}
            <Link to="/courses" className="text-primary hover:underline">
              Compare full curricula
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
