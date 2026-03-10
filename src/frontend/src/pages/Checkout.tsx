import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, CreditCard, Lock, Shield } from "lucide-react";
import { motion } from "motion/react";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    features: [
      "3 beginner courses",
      "Community access",
      "Basic progress tracking",
    ],
    current: true,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/ month",
    features: [
      "All 50+ courses",
      "Advanced labs",
      "Certificates",
      "Priority support",
      "Offline access",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "/ month",
    features: [
      "Everything in Pro",
      "Up to 10 seats",
      "Admin dashboard",
      "Custom training paths",
      "SSO / SAML",
    ],
  },
];

export function Checkout() {
  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="font-display text-4xl font-bold mb-2">
          Upgrade Your <span className="text-primary glow-text">Access</span>
        </h1>
        <p className="text-muted-foreground">
          Unlock the full CyberShield curriculum.
        </p>
      </motion.div>

      <Alert
        className="mb-10 border-primary/40 bg-primary/10 max-w-2xl mx-auto"
        data-ocid="checkout.notice.panel"
      >
        <AlertCircle className="w-4 h-4 text-primary" />
        <AlertDescription className="text-primary/90">
          <strong>Payment Coming Soon</strong> — Stripe integration is being set
          up. All features are currently free during beta.
        </AlertDescription>
      </Alert>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={`h-full border-border/60 transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary/60 bg-primary/5 shadow-cyber"
                  : "bg-card/50"
              }`}
              data-ocid={`checkout.plan.item.${i + 1}`}
            >
              {plan.highlighted && (
                <div className="text-center -mb-2 mt-2">
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  {plan.price}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.current
                      ? "bg-secondary text-muted-foreground cursor-default"
                      : plan.highlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
                        : "border-border/60"
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                  disabled={plan.current || plan.highlighted}
                  data-ocid={`checkout.plan.button.${i + 1}`}
                >
                  {plan.current ? "Current Plan" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stubbed Payment Form */}
      <div className="max-w-lg mx-auto">
        <Card className="border-border/60 bg-card/50 opacity-60">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Secure payment processing (coming soon)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Card Number</Label>
              <Input
                disabled
                placeholder="4242 4242 4242 4242"
                className="border-border/40 opacity-50"
                data-ocid="checkout.card.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Expiry</Label>
                <Input
                  disabled
                  placeholder="MM / YY"
                  className="border-border/40 opacity-50"
                  data-ocid="checkout.expiry.input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">CVV</Label>
                <Input
                  disabled
                  placeholder="•••"
                  className="border-border/40 opacity-50"
                  data-ocid="checkout.cvv.input"
                />
              </div>
            </div>
            <Separator className="border-border/40" />
            <Button
              disabled
              className="w-full opacity-50"
              data-ocid="checkout.pay.button"
            >
              <Lock className="w-4 h-4 mr-2" /> Payment Coming Soon
            </Button>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" /> Secured by Stripe (pending
              integration)
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
