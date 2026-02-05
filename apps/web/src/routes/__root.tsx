import { HeadContent, Scripts, Outlet, createRootRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../lib/auth-context'
import { NotFoundPage } from '@/components/error'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'School MIS - School Management Information System' },
      {
        name: 'description',
        content:
          'All-in-one school management system for students, staff, academics, finance, and operations.',
      },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFoundPage,
})

const queryClient = new QueryClient()

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Outlet />
            <Scripts />
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
