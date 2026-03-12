import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, Tag, User } from "lucide-react";
import { useEffect, useRef } from "react";

const post = {
  title: "Effective System Hardening: A Simple, Practical Playbook",
  summary:
    "Keeping systems secure doesn't have to be complicated. This practical guide covers what to remove, what to lock down, how to monitor, when to patch, and why hardening is an ongoing process.",
  author: "Alangh Infosec",
  date: "June 2025",
  readTime: "4 min read",
  category: "Security Best Practices",
  tags: [
    "CyberSecurity",
    "SystemHardening",
    "DataSecurity",
    "Infosec",
    "SecurityBestPractices",
    "TechPlaybook",
  ],
  linkedinUrl:
    "https://www.linkedin.com/posts/alangh-infosec-pvt-ltd_effective-system-hardening-activity-7336823200019861508-5B4M",
  sections: [
    {
      number: "01",
      heading: "What to Remove",
      body: "Eliminate unnecessary software, services, and open ports that expand your attack surface. Every unused application or service is a potential entry point for attackers. Audit your systems regularly and uninstall anything that isn't actively required for business operations.",
    },
    {
      number: "02",
      heading: "What to Lock Down",
      body: "Enforce the principle of least privilege across all user accounts and services. Disable default credentials, enforce strong password policies, and restrict administrative access to only those who truly need it. Apply firewall rules and network segmentation to limit lateral movement.",
    },
    {
      number: "03",
      heading: "How to Monitor the Right Things",
      body: "Effective monitoring isn't about collecting every log — it's about knowing which signals matter. Set up alerts for privileged account activity, failed authentication attempts, and unexpected outbound connections. Use a SIEM or centralised logging platform to correlate events across your environment.",
    },
    {
      number: "04",
      heading: "When to Patch",
      body: "Missed patches are among the easiest ways for attackers to gain a foothold. Establish a repeatable patch management cycle: critical patches within 24–72 hours, others within your defined SLA. Automate where possible and maintain an inventory of all assets and their patch status.",
    },
    {
      number: "05",
      heading: "Why Hardening Is Never Really 'Done'",
      body: "System hardening isn't a one-time task. New vulnerabilities emerge, configurations drift, and environments change. Treat hardening as a continuous process — re-assess periodically, benchmark against standards like CIS Controls or NIST, and document your baseline so deviations are immediately visible.",
    },
  ],
};

function AnimatedSection({
  children,
  delay = 0,
}: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-6");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-6 transition-all duration-700 ease-out"
    >
      {children}
    </div>
  );
}

export function Blog() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative container mx-auto px-4 py-20 max-w-4xl text-center">
          <Badge
            variant="outline"
            className="mb-4 border-primary/40 text-primary text-xs uppercase tracking-widest"
          >
            Alangh Academy Blog
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Insights from the{" "}
            <span className="text-primary">Security Field</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Practical cybersecurity knowledge from 20+ years of hands-on
            industry experience — written for learners, practitioners, and
            anyone serious about digital security.
          </p>
        </div>
      </section>

      {/* Blog Post */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Article Card Header */}
        <AnimatedSection>
          <article className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden shadow-lg">
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />

            <div className="p-8 md:p-10">
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge className="bg-primary/10 text-primary border border-primary/30 text-xs">
                  {post.category}
                </Badge>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <User className="w-3.5 h-3.5" />
                  {post.author}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 leading-snug">
                {post.title}
              </h2>

              {/* Summary */}
              <p className="text-muted-foreground text-base leading-relaxed mb-8 border-l-2 border-primary/50 pl-4 italic">
                {post.summary}
              </p>

              {/* Intro paragraph */}
              <p className="text-foreground/80 text-base leading-relaxed mb-10">
                Open ports, unnecessary services, and missed patches — these are
                the most common footholds attackers exploit. System hardening
                addresses each of them systematically. Whether you're securing a
                single workstation or an enterprise network, the principles are
                the same. Here's a straightforward, no-jargon guide to doing it
                right.
              </p>

              {/* Sections */}
              <div className="space-y-8">
                {post.sections.map((section) => (
                  <div key={section.number} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                      {section.number}
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {section.heading}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {section.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Closing note */}
              <div className="mt-10 p-5 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-foreground/80 text-sm leading-relaxed">
                  <strong className="text-primary">Remember:</strong> Security
                  is not a destination — it's a practice. Start with the basics,
                  build consistency, and iterate. At Alangh Academy, we teach
                  these exact principles in our structured cybersecurity
                  programs so learners can apply them from day one.
                </p>
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2 items-center">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* LinkedIn source link */}
              <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-muted-foreground">
                  Originally published on{" "}
                  <span className="text-foreground font-medium">LinkedIn</span>{" "}
                  by{" "}
                  <span className="text-primary font-medium">
                    Alangh Infosec
                  </span>
                </div>
                <a
                  href={post.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="blog.linkedin_link"
                  className="inline-flex items-center gap-2 text-xs text-primary border border-primary/30 rounded-full px-4 py-1.5 hover:bg-primary/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View original post
                </a>
              </div>
            </div>
          </article>
        </AnimatedSection>

        {/* More posts placeholder */}
        <AnimatedSection delay={200}>
          <div className="mt-14 text-center">
            <p className="text-muted-foreground text-sm">
              More articles from the Alangh team are on the way. Follow us on{" "}
              <a
                href="https://www.linkedin.com/company/alangh-infosec-pvt-ltd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </a>{" "}
              for the latest insights.
            </p>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}
