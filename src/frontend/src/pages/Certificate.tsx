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
          .cert-page { padding: 0 !important; }
          .cert-wrapper {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 0 !important;
          }
          body { background: #0a1628 !important; }
        }
      `}</style>

      <main
        className="cert-page min-h-screen py-10 px-4 flex flex-col items-center"
        style={{
          background:
            "linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)",
        }}
        data-ocid="certificate.page"
      >
        {/* Nav (hidden on print) */}
        <div className="no-print w-full max-w-3xl flex items-center justify-between mb-8">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            data-ocid="certificate.link"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <Button
            onClick={handlePrint}
            className="bg-primary text-primary-foreground hover:bg-primary/80"
            data-ocid="certificate.primary_button"
          >
            <Download className="w-4 h-4 mr-2" />
            Download / Print
          </Button>
        </div>

        {/* Certificate wrapper */}
        <div
          className="cert-wrapper w-full max-w-3xl rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,100,255,0.25)]"
          style={{
            background:
              "linear-gradient(160deg, #0d1f3c 0%, #0a1628 40%, #061020 100%)",
            border: "2px solid rgba(59,130,246,0.4)",
          }}
        >
          {/* Background cybersecurity image with overlay */}
          <div className="relative">
            {/* Cybersecurity hero image strip */}
            <div
              className="w-full h-40 bg-cover bg-center relative"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop&q=80')",
              }}
            >
              {/* Dark overlay so text is readable */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(10,22,40,0.6) 0%, rgba(10,22,40,0.95) 100%)",
                }}
              />

              {/* Logo + Academy name centred over the image */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <img
                  src="/assets/Alangh_Logo.png"
                  alt="Alangh Academy"
                  className="h-16 w-auto object-contain drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-white tracking-wide drop-shadow">
                    Alangh Academy
                  </p>
                  <p className="text-xs text-blue-300 tracking-[0.35em] uppercase">
                    Cybersecurity Training
                  </p>
                </div>
              </div>
            </div>

            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
          </div>

          {/* Certificate body */}
          <div className="px-12 py-10 text-center">
            {/* Divider + award icon */}
            <div className="flex items-center gap-4 mb-7">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              <Award className="w-6 h-6 text-blue-400" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            </div>

            {/* Certificate label */}
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-blue-400 mb-6">
              Certificate of Completion
            </p>

            <p className="text-slate-400 text-base mb-3">
              This is to certify that
            </p>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              {cert.userName}
            </h1>

            <p className="text-slate-400 text-base mb-3">
              has successfully completed the
            </p>

            <p className="font-display text-xl font-semibold text-blue-300 mb-2">
              {cert.courseName}
            </p>

            <p className="text-sm text-slate-400 mb-8">
              offered by Alangh Academy
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            </div>

            {/* Date / Programme / Status row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Date of Issue
                </p>
                <p className="font-semibold text-sm text-white">{issuedDate}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Programme
                </p>
                <p className="font-semibold text-sm text-white">
                  HackStart™ Beginner
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Status
                </p>
                <p className="font-semibold text-sm text-blue-400">
                  Verified ✓
                </p>
              </div>
            </div>

            {/* Bottom shield divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              <Shield className="w-4 h-4 text-blue-500/60" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            </div>

            <p className="text-xs text-slate-600 font-mono">
              Certificate ID: {cert.certificateId} · {cert.userEmail}
            </p>
          </div>

          {/* Bottom accent bar */}
          <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
        </div>

        {/* Bottom print button */}
        <div className="no-print mt-8">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-blue-500/40 text-blue-300 hover:bg-blue-500/10"
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
