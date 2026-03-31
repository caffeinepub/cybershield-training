import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { logAudit } from "@/lib/auditLog";
import { Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  RefreshCw,
  Shield,
  Trophy,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

interface Question {
  id: number;
  text: string;
  options: Record<string, string>;
  correctAnswers: string[];
  isMultiple?: boolean;
}

const ALL_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the purpose of a cybersecurity policy in an organization?",
    options: {
      A: "To ensure compliance with legal and regulatory requirements and protect organizational data, systems, and networks",
      B: "To provide technical guidance for software development",
      C: "To establish strategic policies for the development of business",
      D: "To reduce the need for employee cybersecurity training",
    },
    correctAnswers: ["A"],
  },
  {
    id: 2,
    text: "What is meant by the term 'risk assessment' in the context of cybersecurity?",
    options: {
      A: "Identifying and evaluating potential threats to an organization's digital assets and determining the likelihood and impact of various cyber threats prioritizing the security measures",
      B: "Installing antivirus software across the network to mitigate the risk of malware threats",
      C: "Eliminating all cybersecurity risks from the organization",
      D: "Assessing the business revenue and growth of the organization",
    },
    correctAnswers: ["A"],
  },
  {
    id: 3,
    text: "Explain the role of a CISO (Chief Information Security Officer).",
    options: {
      A: "Developing and implementing the organization's cybersecurity strategy and ensuring compliance with information security laws and regulations",
      B: "Monitoring employee attendance and payroll",
      C: "Overseeing daily coding tasks of software developers and how the product is developed",
      D: "Ensuring the company achieves its business revenue target",
    },
    correctAnswers: ["A"],
  },
  {
    id: 4,
    text: "Why is vendor risk management important in cybersecurity? (Select all that apply)",
    options: {
      A: "Vendors may have access to sensitive data or systems that could be exploited",
      B: "It helps identify and mitigate security risks from third-party services",
      C: "It ensures that vendors will never experience a cyberattack",
      D: "A breach at a vendor can directly impact an organization's operations and reputation",
    },
    correctAnswers: ["A", "B", "D"],
    isMultiple: true,
  },
  {
    id: 5,
    text: "What is the full form of ISO in information security?",
    options: {
      A: "International Security Organization",
      B: "Information Systems Office",
      C: "International Organization for Standardization",
      D: "Information Security Operations",
    },
    correctAnswers: ["C"],
  },
  {
    id: 6,
    text: "What is the primary function of a firewall in network security?",
    options: {
      A: "Encrypt data transmissions",
      B: "Monitor employee productivity",
      C: "Block unauthorized access to or from a private network",
      D: "Perform antivirus scanning",
    },
    correctAnswers: ["C"],
  },
  {
    id: 7,
    text: "Why is network segmentation important in cybersecurity? (Select all that apply)",
    options: {
      A: "It improves network performance and management",
      B: "It prevents phishing attacks from reaching users",
      C: "It limits the spread of malware across the network",
      D: "It helps enforce access control policies",
    },
    correctAnswers: ["A", "C", "D"],
    isMultiple: true,
  },
  {
    id: 8,
    text: "What does the term 'intrusion detection system (IDS)' refer to?",
    options: {
      A: "A tool that automatically encrypts data",
      B: "A system that detects and alerts on suspicious network activity",
      C: "A backup solution for business continuity",
      D: "A device used for load balancing network traffic",
    },
    correctAnswers: ["B"],
  },
  {
    id: 9,
    text: "What is a VPN (Virtual Private Network) in network security?",
    options: {
      A: "To bypass firewall restrictions",
      B: "To monitor and analyze internet traffic",
      C: "To provide a secure, encrypted connection over an untrusted network",
      D: "To replace antivirus software",
    },
    correctAnswers: ["C"],
  },
  {
    id: 10,
    text: "Which of the following are common network security threats? (Select all that apply)",
    options: {
      A: "Denial-of-Service (DoS) attacks",
      B: "Access control list (ACL)",
      C: "VPN tunneling",
      D: "Man-in-the-Middle (MitM) attacks",
    },
    correctAnswers: ["A", "D"],
    isMultiple: true,
  },
  {
    id: 11,
    text: "What is the primary goal of endpoint security?",
    options: {
      A: "Monitor internet traffic",
      B: "Protect servers from power failure",
      C: "Secure individual devices like laptops, desktops, and mobile devices",
      D: "Improve software performance",
    },
    correctAnswers: ["C"],
  },
  {
    id: 12,
    text: "Which of the following is an example of an endpoint?",
    options: {
      A: "Network firewall",
      B: "Web server",
      C: "Laptop / Desktop used by an employee",
      D: "Data center cooling system",
    },
    correctAnswers: ["C"],
  },
  {
    id: 13,
    text: "Which tool is commonly used in endpoint security solutions?",
    options: {
      A: "SIEM",
      B: "IDS",
      C: "Antivirus software",
      D: "Network switch",
    },
    correctAnswers: ["C"],
  },
  {
    id: 14,
    text: "Which of the following best describes Endpoint Detection and Response (EDR)?",
    options: {
      A: "A backup solution for endpoint devices",
      B: "A tool to monitor and respond to threats on endpoints in real-time",
      C: "A method of encrypting email communication",
      D: "A password management system",
    },
    correctAnswers: ["B"],
  },
  {
    id: 15,
    text: "Why is it important to keep endpoint devices updated?",
    options: {
      A: "To enhance screen resolution",
      B: "To reduce system performance",
      C: "To ensure compatibility with older software",
      D: "To patch security vulnerabilities and reduce risk",
    },
    correctAnswers: ["D"],
  },
  {
    id: 16,
    text: "What is the primary purpose of Identity and Access Management (IAM)?",
    options: {
      A: "To secure internet connections",
      B: "To manage and control user identities and access to resources",
      C: "To back up sensitive data",
      D: "To monitor network traffic",
    },
    correctAnswers: ["B"],
  },
  {
    id: 17,
    text: "What is multi-factor authentication (MFA) in Cybersecurity?",
    options: {
      A: "Multi Factor Authentication",
      B: "Master of Fine Arts",
      C: "Multi-Functional Access",
      D: "Multi Fragmented Analogy",
    },
    correctAnswers: ["A"],
  },
  {
    id: 18,
    text: "What is the principle of 'least privilege'?",
    options: {
      A: "Giving users maximum access to reduce support requests",
      B: "Allowing users to choose their own access level",
      C: "Giving users access only to the resources necessary to perform their job",
      D: "Granting access to all team members equally",
    },
    correctAnswers: ["C"],
  },
  {
    id: 19,
    text: "Which of the following best defines Single Sign-On (SSO)?",
    options: {
      A: "Logging in multiple times for each application",
      B: "Using one set of credentials to access multiple applications",
      C: "A process for creating multiple user accounts",
      D: "Resetting passwords regularly",
    },
    correctAnswers: ["B"],
  },
  {
    id: 20,
    text: "Describe the function of an Identity Provider (IdP) in IAM.",
    options: {
      A: "A database for storing user session identity cookies",
      B: "A software tool for writing secure code",
      C: "A system that authenticates and verifies user identities",
      D: "A service for encrypting and decrypting user email exchange server identity",
    },
    correctAnswers: ["C"],
  },
  {
    id: 21,
    text: "What is the primary goal of application security?",
    options: {
      A: "To improve application loading time",
      B: "To protect applications from security threats and vulnerabilities",
      C: "To increase application efficiency in downloads by end users",
      D: "To manage software licenses inventory",
    },
    correctAnswers: ["B"],
  },
  {
    id: 22,
    text: "Which of the following is a common application security vulnerability?",
    options: {
      A: "Data compression",
      B: "Code refactoring",
      C: "SQL injection",
      D: "Page and URL redirection",
    },
    correctAnswers: ["C"],
  },
  {
    id: 23,
    text: "What does OWASP stand for?",
    options: {
      A: "Online Web Application Safety Program",
      B: "Open Web Application Security Project",
      C: "Operational Web Application System Policy",
      D: "Open Worldwide Application Software Protection",
    },
    correctAnswers: ["B"],
  },
  {
    id: 24,
    text: "What is the purpose of input validation in application security?",
    options: {
      A: "To make the app run faster",
      B: "To allow users to skip authentication",
      C: "To ensure that user input is safe and properly formatted",
      D: "To prevent users from entering simple passwords",
    },
    correctAnswers: ["C"],
  },
  {
    id: 25,
    text: "Which of the following helps protect applications during development?",
    options: {
      A: "Static Application Security Testing (SAST)",
      B: "Load testing",
      C: "Functional testing",
      D: "Responsive design testing",
    },
    correctAnswers: ["A"],
  },
  {
    id: 26,
    text: "What is a primary security concern in cloud computing?",
    options: {
      A: "High electricity consumption",
      B: "Lack of scalability",
      C: "Unauthorized access to data and services",
      D: "Complex user interface",
    },
    correctAnswers: ["C"],
  },
  {
    id: 27,
    text: "What is the shared responsibility model in cloud security?",
    options: {
      A: "Only the cloud provider is responsible for all aspects of security",
      B: "Both the cloud provider and customer share security responsibilities",
      C: "Only the customer is responsible for securing the cloud infrastructure",
      D: "A model where no one is responsible for security",
    },
    correctAnswers: ["B"],
  },
  {
    id: 28,
    text: "Which of the following is a benefit of cloud security tools?",
    options: {
      A: "They eliminate the need for manual passwords",
      B: "They guarantee 100% protection from all security threats",
      C: "They help monitor and protect data, applications, and infrastructure in the cloud",
      D: "They allow access only with credential authentication",
    },
    correctAnswers: ["C"],
  },
  {
    id: 29,
    text: "What is a CASB (Cloud Access Security Broker)?",
    options: {
      A: "A cloud-based storage service provider",
      B: "A tool used to monitor and secure data flow between cloud service users and providers",
      C: "A web hosting platform for public cloud applications",
      D: "A software development framework for cloud apps",
    },
    correctAnswers: ["B"],
  },
  {
    id: 30,
    text: "What is data encryption in cloud security?",
    options: {
      A: "Backing up data to physical servers",
      B: "Scrambling data to prevent unauthorized access",
      C: "Compressing data for faster uploads and download",
      D: "Sharing data to external domains with restrictions",
    },
    correctAnswers: ["B"],
  },
  {
    id: 31,
    text: "What is HIPAA?",
    options: {
      A: "A framework for securing financial transactions",
      B: "A regulation focused on the protection of health information",
      C: "A cybersecurity protocol for cloud infrastructure",
      D: "An encryption algorithm for secure email communication",
    },
    correctAnswers: ["B"],
  },
  {
    id: 32,
    text: "What is change management in the context of cybersecurity?",
    options: {
      A: "A process to automatically update all user passwords every month",
      B: "A method to monitor employee behavior for insider threats",
      C: "A structured approach to managing changes to IT systems, minimizing risks and disruptions",
      D: "A strategy for marketing new security tools to end-users",
    },
    correctAnswers: ["C"],
  },
  {
    id: 33,
    text: "What is SIEM in cybersecurity?",
    options: {
      A: "A tool for managing user passwords",
      B: "A method for encrypting sensitive data",
      C: "A system that collects, analyzes, and correlates security event data from across the network",
      D: "A framework for building secure applications",
    },
    correctAnswers: ["C"],
  },
  {
    id: 34,
    text: "What is GDPR in the context of cybersecurity and data protection?",
    options: {
      A: "A cybersecurity tool used to encrypt cloud storage",
      B: "A U.S. regulation for protecting health data",
      C: "A set of EU regulations governing data privacy and protection",
      D: "A framework for software development lifecycle",
    },
    correctAnswers: ["C"],
  },
  {
    id: 35,
    text: "What is the difference between a vulnerability and a threat in cybersecurity?",
    options: {
      A: "A vulnerability is an active attack, while a threat is a weakness in the system",
      B: "A vulnerability is a weakness in a system, while a threat is a potential cause of harm that may exploit that weakness",
      C: "A vulnerability is always intentional, while a threat is accidental",
      D: "A vulnerability and a threat are the same thing in cybersecurity",
    },
    correctAnswers: ["B"],
  },
  {
    id: 36,
    text: "What is the purpose of a hash function in cybersecurity?",
    options: {
      A: "To compress files for storage efficiency",
      B: "To encrypt data for secure transmission",
      C: "To verify data integrity by generating a fixed-size output",
      D: "To hide data in images or audio files",
    },
    correctAnswers: ["C"],
  },
  {
    id: 37,
    text: "Which port number is typically used for HTTPS traffic?",
    options: {
      A: "21",
      B: "80",
      C: "443",
      D: "23",
    },
    correctAnswers: ["C"],
  },
  {
    id: 38,
    text: "In networking, what does the acronym 'DNS' stand for?",
    options: {
      A: "Digital Network Service",
      B: "Domain Name System",
      C: "Data Network Security",
      D: "Distributed Node Server",
    },
    correctAnswers: ["B"],
  },
  {
    id: 39,
    text: "Which protocol is commonly used to securely transfer files over the internet?",
    options: {
      A: "FTP",
      B: "Telnet",
      C: "SFTP",
      D: "HTTPS",
    },
    correctAnswers: ["C"],
  },
  {
    id: 40,
    text: "What is DKIM in the context of email security?",
    options: {
      A: "A tool for encrypting email attachments",
      B: "A protocol for filtering spam based on content",
      C: "A method for digitally signing emails to verify the sender and ensure message integrity",
      D: "A firewall used for protecting email servers",
    },
    correctAnswers: ["C"],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getQuestionsPool(): Question[] {
  try {
    const raw = localStorage.getItem("alangh_assessment_questions");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0)
        return parsed as Question[];
    }
  } catch {}
  return ALL_QUESTIONS;
}

