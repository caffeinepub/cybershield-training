import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Shield,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  profile: string;
  reason: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const COURSES = [
  {
    id: "beginner",
    title: "HackStart™ — Beginner",
    subtitle: "Zero to Foundations",
    description:
      "Perfect for those with no prior cybersecurity knowledge. Build solid foundations in networking, security concepts, and ethical hacking basics.",
    chapters: 10,
    duration: "3 months",
    level: "Beginner",
    color: "emerald",
    icon: Shield,
  },
  {
    id: "intermediate",
    title: "CyberElevate™ — Intermediate",
    subtitle: "Skills to Job-Ready",
    description:
      "For those with basic IT knowledge ready to go deeper. Master VAPT, SOC operations, threat hunting, and real-world incident response.",
    chapters: 13,
    duration: "4 months",
    level: "Intermediate",
    color: "cyan",
    icon: Star,
  },
];

export function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "enroll" | "done">("form");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    profile: "",
    reason: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState("");

  useEffect(() => {
    if (step === "done") {
      const timer = setTimeout(() => {
        navigate({ to: "/self-assessment" });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!form.address.trim())
      newErrors.address = "Correspondence address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep("enroll");
    }
  };

  const handleEnroll = () => {
    if (!selectedCourse) {
      setEnrollError("Please select a course to continue.");
      return;
    }
    const courseLabel =
      COURSES.find((c) => c.id === selectedCourse)?.title ?? selectedCourse;

    // Save registration + enrollment to localStorage
    const existing: unknown[] = JSON.parse(
      localStorage.getItem("alangh_registrations") || "[]",
    );
    const newReg = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      profile: form.profile,
      reason: form.reason,
      registeredAt: new Date().toISOString(),
      enrolledCourse: courseLabel,
      score: undefined,
    };
    const idx = (existing as { email: string }[]).findIndex(
      (r) => r.email === form.email,
    );
    if (idx >= 0) {
      (existing as Record<string, unknown>[])[idx] = newReg;
    } else {
      existing.push(newReg);
    }
    localStorage.setItem("alangh_registrations", JSON.stringify(existing));

    setStep("done");
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <main className="relative min-h-screen py-16">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-5">
              <Shield
                className="w-8 h-8 text-primary"
                style={{ animation: "float 4s ease-in-out infinite" }}
              />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Register for{" "}
              <span className="text-primary glow-text">
                Cybersecurity Training
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Take the first step toward your cybersecurity career. Fill in your
              details below and we'll be in touch.
            </p>
          </div>

          {/* Step indicator */}
          {step !== "done" && (
            <div className="flex items-center justify-center gap-3 mb-8">
              {["Register", "Select Course"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      (i === 0 && step === "form") ||
                      (i === 1 && step === "enroll")
                        ? "bg-primary border-primary text-primary-foreground"
                        : i === 0 && step === "enroll"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "border-border/60 text-muted-foreground"
                    }`}
                  >
                    {i === 0 && step === "enroll" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      (i === 0 && step === "form") ||
                      (i === 1 && step === "enroll")
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {i === 0 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1 — Registration form */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-border/60 bg-card/60 shadow-cyber">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-xl text-muted-foreground font-normal">
                      All fields marked{" "}
                      <span className="text-destructive">*</span> are required
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-6"
                    >
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className={`border-border/60 focus-visible:ring-primary ${
                            errors.name
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          data-ocid="register.name.input"
                        />
                        {errors.name && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.name.error_state"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold"
                        >
                          Email Address{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className={`border-border/60 focus-visible:ring-primary ${
                            errors.email
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          data-ocid="register.email.input"
                        />
                        {errors.email && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.email.error_state"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-semibold"
                        >
                          Phone Number{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={form.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className={`border-border/60 focus-visible:ring-primary ${
                            errors.phone
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          data-ocid="register.phone.input"
                        />
                        {errors.phone && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.phone.error_state"
                          >
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-sm font-semibold"
                        >
                          Correspondence Address{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Enter your full correspondence address"
                          rows={3}
                          value={form.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                          className={`border-border/60 focus-visible:ring-primary resize-none ${
                            errors.address
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          data-ocid="register.address.textarea"
                        />
                        {errors.address && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="register.address.error_state"
                          >
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Profile / Work Experience */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="profile"
                          className="text-sm font-semibold"
                        >
                          Tell us about yourself and your work experience
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Share your educational background, current role, and
                          any relevant experience.
                        </p>
                        <Textarea
                          id="profile"
                          placeholder="E.g. I'm a commerce graduate currently working as a data entry operator..."
                          rows={5}
                          value={form.profile}
                          onChange={(e) =>
                            handleChange("profile", e.target.value)
                          }
                          className="border-border/60 focus-visible:ring-primary resize-none"
                          data-ocid="register.profile.textarea"
                        />
                      </div>

                      {/* Enrollment Reason */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="reason"
                          className="text-sm font-semibold"
                        >
                          Why do you want to enroll for cybersecurity training?
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Tell us your goals, motivations, and what you hope to
                          achieve from this program.
                        </p>
                        <Textarea
                          id="reason"
                          placeholder="E.g. I want to switch careers into cybersecurity..."
                          rows={5}
                          value={form.reason}
                          onChange={(e) =>
                            handleChange("reason", e.target.value)
                          }
                          className="border-border/60 focus-visible:ring-primary resize-none"
                          data-ocid="register.reason.textarea"
                        />
                      </div>

                      {/* Submit */}
                      <div className="pt-2">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                          data-ocid="register.submit_button"
                        >
                          Continue to Course Enrollment
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 2 — Course enrollment */}
            {step === "enroll" && (
              <motion.div
                key="enroll"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-border/60 bg-card/60 shadow-cyber">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl">
                      Select Your Course
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Hi{" "}
                      <span className="text-foreground font-medium">
                        {form.name}
                      </span>
                      , choose the course that best matches your current level.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {COURSES.map((course) => {
                      const Icon = course.icon;
                      const isSelected = selectedCourse === course.id;
                      return (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => {
                            setSelectedCourse(course.id);
                            setEnrollError("");
                          }}
                          className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
                            isSelected
                              ? course.color === "emerald"
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-cyan-400 bg-cyan-400/10"
                              : "border-border/60 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40"
                          }`}
                          data-ocid={`register.course.${course.id}.card`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                course.color === "emerald"
                                  ? "bg-emerald-500/15 border border-emerald-500/30"
                                  : "bg-cyan-400/15 border border-cyan-400/30"
                              }`}
                            >
                              <Icon
                                className={`w-6 h-6 ${
                                  course.color === "emerald"
                                    ? "text-emerald-400"
                                    : "text-cyan-400"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-display font-bold text-lg">
                                  {course.title}
                                </h3>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                                    course.color === "emerald"
                                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                                      : "border-cyan-400/40 text-cyan-400 bg-cyan-400/10"
                                  }`}
                                >
                                  {course.level}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {course.description}
                              </p>
                              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                                <span>
                                  <BookOpen className="w-3 h-3 inline mr-1" />
                                  {course.chapters} chapters
                                </span>
                                <span>⏱ {course.duration}</span>
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-all ${
                                isSelected
                                  ? course.color === "emerald"
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-cyan-400 bg-cyan-400"
                                  : "border-border/60"
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}

                    {enrollError && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="register.enroll.error_state"
                      >
                        {enrollError}
                      </p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setStep("form")}
                        className="border-border/60"
                        data-ocid="register.enroll.back_button"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleEnroll}
                        size="lg"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold"
                        data-ocid="register.enroll.submit_button"
                      >
                        Confirm Enrollment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 3 — Success */}
            {step === "done" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  className="border-accent/40 bg-accent/5 text-center"
                  data-ocid="register.success_state"
                >
                  <CardContent className="py-16 px-8">
                    <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="font-display text-2xl font-bold mb-3 text-foreground">
                      You're Enrolled!
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Registration and course enrollment successful! Redirecting
                      to your self-assessment...
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                      Preparing your personalized cybersecurity self-assessment.
                      Please wait a moment...
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
