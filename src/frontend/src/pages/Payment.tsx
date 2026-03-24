import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CreditCard,
  Home,
  Lock,
  Shield,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Registration {
  name: string;
  email: string;
  phone: string;
  address: string;
  profile: string;
  reason: string;
  registeredAt: string;
  enrolledCourse: string;
  score?: number;
}

const COURSE_META: Record<
  string,
  { level: string; color: string; chapters: number; duration: string }
> = {
  "HackStart™ — Beginner": {
    level: "Beginner",
    color: "emerald",
    chapters: 10,
    duration: "3 months",
  },
  "CyberElevate™ — Intermediate": {
    level: "Intermediate",
    color: "cyan",
    chapters: 13,
    duration: "4 months",
  },
};

function getCourseMeta(courseName: string) {
  for (const key of Object.keys(COURSE_META)) {
    if (courseName.includes(key) || key.includes(courseName)) {
      return COURSE_META[key];
    }
  }
  // Fallback by keyword
  if (
    courseName.toLowerCase().includes("beginner") ||
    courseName.toLowerCase().includes("hackstart")
  ) {
    return COURSE_META["HackStart™ — Beginner"];
  }
  if (
    courseName.toLowerCase().includes("intermediate") ||
    courseName.toLowerCase().includes("cyberelevate")
  ) {
    return COURSE_META["CyberElevate™ — Intermediate"];
  }
  return { level: "Course", color: "cyan", chapters: 10, duration: "3 months" };
}

