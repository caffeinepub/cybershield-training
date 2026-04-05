import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, ChevronLeft, Circle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const COURSES_KEY = "alangh_courses_content";

interface StaticChapter {
  id: number;
  title: string;
  description: string;
  topics: string[];
}

interface StaticCourse {
  id: number;
  title: string;
  level: string;
  description: string;
  chapters: StaticChapter[];
}

const STATIC_COURSES: StaticCourse[] = [
  {
    id: 1,
    title: "Alangh Cybersecurity Foundation (HackStart™)",
    level: "Beginner",
    description:
      "Build a rock-solid foundation in cybersecurity from zero. No IT background required. This structured program covers the essentials to get you job-aware and cyber-confident.",
    chapters: [
      {
        id: 1,
        title: "Introduction to Cybersecurity",
        description:
          "Understand the foundations of cybersecurity including the CIA triad, the evolving threat landscape, and why cybersecurity matters in today's world.",
        topics: [
          "What is cybersecurity and why it matters",
          "The CIA Triad: Confidentiality, Integrity, Availability",
          "Types of cyber threats: malware, phishing, ransomware, insider threats",
          "Understanding attack surfaces and risk",
          "Overview of cybersecurity domains and career paths",
        ],
      },
      {
        id: 2,
        title: "Networking Fundamentals",
        description:
          "Learn the core networking concepts that underpin every cybersecurity discipline — from protocols and ports to firewalls and VPNs.",
        topics: [
          "The OSI model and TCP/IP stack",
          "DNS, HTTP/S, FTP, SSH, and key protocols",
          "Ports, services, and their security implications",
          "Firewalls, proxies, and network segmentation",
          "VPNs and secure tunnelling basics",
          "Packet analysis concepts and Wireshark intro",
        ],
      },
      {
        id: 3,
        title: "Operating System Basics",
        description:
          "Master essential Windows and Linux OS skills — file systems, permissions, user management — all critical for any security role.",
        topics: [
          "Windows OS fundamentals for security professionals",
          "Linux command line essentials",
          "File systems and directory structures",
          "User accounts, groups, and permission models",
          "Process management and system monitoring",
          "Hardening basics: disabling services, patching",
        ],
      },
      {
        id: 4,
        title: "Understanding Cyber Threats",
        description:
          "Dive deep into the threat landscape — malware types, attack techniques, social engineering, and how attackers think.",
        topics: [
          "Malware taxonomy: viruses, worms, trojans, ransomware, spyware",
          "Phishing, spear-phishing, and vishing techniques",
          "Social engineering psychology and manipulation tactics",
          "Insider threats and privilege abuse",
          "APTs and nation-state threat actors",
          "Real-world attack case studies",
        ],
      },
      {
        id: 5,
        title: "Basic Cryptography",
        description:
          "Understand encryption, hashing, and digital certificates — the building blocks of secure communications.",
        topics: [
          "Encryption vs encoding vs hashing",
          "Symmetric encryption: AES, DES",
          "Asymmetric encryption: RSA, ECC, public/private keys",
          "Hashing algorithms: MD5, SHA-1, SHA-256",
          "SSL/TLS and HTTPS explained",
          "PKI, digital certificates, and certificate authorities",
        ],
      },
      {
        id: 6,
        title: "Web Application Basics",
        description:
          "Learn how web applications work, common vulnerabilities, and the OWASP Top 10 — essential for any security professional.",
        topics: [
          "How HTTP/S requests and responses work",
          "Cookies, sessions, tokens, and authentication flows",
          "OWASP Top 10 vulnerabilities overview",
          "SQL injection, XSS, CSRF basics",
          "Burp Suite introduction for web testing",
          "Secure coding principles at a high level",
        ],
      },
      {
        id: 7,
        title: "Identity & Access Management",
        description:
          "Understand authentication, authorisation, and modern IAM — from passwords and MFA to SSO and zero trust.",
        topics: [
          "Authentication vs authorisation",
          "Password policies and credential management",
          "Multi-factor authentication (MFA) types and standards",
          "Single Sign-On (SSO) and federated identity",
          "Role-based access control (RBAC) and least privilege",
          "Zero Trust principles introduction",
        ],
      },
      {
        id: 8,
        title: "Security Tools Overview",
        description:
          "Get hands-on with the key tools security professionals use daily — from network scanners to SIEM platforms.",
        topics: [
          "Wireshark: capturing and analysing network traffic",
          "Nmap: network discovery and port scanning",
          "Metasploit: framework overview and ethical use",
          "Burp Suite: web application security testing",
          "SIEM basics: log collection, alerting, and analysis",
          "Intro to vulnerability scanners (Nessus, OpenVAS)",
        ],
      },
      {
        id: 9,
        title: "Incident Response Basics",
        description:
          "Learn the incident response lifecycle — preparation, detection, containment, and recovery — and how to handle a real security incident.",
        topics: [
          "The IR lifecycle: Preparation → Detection → Containment → Eradication → Recovery → Lessons Learned",
          "Log analysis and evidence collection",
          "Chain of custody and digital forensics basics",
          "Creating an incident response playbook",
          "Communication during an incident",
          "Post-incident review and reporting",
        ],
      },
      {
        id: 10,
        title: "Cybersecurity Careers & Paths",
        description:
          "Map out the cybersecurity career landscape — roles, domains, certifications, and how to choose the right path for you.",
        topics: [
          "SOC analyst roles and career progression",
          "Penetration testing and red team careers",
          "GRC: governance, risk, and compliance roles",
          "Cloud security and DevSecOps paths",
          "Key certifications: CompTIA Security+, CEH, OSCP, CISSP overview",
          "Building a portfolio and getting your first cybersecurity job",
        ],
      },
    ],
  },
];