function selectQuestions(prevIds: number[]): Question[] {
  const pool = getQuestionsPool();
  const prevSet = new Set(prevIds);
  const fresh = shuffle(pool.filter((q) => !prevSet.has(q.id)));
  const reuse = shuffle(pool.filter((q) => prevSet.has(q.id)));
  const combined = [...fresh, ...reuse];
  return combined.slice(0, 20);
}

const PASS_SCORE = 16;

function getCurrentUser(): { id: string; name: string; email: string } | null {
  try {
    return JSON.parse(localStorage.getItem("alangh_current_user") || "null");
  } catch {
    return null;
  }
}

function saveAssessmentResult(
  user: { id: string; name: string; email: string },
  score: number,
  passed: boolean,
) {
  try {
    const results: Array<{
      userId: string;
      userName: string;
      userEmail: string;
      score: number;
      passed: boolean;
      date: string;
      attempt: number;
    }> = JSON.parse(localStorage.getItem("alangh_assessment_results") || "[]");

    const userAttempts = results.filter((r) => r.userId === user.id);
    const attempt = userAttempts.length + 1;

    results.push({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      score,
      passed,
      date: new Date().toISOString(),
      attempt,
    });
    localStorage.setItem("alangh_assessment_results", JSON.stringify(results));
  } catch {
    /* ignore */
  }
}