export function Payment() {
  const [registration, setRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    const all: Registration[] = JSON.parse(
      localStorage.getItem("alangh_registrations") || "[]",
    );
    const currentEmail = sessionStorage.getItem("alangh_current_email");
    let reg: Registration | null = null;
    if (currentEmail) {
      reg = all.find((r) => r.email === currentEmail) ?? null;
    }
    if (!reg && all.length > 0) {
      reg = all[all.length - 1];
    }
    setRegistration(reg);
  }, []);

  const courseName = registration?.enrolledCourse ?? "Your Enrolled Course";
  const meta = getCourseMeta(courseName);

  return (
    <main className="relative min-h-screen py-16">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-5">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Enrollment{" "}
              <span className="text-primary glow-text">Confirmation</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Your course enrollment has been received. Review the details below
              and proceed to your self-assessment.
            </p>
          </div>

          {/* Payment Coming Soon Banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-8"
            data-ocid="payment.success_state"
          >
            <div className="flex items-start gap-4 rounded-xl border border-primary/40 bg-primary/8 px-5 py-4">
              <div className="flex-shrink-0 mt-0.5">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-primary text-sm mb-1">
                  🔒 Payment Gateway Integration Coming Soon
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our payment system is currently being set up. Your enrollment
                  has been confirmed and{" "}
                  <span className="text-foreground font-medium">
                    our team will contact you with fee and payment details
                    shortly.
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left — Order Summary + Billing */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
              >
                <Card className="border-border/60 bg-card/60 shadow-cyber">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Course Info */}
                    <div
                      className={`rounded-lg border p-4 ${
                        meta.color === "emerald"
                          ? "border-emerald-500/30 bg-emerald-500/8"
                          : "border-cyan-400/30 bg-cyan-400/8"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm leading-snug">
                          {courseName}
                        </h3>
                        <Badge
                          className={`text-xs shrink-0 ${
                            meta.color === "emerald"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-cyan-400/15 text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/25"
                          }`}
                          variant="outline"
                        >
                          {meta.level}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>
                          <BookOpen className="w-3 h-3 inline mr-1" />
                          {meta.chapters} chapters
                        </span>
                        <span>⏱ {meta.duration}</span>
                      </div>
                    </div>

                    <Separator className="border-border/40" />

                    {/* Price row */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Program Fee
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        ₹ — Contact for pricing
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Taxes & Levies
                      </span>
                      <span className="text-sm text-muted-foreground">
                        As applicable
                      </span>
                    </div>

                    <Separator className="border-border/40" />

                    <div className="rounded-lg bg-muted/30 border border-border/40 px-3 py-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Final fee details will be shared by our team after
                          enrollment confirmation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Billing Information */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28, duration: 0.45 }}
              >
                <Card className="border-border/60 bg-card/60 shadow-cyber">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-lg">
                      Billing Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Full Name
                      </Label>
                      <Input
                        value={registration?.name ?? ""}
                        readOnly
                        className="border-border/40 bg-muted/20 text-muted-foreground cursor-not-allowed"
                        data-ocid="payment.name.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        Email Address
                      </Label>
                      <Input
                        value={registration?.email ?? ""}
                        readOnly
                        className="border-border/40 bg-muted/20 text-muted-foreground cursor-not-allowed"
                        data-ocid="payment.email.input"
                      />
                    </div>
                    {registration?.phone && (
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                          Phone
                        </Label>
                        <Input
                          value={registration.phone}
                          readOnly
                          className="border-border/40 bg-muted/20 text-muted-foreground cursor-not-allowed"
                          data-ocid="payment.phone.input"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right — Payment Details (mock) */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
            >
              <Card className="border-border/60 bg-card/60 shadow-cyber h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Details
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Payment gateway integration coming soon. Fields shown for
                    reference only.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Card payment section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">
                        Credit / Debit Card
                      </span>
                      <div className="ml-auto flex items-center gap-1.5">
                        {["VISA", "MC", "RuPay"].map((c) => (
                          <span
                            key={c}
                            className="text-[10px] px-1.5 py-0.5 border border-border/40 rounded text-muted-foreground bg-muted/20"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          Card Number
                        </Label>
                        <Input
                          disabled
                          placeholder="4242 4242 4242 4242"
                          className="border-border/30 bg-muted/10 text-muted-foreground/50 cursor-not-allowed placeholder:text-muted-foreground/30"
                          data-ocid="payment.card_number.input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            Expiry (MM/YY)
                          </Label>
                          <Input
                            disabled
                            placeholder="MM/YY"
                            className="border-border/30 bg-muted/10 text-muted-foreground/50 cursor-not-allowed placeholder:text-muted-foreground/30"
                            data-ocid="payment.expiry.input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            CVV
                          </Label>
                          <Input
                            disabled
                            placeholder="•••"
                            className="border-border/30 bg-muted/10 text-muted-foreground/50 cursor-not-allowed placeholder:text-muted-foreground/30"
                            data-ocid="payment.cvv.input"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          Cardholder Name
                        </Label>
                        <Input
                          disabled
                          placeholder="As printed on card"
                          className="border-border/30 bg-muted/10 text-muted-foreground/50 cursor-not-allowed placeholder:text-muted-foreground/30"
                          data-ocid="payment.card_name.input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center gap-3">
                    <Separator className="flex-1 border-border/40" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      or
                    </span>
                    <Separator className="flex-1 border-border/40" />
                  </div>

                  {/* UPI section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">UPI Payment</span>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 border border-border/40 rounded text-muted-foreground bg-muted/20">
                        GPay / PhonePe / Paytm
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        UPI ID
                      </Label>
                      <Input
                        disabled
                        placeholder="yourname@upi"
                        className="border-border/30 bg-muted/10 text-muted-foreground/50 cursor-not-allowed placeholder:text-muted-foreground/30"
                        data-ocid="payment.upi.input"
                      />
                    </div>
                  </div>

                  {/* Secure badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      256-bit SSL encryption · PCI-DSS compliant gateway
                    </span>
                  </div>

                  <Separator className="border-border/40" />

                  {/* CTA */}
                  <Link to="/self-assessment">
                    <Button
                      size="lg"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan font-semibold text-base"
                      data-ocid="payment.primary_button"
                    >
                      Continue to Self-Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <Link
                    to="/"
                    className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
                    data-ocid="payment.link"
                  >
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
