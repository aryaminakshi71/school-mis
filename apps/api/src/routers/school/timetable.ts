/**
 * Timetable Router
 *
 * oRPC router for timetable management.
 */

import { z } from 'zod';
import { pub, orgAuthed } from '../../procedures/index.js';

export const timetableRouter = {
  list: pub
    .route({ method: 'GET', path: '/timetable', summary: 'Get timetable', tags: ['Timetable'] })
    .input(
      z.object({
        classId: z.string().uuid().optional(),
        sessionId: z.string().uuid().optional(),
        dayOfWeek: z.number().optional(),
      })
    )
    .output(z.array(z.any()))
    .handler(async () => []),
  getByClass: pub
    .route({
      method: 'GET',
      path: '/timetable/class/{classId}',
      summary: 'Get class timetable',
      tags: ['Timetable'],
    })
    .input(z.object({ classId: z.string().uuid() }))
    .output(z.array(z.any()))
    .handler(async () => []),
  create: orgAuthed
    .route({
      method: 'POST',
      path: '/timetable',
      summary: 'Create timetable entry',
      tags: ['Timetable'],
    })
    .input(
      z.object({
        classId: z.string().uuid(),
        sessionId: z.string().uuid(),
        dayOfWeek: z.number(),
        periodNumber: z.number(),
        subjectId: z.string().uuid(),
        teacherId: z.string().uuid().optional(),
        startTime: z.string(),
        endTime: z.string(),
        roomNumber: z.string().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: 'new-id', ...input })),
  bulkCreate: orgAuthed
    .route({
      method: 'POST',
      path: '/timetable/bulk',
      summary: 'Create bulk timetable',
      tags: ['Timetable'],
    })
    .input(
      z.object({
        classId: z.string().uuid(),
        sessionId: z.string().uuid(),
        entries: z.array(
          z.object({
            dayOfWeek: z.number(),
            periodNumber: z.number(),
            subjectId: z.string().uuid(),
            startTime: z.string(),
            endTime: z.string(),
          })
        ),
      })
    )
    .output(z.object({ created: z.number() }))
    .handler(async ({ input }) => ({ created: input.entries.length })),
  update: orgAuthed
    .route({
      method: 'PUT',
      path: '/timetable/{id}',
      summary: 'Update timetable entry',
      tags: ['Timetable'],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        subjectId: z.string().optional(),
        teacherId: z.string().uuid().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        roomNumber: z.string().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => input),
  delete: orgAuthed
    .route({
      method: 'DELETE',
      path: '/timetable/{id}',
      summary: 'Delete timetable entry',
      tags: ['Timetable'],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
};