export function SelfAssessment() {
  const loadQuestions = useCallback(() => {
    const raw = sessionStorage.getItem("sa_prev_ids");
    const prevIds: number[] = raw ? JSON.parse(raw) : [];
    const selected = selectQuestions(prevIds);
    sessionStorage.setItem(
      "sa_prev_ids",
      JSON.stringify(selected.map((q) => q.id)),
    );
    return selected;
  }, []);

  const [questions, setQuestions] = useState<Question[]>(() => loadQuestions());
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[Number(k)]?.length > 0,
  ).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const handleSingleAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: [option] }));
  };

  const handleMultiAnswer = (
    questionId: number,
    option: string,
    checked: boolean,
  ) => {
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      }
      return { ...prev, [questionId]: current.filter((o) => o !== option) };
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    for (const q of questions) {
      const userAnswers = answers[q.id] ?? [];
      const sortedUser = [...userAnswers].sort().join(",");
      const sortedCorrect = [...q.correctAnswers].sort().join(",");
      if (sortedUser === sortedCorrect) correct++;
    }
    setScore(correct);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const passed = correct >= PASS_SCORE;

    // Save to new alangh_assessment_results schema
    const currentUser = getCurrentUser();
    if (currentUser) {
      saveAssessmentResult(currentUser, correct, passed);
      logAudit({
        actor: currentUser.name,
        actorType: "user",
        action: "USER_ASSESSMENT_COMPLETED",
        details: `Assessment completed with score ${correct}/20 — ${passed ? "Pass" : "Fail"}`,
        resource: currentUser.name,
      });
    }

    // Also persist score to legacy alangh_registrations for backward compat
    try {
      const regs: Array<Record<string, unknown>> = JSON.parse(
        localStorage.getItem("alangh_registrations") || "[]",
      );
      if (regs.length > 0) {
        const targetIdx =
          regs.findIndex((r) => r.score === undefined) !== -1
            ? regs.findIndex((r) => r.score === undefined)
            : regs.length - 1;
        regs[targetIdx] = { ...regs[targetIdx], score: correct };
        localStorage.setItem("alangh_registrations", JSON.stringify(regs));
      }
    } catch {
      // ignore storage errors silently
    }
  };

  const handleRetake = () => {
    const newQs = loadQuestions();
    setQuestions(newQs);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const passed = score >= PASS_SCORE;

  // Check if user has a certificate
  const currentUser = getCurrentUser();
  const certificate = (() => {
    if (!currentUser || !passed) return null;
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

  return (
    <main
      className="relative min-h-screen py-16"
      data-ocid="self_assessment.page"
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-5">
            <Shield
              className="w-8 h-8 text-primary"
              style={{ animation: "float 4s ease-in-out infinite" }}
            />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Cybersecurity{" "}
            <span className="text-primary glow-text">Self-Assessment</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Answer 20 questions across key cybersecurity domains. Score 16 or
            higher to pass.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {passed ? (
                <Card
                  className="border-accent/40 bg-accent/5 text-center"
                  data-ocid="self_assessment.success_state"
                >
                  <CardContent className="py-16 px-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center mx-auto mb-6"
                    >
                      <Trophy className="w-12 h-12 text-accent" />
                    </motion.div>
                    <Badge className="mb-4 border-accent/40 bg-accent/10 text-accent font-mono text-xs tracking-widest">
                      ASSESSMENT PASSED
                    </Badge>
                    <h2 className="font-display text-3xl font-bold mb-3 text-foreground">
                      Congratulations! 🎉
                    </h2>
                    <p className="text-4xl font-bold text-accent mb-4">
                      {score} / {questions.length}
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-2 max-w-lg mx-auto">
                      Excellent work! You have a solid foundation in
                      cybersecurity principles.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
                      Our team will review your results and reach out to you
                      with enrollment details for the Beginner course. We look
                      forward to starting this journey with you!
                    </p>

                    {certificate ? (
                      <Link
                        to="/certificate/$id"
                        params={{ id: certificate.certificateId }}
                      >
                        <Button
                          size="lg"
                          className="bg-accent text-accent-foreground hover:bg-accent/80 font-semibold px-8 mb-4"
                          data-ocid="self_assessment.primary_button"
                        >
                          <Award className="w-5 h-5 mr-2" />
                          Download Your Certificate
                        </Button>
                      </Link>
                    ) : (
                      <div
                        className="bg-accent/10 border border-accent/30 rounded-lg px-6 py-4 inline-block"
                        data-ocid="self_assessment.success_state"
                      >
                        <p className="text-accent font-semibold text-sm">
                          ✓ Your assessment has been recorded. Your certificate
                          will be issued by our team shortly. Check your profile
                          for updates.
                        </p>
                      </div>
                    )}

                    {currentUser && (
                      <div className="mt-5">
                        <Link to="/profile">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-accent/40 text-accent hover:bg-accent/10"
                            data-ocid="self_assessment.secondary_button"
                          >
                            View My Profile
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card
                  className="border-border/60 bg-card/60 text-center"
                  data-ocid="self_assessment.error_state"
                >
                  <CardContent className="py-16 px-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6"
                    >
                      <XCircle className="w-12 h-12 text-primary" />
                    </motion.div>
                    <Badge className="mb-4 border-primary/40 bg-primary/10 text-primary font-mono text-xs tracking-widest">
                      NOT PASSED
                    </Badge>
                    <h2 className="font-display text-3xl font-bold mb-3 text-foreground">
                      Keep Going!
                    </h2>
                    <p className="text-4xl font-bold text-primary mb-4">
                      {score} / {questions.length}
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-2 max-w-lg mx-auto">
                      You need{" "}
                      <span className="text-foreground font-semibold">
                        {PASS_SCORE} correct answers
                      </span>{" "}
                      to pass.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
                      Don't be discouraged — every attempt builds your
                      knowledge. Try again with a fresh set of questions to
                      strengthen your understanding.
                    </p>
                    <Button
                      size="lg"
                      onClick={handleRetake}
                      className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold px-8"
                      data-ocid="self_assessment.retake_button"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Retake Assessment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Progress */}
              <Card className="border-border/40 bg-card/40 mb-6">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground font-mono">
                      Progress: {answeredCount} / {questions.length} answered
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>

              {/* Questions */}
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.4 }}
                  >
                    <Card
                      className="border-border/50 bg-card/60 hover:border-primary/30 transition-colors"
                      data-ocid="self_assessment.question.card"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary font-mono">
                            {idx + 1}
                          </span>
                          <CardTitle className="text-base font-medium leading-relaxed text-foreground">
                            {q.text}
                          </CardTitle>
                        </div>
                        {q.isMultiple && (
                          <Badge className="ml-10 w-fit border-accent/40 bg-accent/10 text-accent text-xs">
                            Select all that apply
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0 pl-10">
                        <div className="space-y-3">
                          {Object.entries(q.options).map(([letter, text]) => (
                            <div
                              key={letter}
                              className="flex items-start gap-3"
                            >
                              {q.isMultiple ? (
                                <Checkbox
                                  id={`q${q.id}-${letter}`}
                                  checked={(answers[q.id] ?? []).includes(
                                    letter,
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleMultiAnswer(q.id, letter, !!checked)
                                  }
                                  className="mt-0.5"
                                />
                              ) : (
                                <input
                                  type="radio"
                                  id={`q${q.id}-${letter}`}
                                  name={`q${q.id}`}
                                  value={letter}
                                  checked={(answers[q.id] ?? [])[0] === letter}
                                  onChange={() =>
                                    handleSingleAnswer(q.id, letter)
                                  }
                                  className="mt-1 accent-primary"
                                />
                              )}
                              <Label
                                htmlFor={`q${q.id}-${letter}`}
                                className="cursor-pointer text-sm leading-relaxed text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <span className="font-semibold text-primary mr-1">
                                  {letter}.
                                </span>
                                {text}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                {answeredCount < questions.length && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Please answer all {questions.length} questions before
                    submitting. ({questions.length - answeredCount} remaining)
                  </p>
                )}
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={answeredCount < questions.length}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold px-10 disabled:opacity-40"
                  data-ocid="self_assessment.submit_button"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Submit Assessment
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
