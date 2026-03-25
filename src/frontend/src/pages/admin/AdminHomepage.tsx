import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminLayout";

const STORAGE_KEY = "alangh_homepage_content";

const DEFAULT_HERO = {
  tagline: "Cybersecurity isn't just for hackers. It's for everyone!",
  subTagline:
    "Whether you're curious about cybersecurity, switching careers, or just getting started — we're here to guide you step-by-step, from beginner to job-ready.",
  subtext: "",
};

const DEFAULT_STATS = [
  { value: "3.5 Million", label: "Unfilled cybersecurity jobs globally" },
  { value: "₹6–25 LPA", label: "Average salary range in India" },
  { value: "0% Unemployment", label: "In the cybersecurity field" },
  { value: "Every 39 sec", label: "A cyberattack occurs globally" },
];

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "I had zero tech background but Alangh Academy made everything so clear. Within months I was job-ready and confident.",
    name: "Priya S.",
    role: "Career Switcher",
  },
  {
    quote:
      "The structured path removed all the confusion. I finally understood where to start and where I was headed.",
    name: "Rahul M.",
    role: "IT Professional",
  },
  {
    quote:
      "As a homemaker returning to work, I was nervous. Alangh Academy's mentorship made me feel supported every step of the way.",
    name: "Anita K.",
    role: "Homemaker",
  },
];

const DEFAULT_FAQS = [
  {
    q: "Do I need a technical background to start?",
    a: "No. Our beginner course is designed for complete newcomers — no prior IT or tech experience needed.",
  },
  {
    q: "How long does it take to complete each course?",
    a: "The beginner course takes 3–6 months depending on your pace. We support self-paced learning.",
  },
  {
    q: "What makes Alangh Academy different?",
    a: "Structured learning paths (Beginner → Intermediate → Advanced), real-world projects and labs, industry-relevant role-based training, personalized mentorship and career guidance.",
  },
];

function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSection(section: string, data: unknown) {
  const existing = loadContent();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...existing, [section]: data }),
  );
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface Faq {
  q: string;
  a: string;
}

