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
    "Whether you're curious about cybersecurity, switching careers, or just getting started \u2014 we're here to guide you step-by-step, from beginner to job-ready.",
  subtext: "",
};

const DEFAULT_STATS = [
  {
    value: "$500+ Billion Industry",
    label:
      "The cybersecurity market is booming and projected to hit $538B by 2030. That means opportunities keep growing.",
  },
  {
    value: "3.5M+ Open Roles",
    label:
      "There's a massive global talent gap. The good news? You don't need a tech background to get started.",
  },
  {
    value: "High Pay, Real Impact",
    label:
      "With high demand comes strong salaries, job security, and the chance to do meaningful work that protects people and businesses.",
  },
  {
    value: "Future-Proof Your Career",
    label:
      "AI, cloud, and remote work are everywhere. Cybersecurity is no longer optional \u2014 every industry needs skilled professionals.",
  },
];

const DEFAULT_PERSONAS = [
  {
    title: "The Curious Beginner",
    desc: "No tech background? No problem. Start from zero.",
    image:
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=480&h=360&fit=crop&auto=format",
  },
  {
    title: "The IT Professional",
    desc: "Already in IT? Level up to cybersecurity roles.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=480&h=360&fit=crop&auto=format",
  },
  {
    title: "The Career Switcher",
    desc: "From any domain to cybersecurity. We'll show you how.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=480&h=360&fit=crop&auto=format",
  },
  {
    title: "The Student",
    desc: "Build skills before your first job. Stand out from day one.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=480&h=360&fit=crop&auto=format",
  },
  {
    title: "The Homemaker",
    desc: "Re-entering the workforce? Cybersecurity welcomes you.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=360&fit=crop&auto=format",
  },
  {
    title: "The Working Professional",
    desc: "Upskill on your own schedule. 5\u201310 hrs/week is enough.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=360&fit=crop&auto=format",
  },
];

const DEFAULT_PATHS = [
  {
    title: "Beginner Path",
    desc: "Zero to foundational cybersecurity skills. Perfect for non-tech backgrounds.",
    badge: "Start Here",
    image:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop&auto=format",
  },
  {
    title: "Intermediate Path",
    desc: "Deepen technical skills. Network security, SOC operations, threat analysis.",
    badge: "Level Up",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&auto=format",
  },
  {
    title: "Advanced Path",
    desc: "Penetration testing, threat hunting, security architecture.",
    badge: "Go Deep",
    image:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop&auto=format",
  },
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
    a: "No. Our beginner course is designed for complete newcomers \u2014 no prior IT or tech experience needed.",
  },
  {
    q: "How long does it take to complete each course?",
    a: "The beginner course takes 3\u20136 months depending on your pace. We support self-paced learning.",
  },
  {
    q: "What makes Alangh Academy different?",
    a: "Structured learning paths (Beginner \u2192 Intermediate \u2192 Advanced), real-world projects and labs, industry-relevant role-based training, personalized mentorship and career guidance.",
  },
];

const DEFAULT_ANNOUNCEMENT = {
  title: "Next Training Batch \u2014 Enrollments Open!",
  subtitle: "HackStart\u2122 Beginner Cybersecurity Programme",
  batchDate: "Batch Starts: August 2025",
  details:
    "Limited seats available. Register now to secure your spot in our upcoming beginner cybersecurity training cohort. Learn from industry experts, work on real-world labs, and start your journey to a career in cybersecurity.",
  image:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&auto=format",
};

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
  window.dispatchEvent(new Event("alanghHomepageChanged"));
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
interface Persona {
  title: string;
  desc: string;
  image: string;
}
interface Path {
  title: string;
  desc: string;
  badge: string;
  image: string;
}
interface Announcement {
  title: string;
  subtitle: string;
  batchDate: string;
  details: string;
  image: string;
}

