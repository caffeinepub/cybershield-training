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
    title: "Alangh Cybersecurity Foundation (HackStart™)",
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

export function Courses() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { data: enrolledIds, isLoading } = useEnrolledCourseIds();
  const enrollMutation = useEnrollInCourse();
  const { identity } = useInternetIdentity();

  const filtered = STATIC_COURSES.filter((c) => {
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
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold mb-2">
          Course <span className="text-primary glow-text">Catalog</span>
        </h1>
        <p className="text-muted-foreground">
          Choose your path. Master cybersecurity at your pace.
        </p>
      </motion.div>

      {/* Register Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8 border border-primary/40 rounded-xl bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              Ready to begin your journey?
            </p>
            <p className="text-sm text-muted-foreground">
              Register now to secure your spot in our upcoming cybersecurity
              training batches.
            </p>
          </div>
        </div>
        <Link to="/register" className="flex-shrink-0">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/80 font-semibold whitespace-nowrap"
            data-ocid="courses.register.button"
          >
            Register Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
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
          <p className="font-display text-lg mb-1">
            No courses match your filter
          </p>
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
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {course.description}
                  </p>
                  <ul className="mb-5 space-y-1">
                    {course.chapters.slice(0, 10).map((chapter) => (
                      <li
                        key={chapter}
                        className="flex items-start gap-2 text-xs text-muted-foreground/80"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                        <span className="line-clamp-1">{chapter}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-auto flex-wrap">
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
                    <Link to="/register">
                      <Button
                        variant="outline"
                        className="border-accent/40 text-accent hover:bg-accent/10 whitespace-nowrap"
                        data-ocid={`courses.card.register.button.${i + 1}`}
                      >
                        <UserPlus className="w-4 h-4 mr-1" /> Register
                      </Button>
                    </Link>
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
