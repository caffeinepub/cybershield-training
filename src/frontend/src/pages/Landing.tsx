import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Home,
  Layers,
  Lightbulb,
  Route,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Level, useAllCourses } from "../hooks/useQueries";

const LEVEL_COLORS: Record<Level, string> = {
  [Level.beginner]: "bg-accent/20 text-accent border-accent/40",
  [Level.intermediate]: "bg-primary/20 text-primary border-primary/40",
  [Level.advanced]: "bg-destructive/20 text-destructive border-destructive/40",
};

const COURSE_IMAGES: Record<Level, string> = {
  [Level.beginner]: "/assets/generated/course-beginner.dim_400x200.png",
  [Level.intermediate]: "/assets/generated/course-intermediate.dim_400x200.png",
  [Level.advanced]: "/assets/generated/course-advanced.dim_400x200.png",
};

const STATS = [
  {
    value: "3.5 Million",
    label: "Unfilled cybersecurity jobs globally",
    icon: Users,
    image: "/assets/generated/stat-jobs.dim_300x200.png",
  },
  {
    value: "₹6–25 LPA",
    label: "Average salary range in India",
    icon: TrendingUp,
    image: "/assets/generated/stat-salary.dim_300x200.png",
  },
  {
    value: "0% Unemployment",
    label: "In the cybersecurity field",
    icon: Target,
    image: "/assets/generated/stat-employment.dim_300x200.png",
  },
  {
    value: "Every 39 sec",
    label: "A cyberattack occurs globally",
    icon: Zap,
    image: "/assets/generated/stat-attack.dim_300x200.png",
  },
];

const WHY_FEATURES = [
  {
    icon: Layers,
    text: "Structured learning paths (Beginner → Intermediate → Advanced)",
  },
  { icon: BookOpen, text: "Real-world projects and labs" },
  { icon: BriefcaseBusiness, text: "Industry-relevant role-based training" },
  {
    icon: Lightbulb,
    text: "Personalized mentorship and career guidance",
  },
];

const PERSONAS = [
  {
    icon: Lightbulb,
    title: "The Curious Beginner",
    desc: "No tech background? No problem. Start from zero.",
    image: "/assets/generated/persona-beginner.dim_240x180.png",
  },
  {
    icon: Shield,
    title: "The IT Professional",
    desc: "Already in IT? Level up to cybersecurity roles.",
    image: "/assets/generated/persona-it-pro.dim_240x180.png",
  },
  {
    icon: Route,
    title: "The Career Switcher",
    desc: "From any domain to cybersecurity. We'll show you how.",
    image: "/assets/generated/persona-switcher.dim_240x180.png",
  },
  {
    icon: GraduationCap,
    title: "The Student",
    desc: "Build skills before your first job. Stand out from day one.",
    image: "/assets/generated/persona-student.dim_240x180.png",
  },
  {
    icon: Home,
    title: "The Homemaker",
    desc: "Re-entering the workforce? Cybersecurity welcomes you.",
    image: "/assets/generated/persona-homemaker.dim_240x180.png",
  },
  {
    icon: BriefcaseBusiness,
    title: "The Working Professional",
    desc: "Upskill on your own schedule. 5–10 hrs/week is enough.",
    image: "/assets/generated/persona-professional.dim_240x180.png",
  },
];

const PATHS = [
  {
    title: "Beginner Path",
    desc: "Zero to foundational cybersecurity skills. Perfect for non-tech backgrounds.",
    badge: "Start Here",
    badgeClass: "bg-accent/20 text-accent border-accent/40",
    borderClass: "hover:border-accent/60",
    image: "/assets/generated/path-beginner.dim_400x200.png",
  },
  {
    title: "Intermediate Path",
    desc: "Deepen technical skills. Network security, SOC operations, threat analysis.",
    badge: "Level Up",
    badgeClass: "bg-primary/20 text-primary border-primary/40",
    borderClass: "hover:border-primary/60",
    image: "/assets/generated/path-intermediate.dim_400x200.png",
  },
  {
    title: "Advanced Path",
    desc: "Penetration testing, threat hunting, security architecture.",
    badge: "Go Deep",
    badgeClass: "bg-destructive/20 text-destructive border-destructive/40",
    borderClass: "hover:border-destructive/60",
    image: "/assets/generated/path-advanced.dim_400x200.png",
  },
];

