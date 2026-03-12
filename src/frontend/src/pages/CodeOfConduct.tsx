import { useEffect, useRef, useState } from "react";

const sections = [
  {
    number: "1",
    title: "Respect and Professionalism",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li>
          Treat all participants, instructors, and staff with respect, courtesy,
          and professionalism at all times.
        </li>
        <li>
          Discriminatory, abusive, or offensive remarks based on race, gender,
          religion, age, nationality, or any other characteristic will not be
          tolerated.
        </li>
        <li>
          Harassment, intimidation, or disruptive behaviour in live classes,
          group discussions, or community channels is strictly prohibited.
        </li>
      </ul>
    ),
  },
  {
    number: "2",
    title: "Academic Integrity",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li>
          Learners are expected to engage honestly with all training content.
        </li>
        <li>
          Plagiarism, cheating, or misrepresentation in assignments, projects,
          or assessments is a violation of this Code.
        </li>
        <li>
          Sharing or distributing exam questions, lab credentials, or project
          solutions without authorization is prohibited.
        </li>
      </ul>
    ),
  },
  {
    number: "3",
    title: "Use of Course Material",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li>
          All training material (videos, slides, labs, projects, handbooks,
          recordings) is intellectual property of Alangh Academy LLP.
        </li>
        <li>Learners may use the material only for their personal learning.</li>
        <li>
          Unauthorized reproduction, redistribution, or commercial use of course
          material is strictly prohibited and may result in legal action.
        </li>
      </ul>
    ),
  },
  {
    number: "4",
    title: "Conduct in Live Sessions",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li>Join sessions on time and avoid disruptions during class.</li>
        <li>
          Keep microphones muted when not speaking and use chat features
          responsibly.
        </li>
        <li>
          Respect the trainer's instructions and allow equal participation for
          all learners.
        </li>
        <li>
          Repeated disruption of live classes may result in removal without
          refund.
        </li>
      </ul>
    ),
  },
  {
    number: "5",
    title:
      "Community Group Guidelines (WhatsApp, Telegram, Arattai, or Similar Platforms)",
    content: (
      <>
        <p className="text-muted-foreground mb-3">
          To ensure effective communication and a safe environment, the
          following rules apply to all community groups managed by Alangh
          Academy:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            Groups are for learning-related discussions, announcements, and peer
            support only.
          </li>
          <li>
            Promotional, irrelevant, or spam content (including job ads,
            services, personal businesses) is not allowed.
          </li>
          <li>
            Respect others' privacy. Do not share screenshots, phone numbers, or
            personal details outside the group.
          </li>
          <li>
            Offensive language, political debates, hate speech, or harassment of
            any kind will lead to immediate removal.
          </li>
          <li>
            Direct messaging trainers or staff outside the group without consent
            is discouraged unless explicitly allowed for mentorship.
          </li>
          <li>
            The Company reserves the right to monitor, moderate, and remove
            content that violates these rules, and to remove or permanently ban
            violators from community groups.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "6",
    title: "Responsible Use of Technology",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li>
          Learners must use lab access, tools, or practical exercises ethically
          and legally.
        </li>
        <li>
          Any attempt to misuse training labs, hack external systems, or engage
          in unlawful activity will result in termination without refund and may
          be reported to authorities.
        </li>
      </ul>
    ),
  },
  {
    number: "7",
    title: "Disciplinary Action",
    content: (
      <>
        <p className="text-muted-foreground mb-3">
          Violations of this Code may result in:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Verbal or written warnings.</li>
          <li>
            Temporary or permanent removal from classes or community groups.
          </li>
          <li>Termination of course access without refund.</li>
          <li>
            Legal action in cases of intellectual property theft, harassment, or
            unlawful activity.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "8",
    title: "Reporting Concerns",
    content: (
      <p className="text-muted-foreground">
        If you experience or witness any violation of this Code of Conduct,
        please report it immediately to{" "}
        <a
          href="mailto:info@alangh.com"
          className="text-primary hover:underline"
        >
          info@alangh.com
        </a>
        . All complaints will be treated seriously and handled confidentially.
      </p>
    ),
  },
  {
    number: "9",
    title: "Acceptance of Guidelines",
    content: (
      <p className="text-muted-foreground">
        By enrolling in any program, joining community groups, or participating
        in training activities of Alangh Academy, you confirm that you have
        read, understood, and agreed to abide by this Code of Conduct &amp;
        Community Guidelines.
      </p>
    ),
  },
];

function AnimatedSection({
  children,
  delay = 0,
}: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </div>
  );
}

export function CodeOfConduct() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-background to-card/40 border-b border-border/40">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
              Community Standards
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Code of Conduct &amp; Community Guidelines
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              At Alangh Academy LLP, we are committed to creating a safe,
              respectful, and professional learning environment for all
              learners, trainers, mentors, and staff. By enrolling in our
              programs, participating in live sessions, or joining our online
              communities, you agree to abide by the following Code of Conduct.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          {sections.map((section, i) => (
            <AnimatedSection key={section.number} delay={i * 60}>
              <div className="bg-card/40 border border-border/50 rounded-xl p-6 md:p-8 hover:border-primary/30 transition-colors">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                    {section.number}
                  </span>
                  {section.title}
                </h2>
                {section.content}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  );
}
