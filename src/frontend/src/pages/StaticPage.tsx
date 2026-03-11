import { Shield } from "lucide-react";

interface StaticPageProps {
  title: string;
}

export function StaticPage({ title }: StaticPageProps) {
  return (
    <main className="container mx-auto px-4 py-20 max-w-3xl">
      <div className="flex flex-col items-center text-center gap-6 py-16 border border-border/60 rounded-2xl bg-card/30">
        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Content for this page is coming soon. Please check back later.
        </p>
      </div>
    </main>
  );
}