export function AdminHomepage() {
  const content = loadContent();

  // Hero state
  const [hero, setHero] = useState({
    tagline: content.hero?.tagline ?? DEFAULT_HERO.tagline,
    subTagline: content.hero?.subTagline ?? DEFAULT_HERO.subTagline,
    subtext: content.hero?.subtext ?? DEFAULT_HERO.subtext,
  });

  // Stats state
  const [stats, setStats] = useState<{ value: string; label: string }[]>(
    content.stats ?? DEFAULT_STATS,
  );

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    content.testimonials ?? DEFAULT_TESTIMONIALS,
  );
  const [testDialog, setTestDialog] = useState(false);
  const [editTestIdx, setEditTestIdx] = useState<number | null>(null);
  const [testForm, setTestForm] = useState<Testimonial>({
    quote: "",
    name: "",
    role: "",
  });

  // FAQs state
  const [faqs, setFaqs] = useState<Faq[]>(content.faqs ?? DEFAULT_FAQS);
  const [faqDialog, setFaqDialog] = useState(false);
  const [editFaqIdx, setEditFaqIdx] = useState<number | null>(null);
  const [faqForm, setFaqForm] = useState<Faq>({ q: "", a: "" });

  // --- Hero ---
  const saveHero = () => {
    saveSection("hero", hero);
    toast.success("Hero section saved successfully!");
  };

  // --- Stats ---
  const saveStats = () => {
    saveSection("stats", stats);
    toast.success("Career stats saved successfully!");
  };

  // --- Testimonials ---
  const openAddTest = () => {
    setEditTestIdx(null);
    setTestForm({ quote: "", name: "", role: "" });
    setTestDialog(true);
  };
  const openEditTest = (idx: number) => {
    setEditTestIdx(idx);
    setTestForm({ ...testimonials[idx] });
    setTestDialog(true);
  };
  const saveTest = () => {
    if (!testForm.quote.trim() || !testForm.name.trim()) {
      toast.error("Quote and name are required.");
      return;
    }
    const updated =
      editTestIdx !== null
        ? testimonials.map((t, i) => (i === editTestIdx ? testForm : t))
        : [...testimonials, testForm];
    setTestimonials(updated);
    setTestDialog(false);
  };
  const deleteTest = (idx: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== idx));
  };
  const saveTestimonials = () => {
    saveSection("testimonials", testimonials);
    toast.success("Testimonials saved successfully!");
  };

  // --- FAQs ---
  const openAddFaq = () => {
    setEditFaqIdx(null);
    setFaqForm({ q: "", a: "" });
    setFaqDialog(true);
  };
  const openEditFaq = (idx: number) => {
    setEditFaqIdx(idx);
    setFaqForm({ ...faqs[idx] });
    setFaqDialog(true);
  };
  const saveFaq = () => {
    if (!faqForm.q.trim() || !faqForm.a.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    const updated =
      editFaqIdx !== null
        ? faqs.map((f, i) => (i === editFaqIdx ? faqForm : f))
        : [...faqs, faqForm];
    setFaqs(updated);
    setFaqDialog(false);
  };
  const deleteFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };
  const moveFaq = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= faqs.length) return;
    const updated = [...faqs];
    [updated[idx], updated[next]] = [updated[next], updated[idx]];
    setFaqs(updated);
  };
  const saveFaqs = () => {
    saveSection("faqs", faqs);
    toast.success("FAQs saved successfully!");
  };

  // --- Reset all ---
  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHero({ ...DEFAULT_HERO });
    setStats([...DEFAULT_STATS]);
    setTestimonials([...DEFAULT_TESTIMONIALS]);
    setFaqs([...DEFAULT_FAQS]);
    toast.success("All content reset to defaults.");
  };

  return (
    <AdminLayout activePage="homepage">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">
              Home Page Content
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Edit the public landing page sections — changes are applied
              instantly on save.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={resetAll}
            data-ocid="admin.homepage.reset_button"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset to Defaults
          </Button>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="bg-secondary/40 border border-border/60 mb-6 flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="hero" data-ocid="admin.homepage.hero.tab">
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="stats" data-ocid="admin.homepage.stats.tab">
              Career Stats
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              data-ocid="admin.homepage.testimonials.tab"
            >
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="faqs" data-ocid="admin.homepage.faqs.tab">
              FAQs
            </TabsTrigger>
          </TabsList>

          {/* Hero Tab */}
          <TabsContent value="hero" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/60 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">Edit Hero Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hero Tagline (main headline)</Label>
                    <Input
                      value={hero.tagline}
                      onChange={(e) =>
                        setHero({ ...hero, tagline: e.target.value })
                      }
                      placeholder="Cybersecurity isn't just for hackers..."
                      data-ocid="admin.homepage.hero.tagline.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sub-tagline</Label>
                    <Textarea
                      value={hero.subTagline}
                      onChange={(e) =>
                        setHero({ ...hero, subTagline: e.target.value })
                      }
                      placeholder="Whether you're curious about cybersecurity..."
                      rows={3}
                      data-ocid="admin.homepage.hero.subtagline.textarea"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Paragraph (optional)</Label>
                    <Textarea
                      value={hero.subtext}
                      onChange={(e) =>
                        setHero({ ...hero, subtext: e.target.value })
                      }
                      placeholder="Additional paragraph below the sub-tagline..."
                      rows={3}
                      data-ocid="admin.homepage.hero.subtext.textarea"
                    />
                  </div>
                  <Button
                    onClick={saveHero}
                    className="bg-primary text-primary-foreground hover:bg-primary/80 w-full"
                    data-ocid="admin.homepage.hero.save_button"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Hero Section
                  </Button>
                </CardContent>
              </Card>

              {/* Live Preview */}
              <Card className="border-border/60 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-background/60 border border-border/40 p-5 space-y-3">
                    <div className="inline-block">
                      <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/30 px-2 py-1 rounded-full">
                        ● ALANGH ACADEMY
                      </span>
                    </div>
                    <h2 className="font-display text-lg font-bold leading-snug">
                      {hero.tagline || (
                        <span className="text-muted-foreground italic">
                          No tagline entered
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {hero.subTagline || (
                        <span className="italic">No sub-tagline entered</span>
                      )}
                    </p>
                    {hero.subtext && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {hero.subtext}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card className="border-border/60 bg-card/60">
              <CardHeader>
                <CardTitle className="text-base">Edit Career Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, i) => (
                  <div
                    key={stat.value || String(i)}
                    className="grid grid-cols-2 gap-3 pb-4 border-b border-border/40 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Value #{i + 1}
                      </Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[i] = { ...updated[i], value: e.target.value };
                          setStats(updated);
                        }}
                        placeholder="e.g. 3.5 Million"
                        data-ocid={`admin.homepage.stats.value.input.${i + 1}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Label #{i + 1}
                      </Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[i] = { ...updated[i], label: e.target.value };
                          setStats(updated);
                        }}
                        placeholder="e.g. Unfilled cybersecurity jobs"
                        data-ocid={`admin.homepage.stats.label.input.${i + 1}`}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  onClick={saveStats}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 w-full"
                  data-ocid="admin.homepage.stats.save_button"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Career Stats
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {testimonials.length} testimonial
                {testimonials.length !== 1 ? "s" : ""}
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/80"
                onClick={openAddTest}
                data-ocid="admin.homepage.testimonials.open_modal_button"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Testimonial
              </Button>
            </div>

            {testimonials.length === 0 ? (
              <Card className="border-dashed border-border/60 bg-card/30">
                <CardContent className="py-10 text-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No testimonials yet. Add one above.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {testimonials.map((t, i) => (
                  <Card
                    key={t.name || String(i)}
                    className="border-border/60 bg-card/60"
                    data-ocid={`admin.homepage.testimonials.item.${i + 1}`}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground italic leading-relaxed mb-2">
                          "{t.quote}"
                        </p>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-primary">{t.role}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEditTest(i)}
                          data-ocid={`admin.homepage.testimonials.edit_button.${i + 1}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteTest(i)}
                          data-ocid={`admin.homepage.testimonials.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button
              onClick={saveTestimonials}
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              data-ocid="admin.homepage.testimonials.save_button"
            >
              <Save className="w-4 h-4 mr-2" /> Save Testimonials
            </Button>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""}
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/80"
                onClick={openAddFaq}
                data-ocid="admin.homepage.faqs.open_modal_button"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add FAQ
              </Button>
            </div>

            {faqs.length === 0 ? (
              <Card className="border-dashed border-border/60 bg-card/30">
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground text-sm">
                    No FAQs yet. Add one above.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <Card
                    key={faq.q || String(i)}
                    className="border-border/60 bg-card/60"
                    data-ocid={`admin.homepage.faqs.item.${i + 1}`}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold mb-1">{faq.q}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => moveFaq(i, -1)}
                          disabled={i === 0}
                          data-ocid={`admin.homepage.faqs.toggle.${i + 1}`}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => moveFaq(i, 1)}
                          disabled={i === faqs.length - 1}
                          data-ocid={`admin.homepage.faqs.toggle.${i + 1}`}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEditFaq(i)}
                          data-ocid={`admin.homepage.faqs.edit_button.${i + 1}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteFaq(i)}
                          data-ocid={`admin.homepage.faqs.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Button
              onClick={saveFaqs}
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              data-ocid="admin.homepage.faqs.save_button"
            >
              <Save className="w-4 h-4 mr-2" /> Save FAQs
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Testimonial Dialog */}
      <Dialog open={testDialog} onOpenChange={setTestDialog}>
        <DialogContent className="bg-card border-border/60">
          <DialogHeader>
            <DialogTitle>
              {editTestIdx !== null ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Quote *</Label>
              <Textarea
                value={testForm.quote}
                onChange={(e) =>
                  setTestForm({ ...testForm, quote: e.target.value })
                }
                placeholder="What did the student say?"
                rows={3}
                data-ocid="admin.homepage.testimonials.dialog"
              />
            </div>
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={testForm.name}
                onChange={(e) =>
                  setTestForm({ ...testForm, name: e.target.value })
                }
                placeholder="Student name"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={testForm.role}
                onChange={(e) =>
                  setTestForm({ ...testForm, role: e.target.value })
                }
                placeholder="e.g. Career Switcher, IT Professional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTestDialog(false)}
              data-ocid="admin.homepage.testimonials.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={saveTest}
              data-ocid="admin.homepage.testimonials.confirm_button"
            >
              {editTestIdx !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={faqDialog} onOpenChange={setFaqDialog}>
        <DialogContent className="bg-card border-border/60">
          <DialogHeader>
            <DialogTitle>
              {editFaqIdx !== null ? "Edit FAQ" : "Add FAQ"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Question *</Label>
              <Input
                value={faqForm.q}
                onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                placeholder="What is the question?"
                data-ocid="admin.homepage.faqs.dialog"
              />
            </div>
            <div className="space-y-2">
              <Label>Answer *</Label>
              <Textarea
                value={faqForm.a}
                onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                placeholder="Provide a clear answer..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFaqDialog(false)}
              data-ocid="admin.homepage.faqs.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={saveFaq}
              data-ocid="admin.homepage.faqs.confirm_button"
            >
              {editFaqIdx !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