function getCoursesWithOverrides(): StaticCourse[] {
  try {
    const saved = JSON.parse(localStorage.getItem(COURSES_KEY) || "[]");
    if (saved && saved.length > 0) {
      return STATIC_COURSES.map((c, i) =>
        saved[i]
          ? {
              ...c,
              title: saved[i].title || c.title,
              description: saved[i].description || c.description,
              chapters: saved[i].chapters
                ? c.chapters.map((ch: StaticChapter, ci: number) =>
                    saved[i].chapters[ci]
                      ? {
                          ...ch,
                          title: saved[i].chapters[ci].title || ch.title,
                          description:
                            saved[i].chapters[ci].description || ch.description,
                          topics: saved[i].chapters[ci].topics || ch.topics,
                        }
                      : ch,
                  )
                : c.chapters,
            }
          : c,
      );
    }
  } catch {
    // ignore
  }
  return STATIC_COURSES;
}

export function CourseDetail() {
  const { id } = useParams({ from: "/course/$id" });

  const allCourses = getCoursesWithOverrides();
  const course = allCourses.find((c) => String(c.id) === String(id));

  const [selectedChapterId, setSelectedChapterId] = useState<number>(
    course?.chapters[0]?.id ?? 1,
  );

  if (!course) {
    return (
      <div
        className="container mx-auto px-4 py-12 text-center"
        data-ocid="course-detail.error_state"
      >
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
        <p className="text-muted-foreground text-lg mb-4">Course not found.</p>
        <Link to="/courses">
          <Button variant="outline" className="border-border/60">
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  const activeChapter =
    course.chapters.find((c) => c.id === selectedChapterId) ??
    course.chapters[0];

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
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-3 px-1">
              Chapters ({course.chapters.length})
            </h3>
            <ScrollArea className="h-[60vh] lg:h-[calc(100vh-220px)]">
              <div className="space-y-1 pr-2">
                {course.chapters.map((chapter, i) => {
                  const active = chapter.id === selectedChapterId;
                  return (
                    <button
                      type="button"
                      key={chapter.id}
                      onClick={() => setSelectedChapterId(chapter.id)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded flex items-center gap-2.5 transition-all text-sm group",
                        active
                          ? "bg-primary/15 border border-primary/40 text-foreground"
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground",
                      )}
                      data-ocid={`course-detail.chapter.item.${i + 1}`}
                    >
                      {active ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 shrink-0 opacity-40" />
                      )}
                      <span className="line-clamp-2">
                        {i + 1}. {chapter.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeChapter && (
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-border/60 rounded-xl p-8 bg-card/50"
            >
              <div className="mb-6">
                <Badge
                  variant="outline"
                  className="font-mono text-xs mb-3 border-primary/30 bg-primary/10 text-primary"
                >
                  Chapter {activeChapter.id} of {course.chapters.length}
                </Badge>
                <h2 className="font-display text-2xl font-bold mb-3">
                  {activeChapter.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {activeChapter.description}
                </p>
              </div>

              {activeChapter.topics.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    Topics Covered
                  </h3>
                  <ul className="space-y-3">
                    {activeChapter.topics.map((topic, ti) => (
                      <li
                        key={`topic-${ti}-${topic.slice(0, 20)}`}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">
                            {ti + 1}
                          </span>
                        </div>
                        <span className="text-foreground/90 leading-relaxed text-sm">
                          {topic}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