const TESTIMONIALS = [
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

const FAQS = [
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
    a: "6–9 months on average, depending on your current knowledge level, the track you choose (Beginner / Intermediate / Advanced), and how much time you can dedicate weekly (5–10 hrs/week is typical).",
  },
  {
    q: "What kinds of jobs can I get after this?",
    a: "Entry-level roles include: Security Operations Center (SOC) Analyst, Information Security Analyst, IT Security Support, GRC Associate. These roles exist across banking, IT, healthcare, e-commerce, and government sectors.",
  },
  {
    q: "Is this course only for students or freshers?",
    a: "No. We train students, working professionals, career switchers, and homemakers re-entering the workforce. Anyone can join — as long as they're willing to learn.",
  },
  {
    q: "Is this aligned with global standards or certifications?",
    a: "We do not offer certification prep (like CEH, CISSP, etc.) right now. Instead, we help you break into cybersecurity. Our focus is on practical, project-based learning that builds foundational and intermediate skills applicable in real-world jobs.",
  },
  {
    q: "What makes Alangh Academy different?",
    a: "Structured learning paths (Beginner → Intermediate → Advanced), real-world projects and labs, industry-relevant role-based training, personalized mentorship and career guidance.",
  },
];

export function Landing() {
  const { data: courses, isLoading } = useAllCourses();
  const { login, isLoggingIn, identity } = useInternetIdentity();

  return (
    <main>
      {/* Section 1: Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <img
          src="/assets/generated/cyber-hero-bg.dim_1920x1080.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
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
              <span className="text-foreground">Cybersecurity isn't</span>
              <br />
              <span className="text-foreground">just for </span>
              <span className="text-primary glow-text">hackers.</span>
              <br />
              <span className="text-foreground">It's for </span>
              <span className="text-accent">everyone!</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Whether you're curious about cybersecurity, switching careers, or
              just getting started — we're here to guide you step-by-step, from
              beginner to job-ready.
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

              {identity ? (
                <Link to="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border/60 hover:border-primary/60"
                    data-ocid="hero.secondary_button"
                  >
                    Browse Courses
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="border-border/60 hover:border-primary/60"
                  data-ocid="hero.login.button"
                >
                  {isLoggingIn ? "Connecting..." : "Start Your Journey"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Career Stats */}
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
            {STATS.map((stat, i) => (
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
                      alt={stat.label}
                      className="w-full h-[120px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
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
                  {/* Decorative banner image with float animation */}
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img
                      src="/assets/generated/path-beginner.dim_400x200.png"
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
            {PERSONAS.map((persona, i) => (
              <motion.div
                key={persona.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                data-ocid={`personas.item.${i + 1}`}
              >
                <Card className="border-border/60 bg-card/50 hover:border-primary/40 hover:bg-card transition-all duration-300 group h-full overflow-hidden">
                  {/* Persona image at top */}
                  <div className="overflow-hidden">
                    <img
                      src={persona.image}
                      alt={persona.title}
                      className="w-full h-[120px] object-cover rounded-t-xl group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                      <persona.icon className="w-6 h-6 text-primary" />
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
            ))}
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
            {PATHS.map((path, i) => (
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
                  {/* Path banner image */}
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
                        Explore Path <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Featured <span className="text-primary glow-text">Courses</span>
              </h2>
              <p className="text-muted-foreground">
                Curated learning paths for every stage of your journey.
              </p>
            </div>
            <Link to="/courses" data-ocid="landing.view-all.link">
              <Button
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-48 rounded-lg"
                  data-ocid="landing.courses.loading_state"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(courses || []).slice(0, 6).map((course, i) => (
                <motion.div
                  key={course.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to="/courses/$id" params={{ id: course.id.toString() }}>
                    <Card
                      className="border-border/60 bg-card/50 hover:border-primary/40 hover:shadow-cyber transition-all duration-300 cursor-pointer h-full group overflow-hidden"
                      data-ocid={`landing.course.item.${i + 1}`}
                    >
                      {/* Course thumbnail */}
                      <div className="overflow-hidden">
                        <img
                          src={COURSE_IMAGES[course.level]}
                          alt={course.title}
                          className="w-full h-[120px] object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <Badge
                            variant="outline"
                            className={`text-xs font-mono ${LEVEL_COLORS[course.level]}`}
                          >
                            {course.level.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="font-display font-semibold mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                          {course.description}
                        </p>
                        <div className="mt-4 flex items-center text-xs text-primary font-mono">
                          View Course <ChevronRight className="w-3 h-3 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}

              {(!courses || courses.length === 0) && (
                <div
                  className="col-span-3 text-center py-12 text-muted-foreground"
                  data-ocid="landing.courses.empty_state"
                >
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Courses loading from the blockchain...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Testimonials */}
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
            {TESTIMONIALS.map((testimonial, i) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: FAQ */}
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
              {FAQS.map((faq, i) => (
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

      {/* Section 8: Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto border border-primary/30 rounded-2xl p-12 bg-card/30 glow-cyan relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-20" />
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
              {identity ? (
                <Link to="/courses">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                    data-ocid="cta.primary_button"
                  >
                    Start Learning Today <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                  data-ocid="cta.login.button"
                >
                  {isLoggingIn ? "Connecting..." : "Start Learning Today"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
