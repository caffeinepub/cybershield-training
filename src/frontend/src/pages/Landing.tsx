import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Lock,
  Shield,
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

const FEATURES = [
  {
    icon: Lock,
    title: "Hands-On Labs",
    desc: "Practice real-world attack and defense scenarios in isolated environments.",
  },
  {
    icon: BookOpen,
    title: "Structured Paths",
    desc: "From beginner fundamentals to advanced penetration testing — follow curated paths.",
  },
  {
    icon: Award,
    title: "Certifications",
    desc: "Earn recognized certifications to validate your cybersecurity expertise.",
  },
  {
    icon: Zap,
    title: "Live Threat Intel",
    desc: "Stay current with modules updated weekly as new vulnerabilities emerge.",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    desc: "Learn from senior security engineers with real-world breach response experience.",
  },
  {
    icon: CheckCircle2,
    title: "Progress Tracking",
    desc: "Visual dashboards to keep you accountable and measure skill growth over time.",
  },
];

export function Landing() {
  const { data: courses, isLoading } = useAllCourses();
  const { login, isLoggingIn, identity } = useInternetIdentity();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-cybershield.dim_1200x600.jpg')",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        {/* Floating glows */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/8 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Badge className="mb-6 border-primary/40 bg-primary/10 text-primary font-mono text-xs tracking-widest">
              <span
                className="mr-1.5 w-1.5 h-1.5 rounded-full bg-primary inline-block"
                style={{ animation: "pulse-glow 2s infinite" }}
              />
              NEXT-GEN SECURITY TRAINING
            </Badge>

            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              <span className="text-foreground">Defend.</span>
              <br />
              <span className="text-primary glow-text">Attack.</span>
              <br />
              <span className="text-foreground">Dominate.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Master cybersecurity from the ground up. Structured tracks for
              every level, from password hygiene to zero-day exploitation.
            </p>

            <div className="flex flex-wrap gap-4">
              {identity ? (
                <Link to="/courses">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                    data-ocid="hero.browse.button"
                  >
                    Browse Courses <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                  data-ocid="hero.login.button"
                >
                  {isLoggingIn ? "Connecting..." : "Start Training"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
              <Link to="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/60 hover:border-primary/60"
                  data-ocid="hero.courses.button"
                >
                  View Courses
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why <span className="text-primary glow-text">CyberShield</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built by practitioners, for practitioners. Every module reflects
              real-world threat scenarios.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border-border/60 bg-card/50 hover:border-primary/40 hover:bg-card transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-cyan transition-all">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
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
                      className="border-border/60 bg-card/50 hover:border-primary/40 hover:shadow-cyber transition-all duration-300 cursor-pointer h-full"
                      data-ocid={`landing.course.item.${i + 1}`}
                    >
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

      {/* CTA */}
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
                Ready to level up your security skills?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of security professionals on CyberShield.
              </p>
              {!identity && (
                <Button
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                  data-ocid="cta.login.button"
                >
                  {isLoggingIn ? "Connecting..." : "Get Started Free"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
