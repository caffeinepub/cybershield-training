import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Globe,
  GraduationCap,
  Home,
  Layers,
  Lightbulb,
  Route,
  Shield,
  Star,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const WHY_FEATURES = [
  {
    icon: Layers,
    text: "Structured learning paths (Beginner → Intermediate → Advanced)",
  },
  { icon: BookOpen, text: "Real-world projects and labs" },
  { icon: BriefcaseBusiness, text: "Industry-relevant role-based training" },
  { icon: Lightbulb, text: "Personalized mentorship and career guidance" },
];

const DEFAULT_STATS = [
  {
    value: "$500+ Billion Industry",
    label:
      "The cybersecurity market is booming and projected to hit $538B by 2030. That means opportunities keep growing.",
    icon: DollarSign,
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop&auto=format",
  },
  {
    value: "3.5M+ Open Roles",
    label:
      "There's a massive global talent gap. The good news? You don't need a tech background to get started.",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop&auto=format",
  },
  {
    value: "High Pay, Real Impact",
    label:
      "With high demand comes strong salaries, job security, and the chance to do meaningful work that protects people and businesses.",
    icon: TrendingUp,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format",
  },
  {
    value: "Future-Proof Your Career",
    label:
      "AI, cloud, and remote work are everywhere. Cybersecurity is no longer optional — every industry needs skilled professionals.",
    icon: Target,
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop&auto=format",
  },
];

const DEFAULT_PERSONAS = [
  {
    icon: Lightbulb,
    title: "The Curious Beginner",
    desc: "No tech background? No problem. Start from zero.",
    image:
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=480&h=360&fit=crop&auto=format",
  },
  {
    icon: Shield,
    title: "The IT Professional",
    desc: "Already in IT? Level up to cybersecurity roles.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=480&h=360&fit=crop&auto=format",
  },
  {
    icon: Route,
    title: "The Career Switcher",
    desc: "From any domain to cybersecurity. We'll show you how.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=480&h=360&fit=crop&auto=format",
  },
  {
    icon: GraduationCap,
    title: "The Student",
    desc: "Build skills before your first job. Stand out from day one.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=480&h=360&fit=crop&auto=format",
  },
  {
    icon: Home,
    title: "The Homemaker",
    desc: "Re-entering the workforce? Cybersecurity welcomes you.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=360&fit=crop&auto=format",
  },
  {
    icon: BriefcaseBusiness,
    title: "The Working Professional",
    desc: "Upskill on your own schedule. 5–10 hrs/week is enough.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=360&fit=crop&auto=format",
  },
];

const DEFAULT_PATHS = [
  {
    title: "Beginner Path",
    desc: "Zero to foundational cybersecurity skills. Perfect for non-tech backgrounds.",
    badge: "Start Here",
    badgeClass: "bg-accent/20 text-accent border-accent/40",
    borderClass: "hover:border-accent/60",
    image:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop&auto=format",
  },
  {
    title: "Intermediate Path",
    desc: "Deepen technical skills. Network security, SOC operations, threat analysis.",
    badge: "Level Up",
    badgeClass: "bg-primary/20 text-primary border-primary/40",
    borderClass: "hover:border-primary/60",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&auto=format",
  },
  {
    title: "Advanced Path",
    desc: "Penetration testing, threat hunting, security architecture.",
    badge: "Go Deep",
    badgeClass: "bg-destructive/20 text-destructive border-destructive/40",
    borderClass: "hover:border-destructive/60",
    image:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop&auto=format",
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "I had zero tech background but Alangh Academy made everything so clear. Got my first SOC role in 8 months!",
    name: "Priya S.",
    role: "Career Switcher",
  },
  {
    quote:
      "The structured path removed all the confusion. I knew exactly what to do next at every step.",
    name: "Rahul M.",
    role: "IT Professional",
  },
  {
    quote:
      "As a homemaker returning to work, I was nervous. This platform made the journey feel achievable.",
    name: "Anita K.",
    role: "Homemaker",
  },
];

