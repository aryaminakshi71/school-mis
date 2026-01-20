/**
 * TanStack Query Hooks with oRPC
 *
 * React Query hooks integrated with oRPC for data fetching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// === Students Hooks ===

export function useStudents(params?: { classId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: async () => {
      const result = await api.students.list(params);
      return result;
    },
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      const result = await api.students.get({ id });
      return result;
    },
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const result = await api.students.create(input);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string } & any) => {
      const result = await api.students.update({ id, ...input });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.students.delete({ id });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// === Classes Hooks ===

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const result = await api.classes.list();
      return result;
    },
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const result = await api.classes.create(input);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}

// === Teachers Hooks ===

export function useTeachers() {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const result = await api.teachers.list();
      return result;
    },
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const result = await api.teachers.create(input);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
}

// === Attendance Hooks ===

export function useAttendance(params?: { classId?: string; date?: string }) {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: async () => {
      const result = await api.attendance.list(params);
      return result;
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const result = await api.attendance.mark(input);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

// === Sessions Hooks ===

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const result = await api.sessions.list();
      return result;
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const result = await api.sessions.create(input);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
