import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { logAudit } from "@/lib/auditLog";
import { Link, useParams } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Lock,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const IDB_NAME = "alangh_training_files";
const IDB_STORE = "files";

async function getFileFromIDB(id: string): Promise<File | undefined> {
  return new Promise((resolve) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => {
      const tx = req.result.transaction(IDB_STORE, "readonly");
      const getReq = tx.objectStore(IDB_STORE).get(id);
      getReq.onsuccess = () => resolve(getReq.result as File | undefined);
      getReq.onerror = () => resolve(undefined);
    };
    req.onerror = () => resolve(undefined);
  });
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
}

const DEFAULT_CURRICULUM: Chapter[] = [
  {
    id: "ch1",
    title: "Introduction to Cybersecurity",
    description:
      "Lay the groundwork with a solid understanding of what cybersecurity is, why it matters, and the landscape of threats organizations face today.",
    subtopics: [
      "What is Cybersecurity?",
      "Types of Cyber Threats",
      "CIA Triad (Confidentiality, Integrity, Availability)",
      "Common Attack Vectors",
      "Career Paths in Cybersecurity",
    ],
  },
  {
    id: "ch2",
    title: "Networking Fundamentals",
    description:
      "Understand how data moves across networks, the protocols that govern communication, and the devices that defend network perimeters.",
    subtopics: [
      "OSI and TCP/IP Models",
      "IP Addressing and Subnetting",
      "DNS, DHCP, HTTP/S Protocols",
      "Firewalls and Network Devices",
      "Network Traffic Analysis",
    ],
  },
  {
    id: "ch3",
    title: "Operating System Security",
    description:
      "Learn how to harden both Windows and Linux systems against attack, manage permissions, and ensure data is protected at rest.",
    subtopics: [
      "Windows Security Hardening",
      "Linux Basics and Security",
      "File System Permissions",
      "Patch Management",
      "Secure Boot and Disk Encryption",
    ],
  },
  {
    id: "ch4",
    title: "Identity and Access Management",
    description:
      "Explore how organisations verify who users are and what they're allowed to do, from basic authentication through to enterprise-grade SSO.",
    subtopics: [
      "Authentication vs Authorization",
      "Password Policies and MFA",
      "Role-Based Access Control (RBAC)",
      "Single Sign-On (SSO)",
      "Privileged Access Management",
    ],
  },
  {
    id: "ch5",
    title: "Threat Intelligence and Risk Management",
    description:
      "Build skills to identify threat actors, assess organisational risk, and prioritise the remediation of vulnerabilities using industry frameworks.",
    subtopics: [
      "Understanding Threat Actors",
      "Risk Assessment Frameworks",
      "CVSS Scoring",
      "Vulnerability Management",
      "Threat Hunting Basics",
    ],
  },
  {
    id: "ch6",
    title: "Network Security",
    description:
      "Go deeper into network defence — from intrusion systems and VPNs to segmentation strategies and the Zero Trust model.",
    subtopics: [
      "Intrusion Detection and Prevention Systems",
      "VPN Technologies",
      "Network Segmentation",
      "Wireless Security (WPA3, 802.1X)",
      "Zero Trust Architecture",
    ],
  },
  {
    id: "ch7",
    title: "Application Security",
    description:
      "Understand the OWASP Top 10, how to write more secure code, and the tools used to test and defend web applications and APIs.",
    subtopics: [
      "OWASP Top 10 Vulnerabilities",
      "Secure Coding Practices",
      "Web Application Firewalls",
      "API Security",
      "Penetration Testing Basics",
    ],
  },
  {
    id: "ch8",
    title: "Cloud Security",
    description:
      "Navigate the unique security challenges of cloud environments and learn how the shared responsibility model shapes defensive strategies.",
    subtopics: [
      "Cloud Service Models (IaaS, PaaS, SaaS)",
      "Shared Responsibility Model",
      "Cloud Security Best Practices",
      "Identity Management in Cloud",
      "Cloud Compliance Frameworks",
    ],
  },
  {
    id: "ch9",
    title: "Incident Response",
    description:
      "Master the end-to-end incident response lifecycle: from detection and forensics through to analysis, containment, and recovery.",
    subtopics: [
      "Incident Response Lifecycle",
      "Digital Forensics Basics",
      "Log Analysis and SIEM",
      "Malware Analysis",
      "Business Continuity Planning",
    ],
  },
  {
    id: "ch10",
    title: "Compliance and Governance",
    description:
      "Understand the regulatory landscape — GDPR, HIPAA, PCI-DSS, ISO 27001, and NIST — and how to build a compliant security programme.",
    subtopics: [
      "GDPR, HIPAA, PCI-DSS Overview",
      "ISO 27001 Framework",
      "NIST Cybersecurity Framework",
      "Security Policies and Procedures",
      "Audit and Reporting",
    ],
  },
];