const DEFAULT_FAQS = [
  {
    q: "Do I need a computer science degree to get into cybersecurity?",
    a: "No. Most entry-level roles in cybersecurity do not require a formal degree. Skills, certifications, and hands-on experience matter more. Many professionals enter the field with backgrounds in commerce, arts, or unrelated domains.",
  },
  {
    q: "Do I need to know how to code?",
    a: "It depends. For roles like SOC Analyst, GRC, or Compliance, no coding is needed. For penetration testing or threat hunting, basic scripting (Python, Bash) is helpful.",
  },
  {
    q: "Can I switch into cybersecurity from a non-technical background?",
    a: "Yes. Cybersecurity has many roles that don't require technical expertise, like: Governance, Risk & Compliance (GRC), Security Awareness & Training, Policy Writing & Auditing. With the right training and project exposure, a career switch is very possible and common.",
  },
  {
    q: "How long will it take to become job-ready?",
    a: "6\u20139 months on average, depending on your current knowledge level, the track you choose (Beginner / Intermediate / Advanced), and how much time you can dedicate weekly (5\u201310 hrs/week is typical).",
  },
  {
    q: "What kinds of jobs can I get after this?",
    a: "Entry-level roles include: Security Operations Center (SOC) Analyst, Information Security Analyst, IT Security Support, GRC Associate. These roles exist across banking, IT, healthcare, e-commerce, and government sectors.",
  },
  {
    q: "Is this course only for students or freshers?",
    a: "No. We train students, working professionals, career switchers, and homemakers re-entering the workforce. Anyone can join \u2014 as long as they're willing to learn.",
  },
  {
    q: "Is this aligned with global standards or certifications?",
    a: "We do not offer certification prep (like CEH, CISSP, etc.) right now. Instead, we help you break into cybersecurity. Our focus is on practical, project-based learning that builds foundational and intermediate skills applicable in real-world jobs.",
  },
  {
    q: "What makes Alangh Academy different?",
    a: "Structured learning paths (Beginner \u2192 Intermediate \u2192 Advanced), real-world projects and labs, industry-relevant role-based training, personalized mentorship and career guidance.",
  },
];

const DEFAULT_ANNOUNCEMENT = {
  title: "Next Training Batch — Enrollments Open!",
  subtitle: "HackStart\u2122 Beginner Cybersecurity Programme",
  batchDate: "Batch Starts: August 2025",
  details:
    "Limited seats available. Register now to secure your spot in our upcoming beginner cybersecurity training cohort. Learn from industry experts, work on real-world labs, and start your journey to a career in cybersecurity.",
  image:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format",
};

function loadHomepageContent() {
  try {
    return (
      JSON.parse(localStorage.getItem("alangh_homepage_content") || "null") ??
      {}
    );
  } catch {
    return {};
  }
}

