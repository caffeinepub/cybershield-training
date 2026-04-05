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
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminLayout";

const STORAGE_KEY = "alangh_leaders_content";
const MAX_LEADERS = 5;

interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const DEFAULT_LEADERS: Leader[] = [
  {
    id: "l1",
    name: "Founder & CEO",
    role: "Cybersecurity Expert",
    bio: "Leading Alangh Academy with a vision to make cybersecurity accessible to everyone.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format",
  },
];

function loadLeaders(): Leader[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_LEADERS;
  } catch {
    return DEFAULT_LEADERS;
  }
}

function saveLeaders(leaders: Leader[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leaders));
}

export function AdminLeaders() {
  const [leaders, setLeaders] = useState<Leader[]>(loadLeaders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<Leader>({
    id: "",
    name: "",
    role: "",
    bio: "",
    image: "",
  });

  const openAdd = () => {
    if (leaders.length >= MAX_LEADERS) {
      toast.error(`Maximum ${MAX_LEADERS} leader cards allowed.`);
      return;
    }
    setEditIdx(null);
    setForm({
      id: Date.now().toString(),
      name: "",
      role: "",
      bio: "",
      image: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (i: number) => {
    setEditIdx(i);
    setForm({ ...leaders[i] });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    let updated: Leader[];
    if (editIdx !== null) {
      updated = leaders.map((l, i) => (i === editIdx ? form : l));
    } else {
      updated = [...leaders, form];
    }
    setLeaders(updated);
    saveLeaders(updated);
    window.dispatchEvent(new Event("alanghLeadersChanged"));
    setDialogOpen(false);
    toast.success(
      editIdx !== null ? "Leader card updated!" : "Leader card added!",
    );
  };

  const handleDelete = (i: number) => {
    const updated = leaders.filter((_, idx) => idx !== i);
    setLeaders(updated);
    saveLeaders(updated);
    window.dispatchEvent(new Event("alanghLeadersChanged"));
    toast.success("Leader card removed.");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout activePage="leaders">
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">
              Meet The Leaders
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage the leader cards shown on the About Us page. Up to{" "}
              {MAX_LEADERS} cards allowed.
            </p>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/80"
            onClick={openAdd}
            disabled={leaders.length >= MAX_LEADERS}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Leader ({leaders.length}/
            {MAX_LEADERS})
          </Button>
        </div>

        {leaders.length === 0 ? (
          <Card className="border-dashed border-border/60 bg-card/30">
            <CardContent className="py-12 text-center">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No leader cards yet. Add one above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((leader, i) => (
              <Card
                key={leader.id}
                className="border-border/60 bg-card/60 hover:border-primary/40 transition-all"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                      <img
                        src={
                          leader.image ||
                          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format"
                        }
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEdit(i)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => handleDelete(i)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base mb-1">
                    {leader.name}
                  </CardTitle>
                  <p className="text-primary text-xs font-mono mb-2">
                    {leader.role}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {leader.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editIdx !== null ? "Edit" : "Add"} Leader Card
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name / Title *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. John Smith / Founder & CEO"
              />
            </div>
            <div className="space-y-2">
              <Label>Role / Designation</Label>
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Cybersecurity Expert"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio / Description</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Brief description about this person..."
              />
            </div>
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-3">
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    className="w-16 h-16 rounded-full object-cover border border-border/40"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Or use an image URL:
                  </p>
                  <Input
                    value={form.image.startsWith("data:") ? "" : form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={handleSave}
            >
              {editIdx !== null ? "Update" : "Add"} Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
