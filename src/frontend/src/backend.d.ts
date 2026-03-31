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
export interface UserAccount {
    username: string;
    fullName: string;
    email: string;
    passwordHash: string;
    phone: string;
    address: string;
    profileBio: string;
    reason: string;
    createdAt: bigint;
    isDisabled: boolean;
    enrolledCourse: string | null;
    assessmentScore: bigint | null;
    assessmentPassed: boolean | null;
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
    addChapter(courseId: bigint, title: string, content: string, order: bigint): Promise<bigint>;
    addCourse(title: string, description: string, level: Level): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteChapter(chapterId: bigint): Promise<void>;
    deleteCourse(courseId: bigint): Promise<void>;
    enrollInCourse(courseId: bigint): Promise<void>;
    getAllCourses(): Promise<Array<Course>>;
    getAllEnrollments(): Promise<Array<[Principal, Array<bigint>]>>;
    getAllUsers(): Promise<Array<Principal>>;
    getCallerCourseProgress(courseId: bigint): Promise<{
        completedChapters: Array<bigint>;
        enrolled: boolean;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChaptersByCourse(courseId: bigint): Promise<Array<Chapter>>;
    getCompletedChapters(): Promise<Array<bigint>>;
    getCourseEnrollments(): Promise<Array<bigint>>;
    getUserCourseProgress(user: Principal, courseId: bigint): Promise<{
        completedChapters: Array<bigint>;
        enrolled: boolean;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markChapterComplete(chapterId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateChapter(chapterId: bigint, courseId: bigint, title: string, content: string, order: bigint): Promise<void>;
    updateCourse(courseId: bigint, title: string, description: string, level: Level): Promise<void>;
    // User account management
    registerUser(username: string, fullName: string, email: string, passwordHash: string, phone: string, address: string, profileBio: string, reason: string, createdAt: bigint): Promise<{ ok: null } | { err: string }>;
    loginUser(username: string, passwordHash: string): Promise<UserAccount | null>;
    getMaskedEmailByUsername(username: string): Promise<string | null>;
    saveAssessmentResult(username: string, score: bigint, passed: boolean): Promise<boolean>;
    getAllRegisteredUsers(): Promise<Array<UserAccount>>;
    getUserByUsername(username: string): Promise<UserAccount | null>;
    adminResetUserPassword(username: string, newPasswordHash: string): Promise<boolean>;
    adminSetUserDisabled(username: string, isDisabled: boolean): Promise<boolean>;
    adminDeleteUser(username: string): Promise<boolean>;
    adminAssignCourse(username: string, enrolledCourse: string | null): Promise<boolean>;
}
