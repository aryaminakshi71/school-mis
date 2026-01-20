/**
 * Transport Router
 *
 * oRPC router for transport management.
 */

import { z } from 'zod';
import { pub, orgAuthed } from '../../procedures/index.js';

export const transportRouter = {
  listRoutes: pub
    .route({ method: 'GET', path: '/transport/routes', summary: 'Get routes', tags: ['Transport'] })
    .output(z.array(z.any()))
    .handler(async () => []),
  createRoute: orgAuthed
    .route({
      method: 'POST',
      path: '/transport/routes',
      summary: 'Create route',
      tags: ['Transport'],
    })
    .input(
      z.object({
        routeName: z.string(),
        startPoint: z.string(),
        endPoint: z.string(),
        distance: z.number().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: 'new-id', ...input })),
  listVehicles: pub
    .route({
      method: 'GET',
      path: '/transport/vehicles',
      summary: 'Get vehicles',
      tags: ['Transport'],
    })
    .output(z.array(z.any()))
    .handler(async () => []),
  createVehicle: orgAuthed
    .route({
      method: 'POST',
      path: '/transport/vehicles',
      summary: 'Create vehicle',
      tags: ['Transport'],
    })
    .input(z.object({ vehicleNumber: z.string(), vehicleType: z.string(), capacity: z.number() }))
    .output(z.any())
    .handler(async ({ input }) => ({ id: 'new-id', ...input })),
  listDrivers: pub
    .route({
      method: 'GET',
      path: '/transport/drivers',
      summary: 'Get drivers',
      tags: ['Transport'],
    })
    .output(z.array(z.any()))
    .handler(async () => []),
  createDriver: orgAuthed
    .route({
      method: 'POST',
      path: '/transport/drivers',
      summary: 'Create driver',
      tags: ['Transport'],
    })
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string(),
        licenseNumber: z.string().optional(),
      })
    )
    .output(z.any())
    .handler(async ({ input }) => ({ id: 'new-id', ...input })),
  getGpsTracking: pub
    .route({
      method: 'GET',
      path: '/transport/gps/{vehicleId}',
      summary: 'Get GPS tracking',
      tags: ['Transport'],
    })
    .input(z.object({ vehicleId: z.string().uuid() }))
    .output(z.array(z.any()))
    .handler(async () => []),
};
