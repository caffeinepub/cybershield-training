import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Chapter, Course, UserProfile } from "../backend.d";
import { Level, UserRole } from "../backend.d";
import { useActor } from "./useActor";

export { Level, UserRole };
export type { Course, Chapter, UserProfile };

export function useAllCourses() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCourses();
    },
    enabled: !!actor && !actorFetching,
  });
  return {
    ...query,
    isLoading: query.isLoading || actorFetching,
  };
}

export function useChaptersByCourse(courseId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<Chapter[]>({
    queryKey: ["chapters", courseId?.toString()],
    queryFn: async () => {
      if (!actor || courseId === null) return [];
      return actor.getChaptersByCourse(courseId);
    },
    enabled: !!actor && !actorFetching && courseId !== null,
  });
  return {
    ...query,
    isLoading: query.isLoading || actorFetching,
  };
}

export function useCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["role"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCourseProgress(courseId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<{ completedChapters: bigint[]; enrolled: boolean }>({
    queryKey: ["progress", courseId?.toString()],
    queryFn: async () => {
      if (!actor || courseId === null)
        return { completedChapters: [], enrolled: false };
      return actor.getCallerCourseProgress(courseId);
    },
    enabled: !!actor && !isFetching && courseId !== null,
  });
}

export function useEnrolledCourseIds() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["enrollments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCourseEnrollments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<Principal[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllEnrollments() {
  const { actor, isFetching } = useActor();
  return useQuery<[Principal, bigint[]][]>({
    queryKey: ["allEnrollments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEnrollments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile saved!");
    },
    onError: () => toast.error("Failed to save profile"),
  });
}

export function useEnrollInCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.enrollInCourse(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast.success("Enrolled successfully!");
    },
    onError: () => toast.error("Failed to enroll"),
  });
}

export function useMarkChapterComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chapterId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markChapterComplete(chapterId);
    },
    onSuccess: (_, _chapterId) => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast.success("Chapter marked complete!");
    },
    onError: () => toast.error("Failed to mark chapter complete"),
  });
}

export function useAddCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      level,
    }: { title: string; description: string; level: Level }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCourse(title, description, level);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course added!");
    },
    onError: () => toast.error("Failed to add course"),
  });
}

export function useUpdateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      level,
    }: { id: bigint; title: string; description: string; level: Level }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCourse(id, title, description, level);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course updated!");
    },
    onError: () => toast.error("Failed to update course"),
  });
}

export function useDeleteCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCourse(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted!");
    },
    onError: () => toast.error("Failed to delete course"),
  });
}

export function useAddChapter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      title,
      content,
      order,
    }: { courseId: bigint; title: string; content: string; order: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addChapter(courseId, title, content, order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      toast.success("Chapter added!");
    },
    onError: () => toast.error("Failed to add chapter"),
  });
}

export function useUpdateChapter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      courseId,
      title,
      content,
      order,
    }: {
      id: bigint;
      courseId: bigint;
      title: string;
      content: string;
      order: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateChapter(id, courseId, title, content, order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      toast.success("Chapter updated!");
    },
    onError: () => toast.error("Failed to update chapter"),
  });
}

export function useDeleteChapter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chapterId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteChapter(chapterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      toast.success("Chapter deleted!");
    },
    onError: () => toast.error("Failed to delete chapter"),
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast.success("Role assigned!");
    },
    onError: () => toast.error("Failed to assign role"),
  });
}
