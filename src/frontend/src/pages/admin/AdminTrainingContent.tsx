import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Download,
  Edit2,
  ExternalLink,
  FileText,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminLayout";

const STORAGE_KEY = "alangh_training_resources";
const IDB_NAME = "alangh_training_files";
const IDB_STORE = "files";

async function saveFileToIDB(id: string, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => {
      const tx = req.result.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(file, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    req.onerror = () => reject(req.error);
  });
}

async function getFileFromIDB(id: string): Promise<File | undefined> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => {
      const tx = req.result.transaction(IDB_STORE, "readonly");
      const getReq = tx.objectStore(IDB_STORE).get(id);
      getReq.onsuccess = () => resolve(getReq.result as File | undefined);
      getReq.onerror = () => reject(getReq.error);
    };
    req.onerror = () => reject(req.error);
  });
}

async function deleteFileFromIDB(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onsuccess = () => {
      const tx = req.result.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    req.onerror = () => reject(req.error);
  });
}

type CourseLevel = "beginner" | "intermediate" | "advanced";
type ResourceType =
  | "pdf"
  | "video"
  | "link"
  | "note"
  | "pdf-file"
  | "presentation"
  | "word-doc";

const FILE_TYPES: ResourceType[] = ["pdf-file", "presentation", "word-doc"];

interface TrainingResource {
  id: string;
  courseLevel: CourseLevel;
  title: string;
  description: string;
  resourceType: ResourceType;
  url?: string;
  content?: string;
  fileName?: string;
  uploadedAt: string;
  isActive: boolean;
}

const EMPTY_FORM: Omit<TrainingResource, "id" | "uploadedAt"> = {
  courseLevel: "beginner",
  title: "",
  description: "",
  resourceType: "link",
  url: "",
  content: "",
  fileName: "",
  isActive: true,
};