export function Landing() {
  const [content, setContent] = useState(() => loadHomepageContent());

  useEffect(() => {
    const handler = () => setContent(loadHomepageContent());
    window.addEventListener("storage", handler);
    window.addEventListener("alanghHomepageChanged", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("alanghHomepageChanged", handler);
    };
  }, []);

  const heroTagline = content?.hero?.tagline ?? null;
  const heroSubTagline = content?.hero?.subTagline ?? null;
  const activeStats = content?.stats
    ? content.stats.map(
        (s: { value: string; label: string; image?: string }, i: number) => ({
          ...DEFAULT_STATS[i],
          value: s.value,
          label: s.label,
          image: s.image ?? DEFAULT_STATS[i]?.image,
        }),
      )
    : DEFAULT_STATS;
  const activePersonas = content?.personas ?? DEFAULT_PERSONAS;
  const activePaths = content?.paths ?? DEFAULT_PATHS;
  const activeTestimonials = content?.testimonials ?? DEFAULT_TESTIMONIALS;
  const activeFaqs = content?.faqs ?? DEFAULT_FAQS;
  const announcement = content?.announcement ?? DEFAULT_ANNOUNCEMENT;

  return (
    <main>
      {/* Section 1: Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop&auto=format"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/80" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/8 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge className="mb-6 border-primary/40 bg-primary/10 text-primary font-mono text-xs tracking-widest">
              <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
              ALANGH ACADEMY — CYBERSECURITY TRAINING
            </Badge>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              {heroTagline ? (
                <span className="text-foreground">{heroTagline}</span>
              ) : (
                <>
                  <span className="text-foreground">Cybersecurity isn't</span>
                  <br />
                  <span className="text-foreground">just for </span>
                  <span className="text-primary glow-text">hackers.</span>
                  <br />
                  <span className="text-foreground">It's for </span>
                  <span className="text-accent">everyone!</span>
                </>
              )}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              {heroSubTagline ??
                "Whether you're curious about cybersecurity, switching careers, or just getting started — we're here to guide you step-by-step, from beginner to job-ready."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/courses">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                  data-ocid="hero.primary_button"
                >
                  Explore Learning Paths <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Career Stats / Why Cybersecurity */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Why Cybersecurity is the{" "}
              <span className="text-primary glow-text">
                Smartest Career Move
              </span>{" "}
              You Can Make Right Now?
            </h2>
            <p className="text-muted-foreground text-lg">
              It's not just a job. It's your edge in the digital world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeStats.map((stat: (typeof DEFAULT_STATS)[0], i: number) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-border/60 bg-card/60 hover:border-primary/40 transition-all duration-300 text-center group overflow-hidden">
                  <div className="overflow-hidden">
                    <img
                      src={stat.image}
                      alt={stat.value}
                      className="w-full h-[120px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-display text-lg md:text-xl font-bold text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Why Alangh Academy */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Why{" "}
                <span className="text-primary glow-text">Alangh Academy</span>?
              </h2>
              <p className="text-accent font-semibold text-lg mb-6">
                Cybersecurity feels confusing. We make it simple.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Most people don't know where to begin with cybersecurity — and
                that's not their fault. The industry hasn't made it easy. At
                Alangh Academy, we've built a better way — clear, structured
                learning paths designed to take you from beginner to job-ready —
                no fluff, no confusion, just real skills and step-by-step
                support.
              </p>
              <ul className="space-y-4 mb-8">
                {WHY_FEATURES.map((feat) => (
                  <li key={feat.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <feat.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{feat.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-primary font-semibold italic">
                We don't just teach. We guide. From curiosity to career — we
                bridge the gap.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="border border-primary/20 rounded-2xl p-8 bg-card/40 relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/5 blur-2xl" />
                <div className="relative z-10">
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=320&fit=crop&auto=format"
                      alt="Cybersecurity learning path"
                      className="w-full h-[160px] object-cover rounded-xl"
                      style={{ animation: "float 4s ease-in-out infinite" }}
                    />
                  </div>
                  <div className="space-y-4">
                    {["Beginner", "Intermediate", "Advanced"].map(
                      (level, i) => (
                        <div
                          key={level}
                          className="flex items-center gap-3 p-3 rounded-lg bg-background/40 border border-border/40"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              i === 0
                                ? "bg-accent/20 text-accent"
                                : i === 1
                                  ? "bg-primary/20 text-primary"
                                  : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className="font-medium">{level} Path</span>
                          <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                        </div>
                      ),
                    )}
                  </div>
                  <p className="text-center text-muted-foreground text-sm mt-6">
                    Clear progression. No guesswork.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Persona Cards */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Who is this <span className="text-primary glow-text">For?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePersonas.map(
              (persona: (typeof DEFAULT_PERSONAS)[0], i: number) => {
                const IconComp = DEFAULT_PERSONAS[i]?.icon ?? Shield;
                return (
                  <motion.div
                    key={persona.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    data-ocid={`personas.item.${i + 1}`}
                  >
                    <Card className="border-border/60 bg-card/50 hover:border-primary/40 hover:bg-card transition-all duration-300 group h-full overflow-hidden">
                      <div className="overflow-hidden">
                        <img
                          src={persona.image}
                          alt={persona.title}
                          className="w-full h-[140px] object-cover rounded-t-xl group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                          <IconComp className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-display font-bold text-lg mb-2">
                          {persona.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {persona.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Section 5: Learning Paths */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Where Should I{" "}
              <span className="text-primary glow-text">Start?</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              No matter your background — we'll meet you where you are.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activePaths.map((path: (typeof DEFAULT_PATHS)[0], i: number) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`paths.item.${i + 1}`}
              >
                <Card
                  className={`border-border/60 bg-card/50 transition-all duration-300 h-full flex flex-col group overflow-hidden ${path.borderClass}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={path.image}
                      alt={path.title}
                      className="w-full h-[140px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/80" />
                  </div>
                  <CardContent className="p-8 flex flex-col h-full">
                    <Badge
                      variant="outline"
                      className={`mb-4 w-fit text-xs font-mono ${path.badgeClass}`}
                    >
                      {path.badge}
                    </Badge>
                    <h3 className="font-display font-bold text-xl mb-3">
                      {path.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                      {path.desc}
                    </p>
                    <Link to="/courses">
                      <Button
                        variant="outline"
                        className="w-full border-primary/40 text-primary hover:bg-primary/10"
                        data-ocid={`paths.explore.button.${i + 1}`}
                      >
                        Explore Path <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Announcement (replaces Featured Courses) */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card/50 shadow-cyber group">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={announcement.image}
                    alt="Training Batch Announcement"
                    className="w-full h-full min-h-[240px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60 lg:block hidden" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent lg:hidden" />
                </div>
                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative">
                  <div className="absolute inset-0 grid-bg opacity-10" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <Bell className="w-4 h-4 text-primary" />
                      </div>
                      <Badge className="border-primary/40 bg-primary/10 text-primary font-mono text-xs tracking-widest">
                        <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
                        ANNOUNCEMENT
                      </Badge>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                      {announcement.title}
                    </h2>
                    <p className="text-primary font-semibold mb-1">
                      {announcement.subtitle}
                    </p>
                    <div className="flex items-center gap-2 text-accent font-mono text-sm mb-4">
                      <CalendarDays className="w-4 h-4" />
                      {announcement.batchDate}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {announcement.details}
                    </p>
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                        data-ocid="announcement.register.button"
                      >
                        <UserPlus className="w-4 h-4 mr-2" /> Register for This
                        Batch
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 7: Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              What Our{" "}
              <span className="text-primary glow-text">Learners Say</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTestimonials.map(
              (testimonial: (typeof DEFAULT_TESTIMONIALS)[0], i: number) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-ocid={`testimonials.item.${i + 1}`}
                >
                  <Card className="border-border/60 bg-card/50 hover:border-primary/40 transition-all duration-300 h-full">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex gap-1 mb-4">
                        {["1", "2", "3", "4", "5"].map((s) => (
                          <Star
                            key={s}
                            className="w-4 h-4 fill-primary text-primary"
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground leading-relaxed flex-1 mb-6 italic">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-primary font-mono">
                          {testimonial.role}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Cybersecurity is Not Just for{" "}
              <span className="text-primary glow-text">Tech Geniuses</span>{" "}
              &mdash; FAQ for Beginners
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion
              type="single"
              collapsible
              className="space-y-2"
              data-ocid="faq.panel"
            >
              {activeFaqs.map((faq: (typeof DEFAULT_FAQS)[0], i: number) => (
                <AccordionItem
                  key={faq.q}
                  value={`faq-${i}`}
                  className="border border-border/60 rounded-lg px-4 bg-card/40"
                  data-ocid={`faq.item.${i + 1}`}
                >
                  <AccordionTrigger className="text-left font-medium hover:text-primary hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Self-Assessment Section */}
      <section
        className="py-24 bg-secondary/20"
        data-ocid="landing.self_assessment.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-card/40 p-10 md:p-14">
              <div className="absolute inset-0 grid-bg opacity-10" />
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-primary/5 blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-accent" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Badge className="mb-4 border-accent/40 bg-accent/10 text-accent font-mono text-xs tracking-widest">
                    FREE SELF-ASSESSMENT
                  </Badge>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                    Know Your{" "}
                    <span className="text-accent glow-text">
                      Cybersecurity Level
                    </span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                    Not sure where to begin your cybersecurity journey? Our free
                    self-assessment helps you gauge your current knowledge level
                    across key domains including network security, cloud
                    security, identity management, and more. It takes less than
                    10 minutes and helps us recommend the right course for you.
                  </p>
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/80 font-semibold"
                      data-ocid="landing.self_assessment.primary_button"
                    >
                      Start Self-Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Corporate Training Teaser */}
      <section className="py-24" data-ocid="landing.corporate.section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-secondary/30 p-10 md:p-14">
              <div className="absolute inset-0 grid-bg opacity-15" />
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Badge className="mb-4 border-accent/40 bg-accent/10 text-accent font-mono text-xs tracking-widest">
                    ENTERPRISE &amp; CORPORATE
                  </Badge>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                    Scale Cybersecurity Skills{" "}
                    <span className="text-primary glow-text">
                      Across Your Organization
                    </span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                    Alangh Academy offers customized corporate cybersecurity
                    training designed for teams of any size. From awareness
                    programs to advanced technical upskilling — we build
                    programs that fit your goals, roles, and risk profile.
                  </p>
                  <Link to="/corporate-training">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                      data-ocid="landing.corporate.primary_button"
                    >
                      Explore Corporate Training{" "}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto border border-primary/30 rounded-2xl p-12 bg-card/30 glow-cyan relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-20" />
              <div className="relative z-10">
                <Shield
                  className="w-12 h-12 mx-auto mb-6 text-primary"
                  style={{ animation: "float 4s ease-in-out infinite" }}
                />
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Your{" "}
                  <span className="text-primary glow-text">
                    Cybersecurity Journey?
                  </span>
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  This is your launchpad. Let's build your future.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                      data-ocid="cta.primary_button"
                    >
                      Start Learning Today{" "}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/80 font-semibold"
                      data-ocid="cta.register.button"
                    >
                      <UserPlus className="w-4 h-4 mr-2" /> Register Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
