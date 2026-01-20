/**
 * oRPC Client Setup
 *
 * Creates a type-safe client for calling the API.
 */

import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { AppRouter } from '@school/api/router';

const link = new RPCLink({
  url: '/api',
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
  headers: () => {
    const headers: Record<string, string> = {};
    const orgSlug = typeof window !== 'undefined' ? localStorage.getItem('currentOrgSlug') : null;
    if (orgSlug) {
      headers['x-organization-slug'] = orgSlug;
    }
    return headers;
  },
});

export const api = createORPCClient(link) as any;

export function setCurrentOrganization(slug: string | null) {
  if (typeof window !== 'undefined') {
    if (slug) {
      localStorage.setItem('currentOrgSlug', slug);
    } else {
      localStorage.removeItem('currentOrgSlug');
    }
  }
}

export function getCurrentOrganization(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('currentOrgSlug');
  }
  return null;
}
