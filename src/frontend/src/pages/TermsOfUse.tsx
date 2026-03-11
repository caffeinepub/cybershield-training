import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  CreditCard,
  FileText,
  Gavel,
  Globe,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  UserX,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.09,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function SectionWrapper({
  icon,
  number,
  title,
  children,
  accent = "primary",
}: {
  icon: React.ReactNode;
  number: number;
  title: string;
  children: React.ReactNode;
  accent?: "primary" | "accent" | "destructive";
}) {
  const colorMap = {
    primary: {
      bg: "bg-primary/15",
      border: "border-primary/30",
      text: "text-primary",
    },
    accent: {
      bg: "bg-accent/15",
      border: "border-accent/30",
      text: "text-accent",
    },
    destructive: {
      bg: "bg-destructive/15",
      border: "border-destructive/30",
      text: "text-destructive",
    },
  };
  const c = colorMap[accent];

  return (
    <motion.section
      className="py-14 container mx-auto px-4 max-w-5xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}
        >
          <span className={c.text}>{icon}</span>
        </div>
        <h2 className="font-display text-xl md:text-2xl font-bold">
          <span className={`${c.text} mr-2`}>{number}.</span>
          {title}
        </h2>
      </motion.div>
      {children}
    </motion.section>
  );
}

function BulletList({
  items,
  accentClass = "text-primary",
}: {
  items: string[];
  accentClass?: string;
}) {
  return (
    <motion.ul variants={fadeUp} className="space-y-3 pl-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-muted-foreground">
          <ChevronRight
            className={`w-5 h-5 ${accentClass} flex-shrink-0 mt-0.5`}
          />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </motion.ul>
  );
}

