import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { useSaveProfile } from "../hooks/useQueries";

interface ProfileSetupProps {
  open: boolean;
  onComplete: () => void;
}

export function ProfileSetup({ open, onComplete }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const saveProfile = useSaveProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await saveProfile.mutateAsync({ name: name.trim() });
    onComplete();
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="border-primary/30 bg-card"
        data-ocid="profile.dialog"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-cyan">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="font-display text-xl">
              Complete Your Profile
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Enter your name to get started with CyberShield Training.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Display Name</Label>
            <Input
              id="profile-name"
              placeholder="e.g. Alex Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="profile.name.input"
              className="border-border/60 focus-visible:ring-primary"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
            disabled={!name.trim() || saveProfile.isPending}
            data-ocid="profile.submit.button"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Enter CyberShield"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
