/**
 * Staff Router
 *
 * oRPC router for staff management.
 */

import { z } from 'zod';
import { pub, orgAuthed } from '../../procedures/index.js';

export const staffRouter = {
  list: pub
    .route({
      method: 'GET',
      path: '/staff',
      summary: 'Get all staff',
      tags: ['Staff'],
    })
    .output(z.array(z.any()))
    .handler(async () => []),

  get: pub
    .route({
      method: 'GET',
      path: '/staff/{id}',
      summary: 'Get single staff',
      tags: ['Staff'],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.any())
    .handler(async () => null),

  create: orgAuthed
    .route({
      method: 'POST',
      path: '/staff',
      summary: 'Create staff',
      tags: ['Staff'],
    })
    .input(
      z.object({
        employeeId: z.string().optional(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        designation: z.string().optional(),
        department: z.string().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: 'new-id', ...input })),

  update: orgAuthed
    .route({
      method: 'PUT',
      path: '/staff/{id}',
      summary: 'Update staff',
      tags: ['Staff'],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        designation: z.string().optional(),
        department: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => input),

  delete: orgAuthed
    .route({
      method: 'DELETE',
      path: '/staff/{id}',
      summary: 'Delete staff',
      tags: ['Staff'],
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async () => ({ success: true })),
};
