import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Headphones,
  LayoutGrid,
  PhoneCall,
  Rocket,
  Shield,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

const WHY_FEATURES = [
  {
    icon: LayoutGrid,
    title: "Tailored Programs",
    desc: "We assess your team's skills, risks, and goals, then design a program that fits.",
  },
  {
    icon: Users,
    title: "Hands-On & Role-Based",
    desc: "From SOC analysts to compliance teams, we provide labs, simulations, and real-world exercises.",
  },
  {
    icon: Shield,
    title: "Industry-Experienced Trainers",
    desc: "Our faculty has decades of frontline cybersecurity experience.",
  },
  {
    icon: Rocket,
    title: "Scalable Delivery",
    desc: "Train 10 or 1,000 employees with live online, hybrid, or onsite formats.",
  },
  {
    icon: ClipboardList,
    title: "Measurable Outcomes",
    desc: "Assessments, reports, and metrics to track ROI and progress.",
  },
  {
    icon: Headphones,
    title: "Continuous Support",
    desc: "Ongoing updates, refresher sessions, and advisory support.",
  },
];

const PROGRAMS = [
  {
    title: "Cyber Awareness & Cyber Hygiene Programs",
    desc: "Build a culture of security across the workforce.",
  },
  {
    title: "Security Awareness & Phishing Simulation Training",
    desc: "Reduce risks from phishing and social engineering.",
  },
  {
    title: "Technical Upskilling Programs",
    desc: "Penetration testing, cloud security, incident response, threat hunting.",
  },
  {
    title: "Red Team & Blue Team Workshops",
    desc: "Realistic simulations for technical defense teams.",
  },
  {
    title: "Compliance & Governance Training",
    desc: "ISO 27001, GDPR, PCI-DSS, HIPAA, and more.",
  },
  {
    title: "Team Assessments & Readiness Audits",
    desc: "Identify gaps before training begins.",
  },
  {
    title: "Post-Training Consultation & Retention",
    desc: "Strategies to sustain outcomes.",
  },
];

const STEPS = [
  {
    icon: PhoneCall,
    title: "Discovery Call",
    desc: "Understand your organization's needs.",
  },
  {
    icon: FileText,
    title: "Proposal & Curriculum Design",
    desc: "Tailored plan, timeline, and pricing.",
  },
  {
    icon: Rocket,
    title: "Delivery & Execution",
    desc: "Live, hybrid, or onsite formats.",
  },
  {
    icon: ClipboardList,
    title: "Assessment & Reporting",
    desc: "Track progress with metrics and certificates.",
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    desc: "Continuous learning and updates.",
  },
];

const BENEFICIARIES = [
  "Small & medium businesses and large enterprises",
  "Government and public sector agencies",
  "Universities and vocational training institutions",
  "Startups building in-house security protocols early",
];

const TRAINING_AREAS = [
  "Security Awareness & Phishing Defense",
  "Cloud Security",
  "Penetration Testing / Ethical Hacking",
  "Incident Response & Threat Hunting",
  "Governance, Risk & Compliance (ISO, GDPR, PCI)",
  "Customized modules",
];