function getChapters(courseId: string): Chapter[] {
  try {
    const all: Array<{ courseId: string; chapters: Chapter[] }> = JSON.parse(
      localStorage.getItem("alangh_course_content") || "[]",
    );
    const found = all.find((c) => c.courseId === courseId);
    if (found && found.chapters.length > 0) return found.chapters;
  } catch {
    /* ignore */
  }
  return DEFAULT_CURRICULUM;
}

function getProgress(userId: string, courseId: string): string[] {
  try {
    const all: Array<{
      userId: string;
      courseId: string;
      completedChapters: string[];
    }> = JSON.parse(localStorage.getItem("alangh_course_progress") || "[]");
    return (
      all.find((p) => p.userId === userId && p.courseId === courseId)
        ?.completedChapters ?? []
    );
  } catch {
    return [];
  }
}

function saveProgress(userId: string, courseId: string, completed: string[]) {
  try {
    const all: Array<{
      userId: string;
      courseId: string;
      completedChapters: string[];
    }> = JSON.parse(localStorage.getItem("alangh_course_progress") || "[]");
    const idx = all.findIndex(
      (p) => p.userId === userId && p.courseId === courseId,
    );
    if (idx >= 0) {
      all[idx] = { userId, courseId, completedChapters: completed };
    } else {
      all.push({ userId, courseId, completedChapters: completed });
    }
    localStorage.setItem("alangh_course_progress", JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function CourseLearn() {
  const { level } = useParams({ from: "/learn/$level" });
  const currentUser: { id: string; name: string; email: string } | null =
    (() => {
      try {
        return JSON.parse(
          localStorage.getItem("alangh_current_user") || "null",
        );
      } catch {
        return null;
      }
    })();

  const chapters = getChapters(level);
  const [expanded, setExpanded] = useState<string | null>(
    chapters[0]?.id ?? null,
  );
  const [completed, setCompleted] = useState<string[]>(() =>
    currentUser ? getProgress(currentUser.id, level) : [],
  );

  const progressPct =
    chapters.length > 0
      ? Math.round((completed.length / chapters.length) * 100)
      : 0;
  const allDone = completed.length === chapters.length && chapters.length > 0;

  const handleMarkComplete = (chapterId: string) => {
    if (!currentUser) return;
    const wasCompleted = completed.includes(chapterId);
    const updated = wasCompleted
      ? completed.filter((c) => c !== chapterId)
      : [...completed, chapterId];
    setCompleted(updated);
    saveProgress(currentUser.id, level, updated);
    if (!wasCompleted) {
      const chapterName =
        chapters.find((c) => c.id === chapterId)?.title || chapterId;
      logAudit({
        actor: currentUser.name,
        actorType: "user",
        action: "USER_CHAPTER_COMPLETED",
        details: `Completed chapter: ${chapterName}`,
        resource: currentUser.name,
      });
    }
  };

  const courseTitle =
    level === "beginner"
      ? "Alangh Cybersecurity Foundation (HackStart™)"
      : `${level.charAt(0).toUpperCase() + level.slice(1)} Course`;

  // Get certificate for this user if it exists
  const certificate = (() => {
    if (!currentUser) return null;
    try {
      const certs: Array<{
        certificateId: string;
        userId: string;
        revokedAt?: string;
      }> = JSON.parse(localStorage.getItem("alangh_certificates") || "[]");
      return (
        certs.find((c) => c.userId === currentUser.id && !c.revokedAt) ?? null
      );
    } catch {
      return null;
    }
  })();

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
            Please log in to access course content and track your progress.
          </p>
          <Link to="/login">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
              data-ocid="course_learn.primary_button"
            >
              Log In to Continue
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen py-12" data-ocid="course_learn.page">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-3xl">
        {/* Back link */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          data-ocid="course_learn.link"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Courses
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <Badge
              variant="outline"
              className="border-primary/30 text-primary text-xs font-mono"
            >
              Beginner
            </Badge>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
            {courseTitle}
          </h1>
          <p className="text-muted-foreground">
            Work through all 10 chapters to earn your certificate of completion.
          </p>
        </motion.div>

        {/* Progress */}
        <Card className="border-border/40 bg-card/60 mb-8">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold">
                  {completed.length} of {chapters.length} chapters completed
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Keep going — you're doing great!
                </p>
              </div>
              <span className="text-2xl font-bold text-primary font-mono">
                {progressPct}%
              </span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </CardContent>
        </Card>

        {/* Completion Banner */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              className="border-accent/40 bg-accent/5 mb-8 text-center"
              data-ocid="course_learn.success_state"
            >
              <CardContent className="py-10 px-8">
                <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center mx-auto mb-5">
                  <Award className="w-10 h-10 text-accent" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  🎉 Course Complete!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Congratulations on completing all chapters of the HackStart™
                  programme.
                </p>
                {certificate ? (
                  <Link
                    to="/certificate/$id"
                    params={{ id: certificate.certificateId }}
                  >
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/80 font-semibold"
                      data-ocid="course_learn.primary_button"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Download Your Certificate
                    </Button>
                  </Link>
                ) : (
                  <div className="bg-accent/10 border border-accent/30 rounded-lg px-5 py-4 inline-block">
                    <p className="text-accent text-sm font-medium">
                      ✓ Your certificate will be issued by our team shortly.
                      Check your profile for updates.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Chapters */}
        <div className="space-y-3" data-ocid="course_learn.list">
          {chapters.map((chapter, idx) => {
            const isCompleted = completed.includes(chapter.id);
            const isExpanded = expanded === chapter.id;
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.4 }}
                data-ocid={`course_learn.item.${idx + 1}`}
              >
                <Card
                  className={`border-border/50 bg-card/60 transition-colors ${
                    isCompleted ? "border-accent/30" : "hover:border-primary/30"
                  }`}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setExpanded(isExpanded ? null : chapter.id)}
                    data-ocid="course_learn.toggle"
                  >
                    <CardHeader className="pb-3 pt-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                            isCompleted
                              ? "bg-accent/20 border border-accent/40 text-accent"
                              : "bg-primary/10 border border-primary/30 text-primary"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">
                            {chapter.title}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {chapter.subtopics.length} topics
                          </p>
                        </div>
                        {isCompleted && (
                          <Badge className="border-accent/40 bg-accent/10 text-accent text-xs shrink-0">
                            Complete
                          </Badge>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </CardHeader>
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0 pb-5 pl-14">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {chapter.description}
                      </p>
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Topics covered
                        </p>
                        <ul className="space-y-1.5">
                          {chapter.subtopics.map((topic) => (
                            <li
                              key={topic}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Shield className="w-3 h-3 text-primary shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleMarkComplete(chapter.id)}
                        className={
                          isCompleted
                            ? "bg-secondary border border-accent/40 text-accent hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                            : "bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
                        }
                        data-ocid="course_learn.primary_button"
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Mark as Incomplete
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Mark as Complete
                          </>
                        )}
                      </Button>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Training Resources Section */}
      {(() => {
        const allResources: Array<{
          id: string;
          courseLevel: string;
          title: string;
          description: string;
          resourceType: string;
          url?: string;
          content?: string;
          isActive: boolean;
          uploadedAt: string;
          fileName?: string;
        }> = (() => {
          try {
            return JSON.parse(
              localStorage.getItem("alangh_training_resources") || "[]",
            );
          } catch {
            return [];
          }
        })();
        const levelResources = allResources.filter(
          (r) => r.courseLevel === level && r.isActive,
        );

        const typeBadgeClass: Record<string, string> = {
          pdf: "bg-red-500/15 text-red-400 border-red-500/30",
          video: "bg-purple-500/15 text-purple-400 border-purple-500/30",
          link: "bg-blue-500/15 text-blue-400 border-blue-500/30",
          note: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
        };
        const typeLabelMap: Record<string, string> = {
          pdf: "PDF",
          video: "Video",
          link: "Link",
          note: "Note",
        };

        return (
          <div className="container mx-auto px-4 pb-16">
            <div className="border-t border-border/40 pt-10">
              <h2 className="font-display text-xl font-bold mb-1">
                Training Resources
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Additional materials uploaded by your instructor for this
                course.
              </p>

              {levelResources.length === 0 ? (
                <p
                  className="text-sm text-muted-foreground/60 italic"
                  data-ocid="course_learn.empty_state"
                >
                  {" "}
                  No additional resources have been uploaded for this course
                  yet.{" "}
                </p>
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  data-ocid="course_learn.panel"
                >
                  {" "}
                  {levelResources.map((r, idx) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      index={idx}
                      typeBadgeClass={typeBadgeClass}
                      typeLabelMap={typeLabelMap}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </main>
  );
}

interface LearnerResourceCardProps {
  resource: {
    id: string;
    title: string;
    description: string;
    resourceType: string;
    url?: string;
    content?: string;
    fileName?: string;
  };
  index: number;
  typeBadgeClass: Record<string, string>;
  typeLabelMap: Record<string, string>;
}

function ResourceCard({
  resource,
  index,
  typeBadgeClass,
  typeLabelMap,
}: LearnerResourceCardProps) {
  const [noteExpanded, setNoteExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleFileDownload = async () => {
    setDownloading(true);
    const file = await getFileFromIDB(resource.id);
    if (!file) {
      setDownloading(false);
      alert("File not available. Please contact your instructor.");
      return;
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = resource.fileName || file.name;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };
  return (
    <Card
      className="border-border/60 bg-card/60 hover:border-primary/30 transition-all"
      data-ocid={`course_learn.item.${index + 1}`}
    >
      <CardContent className="p-4 space-y-2">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium border rounded px-2 py-0.5 ${typeBadgeClass[resource.resourceType] ?? ""}`}
        >
          {typeLabelMap[resource.resourceType] ?? resource.resourceType}
        </span>
        <h3 className="font-semibold text-sm">{resource.title}</h3>
        {resource.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {resource.description}
          </p>
        )}
        {resource.resourceType !== "note" && resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
          >
            Open Link ↗
          </a>
        )}
        {resource.resourceType !== "note" &&
          !resource.url &&
          resource.fileName && (
            <button
              type="button"
              onClick={handleFileDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1 disabled:opacity-50"
              data-ocid={`course_learn.download.${index + 1}`}
            >
              {downloading ? "Loading..." : `Download ${resource.fileName}`} ↓
            </button>
          )}
        {resource.resourceType === "note" && resource.content && (
          <div>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => setNoteExpanded(!noteExpanded)}
              data-ocid={`course_learn.toggle.${index + 1}`}
            >
              {noteExpanded ? "Hide Note" : "View Note"}
            </button>
            {noteExpanded && (
              <div className="mt-2 p-3 bg-secondary/30 rounded border border-border/40 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {resource.content}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