function loadResources(): TrainingResource[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveResources(resources: TrainingResource[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

function typeBadge(type: ResourceType) {
  const map: Record<
    ResourceType,
    { label: string; className: string; icon: React.ElementType }
  > = {
    pdf: {
      label: "PDF",
      className: "bg-red-500/15 text-red-400 border-red-500/30",
      icon: FileText,
    },
    video: {
      label: "Video",
      className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      icon: Video,
    },
    link: {
      label: "Link",
      className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      icon: ExternalLink,
    },
    note: {
      label: "Note",
      className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      icon: BookOpen,
    },
    "pdf-file": {
      label: "PDF File",
      className: "bg-red-500/15 text-red-400 border-red-500/30",
      icon: FileText,
    },
    presentation: {
      label: "Presentation",
      className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      icon: FileText,
    },
    "word-doc": {
      label: "Word Doc",
      className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      icon: FileText,
    },
  };
  const { label, className, icon: Icon } = map[type];
  return (
    <Badge className={`border text-xs font-medium gap-1 ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}

interface ResourceCardProps {
  resource: TrainingResource;
  index: number;
  onEdit: (r: TrainingResource) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

function ResourceCard({
  resource,
  index,
  onEdit,
  onDelete,
  onToggle,
}: ResourceCardProps) {
  const [noteExpanded, setNoteExpanded] = useState(false);

  const handleDownload = async () => {
    const file = await getFileFromIDB(resource.id);
    if (!file) {
      toast.error("File not found in local storage. It may have been cleared.");
      return;
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = resource.fileName || file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      className="border-border/60 bg-card/60 hover:border-primary/30 transition-all"
      data-ocid={`admin.training.item.${index + 1}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {typeBadge(resource.resourceType)}
              {!resource.isActive && (
                <Badge className="border border-border/60 text-muted-foreground text-xs">
                  Inactive
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-sm mt-2 leading-snug">
              {resource.title}
            </h3>
            {resource.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {resource.description}
              </p>
            )}
            {/* URL-based types */}
            {!FILE_TYPES.includes(resource.resourceType) &&
              resource.resourceType !== "note" &&
              resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Open Link
                </a>
              )}
            {/* File-based types */}
            {FILE_TYPES.includes(resource.resourceType) && (
              <div className="mt-2">
                {resource.fileName && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {resource.fileName}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1"
                  onClick={handleDownload}
                  data-ocid={`admin.training.download.button.${index + 1}`}
                >
                  <Download className="w-3 h-3" /> Download
                </Button>
              </div>
            )}
            {/* Note type */}
            {resource.resourceType === "note" && resource.content && (
              <div className="mt-2">
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setNoteExpanded(!noteExpanded)}
                >
                  {noteExpanded ? "Hide Note" : "View Note"}
                </button>
                {noteExpanded && (
                  <div className="mt-2 p-3 bg-secondary/30 rounded-md border border-border/40 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {resource.content}
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground/60 mt-2">
              Uploaded {new Date(resource.uploadedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Switch
              checked={resource.isActive}
              onCheckedChange={() => onToggle(resource.id)}
              data-ocid={`admin.training.switch.${index + 1}`}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(resource)}
              data-ocid={`admin.training.edit_button.${index + 1}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(resource.id)}
              data-ocid={`admin.training.delete_button.${index + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminTrainingContent() {
  const [resources, setResources] = useState<TrainingResource[]>(loadResources);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] =
    useState<Omit<TrainingResource, "id" | "uploadedAt">>(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getByLevel = (level: CourseLevel) =>
    resources.filter((r) => r.courseLevel === level);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setSelectedFile(null);
    setDialogOpen(true);
  };

  const openEdit = (r: TrainingResource) => {
    setEditingId(r.id);
    setForm({
      courseLevel: r.courseLevel,
      title: r.title,
      description: r.description,
      resourceType: r.resourceType,
      url: r.url ?? "",
      content: r.content ?? "",
      fileName: r.fileName ?? "",
      isActive: r.isActive,
    });
    setSelectedFile(null);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    const isFileType = FILE_TYPES.includes(form.resourceType);
    if (isFileType) {
      if (!editingId && !selectedFile) {
        toast.error("Please select a file to upload.");
        return;
      }
    } else if (form.resourceType !== "note" && !form.url?.trim()) {
      toast.error("URL is required for this resource type.");
      return;
    }
    if (form.resourceType === "note" && !form.content?.trim()) {
      toast.error("Note content is required.");
      return;
    }

    let updated: TrainingResource[];
    if (editingId) {
      if (isFileType && selectedFile) {
        saveFileToIDB(editingId, selectedFile).catch(() => {});
      }
      updated = resources.map((r) =>
        r.id === editingId
          ? {
              ...r,
              ...form,
              url: form.url || undefined,
              content: form.content || undefined,
              fileName:
                isFileType && selectedFile
                  ? selectedFile.name
                  : form.fileName || r.fileName,
            }
          : r,
      );
      toast.success("Resource updated successfully!");
    } else {
      const newId = Date.now().toString();
      if (isFileType && selectedFile) {
        saveFileToIDB(newId, selectedFile).catch(() => {});
      }
      const newResource: TrainingResource = {
        id: newId,
        ...form,
        url: form.url || undefined,
        content: form.content || undefined,
        fileName: isFileType && selectedFile ? selectedFile.name : undefined,
        uploadedAt: new Date().toISOString(),
      };
      updated = [...resources, newResource];
      toast.success("Resource added successfully!");
    }

    setResources(updated);
    saveResources(updated);
    setDialogOpen(false);
    setSelectedFile(null);
  };

  const handleDelete = (id: string) => {
    try {
      deleteFileFromIDB(id).catch(() => {});
    } catch {}
    const updated = resources.filter((r) => r.id !== id);
    setResources(updated);
    saveResources(updated);
    toast.success("Resource deleted.");
  };

  const handleToggle = (id: string) => {
    const updated = resources.map((r) =>
      r.id === id ? { ...r, isActive: !r.isActive } : r,
    );
    setResources(updated);
    saveResources(updated);
  };

  const urlLabel = {
    pdf: "PDF URL",
    video: "Video URL",
    link: "External URL",
    note: "",
    "pdf-file": "",
    presentation: "",
    "word-doc": "",
  }[form.resourceType];

  const fileAccept = {
    "pdf-file": ".pdf",
    presentation: ".ppt,.pptx,.ppsx",
    "word-doc": ".doc,.docx",
  } as Record<string, string>;

  const levels: { key: CourseLevel; label: string; color: string }[] = [
    { key: "beginner", label: "Beginner", color: "text-green-400" },
    { key: "intermediate", label: "Intermediate", color: "text-yellow-400" },
    { key: "advanced", label: "Advanced", color: "text-red-400" },
  ];

  return (
    <AdminLayout activePage="training-content">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">
              Training Resources
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Upload and manage course materials for enrolled students.
            </p>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
            onClick={openAdd}
            data-ocid="admin.training.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Resource
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {levels.map(({ key, label, color }) => (
            <Card key={key} className="border-border/60 bg-card/60">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                  <BookOpen className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">
                    {getByLevel(key).length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {label} Resources
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resource Tabs */}
        <Tabs defaultValue="beginner">
          <TabsList className="bg-secondary/40 border border-border/60 mb-5">
            {levels.map(({ key, label }) => (
              <TabsTrigger
                key={key}
                value={key}
                data-ocid={`admin.training.${key}.tab`}
              >
                {label}
                <span className="ml-2 text-xs bg-secondary/60 rounded-full px-1.5 py-0.5">
                  {getByLevel(key).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {levels.map(({ key, label }) => (
            <TabsContent key={key} value={key} className="space-y-3">
              {getByLevel(key).length === 0 ? (
                <Card
                  className="border-dashed border-border/60 bg-card/30"
                  data-ocid="admin.training.empty_state"
                >
                  <CardContent className="py-12 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No resources uploaded for the {label} course yet.
                    </p>
                    <Button
                      size="sm"
                      className="mt-4 bg-primary text-primary-foreground hover:bg-primary/80"
                      onClick={openAdd}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Add First Resource
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                getByLevel(key).map((resource, idx) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    index={idx}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="bg-card border-border/60 max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.training.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Resource" : "Add Training Resource"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Resource title"
                data-ocid="admin.training.input"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Brief description (optional)"
                rows={2}
                data-ocid="admin.training.textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Target Course Level *</Label>
                <Select
                  value={form.courseLevel}
                  onValueChange={(v) =>
                    setForm({ ...form, courseLevel: v as CourseLevel })
                  }
                >
                  <SelectTrigger data-ocid="admin.training.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resource Type *</Label>
                <Select
                  value={form.resourceType}
                  onValueChange={(v) => {
                    setForm({
                      ...form,
                      resourceType: v as ResourceType,
                      url: "",
                      content: "",
                      fileName: "",
                    });
                    setSelectedFile(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF (URL)</SelectItem>
                    <SelectItem value="video">Video Link</SelectItem>
                    <SelectItem value="link">External Link</SelectItem>
                    <SelectItem value="note">Text Note</SelectItem>
                    <SelectItem value="pdf-file">PDF (Upload File)</SelectItem>
                    <SelectItem value="presentation">
                      Presentation (PPT/PPTX)
                    </SelectItem>
                    <SelectItem value="word-doc">Word Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* URL input for non-file, non-note types */}
            {!FILE_TYPES.includes(form.resourceType) &&
              form.resourceType !== "note" && (
                <div className="space-y-2">
                  <Label>{urlLabel} *</Label>
                  <Input
                    value={form.url ?? ""}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder={`Enter ${urlLabel?.toLowerCase()}...`}
                  />
                </div>
              )}

            {/* File upload for file types */}
            {FILE_TYPES.includes(form.resourceType) && (
              <div className="space-y-2">
                <Label>Upload File *</Label>
                <Input
                  type="file"
                  accept={fileAccept[form.resourceType] ?? ""}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedFile(file);
                  }}
                  className="cursor-pointer"
                  data-ocid="admin.training.upload_button"
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedFile.name} (
                    {(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
                {!selectedFile && form.fileName && (
                  <p className="text-xs text-muted-foreground">
                    Current file: {form.fileName}
                  </p>
                )}
              </div>
            )}

            {form.resourceType === "note" && (
              <div className="space-y-2">
                <Label>Note Content *</Label>
                <Textarea
                  value={form.content ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  placeholder="Write the note content here..."
                  rows={5}
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                data-ocid="admin.training.switch"
              />
              <Label className="cursor-pointer">
                Active (visible to enrolled students)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.training.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={handleSave}
              data-ocid="admin.training.confirm_button"
            >
              {editingId ? "Update Resource" : "Add Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