export function CorporateTraining() {
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    industry: "",
    employees: "",
    delivery: "",
    details: "",
  });

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  };

  const PERSONAL_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "icloud.com",
    "live.com",
    "msn.com",
    "me.com",
    "mail.com",
    "protonmail.com",
    "ymail.com",
    "rediffmail.com",
    "inbox.com",
    "zohomail.com",
    "gmx.com",
    "yandex.com",
    "tutanota.com",
  ];

  const validateWorkEmail = (email: string): boolean => {
    const domain = email.split("@")[1]?.toLowerCase() ?? "";
    return !PERSONAL_DOMAINS.includes(domain);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateWorkEmail(form.email)) {
      setEmailError(
        "Please use a work email address. Personal email domains (Gmail, Yahoo, etc.) are not accepted.",
      );
      return;
    }
    setEmailError("");
    setSubmitted(true);
  };

  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden min-h-[60vh] flex items-center py-24"
        data-ocid="corporate.hero.section"
      >
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-accent/6 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <Badge className="mb-6 border-primary/40 bg-primary/10 text-primary font-mono text-xs tracking-widest">
              <Building2 className="w-3 h-3 mr-1.5" />
              ENTERPRISE & CORPORATE SOLUTIONS
            </Badge>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
              Corporate{" "}
              <span className="text-primary glow-text">
                Cybersecurity Training
              </span>
              <br />
              <span className="text-accent">& Enterprise Solutions</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl leading-relaxed">
              When organizations need cybersecurity skills development at scale,
              off-the-shelf courses often fall short. Alangh Academy's corporate
              cybersecurity training is designed to fill that gap with
              customized programs, real-world labs, and measurable outcomes.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                onClick={handleScrollToForm}
                data-ocid="corporate.enquire.primary_button"
              >
                Enquire Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Companies Choose Alangh Academy */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Companies Choose{" "}
              <span className="text-primary glow-text">Alangh Academy</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We don't deliver generic training. We build programs your team
              actually needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border-border/60 bg-card/60 hover:border-primary/40 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                      <feat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs We Offer */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Corporate Cybersecurity{" "}
              <span className="text-primary glow-text">Programs We Offer</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {PROGRAMS.map((prog, i) => (
              <motion.div
                key={prog.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-start gap-4 p-5 rounded-xl border border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card/70 transition-all duration-300">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      {prog.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{prog.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How Our Corporate Training{" "}
              <span className="text-primary glow-text">Works</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-6 top-8 bottom-8 w-px bg-primary/20 hidden md:block" />
              <div className="space-y-6">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-6"
                  >
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center">
                      <span className="font-display font-bold text-primary text-sm">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 p-5 rounded-xl border border-border/60 bg-card/40 hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <step.icon className="w-5 h-5 text-accent" />
                        <h3 className="font-display font-bold text-lg">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizations That Benefit */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Organizations That{" "}
                <span className="text-primary glow-text">Benefit</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                From startups to governments — cybersecurity training is for
                every organization.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFICIARIES.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-5 rounded-xl border border-border/60 bg-card/40 hover:border-primary/40 transition-all"
                >
                  <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Talk + Enquiry Form */}
      <section
        className="py-24 bg-secondary/20"
        ref={formRef}
        data-ocid="corporate.enquiry_form.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="text-primary glow-text">Talk?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              If your organization is serious about building cyber resilience,
              let's connect.
            </p>
            <Button
              size="lg"
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
              onClick={handleScrollToForm}
              data-ocid="corporate.enquire.secondary_button"
            >
              Enquire Now <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="border border-primary/20 rounded-2xl p-8 bg-card/40 relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-10" />
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                      data-ocid="corporate.form.success_state"
                    >
                      <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
                      <h3 className="font-display text-2xl font-bold mb-3">
                        Enquiry Received!
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Thank you for reaching out. Our team will review your
                        requirements and get back to you within 1-2 business
                        days.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                          <Label htmlFor="fullName">
                            Full Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            required
                            value={form.fullName}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                              }))
                            }
                            className="border-border/60 bg-background/50 focus:border-primary/60"
                            placeholder="Your full name"
                            data-ocid="corporate.fullname.input"
                          />
                        </div>

                        {/* Company */}
                        <div className="space-y-2">
                          <Label htmlFor="company">
                            Company / Organization Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="company"
                            required
                            value={form.company}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                company: e.target.value,
                              }))
                            }
                            className="border-border/60 bg-background/50 focus:border-primary/60"
                            placeholder="Your official organization name."
                            data-ocid="corporate.company.input"
                          />
                        </div>

                        {/* Work Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Work Email{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={form.email}
                            className={`border-border/60 bg-background/50 focus:border-primary/60${emailError ? " border-destructive" : ""}`}
                            placeholder="We'll send the proposal and follow-up here."
                            data-ocid="corporate.email.input"
                            onChange={(e) => {
                              setForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }));
                              if (emailError) setEmailError("");
                            }}
                          />
                          {emailError && (
                            <p className="text-xs text-destructive mt-1">
                              {emailError}
                            </p>
                          )}
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-2">
                          <Label htmlFor="phone">Contact Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="border-border/60 bg-background/50 focus:border-primary/60"
                            placeholder="Optional"
                            data-ocid="corporate.phone.input"
                          />
                        </div>

                        {/* Industry */}
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry / Sector</Label>
                          <Input
                            id="industry"
                            value={form.industry}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                industry: e.target.value,
                              }))
                            }
                            className="border-border/60 bg-background/50 focus:border-primary/60"
                            placeholder="E.g., IT, Finance, Healthcare, Education..."
                            data-ocid="corporate.industry.input"
                          />
                        </div>

                        {/* Number of Employees */}
                        <div className="space-y-2">
                          <Label>
                            Number of Employees to be Trained{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            required
                            value={form.employees}
                            onValueChange={(v) =>
                              setForm((prev) => ({ ...prev, employees: v }))
                            }
                          >
                            <SelectTrigger
                              className="border-border/60 bg-background/50 focus:border-primary/60"
                              data-ocid="corporate.employees.select"
                            >
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5-10">5–10</SelectItem>
                              <SelectItem value="11-25">11–25</SelectItem>
                              <SelectItem value="26-50">26–50</SelectItem>
                              <SelectItem value="51-200">51–200</SelectItem>
                              <SelectItem value="200+">200+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Training Areas */}
                      <div className="space-y-3">
                        <Label>Training Areas of Interest (Optional)</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {TRAINING_AREAS.map((area, i) => (
                            <div
                              key={area}
                              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background/30 hover:border-primary/40 transition-all"
                            >
                              <Checkbox
                                id={`area-${i}`}
                                checked={selectedAreas.includes(area)}
                                onCheckedChange={() => toggleArea(area)}
                                className="border-border/60"
                                data-ocid={`corporate.training_area.checkbox.${i + 1}`}
                              />
                              <Label
                                htmlFor={`area-${i}`}
                                className="text-sm cursor-pointer"
                              >
                                {area}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preferred Delivery Mode */}
                      <div className="space-y-2">
                        <Label>Preferred Mode of Delivery (Optional)</Label>
                        <Select
                          value={form.delivery}
                          onValueChange={(v) =>
                            setForm((prev) => ({ ...prev, delivery: v }))
                          }
                        >
                          <SelectTrigger
                            className="border-border/60 bg-background/50 focus:border-primary/60"
                            data-ocid="corporate.delivery.select"
                          >
                            <SelectValue placeholder="Select delivery mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="live-online">
                              Live Online
                            </SelectItem>
                            <SelectItem value="hybrid">
                              Hybrid (Online + Onsite)
                            </SelectItem>
                            <SelectItem value="onsite">
                              Onsite at Organization
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-2">
                        <Label htmlFor="details">Additional Details</Label>
                        <Textarea
                          id="details"
                          rows={5}
                          value={form.details}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              details: e.target.value,
                            }))
                          }
                          className="border-border/60 bg-background/50 focus:border-primary/60 resize-none"
                          placeholder="Share anything else about your training needs."
                          data-ocid="corporate.details.textarea"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                        data-ocid="corporate.submit.button"
                      >
                        Send Enquiry <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
