/**
 * Subjects Router
 *
 * oRPC router for subject management.
 */

import { z } from 'zod';
import { pub, orgAuthed } from '../../procedures/index.js';

export const subjectsRouter = {
  list: pub
    .route({
      method: 'GET',
      path: '/subjects',
      summary: 'Get all subjects',
      tags: ['Subjects'],
    })
    .input(
      z.object({
        classId: z.string().uuid().optional(),
        teacherId: z.string().uuid().optional(),
      })
    )
    .output(z.array(z.any()))
    .handler(async () => []),

  get: pub
    .route({
      method: 'GET',
      path: '/subjects/{id}',
      summary: 'Get single subject',
      tags: ['Subjects'],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),

  create: orgAuthed
    .route({
      method: 'POST',
      path: '/subjects',
      summary: 'Create subject',
      tags: ['Subjects'],
    })
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().optional(),
        classId: z.string().uuid().optional(),
        teacherId: z.string().uuid().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: 'new-id', ...input })),

  update: orgAuthed
    .route({
      method: 'PUT',
      path: '/subjects/{id}',
      summary: 'Update subject',
      tags: ['Subjects'],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        code: z.string().optional(),
        teacherId: z.string().uuid().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => input),

  delete: orgAuthed
    .route({
      method: 'DELETE',
      path: '/subjects/{id}',
      summary: 'Delete subject',
      tags: ['Subjects'],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
};
