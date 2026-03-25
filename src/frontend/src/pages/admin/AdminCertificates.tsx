import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, CheckCircle2, ExternalLink, ShieldOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AdminLayout } from "./AdminLayout";

interface AssessmentResult {
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  passed: boolean;
  date: string;
  attempt: number;
}

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

function loadResults(): AssessmentResult[] {
  try {
    return JSON.parse(
      localStorage.getItem("alangh_assessment_results") || "[]",
    );
  } catch {
    return [];
  }
}

function loadCerts(): Certificate[] {
  try {
    return JSON.parse(localStorage.getItem("alangh_certificates") || "[]");
  } catch {
    return [];
  }
}

function saveCerts(certs: Certificate[]) {
  localStorage.setItem("alangh_certificates", JSON.stringify(certs));
}

interface StudentEntry {
  userId: string;
  userName: string;
  userEmail: string;
  bestScore: number;
  latestDate: string;
}

function getPassedStudents(): StudentEntry[] {
  const results = loadResults().filter((r) => r.passed);
  const map = new Map<string, StudentEntry>();
  for (const r of results) {
    const existing = map.get(r.userId);
    if (!existing || r.score > existing.bestScore) {
      map.set(r.userId, {
        userId: r.userId,
        userName: r.userName,
        userEmail: r.userEmail,
        bestScore: r.score,
        latestDate: r.date,
      });
    }
  }
  return Array.from(map.values());
}

export function AdminCertificates() {
  const [certs, setCerts] = useState<Certificate[]>(loadCerts);

  const students = getPassedStudents();

  const getCertForUser = (userId: string) =>
    certs.find((c) => c.userId === userId);

  const handleIssue = (student: StudentEntry) => {
    const newCert: Certificate = {
      certificateId: `ALAN-${Date.now()}`,
      userId: student.userId,
      userName: student.userName,
      userEmail: student.userEmail,
      courseId: "beginner",
      courseName: "Alangh Cybersecurity Foundation (HackStart™)",
      issuedAt: new Date().toISOString(),
    };
    const updated = [
      ...certs.filter((c) => c.userId !== student.userId),
      newCert,
    ];
    saveCerts(updated);
    setCerts(updated);
  };

  const handleRevoke = (certId: string) => {
    const updated = certs.map((c) =>
      c.certificateId === certId
        ? { ...c, revokedAt: new Date().toISOString() }
        : c,
    );
    saveCerts(updated);
    setCerts(updated);
  };

  const issued = certs.filter((c) => !c.revokedAt).length;
  const _revoked = certs.filter((c) => !!c.revokedAt).length;
  const pending = students.length - issued;

  return (
    <AdminLayout activePage="certificates">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">
            Certificate <span className="text-primary">Management</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Issue and manage certificates for students who have passed the
            self-assessment.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Passed",
              value: students.length,
              color: "text-primary",
            },
            {
              label: "Certificates Issued",
              value: issued,
              color: "text-accent",
            },
            {
              label: "Pending",
              value: Math.max(0, pending),
              color: "text-yellow-400",
            },
          ].map(({ label, value, color }) => (
            <Card key={label} className="border-border/60 bg-card/80">
              <CardContent className="py-5 px-5 flex items-center gap-4">
                <Award className={`w-8 h-8 ${color}`} />
                <div>
                  <p className={`text-2xl font-bold font-mono ${color}`}>
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        {students.length === 0 ? (
          <Card className="border-border/60 bg-card/80">
            <CardContent
              className="py-16 text-center"
              data-ocid="admin.certificates.empty_state"
            >
              <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No students have passed the assessment yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/60 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Passed Students
              </CardTitle>
            </CardHeader>
            <Table data-ocid="admin.certificates.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Best Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, idx) => {
                  const cert = getCertForUser(student.userId);
                  const isIssued = !!cert && !cert.revokedAt;
                  const isRevoked = !!cert?.revokedAt;
                  return (
                    <TableRow
                      key={student.userId}
                      data-ocid={`admin.certificates.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium">
                        {student.userName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {student.userEmail}
                      </TableCell>
                      <TableCell className="font-bold font-mono text-primary">
                        {student.bestScore}/20
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(student.latestDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </TableCell>
                      <TableCell>
                        {isRevoked ? (
                          <Badge className="border-destructive/40 bg-destructive/10 text-destructive text-xs">
                            Revoked
                          </Badge>
                        ) : isIssued ? (
                          <Badge className="border-accent/40 bg-accent/10 text-accent flex items-center gap-1 text-xs w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Issued
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-yellow-500/40 text-yellow-400 text-xs"
                          >
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          {isIssued && cert && (
                            <>
                              <a
                                href={`/certificate/${cert.certificateId}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-border/60 h-7 px-2"
                                  data-ocid="admin.certificates.secondary_button"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </a>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10 h-7 px-2"
                                onClick={() => handleRevoke(cert.certificateId)}
                                data-ocid="admin.certificates.delete_button"
                              >
                                <ShieldOff className="w-3 h-3 mr-1" />
                                Revoke
                              </Button>
                            </>
                          )}
                          {(isRevoked || !cert) && (
                            <Button
                              size="sm"
                              className="bg-primary text-primary-foreground hover:bg-primary/80 h-7 px-3"
                              onClick={() => handleIssue(student)}
                              data-ocid="admin.certificates.primary_button"
                            >
                              <Award className="w-3 h-3 mr-1" />
                              Issue
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </motion.div>
    </AdminLayout>
  );
}
