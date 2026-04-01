import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Course {
    id: bigint;
    title: string;
    description: string;
    level: Level;
}
export interface Certificate {
    username: string;
    fullName: string;
    email: string;
    certificateId: string;
    issuedAt: bigint;
    courseName: string;
    courseId: string;
    revokedAt?: bigint;
}
export interface AuditLog {
    id: string;
    resource: string;
    action: string;
    actorType: string;
    actorId: string;
    timestamp: bigint;
    details: string;
}
export interface TrainingResource {
    id: string;
    url?: string;
    title: string;
    content?: string;
    courseLevel: string;
    description: string;
    fileName?: string;
    isActive: boolean;
    resourceType: string;
    uploadedAt: bigint;
}
export type Principal = Principal;
export interface UserAccount {
    assessmentScore?: bigint;
    username: string;
    createdAt: bigint;
    fullName: string;
    email: string;
    assessmentPassed?: boolean;
    address: string;
    passwordHash: string;
    phone: string;
    profileBio: string;
    enrolledCourse?: string;
    isDisabled: boolean;
    reason: string;
}
export interface Chapter {
    id: bigint;
    title: string;
    content: string;
    order: bigint;
    courseId: bigint;
}
export interface UserProfile {
    name: string;
}
export enum Level {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAuditLog(log: AuditLog): Promise<void>;
    addChapter(courseId: bigint, title: string, content: string, order: bigint): Promise<bigint>;
    addCourse(title: string, description: string, level: Level): Promise<bigint>;
    addTrainingResource(id: string, courseLevel: string, title: string, description: string, resourceType: string, url: string | null, content: string | null, fileName: string | null): Promise<string>;
    adminAssignCourse(username: string, enrolledCourse: string | null): Promise<boolean>;
    adminDeleteUser(username: string): Promise<boolean>;
    adminResetUserPassword(username: string, newPasswordHash: string): Promise<boolean>;
    adminSetUserDisabled(username: string, isDisabled: boolean): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteChapter(chapterId: bigint): Promise<void>;
    deleteCourse(courseId: bigint): Promise<void>;
    deleteTrainingResource(resourceId: string): Promise<void>;
    enrollInCourse(courseId: bigint): Promise<void>;
    getActiveResourcesByLevel(courseLevel: string): Promise<Array<TrainingResource>>;
    getAllCertificates(): Promise<Array<Certificate>>;
    getAllCourses(): Promise<Array<Course>>;
    getAllEnrollments(): Promise<Array<[Principal, Array<bigint>]>>;
    getAllRegisteredUsers(): Promise<Array<UserAccount>>;
    getAllTrainingResources(): Promise<Array<TrainingResource>>;
    getAllUsers(): Promise<Array<Principal>>;
    getAuditLogs(): Promise<Array<AuditLog>>;
    getCallerCourseProgress(courseId: bigint): Promise<{
        completedChapters: Array<bigint>;
        enrolled: boolean;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCertificateById(certificateId: string): Promise<Certificate | null>;
    getCertificatesByUsername(username: string): Promise<Array<Certificate>>;
    getChaptersByCourse(courseId: bigint): Promise<Array<Chapter>>;
    getCompletedChapters(): Promise<Array<bigint>>;
    getCourseEnrollments(): Promise<Array<bigint>>;
    getMaskedEmailByUsername(username: string): Promise<string | null>;
    getRecentAuditLogs(limit: bigint): Promise<Array<AuditLog>>;
    getUserByUsername(username: string): Promise<UserAccount | null>;
    getUserCourseProgress(user: Principal, courseId: bigint): Promise<{
        completedChapters: Array<bigint>;
        enrolled: boolean;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    issueCertificate(certificateId: string, username: string, fullName: string, email: string, courseId: string, courseName: string): Promise<string>;
    loginUser(username: string, passwordHash: string): Promise<UserAccount | null>;
    markChapterComplete(chapterId: bigint): Promise<void>;
    registerUser(username: string, fullName: string, email: string, passwordHash: string, phone: string, address: string, profileBio: string, reason: string, createdAt: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    revokeCertificate(certificateId: string): Promise<void>;
    saveAssessmentResult(username: string, score: bigint, passed: boolean): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateChapter(chapterId: bigint, courseId: bigint, title: string, content: string, order: bigint): Promise<void>;
    updateCourse(courseId: bigint, title: string, description: string, level: Level): Promise<void>;
    updateTrainingResource(resourceId: string, resource: TrainingResource): Promise<void>;
}
