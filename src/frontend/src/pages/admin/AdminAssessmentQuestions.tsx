import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminLayout";

interface Question {
  id: number;
  text: string;
  options: Record<string, string>;
  correctAnswers: string[];
  isMultiple?: boolean;
}

const DEFAULT_QUESTIONS: Question[] = [
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
      C: "It limits the spread of malware and breaches within a network",
      D: "It reduces the attack surface by isolating sensitive systems",
    },
    correctAnswers: ["A", "C", "D"],
    isMultiple: true,
  },
  {
    id: 8,
    text: "What does VPN stand for?",
    options: {
      A: "Virtual Private Network",
      B: "Verified Protocol Network",
      C: "Virtual Protected Node",
      D: "Virtual Public Network",
    },
    correctAnswers: ["A"],
  },
  {
    id: 9,
    text: "What is a DMZ in network architecture?",
    options: {
      A: "A demilitarized zone that separates the internal network from untrusted external networks",
      B: "A database management zone for storing sensitive data",
      C: "A digital monitoring zone for tracking user activity",
      D: "A distributed management zone for cloud services",
    },
    correctAnswers: ["A"],
  },
  {
    id: 10,
    text: "Which of the following is a characteristic of a zero-trust security model?",
    options: {
      A: "Trust all users within the internal network",
      B: "Verify every user and device regardless of location",
      C: "Allow unrestricted access once logged in",
      D: "Disable all firewalls for faster access",
    },
    correctAnswers: ["B"],
  },
  {
    id: 11,
    text: "What is the purpose of endpoint detection and response (EDR)?",
    options: {
      A: "To manage software licenses",
      B: "To detect and investigate threats on endpoint devices",
      C: "To backup endpoint data automatically",
      D: "To monitor employee keystrokes",
    },
    correctAnswers: ["B"],
  },
  {
    id: 12,
    text: "Which of the following are best practices for endpoint security? (Select all that apply)",
    options: {
      A: "Regularly updating and patching software",
      B: "Disabling antivirus to improve performance",
      C: "Enabling full-disk encryption",
      D: "Implementing application whitelisting",
    },
    correctAnswers: ["A", "C", "D"],
    isMultiple: true,
  },
  {
    id: 13,
    text: "What is the purpose of a host-based intrusion detection system (HIDS)?",
    options: {
      A: "To monitor and analyze activities on a specific device for suspicious behavior",
      B: "To block all incoming network traffic",
      C: "To encrypt files on a host machine",
      D: "To manage user account passwords",
    },
    correctAnswers: ["A"],
  },
  {
    id: 14,
    text: "What is ransomware?",
    options: {
      A: "A type of malware that encrypts files and demands payment for decryption",
      B: "Software used to monitor employee productivity",
      C: "A tool for ethical hackers to test systems",
      D: "A backup system for critical business data",
    },
    correctAnswers: ["A"],
  },
  {
    id: 15,
    text: "Which of the following methods help protect endpoints from malware? (Select all that apply)",
    options: {
      A: "Regular antivirus scans",
      B: "Disabling system firewalls",
      C: "Avoiding unknown email attachments",
      D: "Keeping operating systems updated",
    },
    correctAnswers: ["A", "C", "D"],
    isMultiple: true,
  },
  {
    id: 16,
    text: "What is the purpose of an IAM system?",
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
      B: "Disabling all authentication mechanisms",
      C: "Using default credentials for all services",
      D: "Ignoring third-party dependency updates",
    },
    correctAnswers: ["A"],
  },
  {
    id: 26,
    text: "What is the shared responsibility model in cloud security?",
    options: {
      A: "The cloud provider is responsible for all security aspects",
      B: "Security responsibilities are divided between the cloud provider and the customer",
      C: "The customer is fully responsible for all security",
      D: "Security is handled entirely by third-party vendors",
    },
    correctAnswers: ["B"],
  },
  {
    id: 27,
    text: "Which of the following are key cloud security concerns? (Select all that apply)",
    options: {
      A: "Data breaches and loss",
      B: "Faster internet speeds",
      C: "Misconfigured cloud settings",
      D: "Insider threats and unauthorized access",
    },
    correctAnswers: ["A", "C", "D"],
    isMultiple: true,
  },
  {
    id: 28,
    text: "What is CSPM (Cloud Security Posture Management)?",
    options: {
      A: "A tool to encrypt all cloud data automatically",
      B: "A system for monitoring and managing cloud configurations to ensure compliance",
      C: "A cloud-based antivirus solution",
      D: "A framework for developing cloud applications",
    },
    correctAnswers: ["B"],
  },
  {
    id: 29,
    text: "What is the purpose of a cloud access security broker (CASB)?",
    options: {
      A: "To replace on-premise firewalls",
      B: "To act as a security enforcement point between cloud service users and cloud applications",
      C: "To manage cloud billing and expenses",
      D: "To automate cloud deployments",
    },
    correctAnswers: ["B"],
  },
  {
    id: 30,
    text: "What is the difference between IaaS, PaaS, and SaaS in cloud computing?",
    options: {
      A: "They are different pricing models for cloud services",
      B: "IaaS provides infrastructure, PaaS provides platform tools, SaaS provides ready-to-use applications",
      C: "They all refer to the same cloud deployment model",
      D: "They represent different levels of cloud storage capacity",
    },
    correctAnswers: ["B"],
  },
  {
    id: 31,
    text: "What is phishing in cybersecurity?",
    options: {
      A: "A type of malware that encrypts files",
      B: "A social engineering attack using deceptive emails or messages to steal credentials or sensitive information",
      C: "A network scanning technique used by hackers",
      D: "A vulnerability in web applications",
    },
    correctAnswers: ["B"],
  },
  {
    id: 32,
    text: "What is the CIA triad in cybersecurity?",
    options: {
      A: "Confidentiality, Integrity, and Availability",
      B: "Compliance, Identification, and Assurance",
      C: "Central Intelligence Agency guidelines for IT security",
      D: "Cybersecurity, Infrastructure, and Assessment",
    },
    correctAnswers: ["A"],
  },
  {
    id: 33,
    text: "What is a penetration test?",
    options: {
      A: "An authorized simulated cyberattack to evaluate the security of a system",
      B: "A type of malware that spreads through networks",
      C: "A hardware vulnerability test",
      D: "An automated scan for outdated software",
    },
    correctAnswers: ["A"],
  },
  {
    id: 34,
    text: "What is the purpose of security awareness training?",
    options: {
      A: "To teach employees how to write code",
      B: "To educate employees about cybersecurity threats and how to avoid them",
      C: "To train IT teams on firewall configuration",
      D: "To ensure all employees obtain a cybersecurity certification",
    },
    correctAnswers: ["B"],
  },
  {
    id: 35,
    text: "What is a DDoS attack?",
    options: {
      A: "A type of ransomware attack",
      B: "An attack that overwhelms a target with traffic to make it unavailable",
      C: "A technique for stealing user credentials",
      D: "A method of injecting malicious code into web applications",
    },
    correctAnswers: ["B"],
  },
  {
    id: 36,
    text: "What does SIEM stand for?",
    options: {
      A: "Security Information and Event Management",
      B: "System Integration and Error Monitoring",
      C: "Secure Identity and Encryption Module",
      D: "Standard IT Event Management",
    },
    correctAnswers: ["A"],
  },
  {
    id: 37,
    text: "What is the purpose of an incident response plan?",
    options: {
      A: "To prevent all cyberattacks",
      B: "To provide a structured approach for handling and recovering from security incidents",
      C: "To replace firewalls and antivirus software",
      D: "To train new IT employees",
    },
    correctAnswers: ["B"],
  },
  {
    id: 38,
    text: "What is social engineering in cybersecurity?",
    options: {
      A: "Building social media platforms",
      B: "Manipulating individuals into revealing confidential information or performing actions that compromise security",
      C: "Engineering networks for better social connectivity",
      D: "A cybersecurity certification program",
    },
    correctAnswers: ["B"],
  },
  {
    id: 39,
    text: "What is the purpose of encryption?",
    options: {
      A: "To speed up data transmission",
      B: "To compress files for storage",
      C: "To convert data into a format that is unreadable without the correct decryption key",
      D: "To organize data in a structured database",
    },
    correctAnswers: ["C"],
  },
  {
    id: 40,
    text: "What are Indicators of Compromise (IoCs)? (Select all that apply)",
    options: {
      A: "Unusual network traffic patterns",
      B: "Increased application performance",
      C: "Unexpected account lockouts or privilege escalations",
      D: "Presence of unknown files or processes",
    },
    correctAnswers: ["A", "C", "D"],
    isMultiple: true,
  },
];