export function TermsOfUse() {
  useEffect(() => {
    document.title = "Terms of Use | Alangh Academy";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(
        `meta[name="${name}"]`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta(
      "description",
      "Terms of Use for Alangh Academy LLP. These terms constitute a legally binding agreement governing your use of our cybersecurity training services.",
    );
  }, []);

  return (
    <main className="min-h-screen" data-ocid="terms.page">
      {/* Hero */}
      <section className="relative overflow-hidden grid-bg py-24 md:py-32">
        <div className="absolute inset-0 scan-line pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Legal Agreement
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Terms of <span className="text-primary glow-text">Use</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Last reviewed: March 2026. These terms govern your use of Alangh
              Academy's services.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-card/30 border-b border-border/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Card className="bg-card/60 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    These Terms of Use (&ldquo;Terms&rdquo;) constitute a
                    legally binding agreement between you
                    (&ldquo;learner,&rdquo; &ldquo;participant,&rdquo;
                    &ldquo;user,&rdquo; or &ldquo;you&rdquo;) and{" "}
                    <span className="text-primary font-semibold">
                      Alangh Academy LLP
                    </span>{" "}
                    (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo;
                    or &ldquo;us&rdquo;). By accessing our website, enrolling in
                    our courses, or otherwise using our services, you expressly
                    agree to be bound by these Terms in their entirety. If you
                    do not agree, you must immediately cease use of our
                    services.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 1 — Scope of Services */}
      <SectionWrapper
        icon={<Globe className="w-5 h-5" />}
        number={1}
        title="Scope of Services"
        accent="primary"
      >
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground leading-relaxed mb-5"
        >
          Alangh Academy provides structured cybersecurity training programs,
          including but not limited to live instructor-led sessions, online
          self-paced learning modules, labs, projects, and mentorship
          opportunities. We reserve the right, at our sole discretion, to:
        </motion.p>
        <BulletList
          items={[
            "Modify, suspend, or discontinue any program, feature, or component without prior notice.",
            "Revise content, curriculum, or delivery methods as necessary to maintain relevance, accuracy, or compliance.",
          ]}
        />
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 2 — User Responsibilities */}
      <SectionWrapper
        icon={<BookOpen className="w-5 h-5" />}
        number={2}
        title="User Responsibilities"
        accent="accent"
      >
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground leading-relaxed mb-5"
        >
          By using our services, you agree to the following:
        </motion.p>
        <BulletList
          accentClass="text-accent"
          items={[
            "You shall use our courses and platforms solely for lawful purposes and strictly in accordance with these Terms.",
            "You shall not share, distribute, reproduce, or resell course content, materials, or credentials without prior written authorization.",
            "You are solely responsible for maintaining the confidentiality of your login credentials. Any activity conducted under your account will be deemed your responsibility.",
            "You shall not engage in conduct that disrupts live sessions, compromises platform integrity, or violates the Code of Conduct prescribed by Alangh Academy.",
          ]}
        />
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 3 — Intellectual Property */}
      <SectionWrapper
        icon={<Lock className="w-5 h-5" />}
        number={3}
        title="Intellectual Property"
        accent="primary"
      >
        <BulletList
          items={[
            "All course materials, including but not limited to videos, slides, handbooks, projects, assignments, labs, and assessments, are and shall remain the intellectual property of Alangh Academy.",
            "Enrolment grants you a limited, non-exclusive, non-transferable, revocable license to access training materials for personal learning only.",
            "Unauthorized use, duplication, distribution, or public sharing of course content shall constitute a material breach and may result in immediate termination of access, forfeiture of fees paid, and potential legal action.",
          ]}
        />
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 4 — Enrolment and Payments */}
      <SectionWrapper
        icon={<CreditCard className="w-5 h-5" />}
        number={4}
        title="Enrolment and Payments"
        accent="accent"
      >
        <BulletList
          accentClass="text-accent"
          items={[
            "Enrolment in a course is confirmed only upon receipt of full payment or the first instalment (in the case of subscription plans).",
            "All fees are exclusive of applicable taxes, payment gateway charges, or levies, which shall be borne by the learner.",
            "Non-payment of any instalment when due shall entitle Alangh Academy to suspend or terminate access without prejudice to its rights of recovery.",
            "All payments are subject to the Refund Policy in force at the time of purchase.",
            "All financial transactions are processed by third-party PCI-DSS compliant payment processors. Alangh Academy LLP does not directly handle or store payment card information and disclaims liability for any issues arising from such third-party systems.",
          ]}
        />
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 5 — Certificates */}
      <SectionWrapper
        icon={<FileText className="w-5 h-5" />}
        number={5}
        title="Certificates"
        accent="primary"
      >
        <BulletList
          items={[
            "Certificates of completion, participation, or achievement shall be issued at the sole discretion of Alangh Academy, and only where the learner has met all prescribed requirements, including attendance, assessments, or project submissions.",
            "Issuance of any certificate shall not be construed as a warranty of competence, employability, or qualification for industry certifications.",
          ]}
        />
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 6 — Disclaimer of Guarantees */}
      <SectionWrapper
        icon={<AlertTriangle className="w-5 h-5" />}
        number={6}
        title="Disclaimer of Guarantees"
        accent="destructive"
      >
        <BulletList
          accentClass="text-destructive"
          items={[
            "Alangh Academy provides training programs intended to enhance knowledge and practical skills.",
            "We do not guarantee employment, promotions, salary increments, certification success, or any specific career outcomes.",
            "Learner success is dependent on individual ability, effort, market conditions, and factors beyond the control of Alangh Academy.",
          ]}
        />
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 7 — Limitation of Liability */}
      <SectionWrapper
        icon={<XCircle className="w-5 h-5" />}
        number={7}
        title="Limitation of Liability"
        accent="destructive"
      >
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground leading-relaxed mb-5"
        >
          To the fullest extent permitted by law:
        </motion.p>
        <BulletList
          accentClass="text-destructive"
          items={[
            "Alangh Academy, its directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of the use of our services.",
            "The sole and exclusive remedy available to a learner in respect of any claim, whether contractual or otherwise, shall be a refund (if eligible) as per the Refund Policy.",
            "Under no circumstance shall our liability exceed the total amount paid by the learner for the program in dispute.",
          ]}
        />
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 8 — Termination of Access */}
      <SectionWrapper
        icon={<UserX className="w-5 h-5" />}
        number={8}
        title="Termination of Access"
        accent="destructive"
      >
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground leading-relaxed mb-5"
        >
          Alangh Academy reserves the right, without prior notice, to suspend or
          terminate a learner&rsquo;s access if:
        </motion.p>
        <BulletList
          accentClass="text-destructive"
          items={[
            "The learner violates these Terms, the Refund Policy, or any applicable law.",
            "The learner engages in academic dishonesty, unauthorized distribution of content, or disruptive conduct during training.",
            "The learner misuses or attempts to gain unauthorized access to systems, labs, or platforms.",
          ]}
        />
        <motion.p
          variants={fadeUp}
          className="mt-5 text-muted-foreground leading-relaxed italic border-l-2 border-destructive/40 pl-4"
        >
          Termination on these grounds shall not entitle the learner to any
          refund, partial or full.
        </motion.p>
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 9 — Governing Law */}
      <SectionWrapper
        icon={<Gavel className="w-5 h-5" />}
        number={9}
        title="Governing Law and Jurisdiction"
        accent="primary"
      >
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground leading-relaxed"
        >
          These Terms shall be governed by and construed in accordance with the
          laws of India, without regard to conflict of law principles. All
          disputes shall fall under the exclusive jurisdiction of the courts in
          [Insert City], and by enrolling, you consent to the same.
        </motion.p>
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 10 — Amendments */}
      <SectionWrapper
        icon={<RefreshCw className="w-5 h-5" />}
        number={10}
        title="Amendments"
        accent="accent"
      >
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground leading-relaxed"
        >
          Alangh Academy reserves the right to revise, amend, or update these
          Terms at any time without prior notice. The version published on our
          website at the time of enrollment shall be deemed the applicable
          version. Continued use of our services following any modification
          shall constitute acceptance of the revised Terms.
        </motion.p>
      </SectionWrapper>

      <div className="border-t border-border/40" />

      {/* Section 11 — Contact Information */}
      <SectionWrapper
        icon={<Mail className="w-5 h-5" />}
        number={11}
        title="Contact Information"
        accent="primary"
      >
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground leading-relaxed mb-6"
        >
          For any questions or concerns regarding these Terms, you may contact
          us at:
        </motion.p>
        <motion.div variants={fadeUp}>
          <Card className="bg-card/60 border-primary/20 hover:border-primary/40 transition-colors duration-300 inline-block">
            <CardContent className="p-6">
              <p className="font-semibold text-foreground mb-1">
                Alangh Academy
              </p>
              <p className="text-muted-foreground">
                Email:{" "}
                <a
                  href="mailto:info@alangh.com"
                  className="text-primary hover:underline"
                  data-ocid="terms.link"
                >
                  info@alangh.com
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </SectionWrapper>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden border-t border-border/60">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold mb-5"
            >
              Have Questions About Our{" "}
              <span className="text-primary glow-text">Terms?</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto"
            >
              We're happy to clarify anything. Reach out to our team and we'll
              respond as soon as possible.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button
                asChild
                size="lg"
                className="glow-cyan font-semibold text-base px-8 py-6 rounded-xl"
                data-ocid="terms.primary_button"
              >
                <Link to="/contact">
                  Contact Us
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