export function AdminHomepage() {
  const content = loadContent();

  const [hero, setHero] = useState({
    tagline: content.hero?.tagline ?? DEFAULT_HERO.tagline,
    subTagline: content.hero?.subTagline ?? DEFAULT_HERO.subTagline,
    subtext: content.hero?.subtext ?? DEFAULT_HERO.subtext,
  });
  const [stats, setStats] = useState<{ value: string; label: string }[]>(
    content.stats ?? DEFAULT_STATS,
  );
  const [personas, setPersonas] = useState<Persona[]>(
    content.personas ?? DEFAULT_PERSONAS,
  );
  const [paths, setPaths] = useState<Path[]>(content.paths ?? DEFAULT_PATHS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    content.testimonials ?? DEFAULT_TESTIMONIALS,
  );
  const [faqs, setFaqs] = useState<Faq[]>(content.faqs ?? DEFAULT_FAQS);
  const [announcement, setAnnouncement] = useState<Announcement>(
    content.announcement ?? DEFAULT_ANNOUNCEMENT,
  );

  // Dialog states
  const [testDialog, setTestDialog] = useState(false);
  const [editTestIdx, setEditTestIdx] = useState<number | null>(null);
  const [testForm, setTestForm] = useState<Testimonial>({
    quote: "",
    name: "",
    role: "",
  });

  const [faqDialog, setFaqDialog] = useState(false);
  const [editFaqIdx, setEditFaqIdx] = useState<number | null>(null);
  const [faqForm, setFaqForm] = useState<Faq>({ q: "", a: "" });

  const [personaDialog, setPersonaDialog] = useState(false);
  const [editPersonaIdx, setEditPersonaIdx] = useState<number | null>(null);
  const [personaForm, setPersonaForm] = useState<Persona>({
    title: "",
    desc: "",
    image: "",
  });

  const [pathDialog, setPathDialog] = useState(false);
  const [editPathIdx, setEditPathIdx] = useState<number | null>(null);
  const [pathForm, setPathForm] = useState<Path>({
    title: "",
    desc: "",
    badge: "",
    image: "",
  });

  // --- Hero ---
  const saveHero = () => {
    saveSection("hero", hero);
    toast.success("Hero section saved!");
  };

  // --- Stats ---
  const saveStats = () => {
    saveSection("stats", stats);
    toast.success("Career stats saved!");
  };

  // --- Personas ---
  const openAddPersona = () => {
    setEditPersonaIdx(null);
    setPersonaForm({ title: "", desc: "", image: "" });
    setPersonaDialog(true);
  };
  const openEditPersona = (i: number) => {
    setEditPersonaIdx(i);
    setPersonaForm({ ...personas[i] });
    setPersonaDialog(true);
  };
  const savePersonaDialog = () => {
    if (!personaForm.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    const updated =
      editPersonaIdx !== null
        ? personas.map((p, i) => (i === editPersonaIdx ? personaForm : p))
        : [...personas, personaForm];
    setPersonas(updated);
    setPersonaDialog(false);
  };
  const deletePersona = (i: number) =>
    setPersonas(personas.filter((_, idx) => idx !== i));
  const savePersonas = () => {
    saveSection("personas", personas);
    toast.success('"Who is this for?" cards saved!');
  };

  // --- Paths ---
  const openAddPath = () => {
    setEditPathIdx(null);
    setPathForm({ title: "", desc: "", badge: "", image: "" });
    setPathDialog(true);
  };
  const openEditPath = (i: number) => {
    setEditPathIdx(i);
    setPathForm({ ...paths[i] });
    setPathDialog(true);
  };
  const savePathDialog = () => {
    if (!pathForm.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    const updated =
      editPathIdx !== null
        ? paths.map((p, i) => (i === editPathIdx ? pathForm : p))
        : [...paths, pathForm];
    setPaths(updated);
    setPathDialog(false);
  };
  const deletePath = (i: number) =>
    setPaths(paths.filter((_, idx) => idx !== i));
  const savePaths = () => {
    saveSection("paths", paths);
    toast.success('"Where Should I Start?" cards saved!');
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
  const deleteTest = (idx: number) =>
    setTestimonials(testimonials.filter((_, i) => i !== idx));
  const saveTestimonials = () => {
    saveSection("testimonials", testimonials);
    toast.success("Testimonials saved!");
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
  const deleteFaq = (idx: number) => setFaqs(faqs.filter((_, i) => i !== idx));
  const moveFaq = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= faqs.length) return;
    const updated = [...faqs];
    [updated[idx], updated[next]] = [updated[next], updated[idx]];
    setFaqs(updated);
  };
  const saveFaqs = () => {
    saveSection("faqs", faqs);
    toast.success("FAQs saved!");
  };

  // --- Announcement ---
  const saveAnnouncement = () => {
    saveSection("announcement", announcement);
    toast.success("Announcement card saved!");
  };

  // --- Reset ---
  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("alanghHomepageChanged"));
    setHero({ ...DEFAULT_HERO });
    setStats([...DEFAULT_STATS]);
    setPersonas([...DEFAULT_PERSONAS]);
    setPaths([...DEFAULT_PATHS]);
    setTestimonials([...DEFAULT_TESTIMONIALS]);
    setFaqs([...DEFAULT_FAQS]);
    setAnnouncement({ ...DEFAULT_ANNOUNCEMENT });
    toast.success("All content reset to defaults.");
  };

  return (
    <AdminLayout activePage="homepage">
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">
              Home Page Content
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Edit the public landing page sections \u2014 changes are applied
              instantly on save.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={resetAll}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset to Defaults
          </Button>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="bg-secondary/40 border border-border/60 mb-6 flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="stats">Career Stats</TabsTrigger>
            <TabsTrigger value="personas">Who Is This For?</TabsTrigger>
            <TabsTrigger value="paths">Where Should I Start?</TabsTrigger>
            <TabsTrigger value="announcement">Announcement</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sub-tagline</Label>
                    <Textarea
                      value={hero.subTagline}
                      onChange={(e) =>
                        setHero({ ...hero, subTagline: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Paragraph (optional)</Label>
                    <Textarea
                      value={hero.subtext}
                      onChange={(e) =>
                        setHero({ ...hero, subtext: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={saveHero}
                    className="bg-primary text-primary-foreground hover:bg-primary/80 w-full"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Hero Section
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-border/60 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-background/60 border border-border/40 p-5 space-y-3">
                    <div className="inline-block">
                      <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/30 px-2 py-1 rounded-full">
                        \u25cf ALANGH ACADEMY
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
                <CardTitle className="text-base">
                  Edit Career Stats Cards
                </CardTitle>
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
                          const u = [...stats];
                          u[i] = { ...u[i], value: e.target.value };
                          setStats(u);
                        }}
                        placeholder="e.g. $500+ Billion Industry"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Description #{i + 1}
                      </Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const u = [...stats];
                          u[i] = { ...u[i], label: e.target.value };
                          setStats(u);
                        }}
                        placeholder="e.g. The cybersecurity market is booming..."
                      />
                    </div>
                  </div>
                ))}
                <Button
                  onClick={saveStats}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 w-full"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Career Stats
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personas Tab */}
          <TabsContent value="personas" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {personas.length} card{personas.length !== 1 ? "s" : ""}
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/80"
                onClick={openAddPersona}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Card
              </Button>
            </div>
            {personas.length === 0 ? (
              <Card className="border-dashed border-border/60 bg-card/30">
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground text-sm">No cards yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {personas.map((p, i) => (
                  <Card
                    key={p.title || String(i)}
                    className="border-border/60 bg-card/60"
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-16 h-12 object-cover rounded border border-border/40 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{p.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {p.desc}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEditPersona(i)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => deletePersona(i)}
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
              onClick={savePersonas}
              className="bg-primary text-primary-foreground hover:bg-primary/80"
            >
              <Save className="w-4 h-4 mr-2" /> Save \"Who Is This For?\" Cards
            </Button>
          </TabsContent>

          {/* Paths Tab */}
          <TabsContent value="paths" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {paths.length} card{paths.length !== 1 ? "s" : ""}
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/80"
                onClick={openAddPath}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Card
              </Button>
            </div>
            {paths.length === 0 ? (
              <Card className="border-dashed border-border/60 bg-card/30">
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground text-sm">No cards yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {paths.map((p, i) => (
                  <Card
                    key={p.title || String(i)}
                    className="border-border/60 bg-card/60"
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-16 h-12 object-cover rounded border border-border/40 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">
                          {p.title}{" "}
                          <span className="text-xs text-primary ml-1">
                            {p.badge}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {p.desc}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEditPath(i)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => deletePath(i)}
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
              onClick={savePaths}
              className="bg-primary text-primary-foreground hover:bg-primary/80"
            >
              <Save className="w-4 h-4 mr-2" /> Save \"Where Should I Start?\"
              Cards
            </Button>
          </TabsContent>

          {/* Announcement Tab */}
          <TabsContent value="announcement" className="space-y-6">
            <Card className="border-border/60 bg-card/60">
              <CardHeader>
                <CardTitle className="text-base">
                  Edit Announcement Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input
                    value={announcement.title}
                    onChange={(e) =>
                      setAnnouncement({
                        ...announcement,
                        title: e.target.value,
                      })
                    }
                    placeholder="Next Training Batch \u2014 Enrollments Open!"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Programme Name</Label>
                  <Input
                    value={announcement.subtitle}
                    onChange={(e) =>
                      setAnnouncement({
                        ...announcement,
                        subtitle: e.target.value,
                      })
                    }
                    placeholder="HackStart\u2122 Beginner Cybersecurity Programme"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Batch Date / Schedule</Label>
                  <Input
                    value={announcement.batchDate}
                    onChange={(e) =>
                      setAnnouncement({
                        ...announcement,
                        batchDate: e.target.value,
                      })
                    }
                    placeholder="Batch Starts: August 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details / Description</Label>
                  <Textarea
                    value={announcement.details}
                    onChange={(e) =>
                      setAnnouncement({
                        ...announcement,
                        details: e.target.value,
                      })
                    }
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={announcement.image}
                    onChange={(e) =>
                      setAnnouncement({
                        ...announcement,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://images.unsplash.com/..."
                  />
                  {announcement.image && (
                    <img
                      src={announcement.image}
                      alt="preview"
                      className="w-full h-32 object-cover rounded border border-border/40 mt-2"
                    />
                  )}
                </div>
                <Button
                  onClick={saveAnnouncement}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 w-full"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Announcement Card
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
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Testimonial
              </Button>
            </div>
            {testimonials.length === 0 ? (
              <Card className="border-dashed border-border/60 bg-card/30">
                <CardContent className="py-10 text-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No testimonials yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {testimonials.map((t, i) => (
                  <Card
                    key={t.name || String(i)}
                    className="border-border/60 bg-card/60"
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
                          className="h-8 w-8"
                          onClick={() => openEditTest(i)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => deleteTest(i)}
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
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add FAQ
              </Button>
            </div>
            {faqs.length === 0 ? (
              <Card className="border-dashed border-border/60 bg-card/30">
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground text-sm">No FAQs yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <Card
                    key={faq.q || String(i)}
                    className="border-border/60 bg-card/60"
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
                          className="h-7 w-7"
                          onClick={() => moveFaq(i, -1)}
                          disabled={i === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => moveFaq(i, 1)}
                          disabled={i === faqs.length - 1}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEditFaq(i)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => deleteFaq(i)}
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
            >
              <Save className="w-4 h-4 mr-2" /> Save FAQs
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Testimonial Dialog */}
      <Dialog open={testDialog} onOpenChange={setTestDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editTestIdx !== null ? "Edit" : "Add"} Testimonial
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
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={testForm.name}
                onChange={(e) =>
                  setTestForm({ ...testForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={testForm.role}
                onChange={(e) =>
                  setTestForm({ ...testForm, role: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={saveTest}
            >
              {editTestIdx !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={faqDialog} onOpenChange={setFaqDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editFaqIdx !== null ? "Edit" : "Add"} FAQ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Question *</Label>
              <Input
                value={faqForm.q}
                onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Answer *</Label>
              <Textarea
                value={faqForm.a}
                onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={saveFaq}
            >
              {editFaqIdx !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Persona Dialog */}
      <Dialog open={personaDialog} onOpenChange={setPersonaDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editPersonaIdx !== null ? "Edit" : "Add"} \"Who Is This For?\"
              Card
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={personaForm.title}
                onChange={(e) =>
                  setPersonaForm({ ...personaForm, title: e.target.value })
                }
                placeholder="e.g. The Curious Beginner"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={personaForm.desc}
                onChange={(e) =>
                  setPersonaForm({ ...personaForm, desc: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={personaForm.image}
                onChange={(e) =>
                  setPersonaForm({ ...personaForm, image: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
              />
              {personaForm.image && (
                <img
                  src={personaForm.image}
                  alt="preview"
                  className="w-full h-24 object-cover rounded border border-border/40 mt-2"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPersonaDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={savePersonaDialog}
            >
              {editPersonaIdx !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Path Dialog */}
      <Dialog open={pathDialog} onOpenChange={setPathDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editPathIdx !== null ? "Edit" : "Add"} \"Where Should I Start?\"
              Card
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={pathForm.title}
                onChange={(e) =>
                  setPathForm({ ...pathForm, title: e.target.value })
                }
                placeholder="e.g. Beginner Path"
              />
            </div>
            <div className="space-y-2">
              <Label>Badge Label</Label>
              <Input
                value={pathForm.badge}
                onChange={(e) =>
                  setPathForm({ ...pathForm, badge: e.target.value })
                }
                placeholder="e.g. Start Here"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={pathForm.desc}
                onChange={(e) =>
                  setPathForm({ ...pathForm, desc: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={pathForm.image}
                onChange={(e) =>
                  setPathForm({ ...pathForm, image: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
              />
              {pathForm.image && (
                <img
                  src={pathForm.image}
                  alt="preview"
                  className="w-full h-24 object-cover rounded border border-border/40 mt-2"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPathDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={savePathDialog}
            >
              {editPathIdx !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
