import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  Lightbulb,
  MapIcon,
  Shield,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

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

const whoWeAreBullets = [
  "Most training providers only push industry-standard certifications (CEH, CISSP, CompTIA, etc.) without addressing the fundamentals.",
  "Universities offer programs, but they're expensive, lengthy, and unclear on how they connect to real-world jobs.",
  "Beginners and career changers are left confused and overwhelmed about where to start and how to grow.",
];

const problemBullets = [
  "90% of providers focus only on the standard certification coaching.",
  "Beginners are told to 'just do a certification' without understanding what skills or roles it actually prepares them for.",
  "There's no map that connects starting out \u2192 gaining skills \u2192 choosing a domain \u2192 entering a career.",
];

const approachItems = [
  {
    id: "structured",
    title: "Structured Learning Paths",
    desc: "From beginner to advanced, with clarity at every stage:",
    sub: [
      "Alangh Cybersecurity Foundation (HackStart\u2122)",
      "Alangh Professional Cybersecurity Track (CyberElevate\u2122)",
      "Alangh Advanced Cybersecurity Track (MasterLine\u2122)",
    ],
    iconKey: "map" as const,
    color: "border-primary/20 hover:border-primary/40",
    iconColor: "text-primary",
    bg: "bg-primary/15",
    bgBorder: "border-primary/30",
  },
  {
    id: "practical",
    title: "Practical & Career-Focused",
    desc: "Hands-on labs, exercises, and real-world case studies. We train you for skills, not just exams.",
    sub: [],
    iconKey: "zap" as const,
    color: "border-accent/20 hover:border-accent/40",
    iconColor: "text-accent",
    bg: "bg-accent/15",
    bgBorder: "border-accent/30",
  },
  {
    id: "clarity",
    title: "Clarity on Career Options",
    desc: "Learners discover which cybersecurity domains exist (SOC, pen-testing, GRC, cloud security, etc.), what roles fit them, and how to get there.",
    sub: [],
    iconKey: "target" as const,
    color: "border-primary/20 hover:border-primary/40",
    iconColor: "text-primary",
    bg: "bg-primary/15",
    bgBorder: "border-primary/30",
  },
  {
    id: "accessible",
    title: "Accessible for All",
    desc: "No coding background? Not from IT? That's fine. Our training is designed for you to start from scratch and grow with confidence.",
    sub: [],
    iconKey: "users" as const,
    color: "border-accent/20 hover:border-accent/40",
    iconColor: "text-accent",
    bg: "bg-accent/15",
    bgBorder: "border-accent/30",
  },
];

const differentItems = [
  "We start where no one else does \u2014 at the true beginner level.",
  "We provide the missing map: a step-by-step pathway into cybersecurity, not just a random push toward certifications.",
  "We're practitioners, not just trainers. Our courses come from 20+ years of solving real-world security challenges.",
  "We bridge theory and practice. You don't just learn concepts, you apply them.",
];

const philosophyItems = [
  {
    id: "clarity",
    heading: "Clarity over confusion",
    body: "Structured paths, not scattered content.",
    iconKey: "map" as const,
  },
  {
    id: "skills",
    heading: "Skills over cramming",
    body: "Learning by doing, not rote memorization.",
    iconKey: "book" as const,
  },
  {
    id: "guidance",
    heading: "Guidance over guesswork",
    body: "Mentorship and community support along the way.",
    iconKey: "users" as const,
  },
];

const mattersItems = [
  {
    id: "learners",
    audience: "For Learners",
    text: "It means starting a career without wasting years or money chasing the wrong programs.",
  },
  {
    id: "industry",
    audience: "For the Industry",
    text: "It means a better-prepared, job-ready workforce that can fill the global cybersecurity talent gap.",
  },
];

function ApproachIcon({
  iconKey,
  className,
}: {
  iconKey: "map" | "zap" | "target" | "users";
  className: string;
}) {
  if (iconKey === "map") return <MapIcon className={className} />;
  if (iconKey === "zap") return <Zap className={className} />;
  if (iconKey === "target") return <Target className={className} />;
  return <Users className={className} />;
}

function PhilosophyIcon({
  iconKey,
  className,
}: {
  iconKey: "map" | "book" | "users";
  className: string;
}) {
  if (iconKey === "map") return <MapIcon className={className} />;
  if (iconKey === "book") return <BookOpen className={className} />;
  return <Users className={className} />;
}

interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

function LeadersCarousel({ leaders }: { leaders: Leader[] }) {
  const [idx, setIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const visible = 3;
  const maxIdx = Math.max(0, leaders.length - visible);

  const scrollTo = (newIdx: number) => {
    const clamped = Math.max(0, Math.min(newIdx, maxIdx));
    setIdx(clamped);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={containerRef}>
        <div
          className="flex gap-6 transition-transform duration-500"
          style={{
            transform: `translateX(calc(-${idx * (100 / visible)}% - ${idx * (24 / visible)}px))`,
          }}
        >
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="flex-shrink-0 w-[calc(33.333%-16px)] min-w-[260px]"
            >
              <Card className="border-border/60 bg-card/60 hover:border-primary/40 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary/30">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format";
                      }}
                    />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-primary text-sm font-mono mb-3">
                    {leader.role}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {leader.bio}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      {leaders.length > visible && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => scrollTo(idx - 1)}
            disabled={idx === 0}
            className="w-10 h-10 rounded-full border border-border/60 bg-card/60 flex items-center justify-center hover:border-primary/40 hover:bg-primary/10 transition-all disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: maxIdx + 1 }, (_, i) => i).map((dotIdx) => (
              <button
                key={`dot-${dotIdx}`}
                type="button"
                onClick={() => scrollTo(dotIdx)}
                className={`w-2 h-2 rounded-full transition-all ${dotIdx === idx ? "bg-primary w-4" : "bg-border"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollTo(idx + 1)}
            disabled={idx >= maxIdx}
            className="w-10 h-10 rounded-full border border-border/60 bg-card/60 flex items-center justify-center hover:border-primary/40 hover:bg-primary/10 transition-all disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

const DEFAULT_LEADERS: Leader[] = [
  {
    id: "l1",
    name: "Founder & CEO",
    role: "Cybersecurity Expert",
    bio: "Leading Alangh Academy with a vision to make cybersecurity accessible to everyone.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format",
  },
];

function loadLeadersFromStorage(): Leader[] {
  try {
    const raw = localStorage.getItem("alangh_leaders_content");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return DEFAULT_LEADERS;
}

export function AboutUs() {
  const [leaders, setLeaders] = useState<Leader[]>(() =>
    loadLeadersFromStorage(),
  );

  useEffect(() => {
    const handler = () => {
      setLeaders(loadLeadersFromStorage());
    };
    window.addEventListener("storage", handler);
    window.addEventListener("alanghLeadersChanged", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("alanghLeadersChanged", handler);
    };
  }, []);

  useEffect(() => {
    document.title =
      "About Us | Alangh Academy \u2013 Structured Cybersecurity Learning for Beginners";
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
      "Alangh Academy bridges the gap in cybersecurity training with structured learning paths, practical skills, and beginner-to-advanced programs. No IT background required.",
    );
    setMeta(
      "keywords",
      "cybersecurity training for beginners, structured cybersecurity learning, beginner cybersecurity courses, no coding cybersecurity training, career path in cybersecurity, practical cybersecurity training, Alangh Academy",
    );
  }, []);

  return (
    <main className="min-h-screen">
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
                Alangh Academy
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              data-ocid="about.page"
            >
              About{" "}
              <span className="text-primary glow-text">Alangh Academy</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Bridging the gap in cybersecurity training with structured
              learning paths, practical skills, and beginner-to-advanced
              programs. No IT background required.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section
        className="py-20 container mx-auto px-4 max-w-5xl"
        data-ocid="about.section"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Who We Are
            </h2>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-lg leading-relaxed mb-4"
          >
            Alangh Academy was founded with one purpose:{" "}
            <span className="text-foreground font-medium">
              to make cybersecurity learning structured, practical, and
              accessible to beginners.
            </span>
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-lg leading-relaxed mb-6"
          >
            We're the learning division of{" "}
            <span className="text-primary font-semibold">Alangh Infosec</span>,
            a cybersecurity company with over 20 years of hands-on industry
            experience. After decades of securing enterprises, running
            penetration tests, and guiding organizations through real-world
            cyber threats, we saw a clear gap in the market:
          </motion.p>
          <motion.ul variants={fadeUp} className="space-y-3 mb-6 pl-2">
            {whoWeAreBullets.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-muted-foreground"
              >
                <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
          <motion.p
            variants={fadeUp}
            className="text-lg font-semibold text-primary"
          >
            That's the gap we're here to bridge.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 bg-card/30 border-y border-border/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
            >
              <Card className="h-full bg-card/60 border-primary/20 hover:border-primary/40 transition-colors duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-display text-xl font-bold">
                      Our Mission
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To create a clear and structured learning path in
                    cybersecurity, starting from zero, building real skills step
                    by step, and guiding learners toward career opportunities
                    with confidence.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={1}
            >
              <Card className="h-full bg-card/60 border-accent/20 hover:border-accent/40 transition-colors duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-display text-xl font-bold">
                      Our Vision
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    A world where anyone — whether a student, a career switcher,
                    or a professional with no coding background — can build a
                    career in cybersecurity through structured, affordable, and
                    practical learning.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-20 container mx-auto px-4 max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-10 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              The Problem We Solve
            </h2>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground text-lg leading-relaxed mb-5"
          >
            Right now, cybersecurity training is fragmented:
          </motion.p>
          <motion.ul variants={fadeUp} className="space-y-3 mb-6 pl-2">
            {problemBullets.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-muted-foreground"
              >
                <ChevronRight className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
          <motion.p
            variants={fadeUp}
            className="text-lg font-semibold text-primary"
          >
            Alangh Academy is changing that.
          </motion.p>
        </motion.div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-card/20 border-y border-border/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 mb-10"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Our Approach
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-5">
              {approachItems.map((item, idx) => (
                <motion.div key={item.id} variants={fadeUp} custom={idx}>
                  <Card
                    className={`h-full bg-card/60 transition-colors duration-300 ${item.color}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-9 h-9 rounded-lg ${item.bg} border ${item.bgBorder} flex items-center justify-center`}
                        >
                          <ApproachIcon
                            iconKey={item.iconKey}
                            className={`w-5 h-5 ${item.iconColor}`}
                          />
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.desc}
                      </p>
                      {item.sub.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {item.sub.map((s) => (
                            <li
                              key={s}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-20 container mx-auto px-4 max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Why Alangh Academy Is Different
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {differentItems.map((item, idx) => (
              <motion.div
                key={item}
                variants={fadeUp}
                custom={idx}
                className="flex items-start gap-4 p-5 rounded-xl border border-border/60 bg-card/40 hover:border-primary/30 hover:bg-card/60 transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-card/20 border-y border-border/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Our Philosophy
              </h2>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-3xl"
            >
              Cybersecurity should not feel overwhelming or gatekept. With the
              right structure, anyone can learn and succeed.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-foreground font-medium mb-5"
            >
              We believe in:
            </motion.p>
            <div className="grid sm:grid-cols-3 gap-5">
              {philosophyItems.map((item, idx) => (
                <motion.div key={item.id} variants={fadeUp} custom={idx}>
                  <Card className="h-full bg-card/60 border-border/60 hover:border-primary/30 transition-colors duration-300">
                    <CardContent className="p-6 flex flex-col gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                        <PhilosophyIcon
                          iconKey={item.iconKey}
                          className="w-5 h-5 text-primary"
                        />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {item.heading}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.body}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20 container mx-auto px-4 max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Why This Matters
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {mattersItems.map((item, idx) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                custom={idx}
                className="relative overflow-hidden p-7 rounded-xl border border-border/60 bg-card/40 hover:border-primary/30 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent rounded-l-xl" />
                <h3 className="font-semibold text-primary mb-3 pl-3">
                  {item.audience}
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-3">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Meet The Leaders */}
      {leaders.length > 0 && (
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={fadeUp} className="text-center mb-14">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Meet The{" "}
                  <span className="text-primary glow-text">Leaders</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  The people behind Alangh Academy — passionate about making
                  cybersecurity education accessible and impactful.
                </p>
              </motion.div>
              <LeadersCarousel leaders={leaders} />
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
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
              Ready to Start Your{" "}
              <span className="text-primary glow-text">
                Cybersecurity Journey?
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto"
            >
              Alangh Academy is more than a training provider. We're your guide
              into cybersecurity — from curiosity to career.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button
                asChild
                size="lg"
                className="glow-cyan font-semibold text-base px-8 py-6 rounded-xl"
                data-ocid="about.primary_button"
              >
                <Link to="/courses">
                  Explore Our Learning Paths
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
