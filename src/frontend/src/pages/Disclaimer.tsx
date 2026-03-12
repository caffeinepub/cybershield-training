import { useEffect, useRef } from "react";

const sections = [
  {
    id: "educational-purpose",
    title: "1. Educational Purpose Only",
    content: (
      <>
        <p className="mb-3">
          All content, materials, courses, and resources provided by Alangh
          Academy LLP are intended solely for educational and training purposes.
          While we strive to ensure accuracy and quality, the information
          provided should not be considered as:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-3">
          <li>Professional or legal advice,</li>
          <li>A guarantee of specific outcomes, or</li>
          <li>A substitute for independent research or industry experience.</li>
        </ul>
        <p>
          Learners are responsible for applying their knowledge responsibly and
          in compliance with applicable laws and regulations.
        </p>
      </>
    ),
  },
  {
    id: "no-employment-guarantee",
    title: "2. No Employment Guarantee",
    content: (
      <>
        <p className="mb-3">
          Alangh Academy LLP provides structured learning paths, mentorship, and
          real-world projects to enhance employability. However, we make no
          guarantee of employment, job placement, or career advancement upon
          completion of our programs. Career outcomes depend on factors beyond
          our control, including:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Your background, prior experience, and personal effort,</li>
          <li>Market conditions and demand in your region, and</li>
          <li>Employer-specific hiring practices.</li>
        </ul>
      </>
    ),
  },
  {
    id: "certifications",
    title: "3. Certifications and Industry Standards",
    content: (
      <p>
        We are not an industry certification training provider. Our programs are
        designed to build foundational and advanced skills that can support
        learners in preparing for globally recognized certifications (such as
        CompTIA Security+, CEH, CISSP, OSCP, etc.). Passing any certification
        exams is the responsibility of the learner and is subject to the terms
        and requirements of the issuing body.
      </p>
    ),
  },
  {
    id: "tools-labs",
    title: "4. Use of Tools, Labs, and Software",
    content: (
      <>
        <p className="mb-3">
          During training, learners may be introduced to third-party tools,
          labs, or platforms (e.g., VAPT tools, security software, simulation
          environments). We do not control these third-party services and are
          not responsible for:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-3">
          <li>Their availability, accuracy, or performance,</li>
          <li>Any damages caused by their misuse, or</li>
          <li>
            Any licensing requirements or restrictions imposed by third parties.
          </li>
        </ul>
        <p>Learners are expected to use such tools ethically and legally.</p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "5. Limitation of Liability",
    content: (
      <>
        <p className="mb-3">
          To the fullest extent permitted by law, Alangh Academy LLP, its
          directors, instructors, employees, and affiliates shall not be liable
          for any:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-3">
          <li>
            Direct, indirect, incidental, consequential, or punitive damages,
          </li>
          <li>Loss of data, business, income, or reputation,</li>
          <li>
            Security incidents, breaches, or damages arising from misuse of
            information learned through our training.
          </li>
        </ul>
        <p>
          You agree to use the knowledge gained at your own risk and
          responsibility.
        </p>
      </>
    ),
  },
  {
    id: "accuracy",
    title: "6. Accuracy of Information",
    content: (
      <>
        <p className="mb-3">
          While every effort is made to keep course content and website
          information accurate and up to date, we make no warranties or
          representations about:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-3">
          <li>The completeness or reliability of content,</li>
          <li>The suitability of material for any specific purpose, or</li>
          <li>The uninterrupted availability of our website or platforms.</li>
        </ul>
        <p>
          We reserve the right to update or modify training materials, features,
          or course structures at any time without prior notice.
        </p>
      </>
    ),
  },
  {
    id: "external-links",
    title: "7. External Links",
    content: (
      <p>
        Our website and course materials may contain links to third-party
        websites. These links are provided for convenience only. We do not
        endorse or assume responsibility for the content, accuracy, or policies
        of third-party sites. Accessing such sites is at your own risk.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "8. Governing Law",
    content: (
      <p>
        This Disclaimer shall be governed by and construed in accordance with
        the laws of India. Any disputes shall fall under the exclusive
        jurisdiction of the courts in NOIDA, India.
      </p>
    ),
  },
  {
    id: "contact",
    title: "9. Contact Us",
    content: (
      <>
        <p className="mb-2">
          If you have any questions regarding this Disclaimer, please contact us
          at:
        </p>
        <p className="font-semibold">Alangh Academy LLP</p>
        <p>
          Email:{" "}
          <a
            href="mailto:info@alangh.com"
            className="text-primary hover:underline"
          >
            info@alangh.com
          </a>
        </p>
      </>
    ),
  },
];

export function Disclaimer() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const el of sectionRefs.current) {
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("opacity-100", "translate-y-0");
            el.classList.remove("opacity-0", "translate-y-6");
            obs.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => {
      for (const o of observers) o.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-b from-primary/10 via-background to-background border-b border-border/40">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
            Legal
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Disclaimer
          </h1>
          <p className="text-muted-foreground text-lg">
            This Disclaimer applies to the website, online platforms, courses,
            and training programs offered by Alangh Academy LLP. By accessing
            our website or participating in our programs, you acknowledge and
            agree to the terms outlined below.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-10">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
            className="opacity-0 translate-y-6 transition-all duration-700 ease-out bg-card/40 border border-border/50 rounded-xl p-6 md:p-8"
          >
            <h2 className="text-xl font-bold text-primary mb-4">{sec.title}</h2>
            <div className="text-muted-foreground leading-relaxed">
              {sec.content}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
