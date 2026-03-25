import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Award, Download, Shield } from "lucide-react";

interface Certificate {
  certificateId: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  issuedAt: string;
  revokedAt?: string;
}

function getCertificate(certId: string): Certificate | null {
  try {
    const certs: Certificate[] = JSON.parse(
      localStorage.getItem("alangh_certificates") || "[]",
    );
    return certs.find((c) => c.certificateId === certId) ?? null;
  } catch {
    return null;
  }
}

export function Certificate() {
  const { id } = useParams({ from: "/certificate/$id" });
  const cert = getCertificate(id);

  const handlePrint = () => window.print();

  if (!cert) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Shield className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3">
            Certificate Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The certificate ID provided does not match any issued certificate.
          </p>
          <Link to="/profile">
            <Button variant="outline" data-ocid="certificate.primary_button">
              Back to Profile
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (cert.revokedAt) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Shield className="w-12 h-12 text-destructive/60 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3">
            Certificate Revoked
          </h2>
          <p className="text-muted-foreground mb-6">
            This certificate has been revoked by the administrator.
          </p>
          <Link to="/profile">
            <Button variant="outline" data-ocid="certificate.primary_button">
              Back to Profile
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .cert-page { padding: 0 !important; background: white !important; }
          .cert-wrapper {
            box-shadow: none !important;
            border: 4px double #1a4a2e !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          body { background: white !important; }
        }
      `}</style>

      <main
        className="cert-page min-h-screen py-10 px-4 flex flex-col items-center"
        data-ocid="certificate.page"
      >
        {/* Nav (hidden on print) */}
        <div className="no-print w-full max-w-3xl flex items-center justify-between mb-8">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="certificate.link"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <Button
            onClick={handlePrint}
            className="bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan"
            data-ocid="certificate.primary_button"
          >
            <Download className="w-4 h-4 mr-2" />
            Download / Print
          </Button>
        </div>

        {/* Certificate */}
        <div className="cert-wrapper w-full max-w-3xl bg-card border-2 border-primary/40 rounded-2xl shadow-[0_0_60px_rgba(0,255,170,0.12)] overflow-hidden">
          {/* Top accent bar */}
          <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="px-12 py-12 text-center">
            {/* Logo area */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-display text-xl font-bold text-foreground">
                  Alangh Academy
                </p>
                <p className="text-xs text-muted-foreground tracking-widest uppercase">
                  Cybersecurity Training
                </p>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <Award className="w-6 h-6 text-primary" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            {/* Main content */}
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-6">
              Certificate of Completion
            </p>

            <p className="text-muted-foreground text-base mb-3">
              This is to certify that
            </p>

            <h1
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {cert.userName}
            </h1>

            <p className="text-muted-foreground text-base mb-3">
              has successfully completed the
            </p>

            <p className="font-display text-xl font-semibold text-primary mb-2">
              {cert.courseName}
            </p>

            <p className="text-sm text-muted-foreground mb-8">
              offered by Alangh Infosec Pvt. Ltd. (Alangh Academy)
            </p>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Date and signature row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Date of Issue
                </p>
                <p className="font-semibold text-sm">{issuedDate}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Programme
                </p>
                <p className="font-semibold text-sm">HackStart™ Beginner</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Status
                </p>
                <p className="font-semibold text-sm text-primary">Verified ✓</p>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <Shield className="w-4 h-4 text-primary/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            <p className="text-xs text-muted-foreground/60 font-mono">
              Certificate ID: {cert.certificateId} · {cert.userEmail}
            </p>
          </div>

          {/* Bottom accent bar */}
          <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary" />
        </div>

        {/* Print button (bottom, also hidden on print) */}
        <div className="no-print mt-8">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
            data-ocid="certificate.secondary_button"
          >
            <Download className="w-4 h-4 mr-2" />
            Print / Save as PDF
          </Button>
        </div>
      </main>
    </>
  );
}