const STORAGE_KEY = "alangh_assessment_questions";

function loadQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  // Seed defaults
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_QUESTIONS));
  return DEFAULT_QUESTIONS;
}

function saveQuestions(questions: Question[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

const EMPTY_FORM = {
  text: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswers: [] as string[],
};

export function AdminAssessmentQuestions() {
  const [questions, setQuestions] = useState<Question[]>(() => loadQuestions());
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<
    Record<string, string | undefined>
  >({});

  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

  function toggleExpand(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openEdit(q: Question) {
    setEditingId(q.id);
    setForm({
      text: q.text,
      optionA: q.options.A,
      optionB: q.options.B,
      optionC: q.options.C,
      optionD: q.options.D,
      correctAnswers: [...q.correctAnswers],
    });
    setFormErrors({});
    setIsAdding(false);
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setIsAdding(true);
  }

  function closeModal() {
    setIsAdding(false);
    setEditingId(null);
    setFormErrors({});
  }

  function validateForm(): boolean {
    const errs: Record<string, string> = {};
    if (!form.text.trim()) errs.text = "Question text is required.";
    if (!form.optionA.trim()) errs.optionA = "Option A is required.";
    if (!form.optionB.trim()) errs.optionB = "Option B is required.";
    if (!form.optionC.trim()) errs.optionC = "Option C is required.";
    if (!form.optionD.trim()) errs.optionD = "Option D is required.";
    if (form.correctAnswers.length === 0)
      errs.correctAnswers = "Select at least one correct answer.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validateForm()) return;
    const newQ: Question = {
      id: editingId ?? Math.max(0, ...questions.map((q) => q.id)) + 1,
      text: form.text.trim(),
      options: {
        A: form.optionA.trim(),
        B: form.optionB.trim(),
        C: form.optionC.trim(),
        D: form.optionD.trim(),
      },
      correctAnswers: form.correctAnswers,
      isMultiple: form.correctAnswers.length > 1,
    };
    if (editingId !== null) {
      setQuestions((prev) => prev.map((q) => (q.id === editingId ? newQ : q)));
      toast.success("Question updated.");
    } else {
      setQuestions((prev) => [...prev, newQ]);
      toast.success("Question added.");
    }
    closeModal();
  }

  function handleDelete(id: number) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setDeleteConfirmId(null);
    toast.success("Question deleted.");
  }

  function toggleCorrect(letter: string) {
    setForm((prev) => {
      const has = prev.correctAnswers.includes(letter);
      return {
        ...prev,
        correctAnswers: has
          ? prev.correctAnswers.filter((c) => c !== letter)
          : [...prev.correctAnswers, letter],
      };
    });
    setFormErrors((p) => ({ ...p, correctAnswers: undefined }));
  }

  return (
    <AdminLayout activePage="assessment-questions">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Assessment <span className="text-primary">Questions</span>
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span className="inline-flex items-center justify-center bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {questions.length}
              </span>
              questions in the pool
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="gap-2"
            data-ocid="admin.assessment_questions.add.button"
          >
            <Plus className="w-4 h-4" /> Add New Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            data-ocid="admin.assessment_questions.empty_state"
          >
            <ClipboardList className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">No questions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="border border-border/60 rounded-lg bg-card overflow-hidden"
                data-ocid={`admin.assessment_questions.item.${idx + 1}`}
              >
                <div className="flex items-center gap-3 p-4">
                  <span className="text-xs font-mono text-muted-foreground w-6 flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {q.text.length > 100
                        ? `${q.text.slice(0, 100)}...`
                        : q.text}
                    </p>
                    {q.isMultiple && (
                      <Badge
                        variant="outline"
                        className="text-xs mt-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                      >
                        Multiple Select
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 border-border/60 text-muted-foreground hover:text-primary"
                      onClick={() => openEdit(q)}
                      data-ocid={`admin.assessment_questions.edit.button.${idx + 1}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 border-destructive/40 text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteConfirmId(q.id)}
                      data-ocid={`admin.assessment_questions.delete.button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground"
                      onClick={() => toggleExpand(q.id)}
                    >
                      {expanded.has(q.id) ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {expanded.has(q.id) && (
                  <div className="border-t border-border/40 bg-secondary/10 p-4 space-y-2">
                    <p className="text-sm font-medium text-foreground mb-3">
                      {q.text}
                    </p>
                    {(["A", "B", "C", "D"] as const).map((letter) => (
                      <div
                        key={letter}
                        className={`flex items-start gap-2 text-sm p-2 rounded-lg ${q.correctAnswers.includes(letter) ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-secondary/20"}`}
                      >
                        <span
                          className={`font-bold text-xs w-5 flex-shrink-0 mt-0.5 ${q.correctAnswers.includes(letter) ? "text-emerald-400" : "text-muted-foreground"}`}
                        >
                          {letter}.
                        </span>
                        <span
                          className={
                            q.correctAnswers.includes(letter)
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {q.options[letter]}
                        </span>
                        {q.correctAnswers.includes(letter) && (
                          <span className="text-xs text-emerald-400 ml-auto flex-shrink-0">
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {deleteConfirmId === q.id && (
                  <div className="border-t border-destructive/30 bg-destructive/10 p-3 flex items-center gap-3">
                    <p className="text-sm text-destructive flex-1">
                      Delete this question? This cannot be undone.
                    </p>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(q.id)}
                      data-ocid={`admin.assessment_questions.delete.confirm_button.${idx + 1}`}
                    >
                      Yes, Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border/60"
                      onClick={() => setDeleteConfirmId(null)}
                      data-ocid={`admin.assessment_questions.delete.cancel_button.${idx + 1}`}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add / Edit Modal */}
      <Dialog
        open={isAdding || editingId !== null}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent
          className="max-w-2xl border-border/60 bg-card max-h-[90vh] overflow-y-auto"
          data-ocid="admin.assessment_questions.modal"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingId !== null ? "Edit Question" : "Add New Question"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-text">
                Question Text <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="q-text"
                value={form.text}
                onChange={(e) =>
                  setForm((p) => ({ ...p, text: e.target.value }))
                }
                placeholder="Enter the question..."
                rows={3}
                className={`border-border/60 bg-secondary/30 resize-none ${formErrors.text ? "border-destructive" : ""}`}
                data-ocid="admin.assessment_questions.question_text.textarea"
              />
              {formErrors.text && (
                <p className="text-xs text-destructive">{formErrors.text}</p>
              )}
            </div>

            {(["A", "B", "C", "D"] as const).map((letter) => {
              const key = `option${letter}` as keyof typeof form;
              return (
                <div key={letter} className="space-y-1.5">
                  <Label htmlFor={`q-opt-${letter}`}>
                    Option {letter} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`q-opt-${letter}`}
                    value={form[key] as string}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    placeholder={`Enter option ${letter}...`}
                    className={`border-border/60 bg-secondary/30 ${formErrors[key] ? "border-destructive" : ""}`}
                    data-ocid={`admin.assessment_questions.option_${letter.toLowerCase()}.input`}
                  />
                  {formErrors[key] && (
                    <p className="text-xs text-destructive">
                      {formErrors[key]}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="space-y-2">
              <Label>
                Correct Answer(s) <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-4">
                {(["A", "B", "C", "D"] as const).map((letter) => (
                  <div key={letter} className="flex items-center gap-2">
                    <Checkbox
                      id={`correct-${letter}`}
                      checked={form.correctAnswers.includes(letter)}
                      onCheckedChange={() => toggleCorrect(letter)}
                      data-ocid={`admin.assessment_questions.correct_${letter.toLowerCase()}.checkbox`}
                    />
                    <Label
                      htmlFor={`correct-${letter}`}
                      className="cursor-pointer font-medium"
                    >
                      {letter}
                    </Label>
                  </div>
                ))}
              </div>
              {formErrors.correctAnswers && (
                <p className="text-xs text-destructive">
                  {formErrors.correctAnswers}
                </p>
              )}
              {form.correctAnswers.length > 1 && (
                <p className="text-xs text-cyan-400">
                  Multiple correct answers — question will be marked as
                  "Multiple Select"
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeModal}
              className="border-border/60"
              data-ocid="admin.assessment_questions.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              data-ocid="admin.assessment_questions.save.button"
            >
              Save Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
